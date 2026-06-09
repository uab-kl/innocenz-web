import { useQuery } from '@tanstack/react-query'
import { getPublicClient } from '#/lib/axios-v1'
import { getAccessToken, hasValidTokens } from '#/lib/auth/auth-storage'
import type { User } from '#/lib/auth'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export const profileQueryKey = ['auth', 'profile'] as const

async function fetchProfile(): Promise<User> {
  const accessToken = getAccessToken()
  if (!accessToken) {
    throw new Error('No access token available')
  }

  const client = getPublicClient()
  const response = await client.get<ApiResponse<User>>('/auth/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch profile')
  }

  return response.data.data
}

export function useProfile() {
  return useQuery({
    queryKey: profileQueryKey,
    queryFn: fetchProfile,
    enabled: hasValidTokens(),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}
