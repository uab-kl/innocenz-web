import { createFileRoute } from '@tanstack/react-router'
import { UserTypePage } from '@/components/user/user-type-page'
import { getUserTypeByKey } from '@/constants/user-types'

export const Route = createFileRoute('/admin/user-management/outlet')({
  component: OutletUsersPage,
  head: () => ({
    meta: [{ title: 'Outlet Users — Innocenz Admin' }],
  }),
})

function OutletUsersPage() {
  const type = getUserTypeByKey('outlet')!
  return <UserTypePage type={type} />
}
