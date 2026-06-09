import { FileText, LayoutDashboard, Shield, Users } from 'lucide-react'
import { z } from 'zod'
import { rbacSections } from '@/constants/rbac-sections'
import { userTypes } from '@/constants/user-types'

const ChildNavLinkSchema = z.object({
  key: z.string(),
  title: z.string(),
  label: z.string().optional(),
  icon: z.any(),
  variant: z.enum(['default', 'ghost']),
  href: z.string(),
  allowedPermission: z.array(z.string()),
})

type NavLinkSchemaType = z.infer<typeof ChildNavLinkSchema> & {
  children?: NavLinkSchemaType[]
}

const NavLinkSchema: z.ZodType<NavLinkSchemaType[]> = z.array(
  ChildNavLinkSchema.extend({
    children: z.lazy(() => NavLinkSchema.optional()),
  }),
)

export { NavLinkSchema, type NavLinkSchemaType }

export const allNavigationItems: NavLinkSchemaType[] = [
  {
    key: 'sidebar-dashboard',
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    allowedPermission: ['*'],
    variant: 'default',
  },
  {
    key: 'sidebar-user-management',
    title: 'User',
    href: '/admin/user-management/admin',
    icon: Users,
    allowedPermission: ['*'],
    variant: 'default',
    children: userTypes.map((type) => ({
      key: `sidebar-user-${type.key}`,
      title: type.title,
      href: type.href,
      icon: type.icon,
      allowedPermission: ['*'],
      variant: 'default' as const,
    })),
  },
  {
    key: 'sidebar-rbac',
    title: 'RBAC',
    href: '/admin/rbac/role',
    icon: Shield,
    allowedPermission: ['*'],
    variant: 'default',
    children: rbacSections.map((section) => ({
      key: `sidebar-rbac-${section.key}`,
      title: section.title,
      href: section.href,
      icon: section.icon,
      allowedPermission: ['*'],
      variant: 'default' as const,
    })),
  },
  {
    key: 'sidebar-audit-log',
    title: 'Audit Log',
    href: '/admin/audit-log',
    icon: FileText,
    allowedPermission: ['*'],
    variant: 'default',
  },
]
