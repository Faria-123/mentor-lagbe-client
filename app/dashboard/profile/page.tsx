import type { Metadata } from "next"

import { ProfileForm } from "@/components/profile/profile-form"

export const metadata: Metadata = {
  title: "Update Profile — MentorLagbe",
  description:
    "Update your MentorLagbe profile — name, phone, bio and profile picture.",
}

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Update profile
        </h1>
        <p className="text-muted-foreground">
          Your picture and details show up in the navbar right after you save.
        </p>
      </div>
      <ProfileForm />
    </div>
  )
}
