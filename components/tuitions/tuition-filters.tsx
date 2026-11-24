"use client"

import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { tuitionModes, type TuitionMode } from "@/lib/tuition"

type TuitionFiltersProps = {
  subjects: string[]
  classLevels: string[]
  defaultQuery?: string
  defaultSubject?: string
  defaultClassLevel?: string
  defaultMode?: "" | TuitionMode
}

function TuitionFilters({
  subjects,
  classLevels,
  defaultQuery = "",
  defaultSubject = "",
  defaultClassLevel = "",
  defaultMode = "",
}: TuitionFiltersProps) {
  return (
    <form
      role="search"
      aria-label="Search and filter tuitions"
      className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm sm:p-5"
      onSubmit={(event) => {
        event.preventDefault()
        // TODO: Apply the selected filters when the browse query is wired up.
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field>
          <FieldLabel htmlFor="tuition-search">Search</FieldLabel>
          <div className="relative">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="tuition-search"
              name="q"
              type="search"
              autoComplete="off"
              defaultValue={defaultQuery}
              placeholder="Search by title or subject"
              className="h-10 pl-9"
            />
          </div>
        </Field>

        <Field>
          <FieldLabel htmlFor="tuition-subject">Subject</FieldLabel>
          <NativeSelect
            id="tuition-subject"
            name="subject"
            defaultValue={defaultSubject}
            className="w-full"
          >
            <NativeSelectOption value="">All subjects</NativeSelectOption>
            {subjects.map((subject) => (
              <NativeSelectOption key={subject} value={subject}>
                {subject}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>

        <Field>
          <FieldLabel htmlFor="tuition-class-level">Class level</FieldLabel>
          <NativeSelect
            id="tuition-class-level"
            name="classLevel"
            defaultValue={defaultClassLevel}
            className="w-full"
          >
            <NativeSelectOption value="">All class levels</NativeSelectOption>
            {classLevels.map((classLevel) => (
              <NativeSelectOption key={classLevel} value={classLevel}>
                {classLevel}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>

        <Field>
          <FieldLabel htmlFor="tuition-mode">Mode</FieldLabel>
          <NativeSelect
            id="tuition-mode"
            name="mode"
            defaultValue={defaultMode}
            className="w-full"
          >
            <NativeSelectOption value="">All modes</NativeSelectOption>
            {tuitionModes.map((mode) => (
              <NativeSelectOption key={mode.value} value={mode.value}>
                {mode.label}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
      </div>

      <div className="mt-4 flex justify-end">
        <Button type="submit" size="lg" className="h-10">
          <SearchIcon aria-hidden="true" />
          Search
        </Button>
      </div>
    </form>
  )
}

export { TuitionFilters }
