import type { Metadata } from "next"
import Link from "next/link"
import { BadgeCheckIcon, RefreshCwIcon, ShieldCheckIcon } from "lucide-react"

import { PlanSwitcher } from "@/components/pricing/plan-switcher"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { pricingFaqs } from "@/lib/pricing"
import { cn } from "cn"

export const metadata: Metadata = {
  title: "Pricing & Pro Plans — MentorLagbe",
  description:
    "Compare the free and Pro plans for students and tutors. Upgrade with Stripe for priority booking, unlimited tuition posts and a verified badge.",
}

const perks = [
  {
    icon: ShieldCheckIcon,
    title: "Secure payments",
    description: "Every Pro payment is handled by Stripe.",
  },
  {
    icon: RefreshCwIcon,
    title: "Cancel anytime",
    description: "No long contracts and no hidden fees.",
  },
  {
    icon: BadgeCheckIcon,
    title: "Verified badge",
    description: "Pro tutors get a badge students can trust.",
  },
]

export default function PricingPage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-border/60 bg-muted/20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-24 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-3xl animate-in px-4 py-14 text-center duration-500 fade-in sm:px-6 lg:py-20">
          <Badge
            variant="outline"
            className="rounded-full border-brand/20 bg-brand/5 text-brand"
          >
            Pricing
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Start free. Go Pro when you are ready.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-pretty text-muted-foreground">
            Both plans are free to start. Upgrade to Pro for priority booking,
            unlimited tuition posts and a verified badge.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <PlanSwitcher />

        <ul className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
          {perks.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 lg:py-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            Questions about billing
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Short answers to the questions we get most.
          </p>

          <Accordion className="mt-6">
            {pricingFaqs.map((faq) => (
              <AccordionItem key={faq.value} value={faq.value}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-linear-to-br from-brand to-emerald-700 p-8 text-white sm:p-12 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Not ready to pay? That is fine.
            </h2>
            <p className="mt-2 text-sm text-white/80 sm:text-base">
              The free plan lets you browse tuitions, apply, and manage your
              applications. You can upgrade whenever you want.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/tuitions"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-11 bg-white px-5 text-emerald-950 hover:bg-white/90"
              )}
            >
              Browse tuitions
            </Link>
            <Link
              href="/sign-up"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 border-white/30 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
              )}
            >
              Create an account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
