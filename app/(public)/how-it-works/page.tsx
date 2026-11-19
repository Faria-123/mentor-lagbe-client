import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowRightIcon,
  BriefcaseIcon,
  FilePlus2Icon,
  GraduationCapIcon,
  ListChecksIcon,
  RocketIcon,
  SearchIcon,
  SendIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserPlusIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "cn"

export const metadata: Metadata = {
  title: "How It Works — MentorLagbe",
  description:
    "See how students find a tutor and how tutors post a tuition batch on MentorLagbe, in four simple steps.",
}

type Step = {
  title: string
  description: string
  icon: LucideIcon
}

const studentSteps: Step[] = [
  {
    icon: SearchIcon,
    title: "Search for a subject",
    description:
      "Type a subject, class or tutor name in the search box. You can also choose Online or Offline.",
  },
  {
    icon: ListChecksIcon,
    title: "Compare tuitions",
    description:
      "Open a tuition and read the details. Check the monthly fee, class level and weekly schedule.",
  },
  {
    icon: SendIcon,
    title: "Send an application",
    description:
      "Add your phone number, the time you prefer and a short note. Then tap Apply.",
  },
  {
    icon: RocketIcon,
    title: "Start learning",
    description:
      "The tutor reads your application. When they accept it, you are ready for your first class.",
  },
]

const tutorSteps: Step[] = [
  {
    icon: UserPlusIcon,
    title: "Create a tutor account",
    description:
      "Sign up as a tutor. Add your photo, a short bio and your phone number to your profile.",
  },
  {
    icon: FilePlus2Icon,
    title: "Post your tuition",
    description:
      "Add the subject, class, fee, schedule and a banner image. Publish it when it looks good.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Wait for approval",
    description:
      "Our admin team checks every post. Once it is approved, it appears on Browse Tuitions.",
  },
  {
    icon: UsersIcon,
    title: "Manage your students",
    description:
      "Open your dashboard to see every applicant. Accept the students you want to teach.",
  },
]

function StepCard({ step, index }: { step: Step; index: number }) {
  const Icon = step.icon

  return (
    <li className="relative rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="flex size-10 items-center justify-center rounded-xl bg-brand/10 text-brand">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <span
          className="text-sm font-semibold text-muted-foreground/60"
          aria-hidden="true"
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="mt-4 text-base font-medium">{step.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {step.description}
      </p>
    </li>
  )
}

function Track({
  title,
  subtitle,
  icon: Icon,
  steps,
}: {
  title: string
  subtitle: string
  icon: LucideIcon
  steps: Step[]
}) {
  return (
    <section>
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-brand-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <StepCard key={step.title} step={step} index={index} />
        ))}
      </ol>
    </section>
  )
}

export default function HowItWorksPage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-border/60 bg-muted/20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-24 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-3xl animate-in px-4 py-14 text-center duration-500 fade-in sm:px-6 lg:py-20">
          <Badge
            variant="outline"
            className="rounded-full border-brand/20 bg-brand/5 text-brand"
          >
            How it works
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            From first search to first class
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-pretty text-muted-foreground">
            MentorLagbe keeps it simple. Students find a tutor in four steps,
            and tutors post a batch in four steps. Here is how both sides work.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl space-y-16 px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <Track
          title="If you are a student"
          subtitle="Find a tutor and book a batch."
          icon={GraduationCapIcon}
          steps={studentSteps}
        />

        <Track
          title="If you are a tutor"
          subtitle="Post your batch and find students."
          icon={BriefcaseIcon}
          steps={tutorSteps}
        />

        <div className="flex flex-col gap-4 rounded-2xl border border-brand/20 bg-brand/5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <SparklesIcon
              className="mt-0.5 size-5 shrink-0 text-brand"
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">
                Free tutors can post 2 tuitions.
              </span>{" "}
              Pro tutors can post as many as they want and get a verified badge.
            </p>
          </div>
          <Link
            href="/pricing"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "shrink-0"
            )}
          >
            See Pro plans
            <ArrowRightIcon />
          </Link>
        </div>
      </div>

      <section className="border-t border-border/60 bg-muted/20">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Join as a student to find a tutor, or join as a tutor to post your
            first batch. Both are free.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/tuitions"
              className={cn(buttonVariants({ size: "lg" }), "h-11 px-5")}
            >
              Find a tutor
            </Link>
            <Link
              href="/sign-up?role=tutor"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-11 px-5"
              )}
            >
              Become a tutor
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
