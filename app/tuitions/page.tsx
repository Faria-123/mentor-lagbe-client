import type { Metadata } from "next"
import { InboxIcon } from "lucide-react"

import { TuitionCard } from "@/components/tuitions/tuition-card"
import { TuitionFilters } from "@/components/tuitions/tuition-filters"
import { Badge } from "@/components/ui/badge"
import { browsJobs } from "@/lib/actions/tuitions"
import {
  classLevels,
  filterTuitions,
  fromTuitionApiRecord,
  isPublicTuition,
  tuitionModes,
  type Tuition,
  type TuitionApiRecord,
  type TuitionFilterValues,
  type TuitionMode,
} from "@/lib/tuition"

export const metadata: Metadata = {
  title: "Browse Tuitions — MentorLagbe",
  description:
    "Browse approved and active tuition posts. Search by title or subject and filter by subject, class level or mode.",
}

type TuitionSearchParams = Record<string, string | string[] | undefined>

function getSearchParam(params: TuitionSearchParams, key: string) {
  const value = params[key]
  return typeof value === "string" ? value.trim() : ""
}

function getMode(value: string): "" | TuitionMode {
  return tuitionModes.some((mode) => mode.value === value)
    ? (value as TuitionMode)
    : ""
}

function uniqueSorted(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b)
  )
}

async function getPublicTuitions(query: string): Promise<Tuition[]> {
  try {
    const data: unknown = await browsJobs(query)

    if (!Array.isArray(data)) {
      return []
    }

    return (data as TuitionApiRecord[])
      .map(fromTuitionApiRecord)
      .filter(isPublicTuition)
  } catch (error) {
    console.error("Failed to load tuitions:", error)
    return []
  }
}

export default async function TuitionsPage({
  searchParams,
}: {
  searchParams: Promise<TuitionSearchParams>
}) {
  const params = await searchParams
  const filters: TuitionFilterValues = {
    query: getSearchParam(params, "q"),
    subject: getSearchParam(params, "subject"),
    classLevel: getSearchParam(params, "classLevel"),
    mode: getMode(getSearchParam(params, "mode")),
  }

  const query = new URLSearchParams()

  if (filters.query) query.set("q", filters.query)
  if (filters.subject) query.set("subject", filters.subject)
  if (filters.classLevel) query.set("classLevel", filters.classLevel)
  if (filters.mode) query.set("mode", filters.mode)

  const publicTuitions = await getPublicTuitions(query.toString())
  const tuitions = filterTuitions(publicTuitions, filters)
  const subjects = uniqueSorted(
    publicTuitions.map((tuition) => tuition.subject)
  )
  const classLevelOptions = uniqueSorted([
    ...classLevels,
    ...publicTuitions.map((tuition) => tuition.classLevel),
  ])
  const hasFilters = Boolean(
    filters.query || filters.subject || filters.classLevel || filters.mode
  )
  const countLabel = `${tuitions.length} ${
    tuitions.length === 1 ? "tuition" : "tuitions"
  }`

  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-border/60 bg-muted/20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-24 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Badge
            variant="outline"
            className="rounded-full border-brand/20 bg-brand/5 text-brand"
          >
            Approved &amp; active
          </Badge>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            Find the right tuition for you
          </h1>
          <p className="mt-4 max-w-2xl text-base text-pretty text-muted-foreground">
            Search by title or subject, then narrow the list by subject, class
            level or mode. Only approved and active posts are shown.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <TuitionFilters
          subjects={subjects}
          classLevels={classLevelOptions}
          defaultQuery={filters.query}
          defaultSubject={filters.subject}
          defaultClassLevel={filters.classLevel}
          defaultMode={filters.mode}
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {hasFilters
              ? `${countLabel} of ${publicTuitions.length} approved posts`
              : `${countLabel} available`}
          </p>
        </div>

        {tuitions.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tuitions.map((tuition) => (
              <TuitionCard key={tuition.id} tuition={tuition} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border/70 bg-muted/20 px-6 py-16 text-center">
            <InboxIcon
              className="size-8 text-muted-foreground"
              aria-hidden="true"
            />
            <div className="space-y-1">
              <h2 className="font-medium">No tuitions found</h2>
              <p className="text-sm text-muted-foreground">
                {hasFilters
                  ? "Try a different search or filter."
                  : "Approved tuition posts will appear here once tutors publish them."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
