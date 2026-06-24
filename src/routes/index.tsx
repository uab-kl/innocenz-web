import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '@/components/landing/HomePage'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'InnocenZ — Nightlife Workforce Platform' },
      {
        name: 'description',
        content:
          'One platform to roster talent, track live shifts, and run payroll for nightlife agencies and outlets.',
      },
      {
        property: 'og:title',
        content: 'InnocenZ — Nightlife Workforce Platform',
      },
      {
        property: 'og:description',
        content:
          'Roster, track, and pay your nightlife workforce — all in one place.',
      },
      { property: 'og:type', content: 'website' },
    ],
  }),
  component: HomePage,
})