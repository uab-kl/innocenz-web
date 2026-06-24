import { getClient } from '@/lib/axios-v1'
import { getRoleIdByName } from '@/services/rbac/roles'
import type { CreateAdminInput } from './schemas'
import type {
  AdminApiResponse,
  AdminUser,
  AdminsApiResponse,
  AdminsQueryParams,
} from './types'

interface BackendUser {
  id: string
  email: string | null
  phoneNum: string | null
  accName: string
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

function mapAdminUser(user: BackendUser): AdminUser {
  return {
    id: user.id,
    email: user.email ?? '',
    displayName: user.accName,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    createdBy: user.createdBy,
    updatedBy: user.updatedBy,
  }
}

export async function fetchAdmins(
  params: AdminsQueryParams = {},
  onRefreshFail: () => void,
): Promise<AdminsApiResponse> {
  const adminRoleId = await getRoleIdByName('admin', onRefreshFail)
  if (!adminRoleId) {
    return {
      success: true,
      message: 'OK',
      data: [],
      pagination: {
        page: 1,
        pageSize: params.pageSize ?? 10,
        totalCount: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
  }

  const client = getClient(onRefreshFail)
  const queryString = buildQueryParams({
    email: params.email,
    status: params.status,
    roleId: adminRoleId,
    page: params.page,
    pageSize: params.pageSize,
  })

  const response = await client.get<{
    success: boolean
    message: string
    data: BackendUser[]
    pagination: AdminsApiResponse['pagination']
  }>(`/user${queryString}`)

  return {
    success: response.data.success,
    message: response.data.message,
    data: (response.data.data ?? []).map(mapAdminUser),
    pagination: response.data.pagination,
  }
}

export async function createAdmin(
  input: CreateAdminInput,
  onRefreshFail: () => void,
): Promise<AdminApiResponse> {
  const adminRoleId = await getRoleIdByName('admin', onRefreshFail)
  if (!adminRoleId) {
    throw new Error('Admin role not found')
  }

  const client = getClient(onRefreshFail)
  const response = await client.post<{
    success: boolean
    message: string
    data: BackendUser
  }>('/auth/register', {
    email: input.email,
    phoneNum: `+admin-${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`,
    accName: input.displayName,
    password: input.password,
    roleId: adminRoleId,
  })

  return {
    success: response.data.success,
    message: response.data.message,
    data: mapAdminUser(response.data.data),
  }
}
