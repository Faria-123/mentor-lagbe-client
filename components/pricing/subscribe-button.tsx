"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2Icon } from "lucide-react"

import { useSession } from "@/components/session-provider"
import { Button } from "@/components/ui/button"
import { cn } from "cn"
import type { PlanAudience } from "@/lib/pricing"

/**
 * Starts a Stripe Checkout session for the Pro plan.
 *
 * The backend endpoint (`POST /api/stripe/checkout`) is part of the Stripe
 * step later in the project. Until it exists we show a clear message instead
 * of failing silently; once the route returns `{ url }` this button opens
 * Stripe automatically.
 */
function SubscribeButton({
  audience,
  className,
}: {
  audience: PlanAudience
  className?: string
}) {
  const { user } = useSession()
  const router = useRouter()
  const [isPending, setIsPending] = React.useState(false)
  const [message, setMessage] = React.useState<string | null>(null)

  async function handleClick() {
    if (!user) {
      router.push("/sign-in?next=/pricing")
      return
    }

    setMessage(null)
    setIsPending(true)

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: `pro-${audience}` }),
      })

      if (!response.ok) {
        throw new Error("checkout-unavailable")
      }

      const data = (await response.json()) as { url?: string }

      if (!data.url) {
        throw new Error("missing-checkout-url")
      }

      window.location.assign(data.url)
    } catch {
      setMessage(
        "Stripe checkout is not connected yet. Add your Stripe keys and the checkout route to enable it."
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="w-full">
      <Button
        type="button"
        size="lg"
        className={cn("h-11 w-full", className)}
        onClick={handleClick}
        disabled={isPending}
        aria-label={`Subscribe to the Pro ${audience} plan with Stripe`}
      >
        {isPending ? <Loader2Icon className="animate-spin" /> : null}
        {isPending ? "Opening Stripe…" : "Subscribe with Stripe"}
      </Button>
      {message ? (
        <p role="status" className="mt-2 text-xs text-muted-foreground">
          {message}
        </p>
      ) : null}
    </div>
  )
}

export { SubscribeButton }
