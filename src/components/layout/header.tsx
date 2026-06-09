import { ChevronDown, LogOut, User as UserIcon } from 'lucide-react'
import { useLocation } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { useAuthActions } from '#/lib/auth/use-auth-actions'
import { useCurrentUser } from '#/lib/auth/use-current-user'
import { allNavigationItems } from '#/constants/links'
import { getRbacSectionByKey } from '#/constants/rbac-sections'
import { getUserTypeByKey } from '#/constants/user-types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'

function useBreadcrumbSegments() {
  const location = useLocation()
  const pathname = location.pathname.replace(/^\/en/, '').replace(/\/$/, '')

  if (pathname.startsWith('/admin/user-management/')) {
    const userTypeKey = pathname.split('/').pop()
    const userType = userTypeKey ? getUserTypeByKey(userTypeKey) : undefined
    if (userType) return ['User', userType.title]
  }

  if (pathname.startsWith('/admin/rbac/')) {
    const rbacKey = pathname.split('/').pop()
    const rbacSection = rbacKey ? getRbacSectionByKey(rbacKey) : undefined
    if (rbacSection) return ['RBAC', rbacSection.title]
  }

  const match = allNavigationItems.find((item) => {
    const href = item.href.replace(/^\/en/, '')
    return pathname === href || pathname.startsWith(`${href}/`)
  })

  return [match?.title ?? 'Dashboard']
}

export function Header() {
  const { logout } = useAuthActions()
  const { user } = useCurrentUser()
  const breadcrumbSegments = useBreadcrumbSegments()

  const handleLogout = () => {
    logout()
  }

  const roleLabel = user?.roles?.[0] ?? 'Admin'

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-semibold">
        {breadcrumbSegments.map((segment, index) => (
          <span key={`${segment}-${index}`} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-muted-foreground" aria-hidden="true">
                ›
              </span>
            )}
            <span
              className={
                index === breadcrumbSegments.length - 1
                  ? 'text-gold'
                  : 'text-foreground/80'
              }
            >
              {segment}
            </span>
          </span>
        ))}
      </nav>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto gap-3 px-2 py-1.5 hover:bg-muted/50"
          >
            <div className="relative shrink-0">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={`https://api.dicebear.com/9.x/glass/svg?seed=${user?.displayName}`}
                  alt={user?.displayName ?? ''}
                />
                <AvatarFallback>
                  {user?.displayName?.charAt(0) ?? (
                    <UserIcon className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              <span
                className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-gold"
                aria-hidden="true"
              />
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold leading-none text-foreground">
                {user?.displayName ?? 'User'}
              </p>
              <p className="mt-1 text-xs leading-none text-muted-foreground">
                {roleLabel}
              </p>
            </div>

            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.displayName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
              <p className="mt-1 text-xs font-medium text-gold-light leading-none">
                {roleLabel}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
