import type { Metadata } from "next"

import { MyTuitionsList } from "@/components/tutor/my-tuitions-list"

export const metadata: Metadata = {
  title: "My Tuitions — MentorLagbe",
  description:
    "Manage the tuitions you posted — edit details, close a batch or delete a post.",
}

export default function MyTuitionsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">My tuitions</h1>
        <p className="text-muted-foreground">
          Edit a post, close it when a batch fills up, or remove it entirely.
        </p>
      </div>
      <MyTuitionsList />
    </div>
  )
}
