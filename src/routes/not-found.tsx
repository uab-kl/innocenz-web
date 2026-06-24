import { createFileRoute, Link } from '@tanstack/react-router'
import { FileQuestion, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const notFoundTitle = 'Not Found | Innocenz'

export const notFoundHead = () => ({
  meta: [{ title: notFoundTitle }],
})

export function NotFoundPage() {
  return (
    <div className="fixed inset-0 z-50 flex min-h-svh w-full items-center justify-center bg-background px-6">
      <div className="flex w-full max-w-xl flex-col items-center text-center">
        <div className="mb-10 flex items-center justify-center gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-gold-deep text-xl font-bold text-ink shadow-[0_0_24px_rgba(212,175,55,0.25)]">
            Z
          </div>

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-secondary">
            <FileQuestion
              className="h-9 w-9 text-lavender"
              strokeWidth={1.5}
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Page not found
        </h1>

        <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. The
          page might have been removed or the URL might be incorrect.
        </p>

        <Button asChild size="lg" className="mt-8 h-10 px-6">
          <Link to="/">
            <Home className="h-4 w-4" />
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/not-found')({
  head: notFoundHead,
  component: NotFoundPage,
})
