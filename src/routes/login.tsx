import { useState } from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react'
import axios from 'axios'
import { useAuthActions } from '@/lib/auth/use-auth-actions'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: 'Sign in — InnocenZ' },
      {
        name: 'description',
        content: 'Sign in to access the InnocenZ portal.',
      },
    ],
  }),
})

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

function RouteComponent() {
  const navigate = useNavigate()
  const { login } = useAuthActions()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: formSchema,
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setError('')
      try {
        await login({
          email: value.email,
          password: value.password,
        })
        navigate({ to: '/dashboard' })
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (!err.response) {
            setError(
              'Internal server error.',
            )
            return
          }

          const message =
            (err.response?.data as { message?: string })?.message ||
            'Invalid email or password. Please try again.'
          setError(message)
        } else if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unexpected error occurred. Please try again.')
        }
      }
    },
  })

  return (
    <div className="login-page flex min-h-svh w-full">
      <aside
        aria-hidden="true"
        className="relative hidden w-1/2 shrink-0 flex-col justify-between overflow-hidden border-r border-foreground/10 p-10 lg:flex"
      >
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-section-violet" />
          <div className="absolute inset-0 bg-aurora opacity-60" />
        </div>

        <div className="relative z-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-light to-gold-deep text-xl font-bold text-ink shadow-[0_0_28px_rgba(212,175,55,0.35)]">
            Z
          </div>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-bright">
            Connect · Engage · Entertain
          </p>
        </div>

        <div className="relative z-10 max-w-md space-y-5">
          <h2 className="font-display text-4xl uppercase leading-tight tracking-wide text-foreground">
            Welcome to Innocen<span className="text-gold">Z</span>
          </h2>
          <p className="text-sm leading-relaxed text-foreground/70">
            The workforce operating platform for Malaysia&apos;s nightlife
            industry. Manage rosters, track shifts, and run payroll from one
            secure portal.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between gap-4">
          <p className="text-[11px] text-foreground/40">
            © {new Date().getFullYear()} InnocenZ. All rights reserved.
          </p>
          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/95 px-4 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
              Powered by
            </span>
            <img
              src="/img/uab-logo.webp"
              alt="UAB"
              className="h-6 w-auto object-contain"
            />
          </div>
        </div>
      </aside>

      <main
        role="main"
        className="relative flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16"
      >
        <Link
          to="/"
          className="mb-8 inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-widest text-foreground/60 transition-colors hover:text-gold-bright lg:absolute lg:right-8 lg:top-8 lg:mb-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="mx-auto w-full max-w-[400px]">
          <div className="mb-8 lg:hidden">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-gold-light to-gold-deep text-sm font-bold text-ink">
              Z
            </div>
            <h1 className="font-display text-2xl uppercase tracking-wide text-foreground">
              Innocen<span className="text-gold">Z</span>
            </h1>
          </div>

          <div className="mb-6 space-y-1">
            <h1 className="text-[22px] font-semibold leading-tight text-foreground">
              Sign in to your portal
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Enter your credentials to continue.
            </p>
          </div>

          <div className="rounded-xl border border-foreground/10 bg-card p-6 shadow-lg shadow-black/10">
          <form
            id="login-form"
            aria-label="Sign in form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup className="gap-4">
              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isDirty && !field.state.meta.isValid
                  const errorId = `${field.name}-error`
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
                      <InputGroup>
                        <InputGroupAddon align="inline-start">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id={field.name}
                          name={field.name}
                          type="email"
                          placeholder="you@example.com"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={form.state.isSubmitting}
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? errorId : undefined}
                          autoComplete="email"
                          autoFocus
                        />
                      </InputGroup>
                      {isInvalid && (
                        <FieldError
                          id={errorId}
                          errors={field.state.meta.errors}
                        />
                      )}
                    </Field>
                  )
                }}
              </form.Field>

              <form.Field name="password">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isDirty && !field.state.meta.isValid
                  const errorId = `${field.name}-error`
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <InputGroup>
                        <InputGroupAddon align="inline-start">
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id={field.name}
                          name={field.name}
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={form.state.isSubmitting}
                          aria-invalid={isInvalid}
                          aria-describedby={isInvalid ? errorId : undefined}
                          autoComplete="current-password"
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={
                              showPassword ? 'Hide password' : 'Show password'
                            }
                            disabled={form.state.isSubmitting}
                            variant="ghost"
                            size="icon-xs"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                      {isInvalid && (
                        <FieldError
                          id={errorId}
                          errors={field.state.meta.errors}
                        />
                      )}
                    </Field>
                  )
                }}
              </form.Field>
            </FieldGroup>

            <div
              aria-live="polite"
              aria-atomic="true"
              className="mt-4 min-h-0"
            >
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-[13px] text-destructive"
                >
                  <AlertCircle className="mt-px h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <form.Subscribe
              selector={(state) => [state.isSubmitting, state.canSubmit]}
            >
              {([isSubmitting, canSubmit]) => (
                <Button
                  type="submit"
                  form="login-form"
                  className="mt-5 h-10 w-full bg-primary text-sm font-semibold text-white hover:bg-primary/90 dark:text-[#1a1726] dark:hover:text-[#1a1726] dark:hover:bg-primary/90"
                  disabled={isSubmitting || !canSubmit}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in…
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              )}
            </form.Subscribe>
          </form>
        </div>

        <p className="mt-6 text-center text-[12px] text-muted-foreground">
          Need help?{' '}
          <a
            href="mailto:support@innocenz.com"
            className="text-gold-bright underline underline-offset-4 hover:text-gold"
          >
            Contact support
          </a>
        </p>
        </div>
      </main>
    </div>
  )
}
