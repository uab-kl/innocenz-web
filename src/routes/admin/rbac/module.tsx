import { createFileRoute } from '@tanstack/react-router'
import { RbacSectionPage } from '@/components/rbac'
import { getRbacSectionByKey } from '@/constants/rbac-sections'

export const Route = createFileRoute('/admin/rbac/module')({
  component: ModulePage,
  head: () => ({
    meta: [{ title: 'Module — Innocenz Admin' }],
  }),
})

function ModulePage() {
  const section = getRbacSectionByKey('module')!
  return <RbacSectionPage section={section} />
}
