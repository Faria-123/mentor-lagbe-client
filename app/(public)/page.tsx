import type { Metadata } from "next"

import { HeroSection } from "@/components/home/hero-section"

export const metadata: Metadata = {
  title: "MentorLagbe — Find Your Ideal Tutor or Mentorship Batch",
  description:
    "Compare verified tutors in Bangladesh by subject, class level and monthly budget. Book online or in-person tuition batches and track every application in one dashboard.",
}

export default function Page() {
  return <HeroSection />
}
