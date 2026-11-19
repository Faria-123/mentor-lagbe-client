import Image from "next/image"
import Form from "next/form"
import Link from "next/link"
import {
  ArrowRightIcon,
  BadgeCheckIcon,
  GraduationCapIcon,
  SearchIcon,
  StarIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "cn"

const popularSubjects = [
  "Mathematics",
  "Physics",
  "Programming",
  "IELTS",
  "English",
  "Chemistry",
]

const learnerAvatars = [
  "/images/avatars/student-1.jpg",
  "/images/avatars/student-2.jpg",
  "/images/avatars/student-3.jpg",
  "/images/avatars/student-4.jpg",
]

function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-40 -left-32 size-[32rem] rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute top-10 -right-40 size-[34rem] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-border)_1px,transparent_0)] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)] [background-size:26px_26px] opacity-60" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-4 pt-12 pb-20 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:gap-12 lg:px-8 lg:pt-20 lg:pb-28 xl:gap-16">
        <div className="animate-in duration-700 fade-in slide-in-from-bottom-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-xs font-medium text-brand">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Bangladesh&apos;s smart tuition marketplace
          </span>

          <h1 className="mt-5 text-4xl leading-[1.08] font-semibold tracking-tight text-balance sm:text-5xl xl:text-6xl">
            Find Your <span className="text-brand">Ideal Tutor</span> or
            Mentorship Batch Today
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
            Compare verified tutors by subject, class level and monthly budget.
            Book online or in-person batches and track every application from a
            single dashboard.
          </p>

          <Form action="/tuitions" className="mt-8 w-full max-w-xl">
            <div className="flex flex-col gap-2 rounded-2xl border border-border/70 bg-background/90 p-2 shadow-xl shadow-brand/5 backdrop-blur sm:flex-row sm:items-center">
              <label htmlFor="tuition-search" className="sr-only">
                Search tuitions
              </label>
              <div className="flex flex-1 items-center gap-2 px-2">
                <SearchIcon
                  className="size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="tuition-search"
                  name="q"
                  type="search"
                  autoComplete="off"
                  placeholder="Search subject, class level or tutor…"
                  className="h-10 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Button type="submit" size="lg" className="h-11 px-5 text-sm">
                Browse Tuitions
                <ArrowRightIcon />
              </Button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2 px-1 text-xs text-muted-foreground">
              <span>Popular:</span>
              {popularSubjects.map((subject) => (
                <Link
                  key={subject}
                  href={`/tuitions?subject=${encodeURIComponent(subject)}`}
                  className="rounded-full border border-border/70 bg-background/60 px-2.5 py-1 transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-foreground"
                >
                  {subject}
                </Link>
              ))}
            </div>
          </Form>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <div className="flex items-center" aria-hidden="true">
              {learnerAvatars.map((avatar, index) => (
                <Image
                  key={avatar}
                  src={avatar}
                  alt=""
                  width={40}
                  height={40}
                  className={cn(
                    "size-9 rounded-full object-cover ring-2 ring-background",
                    index > 0 && "-ml-2.5"
                  )}
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <StarIcon
                    key={index}
                    className="size-3.5 fill-current"
                    aria-hidden="true"
                  />
                ))}
                <span className="ml-1.5 text-sm font-semibold text-foreground">
                  4.9/5
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Loved by 2,500+ students &amp; parents
              </p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg animate-in duration-700 [animation-delay:150ms] [animation-fill-mode:both] fade-in slide-in-from-bottom-6 lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute -inset-3 -z-10 rounded-[2.75rem] bg-linear-to-br from-brand/25 via-transparent to-emerald-400/25 blur-2xl"
          />

          <div className="relative aspect-4/5 overflow-hidden rounded-[2rem] border border-border/60 bg-muted shadow-2xl shadow-brand/10 sm:aspect-square lg:aspect-4/5">
            <Image
              src="/images/hero/tutoring-session.jpg"
              alt="Students laughing and collaborating with their tutor during a group study session"
              fill
              sizes="(min-width: 1024px) 44vw, (min-width: 640px) 80vw, 92vw"
              className="object-cover"
              preload
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent"
            />
          </div>

          <div className="absolute top-5 left-2 flex items-center gap-2.5 rounded-2xl border border-border/60 bg-background/90 px-3.5 py-2.5 shadow-xl backdrop-blur-md motion-safe:animate-[hero-float_7s_ease-in-out_infinite] sm:-left-6">
            <span className="flex size-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <BadgeCheckIcon className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold">Verified tutors</p>
              <p className="text-[0.7rem] text-muted-foreground">
                ID &amp; background checked
              </p>
            </div>
          </div>

          <div className="absolute right-2 -bottom-5 flex items-center gap-3 rounded-2xl border border-border/60 bg-background/90 px-3.5 py-3 shadow-xl backdrop-blur-md [animation-delay:1.2s] motion-safe:animate-[hero-float_8s_ease-in-out_infinite] sm:-right-6">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand/10 text-brand">
              <GraduationCapIcon className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold">12,000+</p>
              <p className="text-[0.7rem] text-muted-foreground">
                sessions booked
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { HeroSection }
