import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/(admin)/admin/audit-log')({
  component: AuditLogLayout,
})

function AuditLogLayout() {
  return <Outlet />
}
