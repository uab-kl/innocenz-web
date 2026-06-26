import { createFileRoute } from '@tanstack/react-router'
import { UserTypePage } from '@/components/user/user-type-page'
import { getUserTypeByKey } from '@/constants/user-types'

export const Route = createFileRoute('/(admin)/user-management/agency')({
  component: AgencyUsersPage,
  head: () => ({
    meta: [{ title: 'Agency Users — Innocenz Admin' }],
  }),
})

function AgencyUsersPage() {
  const type = getUserTypeByKey('agency')!
  return <UserTypePage type={type} />
}
