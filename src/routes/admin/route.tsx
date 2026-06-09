import { AdminLayout } from '@/components/layout/admin-layout'
import { createFileRoute } from '@tanstack/react-router'
import { ensureAuthenticated } from '@/lib/auth/guards'

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    ensureAuthenticated()
  },
  component: AdminRoot,
})

function AdminRoot() {
  return <AdminLayout />
}
