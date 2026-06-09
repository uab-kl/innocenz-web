import { z } from 'zod'

export const RoleSchema = z.object({
  roleName: z.string().min(1).max(100),
  status: z.string().default('active'),
})

export type CreateRoleInput = z.infer<typeof RoleSchema>
