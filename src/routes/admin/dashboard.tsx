import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LayoutDashboard, Users, Shield, Settings } from 'lucide-react'
import { useCurrentUser } from '@/lib/auth/use-current-user'

export const Route = createFileRoute('/admin/dashboard')({
  component: DashboardComponent,
  head: () => ({
    meta: [{ title: 'Dashboard — Innocenz Admin' }],
  }),
})

function DashboardComponent() {
  const { user } = useCurrentUser()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back{user?.displayName ? `, ${user.displayName}` : ''}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Overview"
          description="Admin portal home"
          icon={LayoutDashboard}
        />
        <StatCard
          title="Users"
          description="Manage team access"
          icon={Users}
        />
        <StatCard
          title="RBAC"
          description="Roles and permissions"
          icon={Shield}
        />
        <StatCard
          title="Settings"
          description="System configuration"
          icon={Settings}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting started</CardTitle>
          <CardDescription>
            This project mirrors the SME Ederan Frontend stack: TanStack Start,
            Apollo GraphQL, TanStack Query, shadcn/ui, and Paraglide i18n.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            Configure your API endpoints in <code>.env</code> and connect
            backend routes to build out admin features.
          </p>
          <p>
            Default API URL: <code>{import.meta.env.VITE_API_URL}</code>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
