import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/(admin)/admin/settings')({
  component: SettingsComponent,
  head: () => ({
    meta: [{ title: 'Settings — Innocenz Admin' }],
  }),
})

function SettingsComponent() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Configure application preferences and master data.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Environment</CardTitle>
          <CardDescription>
            API configuration loaded from environment variables.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between gap-4 border-b pb-2">
            <span className="text-muted-foreground">API URL</span>
            <code>{import.meta.env.VITE_API_URL}</code>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">GraphQL</span>
            <code>
              {import.meta.env.VITE_GRAPHQL_ENDPOINT ||
                `${import.meta.env.VITE_API_URL?.replace(/\/api$/, '')}/graphql`}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
