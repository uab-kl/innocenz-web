import { useEffect } from 'react'
import { useForm } from '@tanstack/react-form'
import { AlertCircle, Loader2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { getErrorMessage } from '@/lib/utils'
import { RoleSchema, type CreateRoleInput } from '@/services/rbac'

interface CreateRoleSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: CreateRoleInput) => void
  isSubmitting: boolean
  error: Error | null
}

export function CreateRoleSheet({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
  error,
}: CreateRoleSheetProps) {
  const form = useForm({
    defaultValues: {
      roleName: '',
      status: 'active',
    },
    validators: {
      onChange: RoleSchema,
      onSubmit: RoleSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit(value)
    },
  })

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isSubmitting) return
    onOpenChange(nextOpen)
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-start gap-3 pr-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
              <Shield className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <SheetTitle className="text-xl">Create New Role</SheetTitle>
              <SheetDescription>
                Add a new role to define user access levels in the system.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form
          className="flex flex-1 flex-col"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
        >
          <FieldGroup className="flex-1 gap-6 px-4 py-6">
            <form.Field name="roleName">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="create-role-name">
                      Role Name
                    </FieldLabel>
                    <Input
                      id="create-role-name"
                      placeholder="Enter role name"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      disabled={isSubmitting}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="status">
              {(field) => (
                <Field>
                  <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
                    <div className="space-y-1">
                      <FieldLabel htmlFor="create-role-status">
                        Active Status
                      </FieldLabel>
                      <p className="text-sm text-muted-foreground">
                        Set role as active or inactive.
                      </p>
                    </div>
                    <Switch
                      id="create-role-status"
                      checked={field.state.value === 'active'}
                      onCheckedChange={(checked) =>
                        field.handleChange(checked ? 'active' : 'inactive')
                      }
                      disabled={isSubmitting}
                      aria-label="Toggle role active status"
                    />
                  </div>
                </Field>
              )}
            </form.Field>

            <p className="text-sm text-muted-foreground">
              Edit your role permission after creating the role.
            </p>

            {error && (
              <div
                className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive flex items-start gap-2"
                role="alert"
              >
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{getErrorMessage(error)}</span>
              </div>
            )}
          </FieldGroup>

          <SheetFooter className="flex-row justify-end gap-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Role'
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
