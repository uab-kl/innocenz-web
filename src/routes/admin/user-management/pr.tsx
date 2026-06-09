import { createFileRoute } from '@tanstack/react-router'
import { UserTypePage } from '@/components/user/user-type-page'
import { getUserTypeByKey } from '@/constants/user-types'

export const Route = createFileRoute('/admin/user-management/pr')({
  component: PrUsersPage,
  head: () => ({
    meta: [{ title: 'PR Users — Innocenz Admin' }],
  }),
})

function PrUsersPage() {
  const type = getUserTypeByKey('pr')!
  return <UserTypePage type={type} />
}
