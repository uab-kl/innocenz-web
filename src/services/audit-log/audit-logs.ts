import { getClient } from '@/lib/axios-v1'
import type {
  AuditLogApiResponse,
  AuditLogFiltersApiResponse,
  AuditLogsApiResponse,
  AuditLogsQueryParams,
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

export async function fetchAuditLogs(
  params: AuditLogsQueryParams = {},
  onRefreshFail: () => void,
): Promise<AuditLogsApiResponse> {
  const client = getClient(onRefreshFail)
  const queryString = buildQueryParams({
    dateFrom: params.dateFrom,
    dateTo: params.dateTo,
    userId: params.userId,
    role: params.role,
    entity: params.entity,
    entityId: params.entityId,
    action: params.action,
    page: params.page,
    pageSize: params.pageSize,
    sortField: params.sortField,
    sortDirection: params.sortDirection,
  })

  const response = await client.get<AuditLogsApiResponse>(
    `/audit-log${queryString}`,
  )
  return response.data
}

export async function fetchAuditLogById(
  id: number,
  onRefreshFail: () => void,
): Promise<AuditLogApiResponse> {
  const client = getClient(onRefreshFail)
  const response = await client.get<AuditLogApiResponse>(`/audit-log/${id}`)
  return response.data
}

export async function fetchAuditLogActions(
  onRefreshFail: () => void,
): Promise<AuditLogFiltersApiResponse> {
  const client = getClient(onRefreshFail)
  const response = await client.get<AuditLogFiltersApiResponse>(
    '/audit-log/actions',
  )
  return response.data
}

export async function fetchAuditLogEntities(
  onRefreshFail: () => void,
): Promise<AuditLogFiltersApiResponse> {
  const client = getClient(onRefreshFail)
  const response = await client.get<AuditLogFiltersApiResponse>(
    '/audit-log/entities',
  )
  return response.data
}

export async function fetchAuditLogRoles(
  onRefreshFail: () => void,
): Promise<AuditLogFiltersApiResponse> {
  const client = getClient(onRefreshFail)
  const response = await client.get<AuditLogFiltersApiResponse>(
    '/audit-log/roles',
  )
  return response.data
}
