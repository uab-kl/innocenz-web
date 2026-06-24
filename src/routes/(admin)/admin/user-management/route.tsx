import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(admin)/admin/user-management')({
  beforeLoad: ({ location }) => {
    const pathname = location.pathname.replace(/\/$/, '')
    if (pathname === '/admin/user-management') {
      throw redirect({ to: '/admin/user-management/admin' })
    }
  },
  component: UserManagementLayout,
})

function UserManagementLayout() {
  return <Outlet />
}
