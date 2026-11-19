export type PlanAudience = "student" | "tutor"

export type PlanTier = "free" | "pro"

export type PlanDefinition = {
  id: string
  tier: PlanTier
  name: string
  price: number
  cadence: string
  tagline: string
  features: string[]
  cta: string
}

const freeStudent: PlanDefinition = {
  id: "free-student",
  tier: "free",
  name: "Free",
  price: 0,
  cadence: "forever",
  tagline: "Everything you need to find the right tutor.",
  features: [
    "Browse every approved tuition",
    "Send applications to tutors",
    "Track each application in your dashboard",
    "Cancel a pending application",
    "Email support",
  ],
  cta: "Start for free",
}

const proStudent: PlanDefinition = {
  id: "pro-student",
  tier: "pro",
  name: "Pro Student",
  price: 10,
  cadence: "per month",
  tagline: "Get seen first and book the best batches.",
  features: [
    "Everything in Free",
    "Priority booking on new batches",
    "Your applications are shown first to tutors",
    "Pro badge on your profile",
    "Early access to new tuitions",
    "Priority support",
  ],
  cta: "Subscribe with Stripe",
}

const freeTutor: PlanDefinition = {
  id: "free-tutor",
  tier: "free",
  name: "Free",
  price: 0,
  cadence: "forever",
  tagline: "A simple start for new tutors.",
  features: [
    "Post up to 2 tuitions",
    "Manage every applicant",
    "Dashboard with basic stats",
    "Public profile with photo and bio",
    "Email support",
  ],
  cta: "Start for free",
}

const proTutor: PlanDefinition = {
  id: "pro-tutor",
  tier: "pro",
  name: "Pro Tutor",
  price: 15,
  cadence: "per month",
  tagline: "Post as much as you want and stand out.",
  features: [
    "Everything in Free",
    "Unlimited tuition posts",
    "Verified Pro badge",
    "Higher placement in search results",
    "Applicant management tools",
    "Priority support",
  ],
  cta: "Subscribe with Stripe",
}

export const plansByAudience: Record<PlanAudience, PlanDefinition[]> = {
  student: [freeStudent, proStudent],
  tutor: [freeTutor, proTutor],
}

export const pricingFaqs = [
  {
    value: "cancel",
    question: "Can I cancel at any time?",
    answer:
      "Yes. You can cancel from your dashboard whenever you like. You keep Pro features until the end of the month you have already paid for.",
  },
  {
    value: "fees",
    question: "Does MentorLagbe take a cut of my tuition fee?",
    answer:
      "No. Pro is a flat monthly subscription. Tuition fees are paid directly between the student and the tutor.",
  },
  {
    value: "payment",
    question: "How do I pay?",
    answer:
      "Payments are handled by Stripe. You can pay with any major credit or debit card. We never store your card details.",
  },
  {
    value: "upgrade",
    question: "Can I switch plans later?",
    answer:
      "Yes. You can upgrade to Pro or cancel your plan at any time. The change applies from your next billing date.",
  },
]
