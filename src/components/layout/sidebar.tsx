import { useEffect, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import { useCurrentUser } from '#/lib/auth/use-current-user'
import { ScrollArea } from '#/components/ui/scroll-area'
import {
  Sidebar as SidebarUi,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '#/components/ui/sidebar'
import { allNavigationItems, type NavLinkSchemaType } from '#/constants/links'
import { cn } from '#/lib/utils'

export function Sidebar() {
  const location = useLocation()
  const { user } = useCurrentUser()

  const isActive = (href: string) => {
    const cleanPathname = location.pathname.replace(/^\/en/, '')
    const cleanHref = href.replace(/^\/en/, '')
    const pathnameWithoutQuery = cleanPathname.split('?')[0]
    const hrefWithoutQuery = cleanHref.split('?')[0]

    return (
      pathnameWithoutQuery === hrefWithoutQuery ||
      pathnameWithoutQuery.startsWith(`${hrefWithoutQuery}/`)
    )
  }

  const isSectionActive = (link: NavLinkSchemaType) => {
    if (!link.children?.length) return isActive(link.href)
    return link.children.some((child) => isActive(child.href))
  }

  const hasPermission = (permission: string) => {
    if (permission === '*') return true

    const grants = [
      ...(user?.readPermission ?? []),
      ...(user?.createPermission ?? []),
      ...(user?.updatePermission ?? []),
    ]

    return grants.includes('*') || grants.includes(permission)
  }

  const accessControl = (link: NavLinkSchemaType) => {
    if (!user?.readPermission?.length) {
      return link.allowedPermission.includes('*')
    }

    return link.allowedPermission.some(hasPermission)
  }

  return (
    <SidebarUi className="space-y-4 rounded-lg" collapsible="none">
      <SidebarHeader>
        <div className="relative z-20 flex items-center justify-center px-2 py-2 text-base font-medium">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-light to-gold-deep text-ink text-lg font-bold shadow-[0_0_24px_rgba(212,175,55,0.35)]">
              Z
            </div>
            <span className="text-sm font-semibold tracking-tight text-white">
              Innocen<span className="text-gold">Z</span>
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="flex-1 px-3 py-4">
          <SidebarGroup className="space-y-1">
            <SidebarMenu>
              {allNavigationItems.map(
                (link) =>
                  accessControl(link) &&
                  (link.children?.length ? (
                    <SidebarNavGroup
                      key={`nav-${link.key}`}
                      link={link}
                      isActive={isActive}
                      isSectionActive={isSectionActive(link)}
                      accessControl={accessControl}
                    />
                  ) : (
                    <SidebarMenuItem key={`nav-${link.key}`} title={link.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(link.href)}
                        size="lg"
                        className="rounded-lg"
                      >
                        <Link to={link.href}>
                          <link.icon className="h-5 w-5" />
                          <span>{link.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )),
              )}
            </SidebarMenu>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </SidebarUi>
  )
}

function SidebarNavGroup({
  link,
  isActive,
  isSectionActive,
  accessControl,
}: {
  link: NavLinkSchemaType
  isActive: (href: string) => boolean
  isSectionActive: boolean
  accessControl: (link: NavLinkSchemaType) => boolean
}) {
  const [open, setOpen] = useState(isSectionActive)

  useEffect(() => {
    if (isSectionActive) setOpen(true)
  }, [isSectionActive])

  const visibleChildren =
    link.children?.filter((child) => accessControl(child)) ?? []

  if (visibleChildren.length === 0) return null

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        type="button"
        isActive={isSectionActive}
        size="lg"
        className="rounded-lg"
        onClick={() => setOpen((value) => !value)}
      >
        <link.icon className="h-5 w-5" />
        <span>{link.title}</span>
        <ChevronDown
          className={cn(
            'ml-auto h-4 w-4 transition-transform',
            open && 'rotate-180',
          )}
        />
      </SidebarMenuButton>

      {open && (
        <SidebarMenuSub className="border-(--lavender-soft)/40">
          {visibleChildren.map((child) => (
            <SidebarMenuSubItem key={child.key}>
              <SidebarMenuSubButton
                asChild
                isActive={isActive(child.href)}
                className="rounded-md"
              >
                <Link to={child.href}>
                  <child.icon className="h-4 w-4" />
                  <span>{child.title}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  )
}
