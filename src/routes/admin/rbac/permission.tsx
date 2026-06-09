import { createFileRoute } from '@tanstack/react-router'
import { RbacSectionPage } from '@/components/rbac'
import { getRbacSectionByKey } from '@/constants/rbac-sections'

export const Route = createFileRoute('/admin/rbac/permission')({
  component: PermissionPage,
  head: () => ({
    meta: [{ title: 'Permission — Innocenz Admin' }],
  }),
})

function PermissionPage() {
  const section = getRbacSectionByKey('permission')!
  return <RbacSectionPage section={section} />
}
