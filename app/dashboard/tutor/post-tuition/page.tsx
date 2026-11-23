import type { Metadata } from "next"

import { PostTuitionForm } from "@/components/tutor/post-tuition-form"

export const metadata: Metadata = {
  title: "Post a Tuition — MentorLagbe",
  description:
    "Create a new tuition post — subject, class level, schedule, fee and banner image.",
}

export default function PostTuitionPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Post a tuition
        </h1>
        <p className="text-muted-foreground">
          Add the details students need to apply. New posts stay hidden until an
          admin approves them.
        </p>
      </div>
      <PostTuitionForm />
    </div>
  )
}
