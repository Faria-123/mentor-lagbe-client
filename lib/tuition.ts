export type TuitionMode = "online" | "offline" | "both"

export type TuitionApprovalStatus = "pending" | "approved" | "rejected"

/** Raw form state — fees and days stay strings while the user types. */
export type TuitionFormValues = {
  title: string
  subject: string
  classLevel: string
  mode: "" | TuitionMode
  location: string
  monthlyFee: string
  daysPerWeek: string
  description: string
}

export type TuitionFormErrors = Partial<Record<keyof TuitionFormValues, string>>

/** Stored shape: numbers instead of input strings, plus record metadata. */
export type Tuition = Omit<
  TuitionFormValues,
  "mode" | "monthlyFee" | "daysPerWeek"
> & {
  id: string
  subject: string
  title: string
  mode: TuitionMode
  monthlyFee: number
  daysPerWeek: number
  bannerImage: string | null
  approvalStatus: TuitionApprovalStatus
  isActive: boolean
  tutorId: string | null
  createdAt: string
}

/** Mongo document returned by the API before `_id` is normalized to `id`. */
export type TuitionApiRecord = Omit<Tuition, "id"> & { _id: string }

/** Values collected by the browse-tuitions search and filter controls. */
export type TuitionFilterValues = {
  query: string
  subject: string
  classLevel: string
  mode: "" | TuitionMode
}

export function fromTuitionApiRecord(record: TuitionApiRecord): Tuition {
  const { _id, ...tuition } = record
  return { ...tuition, id: _id }
}

/** Only approved, active posts are visible on the public browse page. */
export function isPublicTuition(tuition: Tuition) {
  return tuition.approvalStatus === "approved" && tuition.isActive
}

/** Applies the browse filters to an already-approved list of tuitions. */
export function filterTuitions(
  tuitions: Tuition[],
  filters: TuitionFilterValues
): Tuition[] {
  const query = filters.query.trim().toLowerCase()
  const subject = filters.subject.trim().toLowerCase()
  const classLevel = filters.classLevel.trim().toLowerCase()

  return tuitions.filter((tuition) => {
    const matchesQuery =
      !query ||
      tuition.title.toLowerCase().includes(query) ||
      tuition.subject.toLowerCase().includes(query)
    const matchesSubject = !subject || tuition.subject.toLowerCase() === subject
    const matchesClassLevel =
      !classLevel || tuition.classLevel.toLowerCase() === classLevel
    const matchesMode =
      !filters.mode ||
      tuition.mode === filters.mode ||
      (filters.mode !== "both" && tuition.mode === "both")

    return matchesQuery && matchesSubject && matchesClassLevel && matchesMode
  })
}

export const classLevels = [
  "Class 1-5",
  "Class 6-8",
  "Class 9-10",
  "HSC",
  "Admission test",
  "Undergraduate",
  "Other",
]

export const tuitionModes: { value: TuitionMode; label: string }[] = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "both", label: "Online & offline" },
]

export function tuitionModeLabel(mode: TuitionMode) {
  return tuitionModes.find((option) => option.value === mode)?.label ?? mode
}

const tuitionDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
})

export function formatTuitionDate(value: string) {
  return tuitionDateFormatter.format(new Date(value))
}

export const emptyTuitionValues: TuitionFormValues = {
  title: "",
  subject: "",
  classLevel: "",
  mode: "",
  location: "",
  monthlyFee: "",
  daysPerWeek: "3",
  description: "",
}

export const approvalStatusLabels: Record<TuitionApprovalStatus, string> = {
  pending: "Pending approval",
  approved: "Approved",
  rejected: "Rejected",
}

export function validateTuitionValues(
  values: TuitionFormValues
): TuitionFormErrors {
  const errors: TuitionFormErrors = {}

  if (!values.title.trim()) {
    errors.title = "Enter a title."
  } else if (values.title.trim().length < 5) {
    errors.title = "Use at least 5 characters."
  }

  if (!values.subject.trim()) {
    errors.subject = "Enter the subject."
  }

  if (!values.classLevel) {
    errors.classLevel = "Select a class level."
  }

  if (!values.mode) {
    errors.mode = "Select a mode."
  }

  if (values.mode !== "online" && !values.location.trim()) {
    errors.location = "Enter the location."
  }

  const fee = Number(values.monthlyFee)

  if (!values.monthlyFee.trim() || Number.isNaN(fee) || fee <= 0) {
    errors.monthlyFee = "Enter a monthly fee greater than 0."
  }

  const days = Number(values.daysPerWeek)

  if (!Number.isInteger(days) || days < 1 || days > 7) {
    errors.daysPerWeek = "Choose between 1 and 7 days."
  }

  if (!values.description.trim()) {
    errors.description = "Add a short description."
  } else if (values.description.trim().length < 20) {
    errors.description = "Use at least 20 characters."
  }

  return errors
}

/** Converts validated form values into the numbers stored on a tuition. */
export function toTuitionNumbers(values: TuitionFormValues) {
  return {
    title: values.title.trim(),
    subject: values.subject.trim(),
    classLevel: values.classLevel,
    mode: values.mode as TuitionMode,
    location: values.mode === "online" ? "" : values.location.trim(),
    monthlyFee: Number(values.monthlyFee),
    daysPerWeek: Number(values.daysPerWeek),
    description: values.description.trim(),
  }
}

/** Fills a form from a stored tuition (used by the edit dialog). */
export function toTuitionFormValues(tuition: Tuition): TuitionFormValues {
  return {
    title: tuition.title,
    subject: tuition.subject,
    classLevel: tuition.classLevel,
    mode: tuition.mode,
    location: tuition.location,
    monthlyFee: String(tuition.monthlyFee),
    daysPerWeek: String(tuition.daysPerWeek),
    description: tuition.description,
  }
}
