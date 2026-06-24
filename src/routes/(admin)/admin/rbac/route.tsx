import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/(admin)/admin/rbac')({
  beforeLoad: ({ location }) => {
    const pathname = location.pathname.replace(/\/$/, '')
    if (pathname === '/admin/rbac') {
      throw redirect({ to: '/admin/rbac/role' })
    }
  },
  component: RbacLayout,
})

function RbacLayout() {
  return <Outlet />
}
