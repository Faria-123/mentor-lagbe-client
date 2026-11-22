"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BookOpenIcon,
  ChevronDownIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MenuIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react"

import { Logo } from "@/components/site/logo"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { useSession } from "@/components/session-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { SessionUser, UserRole } from "@/lib/types"
import { cn } from "cn"

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/tuitions", label: "Browse Tuitions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-it-works", label: "How It Works" },
]

const roleStyles: Record<UserRole, string> = {
  student:
    "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-300",
  tutor:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300",
  admin:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-300",
}

const roleLabels: Record<UserRole, string> = {
  student: "Student",
  tutor: "Tutor",
  admin: "Admin",
}

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

function getDashboardHref(role: UserRole) {
  return `/dashboard/${role}`
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function RoleBadge({
  role,
  className,
}: {
  role: UserRole
  className?: string
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 rounded-full text-[0.65rem] font-semibold tracking-wide uppercase",
        roleStyles[role],
        className
      )}
    >
      {roleLabels[role]}
    </Badge>
  )
}

function PlanBadge({ user }: { user: SessionUser }) {
  if (user.plan === "pro") {
    return (
      <Badge className="gap-1 rounded-full bg-linear-to-r from-amber-400 to-orange-500 text-[0.65rem] font-semibold tracking-wide text-amber-950 uppercase shadow-sm">
        <SparklesIcon className="size-2.5" aria-hidden="true" />
        Pro
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className="rounded-full text-[0.65rem] font-semibold tracking-wide text-muted-foreground uppercase"
    >
      Free plan
    </Badge>
  )
}

function UserAvatar({
  user,
  className,
}: {
  user: SessionUser
  className?: string
}) {
  return (
    <Avatar className={className}>
      {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
      <AvatarFallback className="bg-brand/10 text-xs font-semibold text-brand">
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  )
}

function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useSession()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  console.log("user", user)

  const closeMobile = React.useCallback(() => setMobileOpen(false), [])

  const handleSignOut = React.useCallback(() => {
    signOut()
    setMobileOpen(false)
    router.push("/")
  }, [router, signOut])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/70">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:gap-8 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {publicLinks.map((link) => {
            const active = isActivePath(pathname, link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          {user ? (
            <>
              <div className="hidden items-center gap-1 xl:flex">
                <Link
                  href={getDashboardHref(user.role)}
                  className={buttonVariants({ variant: "ghost", size: "lg" })}
                >
                  <LayoutDashboardIcon />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  className={buttonVariants({ variant: "ghost", size: "lg" })}
                >
                  <UserIcon />
                  Update Profile
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                    "hover:bg-destructive/10 hover:text-destructive"
                  )}
                >
                  <LogOutIcon />
                  Sign Out
                </button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="Open account menu"
                  className="flex h-10 items-center gap-2 rounded-full border border-border/70 bg-background py-1 pr-2 pl-1 text-sm font-medium transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <UserAvatar user={user} className="size-8" />
                  <span className="hidden max-w-24 truncate sm:block">
                    {user.name.split(" ")[0]}
                  </span>
                  <RoleBadge
                    role={user.role}
                    className="hidden md:inline-flex"
                  />
                  <ChevronDownIcon className="size-4 text-muted-foreground" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-64">
                  <div className="flex items-center gap-3 px-2 py-2">
                    <UserAvatar user={user} className="size-10" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 px-2 pb-2">
                    <RoleBadge role={user.role} />
                    <PlanBadge user={user} />
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    render={<Link href={getDashboardHref(user.role)} />}
                  >
                    <LayoutDashboardIcon />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem render={<Link href="/dashboard/profile" />}>
                    <UserIcon />
                    Update profile
                  </DropdownMenuItem>

                  {user.role === "student" && (
                    <DropdownMenuItem
                      render={
                        <Link href="/dashboard/student/my-applications" />
                      }
                    >
                      <FileTextIcon />
                      My applications
                    </DropdownMenuItem>
                  )}

                  {user.role === "tutor" && (
                    <>
                      <DropdownMenuItem
                        render={<Link href="/dashboard/tutor/my-tuitions" />}
                      >
                        <BookOpenIcon />
                        My tuitions
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        render={<Link href="/dashboard/tutor/applicants" />}
                      >
                        <UsersIcon />
                        Manage applicants
                      </DropdownMenuItem>
                    </>
                  )}

                  {user.role === "admin" && (
                    <DropdownMenuItem
                      render={<Link href="/dashboard/admin/tuitions" />}
                    >
                      <ShieldCheckIcon />
                      Tuition approvals
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleSignOut}
                  >
                    <LogOutIcon />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Link
                href="/sign-in"
                className={buttonVariants({ variant: "ghost", size: "lg" })}
              >
                Sign In
              </Link>
              <Link href="/sign-up" className={buttonVariants({ size: "lg" })}>
                Sign Up
              </Link>
            </div>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label="Open navigation menu"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-lg" }),
                "lg:hidden"
              )}
            >
              <MenuIcon />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[min(20rem,88vw)] gap-0 p-0 sm:max-w-sm"
            >
              <SheetHeader className="border-b border-border/60 px-5 py-4 pr-14">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <Logo />
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-5">
                <nav aria-label="Mobile" className="flex flex-col gap-1">
                  {publicLinks.map((link) => {
                    const active = isActivePath(pathname, link.href)

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={closeMobile}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    )
                  })}
                </nav>

                <div className="mt-auto flex flex-col gap-3 border-t border-border/60 pt-5">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} className="size-10" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {user.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <RoleBadge role={user.role} />
                        <PlanBadge user={user} />
                      </div>

                      <Link
                        href={getDashboardHref(user.role)}
                        onClick={closeMobile}
                        className={buttonVariants({ size: "lg" })}
                      >
                        <LayoutDashboardIcon />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/profile"
                        onClick={closeMobile}
                        className={buttonVariants({
                          variant: "outline",
                          size: "lg",
                        })}
                      >
                        <UserIcon />
                        Update profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className={buttonVariants({
                          variant: "destructive",
                          size: "lg",
                        })}
                      >
                        <LogOutIcon />
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/sign-in"
                        onClick={closeMobile}
                        className={buttonVariants({
                          variant: "outline",
                          size: "lg",
                        })}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/sign-up"
                        onClick={closeMobile}
                        className={buttonVariants({ size: "lg" })}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export { Navbar }
