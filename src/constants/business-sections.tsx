import { CreditCard } from 'lucide-react'

export const businessSections = [
  {
    key: 'subscription',
    title: 'Subscription',
    description: 'Manage agency subscription plans and billing.',
    href: '/admin/business/subscription',
    icon: CreditCard,
  },
] as const

export type BusinessSection = (typeof businessSections)[number]
export type BusinessSectionKey = BusinessSection['key']

export function getBusinessSectionByKey(key: string) {
  return businessSections.find((section) => section.key === key)
}
