import { useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { Key } from 'lucide-react'
import { toast } from 'sonner'
import {
  ConfirmDialog,
  PermissionFormSheet,
  PermissionsTable,
  type PermissionStatusFilter,
} from '@/components/rbac'
import { useAuth } from '@/lib/auth-context'
import { toMutationError } from '@/lib/mutation-error'
import {
  createPermission,
  deactivatePermission,
  fetchModules,
  fetchPermissions,
  updatePermission,
  type CreatePermissionInput,
  type PermissionsQueryParams,
  type RbacPermission,
} from '@/services/rbac'

export const Route = createFileRoute('/(admin)/rbac/permission')({
  component: PermissionPage,
  head: () => ({
    meta: [{ title: 'Permission — Innocenz Admin' }],
  }),
})

const PAGE_SIZE = 10

function PermissionPage() {
  const { logout } = useAuth()
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<PermissionStatusFilter>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [selectedPermission, setSelectedPermission] =
    useState<RbacPermission | null>(null)
  const [deactivateOpen, setDeactivateOpen] = useState(false)

  const queryParams: PermissionsQueryParams = {
    page: currentPage,
    pageSize: PAGE_SIZE,
  }
  if (statusFilter !== 'all') queryParams.status = statusFilter

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['rbac-permissions', queryParams],
    queryFn: () => fetchPermissions(queryParams, logout),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
    retry: 2,
  })

  const modulesQuery = useQuery({
    queryKey: ['rbac-modules', 'active-options'],
    queryFn: () =>
      fetchModules({ status: 'active', pageSize: 500 }, logout),
    staleTime: 60_000,
  })

  const moduleNameById = useMemo(() => {
    const map = new Map<string, string>()
    for (const module of modulesQuery.data?.data ?? []) {
      map.set(module.moduleId, module.moduleName)
    }
    return map
  }, [modulesQuery.data])

  const createMutation = useMutation({
    mutationFn: (input: CreatePermissionInput) =>
      createPermission(input, logout),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['rbac-permissions'] })
      setFormOpen(false)
      toast.success(response.message || 'Permission created successfully')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      permissionId,
      input,
    }: {
      permissionId: string
      input: CreatePermissionInput
    }) => updatePermission(permissionId, input, logout),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['rbac-permissions'] })
      setFormOpen(false)
      setSelectedPermission(null)
      toast.success(response.message || 'Permission updated successfully')
    },
  })

  const deactivateMutation = useMutation({
    mutationFn: (permissionId: string) =>
      deactivatePermission(permissionId, logout),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['rbac-permissions'] })
      setDeactivateOpen(false)
      setSelectedPermission(null)
      toast.success(response.message || 'Permission deactivated successfully')
    },
  })

  const handleFormSubmit = (input: CreatePermissionInput) => {
    if (formMode === 'edit' && selectedPermission) {
      updateMutation.mutate({
        permissionId: selectedPermission.permissionId,
        input,
      })
      return
    }
    createMutation.mutate(input)
  }

  const formError = toMutationError(
    formMode === 'edit' ? updateMutation.error : createMutation.error,
    formMode === 'edit'
      ? 'Failed to update permission'
      : 'Failed to create permission',
  )

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-500">
          <Key className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Permission Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Define access rules for modules and action types
          </p>
        </div>
      </div>

      <PermissionsTable
        permissions={data?.data ?? []}
        moduleNameById={moduleNameById}
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
        onCreateClick={() => {
          setFormMode('create')
          setSelectedPermission(null)
          setFormOpen(true)
        }}
        onEditClick={(permission) => {
          setFormMode('edit')
          setSelectedPermission(permission)
          setFormOpen(true)
        }}
        onDeactivateClick={(permission) => {
          setSelectedPermission(permission)
          setDeactivateOpen(true)
        }}
      />

      <PermissionFormSheet
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) {
            createMutation.reset()
            updateMutation.reset()
            setSelectedPermission(null)
          }
        }}
        mode={formMode}
        permission={selectedPermission}
        modules={modulesQuery.data?.data ?? []}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        error={formError}
      />

      <ConfirmDialog
        open={deactivateOpen}
        onOpenChange={(open) => {
          setDeactivateOpen(open)
          if (!open) {
            deactivateMutation.reset()
            setSelectedPermission(null)
          }
        }}
        title="Deactivate permission"
        description="Are you sure you want to deactivate this permission?"
        confirmLabel="Deactivate"
        onConfirm={() => {
          if (selectedPermission) {
            deactivateMutation.mutate(selectedPermission.permissionId)
          }
        }}
        isPending={deactivateMutation.isPending}
      />
    </div>
  )
}
