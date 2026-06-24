import { getClient } from '@/lib/axios-v1'
import type { CreateRoleInput } from './schemas'
import type { RoleApiResponse, RbacRole, RolesApiResponse, RolesQueryParams } from './types'

interface BackendRole {
  id: string
  roleName: string
  status: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

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

function mapRole(role: BackendRole): RbacRole {
  return {
    roleId: role.id,
    roleName: role.roleName,
    status: role.status as RbacRole['status'],
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
    createdBy: role.createdBy,
    updatedBy: role.updatedBy,
  }
}

export async function fetchRoles(
  params: RolesQueryParams = {},
  onRefreshFail: () => void,
): Promise<RolesApiResponse> {
  const client = getClient(onRefreshFail)
  const queryString = buildQueryParams({
    roleName: params.roleName ?? params.roleId,
    status: params.status,
  })

  const response = await client.get<{
    success: boolean
    message: string
    data: BackendRole[]
    pagination: RolesApiResponse['pagination']
  }>(`/rbac/role${queryString}`)

  return {
    success: response.data.success,
    message: response.data.message,
    pagination: response.data.pagination,
    data: (response.data.data ?? []).map(mapRole),
  }
}

export async function createRole(
  input: CreateRoleInput,
  onRefreshFail: () => void,
): Promise<RoleApiResponse> {
  const client = getClient(onRefreshFail)
  const response = await client.post<{ success: boolean; message: string; data: BackendRole }>(
    '/rbac/role',
    input,
  )

  return {
    success: response.data.success,
    message: response.data.message,
    data: mapRole(response.data.data),
  }
}

export async function getRoleIdByName(
  roleName: string,
  onRefreshFail: () => void,
): Promise<string | null> {
  const response = await fetchRoles({ roleName }, onRefreshFail)
  const role = response.data.find(
    (item) => item.roleName.toLowerCase() === roleName.toLowerCase(),
  )
  return role?.roleId ?? null
}
