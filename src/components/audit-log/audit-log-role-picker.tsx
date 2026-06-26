import { Link } from '@tanstack/react-router'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { auditLogRoles } from '@/constants/audit-log-roles'

export function AuditLogRolePicker() {
  const gridRoles = auditLogRoles.slice(0, 4)
  const lastRole = auditLogRoles[4]
  const LastIcon = lastRole.icon

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-(--lavender-soft)/50 bg-(--lavender-soft)/20 text-lavender">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Audit Log</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Select a user type to view its activity log.
          </p>
        </div>
      </div>

      <Card className="mx-auto w-full max-w-4xl border-(--lavender-soft)/40 bg-card">
        <CardHeader className="text-center">
          <CardTitle>Choose Role</CardTitle>
          <CardDescription>
            Open the audit log for admin, PR, outlet, agency, or others.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-8 pb-10">
          <div className="grid grid-cols-2 gap-4">
            {gridRoles.map((role) => {
              const Icon = role.icon
              return (
                <Button
                  key={role.key}
                  variant="outline"
                  className="h-auto min-h-28 flex-col gap-3 px-6 py-8"
                  asChild
                >
                  <Link to="/audit-log/$role" params={{ role: role.slug }}>
                    <Icon className="h-6 w-6 text-lavender" />
                    <span className="text-lg font-medium">{role.label}</span>
                  </Link>
                </Button>
              )
            })}
          </div>

          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              className="h-auto min-h-28 w-[calc(50%-0.5rem)] flex-col gap-3 px-6 py-8"
              asChild
            >
              <Link to="/audit-log/$role" params={{ role: lastRole.slug }}>
                <LastIcon className="h-6 w-6 text-lavender" />
                <span className="text-lg font-medium">{lastRole.label}</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
