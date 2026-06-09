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
} from 'lucide-react'
import axios from 'axios'
import { useAuthActions } from '#/lib/auth/use-auth-actions'
import { Button } from '#/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '#/components/ui/input-group'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  head: () => ({
    meta: [
      { title: 'Sign in — Innocenz Admin' },
      {
        name: 'description',
        content: 'Sign in to access the Innocenz Admin portal.',
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
        navigate({ to: '/admin/dashboard' })
      } catch (err) {
        if (axios.isAxiosError(err)) {
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
    <div className="flex min-h-screen w-screen bg-background">
      <aside
        aria-hidden="true"
        className="relative hidden lg:flex lg:w-1/2 flex-col justify-between bg-cover bg-center bg-no-repeat p-10 text-white shrink-0"
        style={{ backgroundImage: "url('/img/cover.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-(--ink)/92 via-(--lavender-soft)/35 to-(--ink)/88" />

        <div className="relative z-10 flex flex-col items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-(--gold-light) to-(--gold-deep) text-(--ink) text-xl font-bold shadow-[0_0_28px_rgba(212,175,55,0.4)]">
            Z
          </div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-(--gold-light) uppercase">
            Connect · Engage · Entertain
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          <h2 className="text-2xl font-bold leading-snug text-white">
            Welcome to Innocen<span className="text-(--gold)">Z</span>
          </h2>
          <p className="text-sm text-white/55 leading-relaxed max-w-md">
            Manage users, roles, and system settings from one secure admin
            dashboard.
          </p>
        </div>

        <p className="relative z-10 text-[11px] text-white/40">
          © {new Date().getFullYear()} Innocenz. All rights reserved.
        </p>
      </aside>

      <main
        role="main"
        className="flex w-full lg:w-1/2 flex-col items-center justify-center px-6 py-12 bg-background"
      >
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-(--gold-light) to-(--gold-deep) text-(--ink) text-sm font-bold">
            Z
          </div>
          <span className="text-sm font-semibold text-foreground">
            Innocen<span className="text-(--gold)">Z</span> Admin
          </span>
        </div>

        <div className="w-full max-w-[400px] space-y-6">
          <div className="space-y-1">
            <h1 className="text-[22px] font-semibold leading-tight text-foreground">
              Sign in to Innocen<span className="text-gold">Z</span>
            </h1>
            <p className="text-[13px] text-muted-foreground">
              Enter your credentials to access the admin portal.
            </p>
          </div>

          <div className="rounded-2xl border border-(--lavender-soft)/40 bg-card shadow-[0_8px_32px_rgba(0,0,0,0.35)] p-6">
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
                        <FieldLabel htmlFor={field.name}>
                          Email address
                        </FieldLabel>
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
                    className="w-full mt-5 h-10 text-sm font-medium"
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

          <p className="text-center text-[12px] text-muted-foreground">
            Need help?{' '}
            <Link
              to="/login"
              className="text-gold-light underline underline-offset-4 hover:text-gold"
            >
              Contact support
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
