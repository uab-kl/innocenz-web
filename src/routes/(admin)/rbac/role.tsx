import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { Shield } from 'lucide-react'
import { toast } from 'sonner'
import { RoleSheet, RolesGrid, type RoleStatusFilter } from '@/components/rbac'
import { useAuth } from '@/lib/auth-context'
import { toMutationError } from '@/lib/mutation-error'
import {
  createRole,
  fetchRoles,
  syncRolePermissions,
  updateRole,
  type CreateRoleInput,
  type RbacRole,
  type RolesQueryParams,
} from '@/services/rbac'

export const Route = createFileRoute('/(admin)/rbac/role')({
  component: RolePage,
  head: () => ({
    meta: [{ title: 'Role Management — Innocenz Admin' }],
  }),
})

const PAGE_SIZE = 12

function RolePage() {
  const { logout } = useAuth()
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<RoleStatusFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetMode, setSheetMode] = useState<'create' | 'manage'>('create')
  const [selectedRole, setSelectedRole] = useState<RbacRole | null>(null)

  const queryParams: RolesQueryParams = {
    page: currentPage,
    pageSize: PAGE_SIZE,
  }
  if (statusFilter !== 'all') queryParams.status = statusFilter

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
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
      closeSheet()
      toast.success(response.message || 'Role created successfully')
    },
  })

  const saveManageMutation = useMutation({
    mutationFn: async ({
      roleId,
      input,
      permissionIds,
    }: {
      roleId: string
      input: CreateRoleInput
      permissionIds: string[]
    }) => {
      const roleResponse = await updateRole(roleId, input, logout)
      const permissionsResponse = await syncRolePermissions(
        roleId,
        permissionIds,
        logout,
      )
      return { roleResponse, permissionsResponse }
    },
    onSuccess: ({ permissionsResponse }) => {
      queryClient.invalidateQueries({ queryKey: ['rbac-roles'] })
      queryClient.invalidateQueries({ queryKey: ['rbac-role-permissions'] })
      closeSheet()
      toast.success(
        permissionsResponse.message || 'Role updated successfully',
      )
    },
  })

  const closeSheet = () => {
    setSheetOpen(false)
    setSelectedRole(null)
    createMutation.reset()
    saveManageMutation.reset()
  }

  const openCreate = () => {
    setSheetMode('create')
    setSelectedRole(null)
    setSheetOpen(true)
  }

  const openManage = (role: RbacRole) => {
    setSheetMode('manage')
    setSelectedRole(role)
    setSheetOpen(true)
  }

  const sheetError = toMutationError(
    sheetMode === 'manage' ? saveManageMutation.error : createMutation.error,
    sheetMode === 'manage' ? 'Failed to update role' : 'Failed to create role',
  )

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
        pagination={data?.pagination}
        page={currentPage}
        pageSize={PAGE_SIZE}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        error={error as Error | null}
        statusFilter={statusFilter}
        onStatusFilterChange={(value) => {
          setStatusFilter(value)
          setCurrentPage(1)
        }}
        onPageChange={setCurrentPage}
        onRetry={() => refetch()}
        onCreateClick={openCreate}
        onRoleClick={openManage}
      />

      <RoleSheet
        open={sheetOpen}
        onOpenChange={(open) => {
          if (!open) closeSheet()
          else setSheetOpen(true)
        }}
        mode={sheetMode}
        role={selectedRole}
        onCreate={(input) => createMutation.mutate(input)}
        onSaveManage={(input, permissionIds) => {
          if (!selectedRole) return
          saveManageMutation.mutate({
            roleId: selectedRole.roleId,
            input,
            permissionIds,
          })
        }}
        isSubmitting={
          createMutation.isPending || saveManageMutation.isPending
        }
        error={sheetError}
        onRefreshFail={logout}
      />
    </div>
  )
}
