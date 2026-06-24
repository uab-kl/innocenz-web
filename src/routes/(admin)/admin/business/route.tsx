import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import { NotFoundPage } from '@/routes/not-found'

function normalizePathname(pathname: string) {
  return pathname.replace(/^\/en/, '').replace(/\/$/, '') || '/'
}

export const Route = createFileRoute('/(admin)/admin/business')({
  beforeLoad: ({ location }) => {
    if (normalizePathname(location.pathname) === '/admin/business') {
      throw notFound()
    }
  },
  notFoundComponent: NotFoundPage,
  component: BusinessLayout,
})

function BusinessLayout() {
  return <Outlet />
}
