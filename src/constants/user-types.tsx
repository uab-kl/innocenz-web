import { Building2, Megaphone, Shield, Store } from 'lucide-react'

export const userTypes = [
  {
    key: 'admin',
    title: 'Admin',
    description: 'Manage platform administrators and system operators.',
    href: '/admin/user-management/admin',
    icon: Shield,
  },
  {
    key: 'agency',
    title: 'Agency',
    description: 'Manage PR agency accounts and their team access.',
    href: '/admin/user-management/agency',
    icon: Building2,
  },
  {
    key: 'outlet',
    title: 'Outlet',
    description: 'Manage outlet venues, staff, and venue operations.',
    href: '/admin/user-management/outlet',
    icon: Store,
  },
  {
    key: 'pr',
    title: 'PR',
    description: 'Manage PR representatives and their assignments.',
    href: '/admin/user-management/pr',
    icon: Megaphone,
  },
] as const

export type UserTypeKey = (typeof userTypes)[number]['key']

export function getUserTypeByKey(key: string) {
  return userTypes.find((type) => type.key === key)
}
