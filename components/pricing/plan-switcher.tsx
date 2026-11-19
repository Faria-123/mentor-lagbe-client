"use client"

import Link from "next/link"
import { CheckIcon, SparklesIcon } from "lucide-react"

import { SubscribeButton } from "@/components/pricing/subscribe-button"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "cn"
import {
  plansByAudience,
  type PlanAudience,
  type PlanDefinition,
} from "@/lib/pricing"

function PlanCard({
  plan,
  audience,
}: {
  plan: PlanDefinition
  audience: PlanAudience
}) {
  const isPro = plan.tier === "pro"

  return (
    <Card
      className={cn(
        "relative h-full [--card-spacing:--spacing(6)]",
        isPro && "shadow-xl ring-2 shadow-brand/5 ring-brand/40"
      )}
    >
      {isPro ? (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-brand via-emerald-500 to-brand"
        />
      ) : null}

      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg">{plan.name}</CardTitle>
          {isPro ? (
            <Badge className="gap-1 rounded-full bg-brand text-brand-foreground">
              <SparklesIcon className="size-3" aria-hidden="true" />
              Most popular
            </Badge>
          ) : (
            <Badge variant="outline" className="rounded-full">
              No card needed
            </Badge>
          )}
        </div>
        <CardDescription className="text-pretty">
          {plan.tagline}
        </CardDescription>
        <div className="mt-4 flex items-baseline gap-1.5">
          <span className="text-4xl font-semibold tracking-tight">
            ${plan.price}
          </span>
          <span className="text-sm text-muted-foreground">{plan.cadence}</span>
        </div>
      </CardHeader>

      <CardContent className="mt-6 flex-1">
        <ul className="space-y-3">
          {plan.features.map((feature) => (
            <li key={feature} className="flex gap-2.5 text-sm">
              <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
                <CheckIcon className="size-3" aria-hidden="true" />
              </span>
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="mt-6 bg-transparent">
        {isPro ? (
          <div className="w-full">
            <SubscribeButton audience={audience} />
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Secure checkout by Stripe. Cancel anytime.
            </p>
          </div>
        ) : (
          <Link
            href={`/sign-up?role=${audience}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-11 w-full"
            )}
          >
            {plan.cta}
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}

function PlanSwitcher() {
  return (
    <Tabs defaultValue="student" className="w-full items-center gap-8">
      <TabsList
        className="h-11 rounded-full bg-muted/70 p-1"
        aria-label="Choose your role"
      >
        <TabsTrigger value="student" className="h-9 rounded-full px-5">
          For Students
        </TabsTrigger>
        <TabsTrigger value="tutor" className="h-9 rounded-full px-5">
          For Tutors
        </TabsTrigger>
      </TabsList>

      {(["student", "tutor"] as const).map((audience) => (
        <TabsContent key={audience} value={audience} className="w-full">
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {plansByAudience[audience].map((plan) => (
              <PlanCard key={plan.id} plan={plan} audience={audience} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

export { PlanSwitcher }
