import type { Metadata } from "next"

import { AuthShell } from "@/components/auth/auth-shell"
import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Create Account — MentorLagbe",
  description:
    "Create a free MentorLagbe account as a student or a tutor. Find verified tutors or post tuition batches.",
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string | string[] }>
}) {
  const params = await searchParams
  const defaultRole =
    params.role === "tutor" || params.role === "admin" ? params.role : "student"

  return (
    <AuthShell mode="sign-up">
      <SignUpForm defaultRole={defaultRole} />
    </AuthShell>
  )
}
