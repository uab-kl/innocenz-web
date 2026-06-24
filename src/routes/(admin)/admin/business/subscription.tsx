import { createFileRoute } from '@tanstack/react-router'
import { BusinessSectionPage } from '@/components/business/business-section-page'
import { getBusinessSectionByKey } from '@/constants/business-sections'

export const Route = createFileRoute('/(admin)/admin/business/subscription')({
  component: SubscriptionPage,
  head: () => ({
    meta: [{ title: 'Subscription — Innocenz Admin' }],
  }),
})

function SubscriptionPage() {
  const section = getBusinessSectionByKey('subscription')!
  return <BusinessSectionPage section={section} />
}
