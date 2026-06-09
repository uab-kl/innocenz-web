import { createFileRoute, Navigate } from '@tanstack/react-router'
import { AuditLogTableView } from '@/components/audit-log/audit-log-table-view'
import {
  getAuditLogRoleBySlug,
  isAuditLogRoleSlug,
} from '@/constants/audit-log-roles';

export const Route = createFileRoute('/admin/audit-log/$role')({
  component: AuditLogRolePage,
  head: ({ params }) => {
    const roleMeta = getAuditLogRoleBySlug(params.role)
    return {
      meta: [
        {
          title: `${roleMeta?.label ?? 'Audit Log'} — Innocenz Admin`,
        },
      ],
    }
  },
})

function AuditLogRolePage() {
  const { role: roleSlug } = Route.useParams()

  if (!isAuditLogRoleSlug(roleSlug)) {
    return <Navigate to="/admin/audit-log" />
  }

  const roleMeta = getAuditLogRoleBySlug(roleSlug)!
  return <AuditLogTableView role={roleMeta.key} />
}
