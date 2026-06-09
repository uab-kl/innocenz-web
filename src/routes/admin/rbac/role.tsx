import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { Shield } from 'lucide-react'
import { toast } from 'sonner'
import { CreateRoleSheet } from '#/components/rbac/create-role-sheet'
import { RolesGrid, type RoleStatusFilter } from '#/components/rbac/roles-grid'
import { useAuth } from '#/lib/auth-context'
import { getErrorMessage } from '#/lib/utils'
import {
  createRole,
  fetchRoles,
  type CreateRoleInput,
  type RbacRole,
  type RolesQueryParams,
} from '#/services/rbac'

export const Route = createFileRoute('/admin/rbac/role')({
  component: RolePage,
  head: () => ({
    meta: [{ title: 'Role Management — Innocenz Admin' }],
  }),
})

function RolePage() {
  const { logout } = useAuth()
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<RoleStatusFilter>('all')
  const [createOpen, setCreateOpen] = useState(false)

  const queryParams: RolesQueryParams = {}
  if (statusFilter !== 'all') queryParams.status = statusFilter

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['rbac-roles', queryParams],
    queryFn: () => fetchRoles(queryParams, logout),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    retry: 2,
  })

  const createMutation = useMutation({
    mutationFn: (input: CreateRoleInput) => createRole(input, logout),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['rbac-roles'] })
      setCreateOpen(false)
      toast.success(response.message || 'Role created successfully')
    },
  })

  const handleCreateSubmit = (input: CreateRoleInput) => {
    createMutation.mutate(input)
  }

  const handleCreateOpenChange = (open: boolean) => {
    setCreateOpen(open)
    if (!open) createMutation.reset()
  }

  const handleRoleClick = (role: RbacRole) => {
    toast.info(`${role.roleName} details coming soon`)
  }

  const createError = (() => {
    const mutationError = createMutation.error
    if (!mutationError) return null
    if (axios.isAxiosError(mutationError)) {
      const message = (mutationError.response?.data as { message?: string })
        ?.message
      return new Error(message || 'Failed to create role')
    }
    if (mutationError instanceof Error) return mutationError
    return new Error(getErrorMessage(mutationError))
  })()

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Role Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create and manage roles for your organization
          </p>
        </div>
      </div>

      <RolesGrid
        roles={data?.data ?? []}
        isLoading={isLoading}
        isError={isError}
        error={error as Error | null}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onRetry={() => refetch()}
        onCreateClick={() => setCreateOpen(true)}
        onRoleClick={handleRoleClick}
      />

      <CreateRoleSheet
        open={createOpen}
        onOpenChange={handleCreateOpenChange}
        onSubmit={handleCreateSubmit}
        isSubmitting={createMutation.isPending}
        error={createError}
      />
    </div>
  )
}
