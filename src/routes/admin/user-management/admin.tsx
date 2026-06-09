import { createFileRoute } from '@tanstack/react-router'
import { UserTypePage } from '#/components/user/user-type-page'
import { getUserTypeByKey } from '#/constants/user-types'

export const Route = createFileRoute('/admin/user-management/admin')({
  component: AdminUsersPage,
  head: () => ({
    meta: [{ title: 'Admin Users — Innocenz Admin' }],
  }),
})

function AdminUsersPage() {
  const type = getUserTypeByKey('admin')!
  return <UserTypePage type={type} />
}
