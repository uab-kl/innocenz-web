import type { Pagination } from '#/lib/pagination/pagination'

export interface RbacRole {
  roleId: string
  roleName: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export interface RolesApiResponse {
  success: boolean
  message: string
  pagination: Pagination
  data: RbacRole[]
}

export interface RolesQueryParams {
  roleId?: string
  roleName?: string
  status?: 'active' | 'inactive'
}

export interface RoleApiResponse {
  success: boolean
  message: string
  data: RbacRole
}
