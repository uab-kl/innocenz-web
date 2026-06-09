import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import {
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from '@/lib/auth/auth-storage'
import { env } from '@/env'

let browserClient: AxiosInstance | null = null

function createClient(onRefreshFail: () => void): AxiosInstance {
  const instance = axios.create({
    baseURL: `${env.VITE_API_URL}/v1`,
    headers: { 'Content-Type': 'application/json' },
  })

  let isRefreshing = false
  let failedQueue: Array<{
    resolve: (value?: unknown) => void
    reject: (err: unknown) => void
  }> = []

  const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) prom.reject(error)
      else prom.resolve(token)
    })
    failedQueue = []
  }

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

      if (originalRequest?.url?.includes('/auth/refresh-token')) {
        return Promise.reject(error)
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          originalRequest._retry = true
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then((token) => {
            if (!originalRequest.headers) originalRequest.headers = {}
            originalRequest.headers.Authorization = `Bearer ${token}`
            return instance(originalRequest)
          })
        }

        originalRequest._retry = true
        isRefreshing = true

        try {
          const refreshToken = getRefreshToken()
          if (!refreshToken) throw new Error('No refresh token')

          const { data } = await axios.post(
            `${env.VITE_API_URL}/v1/auth/refresh-token`,
            { refreshToken },
          )

          const newAccessToken = data.accessToken
          saveAccessToken(newAccessToken)
          if (data.refreshToken) saveRefreshToken(data.refreshToken)

          processQueue(null, newAccessToken)

          if (!originalRequest.headers) originalRequest.headers = {}
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return instance(originalRequest)
        } catch (err) {
          processQueue(err, null)
          onRefreshFail()
          return Promise.reject(err)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    },
  )

  return instance
}

export function getClient(onRefreshFail: () => void): AxiosInstance {
  if (!browserClient) {
    browserClient = createClient(onRefreshFail)
  }
  return browserClient
}

let publicClient: AxiosInstance | null = null

function createPublicClient(): AxiosInstance {
  return axios.create({
    baseURL: `${env.VITE_API_URL}/v1`,
    headers: { 'Content-Type': 'application/json' },
  })
}

export function getPublicClient(): AxiosInstance {
  if (!publicClient) {
    publicClient = createPublicClient()
  }
  return publicClient
}
