import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '#/integrations/tanstack-query/devtools'
import { AuthProvider } from '#/lib/auth-context'
import { getLocale } from '#/paraglide/runtime'
import appCss from '../styles.css?url'
import type { ApolloClientIntegration } from '@apollo/client-integration-tanstack-start'
import type { QueryClient } from '@tanstack/react-query'
import { SidebarProvider } from '#/components/ui/sidebar'
import { Toaster } from '#/components/ui/sonner'
import { TooltipProvider } from '#/components/ui/tooltip'

interface MyRouterContext extends ApolloClientIntegration.RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', getLocale())
    }
  },

  notFoundComponent: NotFound,

  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Innocenz Admin' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()}>
      <head>
        <HeadContent />
      </head>
      <body>
        <TooltipProvider>
          <AuthProvider>
            <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>
          </AuthProvider>
        </TooltipProvider>
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Toaster />
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-foreground">
          Page Not Found
        </h2>
        <p className="mt-2 text-muted-foreground">
          Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
          moved.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
        >
          Go to sign in
        </Link>
      </div>
    </div>
  )
}
