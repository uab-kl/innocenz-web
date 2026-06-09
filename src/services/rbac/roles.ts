import { getClient } from '@/lib/axios-v1'
import type { CreateRoleInput } from './schemas'
import type { RoleApiResponse, RolesApiResponse, RolesQueryParams } from './types'

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

export async function fetchRoles(
  params: RolesQueryParams = {},
  onRefreshFail: () => void,
): Promise<RolesApiResponse> {
  const client = getClient(onRefreshFail)
  const queryString = buildQueryParams({
    roleId: params.roleId,
    roleName: params.roleName,
    status: params.status,
  })

  const response = await client.get<RolesApiResponse>(`/rbac/roles${queryString}`)
  return response.data
}

export async function createRole(
  input: CreateRoleInput,
  onRefreshFail: () => void,
): Promise<RoleApiResponse> {
  const client = getClient(onRefreshFail)
  const response = await client.post<RoleApiResponse>('/rbac/roles', input)
  return response.data
}
