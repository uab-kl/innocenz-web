import { AdminLayout } from '@/components/layout/admin-layout'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { ensureAuthenticated } from '@/lib/auth/guards'
import { NotFoundPage } from '@/routes/not-found'

function normalizePathname(pathname: string) {
  return pathname.replace(/^\/en/, '').replace(/\/$/, '') || '/'
}

export const Route = createFileRoute('/(admin)/admin')({
  beforeLoad: ({ location }) => {
    ensureAuthenticated()

    if (normalizePathname(location.pathname) === '/admin') {
      throw notFound()
    }
  },
  notFoundComponent: NotFoundPage,
  component: AdminRoot,
})

function AdminRoot() {
  return <AdminLayout />
}
