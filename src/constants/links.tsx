import { FileText, LayoutDashboard, Shield, Users } from 'lucide-react'
import { z } from 'zod'
import { businessSections } from '@/constants/business-sections'
import { rbacSections } from '@/constants/rbac-sections'
import { userTypes } from '@/constants/user-types'
import type { LucideIcon } from 'lucide-react'

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

export type SidebarNavItem = {
  key: string
  title: string
  href: string
  icon: LucideIcon
  allowedPermission: string[]
  badge?: number
}

export type SidebarSection = {
  key: string
  label: string
  items: SidebarNavItem[]
}

export const sidebarSections: SidebarSection[] = [
  {
    key: 'overview',
    label: 'Overview',
    items: [
      {
        key: 'sidebar-dashboard',
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        allowedPermission: ['*'],
      },
    ],
  },
  {
    key: 'users',
    label: 'Users',
    items: userTypes.map((type) => ({
      key: `sidebar-user-${type.key}`,
      title: type.title,
      href: type.href,
      icon: type.icon,
      allowedPermission: ['*'],
    })),
  },
  {
    key: 'ac',
    label: 'Access Control',
    items: rbacSections.map((section) => ({
      key: `sidebar-rbac-${section.key}`,
      title: section.title,
      href: section.href,
      icon: section.icon,
      allowedPermission: ['*'],
    })),
  },
  {
    key: 'business',
    label: 'Business',
    items: businessSections.map((section) => ({
      key: `sidebar-business-${section.key}`,
      title: section.title,
      href: section.href,
      icon: section.icon,
      allowedPermission: ['*'],
    })),
  },
  {
    key: 'security',
    label: 'Security',
    items: [
      {
        key: 'sidebar-audit-log',
        title: 'Audit Log',
        href: '/audit-log',
        icon: FileText,
        allowedPermission: ['*'],
      },
    ],
  },
]

export const allNavigationItems: NavLinkSchemaType[] = [
  {
    key: 'sidebar-dashboard',
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    allowedPermission: ['*'],
    variant: 'default',
  },
  {
    key: 'sidebar-user-management',
    title: 'User',
    href: '/user-management/admin',
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
    href: '/rbac/role',
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
    href: '/audit-log',
    icon: FileText,
    allowedPermission: ['*'],
    variant: 'default',
  },
]
