import type { LucideIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  BadgeCheckIcon,
  BellIcon,
  ClipboardListIcon,
  SearchIcon,
  ShieldCheckIcon,
  ZapIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "cn"

type AuthMode = "sign-in" | "sign-up"

type AuthPoint = {
  icon: LucideIcon
  title: string
  text: string
}

const authContent: Record<
  AuthMode,
  {
    badge: string
    panelTitle: string
    panelDescription: string
    points: AuthPoint[]
    formTitle: string
    formDescription: string
  }
> = {
  "sign-in": {
    badge: "Welcome back",
    panelTitle: "Welcome back. Your next class is waiting.",
    panelDescription:
      "Sign in to track your applications, message tutors and manage your tuitions.",
    points: [
      {
        icon: ClipboardListIcon,
        title: "Everything in one place",
        text: "Applications, saved tuitions and updates in one dashboard.",
      },
      {
        icon: BellIcon,
        title: "Never miss a reply",
        text: "Get notified when a tutor accepts your request.",
      },
      {
        icon: ShieldCheckIcon,
        title: "Safe by default",
        text: "Your account is protected and payments run through Stripe.",
      },
    ],
    formTitle: "Sign in to your account",
    formDescription: "Enter your email and password to continue.",
  },
  "sign-up": {
    badge: "Join for free",
    panelTitle: "The easiest way to find a tutor in Bangladesh.",
    panelDescription:
      "Create a free account as a student or a tutor. No card needed to get started.",
    points: [
      {
        icon: SearchIcon,
        title: "Verified tutors only",
        text: "Every tuition and tutor profile is reviewed by our team.",
      },
      {
        icon: ZapIcon,
        title: "Apply in one tap",
        text: "Send your details and preferred time in under a minute.",
      },
      {
        icon: BadgeCheckIcon,
        title: "Free to start",
        text: "Upgrade to Pro only when you need priority booking or unlimited posts.",
      },
    ],
    formTitle: "Create your account",
    formDescription: "It takes less than a minute. It is free.",
  },
}

const tabs: { href: string; label: string; mode: AuthMode }[] = [
  { href: "/sign-in", label: "Sign in", mode: "sign-in" },
  { href: "/sign-up", label: "Create account", mode: "sign-up" },
]

const avatars = [
  "/images/avatars/student-1.jpg",
  "/images/avatars/student-2.jpg",
  "/images/avatars/student-3.jpg",
  "/images/avatars/student-4.jpg",
]

function AuthShell({
  mode,
  children,
}: {
  mode: AuthMode
  children: React.ReactNode
}) {
  const content = authContent[mode]

  return (
    <section className="relative isolate overflow-hidden bg-muted/20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-32 left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute right-0 -bottom-40 size-[26rem] rounded-full bg-brand/5 blur-3xl" />
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_minmax(0,27rem)] lg:items-center lg:gap-16 lg:py-20">
        <aside className="hidden lg:block">
          <Badge
            variant="outline"
            className="rounded-full border-brand/20 bg-brand/5 text-brand"
          >
            {content.badge}
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance xl:text-4xl">
            {content.panelTitle}
          </h1>
          <p className="mt-3 max-w-md text-base text-pretty text-muted-foreground">
            {content.panelDescription}
          </p>

          <ul className="mt-8 space-y-4">
            {content.points.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex items-center gap-3 rounded-2xl border border-border/60 bg-card/70 p-4">
            <div className="flex -space-x-2">
              {avatars.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={32}
                  height={32}
                  className="size-8 rounded-full border-2 border-card object-cover"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">2,000+</span>{" "}
              students and tutors already learn here.
            </p>
          </div>
        </aside>

        <Card className="w-full shadow-xl shadow-foreground/5 [--card-spacing:--spacing(6)]">
          <CardHeader className="gap-4">
            <nav
              aria-label="Account access"
              className="grid grid-cols-2 gap-1 rounded-full bg-muted p-1"
            >
              {tabs.map((tab) => (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-current={mode === tab.mode ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2 text-center text-sm font-medium transition-colors",
                    mode === tab.mode
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>

            <div className="space-y-1.5">
              <CardTitle className="text-xl">{content.formTitle}</CardTitle>
              <CardDescription>{content.formDescription}</CardDescription>
            </div>
          </CardHeader>

          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </section>
  )
}

export { AuthShell }
