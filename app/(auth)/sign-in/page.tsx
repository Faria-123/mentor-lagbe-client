import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata: Metadata = {
  title: "Sign In — MentorLagbe",
  description:
    "Sign in to your MentorLagbe account to track applications, manage tuitions and message tutors.",
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>
}) {
  const params = await searchParams
  const next = typeof params.next === "string" ? params.next : undefined

  return (
    <AuthShell mode="sign-in">
      <SignInForm next={next} />
    </AuthShell>
  )
}
