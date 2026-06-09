import { getClient } from '@/lib/axios-v1'
import type { CreateAdminInput } from './schemas'
import type {
  AdminApiResponse,
  AdminsApiResponse,
  AdminsQueryParams,
} from './types'

function buildQueryParams(
  params: Record<string, string | number | undefined>,
): string {
  const queryParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      queryParams.append(key, String(value))
    }
  }

  const queryString = queryParams.toString()
  return queryString ? `?${queryString}` : ''
}

export async function fetchAdmins(
  params: AdminsQueryParams = {},
  onRefreshFail: () => void,
): Promise<AdminsApiResponse> {
  const client = getClient(onRefreshFail)
  const queryString = buildQueryParams({
    email: params.email,
    status: params.status,
    page: params.page,
    pageSize: params.pageSize,
  })

  const response = await client.get<AdminsApiResponse>(`/admin${queryString}`)
  return response.data
}

export async function createAdmin(
  input: CreateAdminInput,
  onRefreshFail: () => void,
): Promise<AdminApiResponse> {
  const client = getClient(onRefreshFail)
  const response = await client.post<AdminApiResponse>('/admin', input)
  return response.data
}
