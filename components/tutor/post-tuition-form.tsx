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

  function handleSubmit(values: TuitionFormValues, bannerUrl: string | null) {
    // Shape the API can persist as-is; approval starts as pending.
    const payload = {
      ...toTuitionNumbers(values),
      bannerImage: bannerUrl,
      approvalStatus: "pending" as const,
      isActive: true,
      tutorId: user?.id ?? null,
      createdAt: new Date().toISOString(),
    }

    // TODO: POST this to the tuition API once it exists.
    console.log("[post-tuition] new tuition", payload)

    toast.add({
      type: "success",
      title: "Tuition submitted",
      description: "It is pending admin approval.",
    })

    // Remount the form so every field and the banner go back to empty.
    setFormKey((key) => key + 1)
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
