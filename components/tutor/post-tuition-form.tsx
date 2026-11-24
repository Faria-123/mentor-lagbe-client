"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { useSession } from "@/components/session-provider"
import { TuitionForm } from "@/components/tutor/tuition-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/toast"
import { toTuitionNumbers, type TuitionFormValues } from "@/lib/tuition"

function PostTuitionForm() {
  const { user, isPending } = useSession()
  const router = useRouter()
  const [formKey, setFormKey] = React.useState(0)

  React.useEffect(() => {
    if (!isPending && !user) {
      router.replace("/sign-in?next=/dashboard/tutor/post-tuition")
    }
  }, [isPending, user, router])

  if (isPending || !user) {
    return <Skeleton className="h-[32rem] w-full rounded-xl" />
  }

  const userId = user.id

  async function handleSubmit(
    values: TuitionFormValues,
    bannerUrl: string | null
  ) {
    try {
      const payload = {
        ...toTuitionNumbers(values),
        bannerImage: bannerUrl,
        approvalStatus: "pending" as const,
        isActive: true,
        tutorId: userId,
        createdAt: new Date().toISOString(),
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tuitions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error("Failed to post tuition")
      }

      const data = await res.json()

      console.log("Tuition created:", data)

      toast.add({
        type: "success",
        title: "Tuition submitted",
        description: "It is pending admin approval.",
      })

      setFormKey((key) => key + 1)
    } catch (error) {
      console.error("Post tuition error:", error)

      toast.add({
        type: "error",
        title: "Submission failed",
        description: "Something went wrong. Please try again.",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tuition details</CardTitle>
        <CardDescription>
          {user.plan === "pro"
            ? "Pro plan: unlimited tuition posts."
            : "Free plan: up to 2 tuition posts."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TuitionForm
          key={formKey}
          submitLabel="Post tuition"
          onSubmit={handleSubmit}
        />
      </CardContent>
    </Card>
  )
}

export { PostTuitionForm }
