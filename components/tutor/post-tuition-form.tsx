"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CircleCheckIcon, ImagePlusIcon, PlusCircleIcon } from "lucide-react"

import { useSession } from "@/components/session-provider"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { uploadBannerImage } from "@/lib/imgbb"

type TuitionMode = "online" | "offline" | "both"

type TuitionFormValues = {
  title: string
  subject: string
  classLevel: string
  mode: "" | TuitionMode
  location: string
  monthlyFee: string
  daysPerWeek: string
  description: string
}

type FormErrors = Partial<Record<keyof TuitionFormValues, string>>

const initialValues: TuitionFormValues = {
  title: "",
  subject: "",
  classLevel: "",
  mode: "",
  location: "",
  monthlyFee: "",
  daysPerWeek: "3",
  description: "",
}

const classLevels = [
  "Class 1-5",
  "Class 6-8",
  "Class 9-10",
  "HSC",
  "Admission test",
  "Undergraduate",
  "Other",
]

const modes: { value: TuitionMode; label: string }[] = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "both", label: "Online & offline" },
]

function validate(values: TuitionFormValues): FormErrors {
  const errors: FormErrors = {}

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

function PostTuitionForm() {
  const { user, isPending } = useSession()
  const router = useRouter()
  const [values, setValues] = React.useState<TuitionFormValues>(initialValues)
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [bannerUrl, setBannerUrl] = React.useState<string | null>(null)
  const [bannerPreview, setBannerPreview] = React.useState<string | null>(null)
  const [bannerError, setBannerError] = React.useState<string | null>(null)
  const [uploadingBanner, setUploadingBanner] = React.useState(false)

  React.useEffect(() => {
    if (!isPending && !user) {
      router.replace("/sign-in?next=/dashboard/tutor/post-tuition")
    }
  }, [isPending, user, router])

  if (isPending || !user) {
    return <Skeleton className="h-[32rem] w-full rounded-xl" />
  }

  function update<K extends keyof TuitionFormValues>(
    key: K,
    value: TuitionFormValues[K]
  ) {
    setValues((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  async function handleBannerChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]

    // Allows picking the same file again after a failed upload.
    event.target.value = ""

    if (!file) {
      return
    }

    if (!file.type.startsWith("image/")) {
      setBannerError("Choose a PNG, JPG or WebP image.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setBannerError("Keep the image under 5 MB.")
      return
    }

    setBannerError(null)
    setBannerUrl(null)

    // Instant local preview; the ImgBB URL replaces it once uploaded.
    const reader = new FileReader()
    reader.onload = () => {
      setBannerPreview(typeof reader.result === "string" ? reader.result : null)
    }
    reader.readAsDataURL(file)

    setUploadingBanner(true)

    try {
      setBannerUrl(await uploadBannerImage(file))
    } catch (error) {
      setBannerError(
        error instanceof Error ? error.message : "Could not upload the image."
      )
    } finally {
      setUploadingBanner(false)
    }
  }

  function resetForm() {
    setValues(initialValues)
    setErrors({})
    setBannerUrl(null)
    setBannerPreview(null)
    setBannerError(null)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validate(values)
    setErrors(nextErrors)

    if (uploadingBanner) {
      setBannerError("Wait for the banner upload to finish.")
      return
    }

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    // Shape the API can persist as-is; approval starts as pending.
    const payload = {
      title: values.title.trim(),
      subject: values.subject.trim(),
      classLevel: values.classLevel,
      mode: values.mode,
      location: values.mode === "online" ? "" : values.location.trim(),
      monthlyFee: Number(values.monthlyFee),
      daysPerWeek: Number(values.daysPerWeek),
      description: values.description.trim(),
      bannerImage: bannerUrl,
      approvalStatus: "pending" as const,
      isActive: true,
      tutorId: user?.id ?? null,
      createdAt: new Date().toISOString(),
    }

    // TODO: POST this to the tuition API once it exists.
    console.log("[post-tuition] new tuition", payload)

    toast.add({
      type: "success",
      title: "Tuition submitted",
      description: "It is pending admin approval.",
    })

    resetForm()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tuition details</CardTitle>
        <CardDescription>
          {user.plan === "pro"
            ? "Pro plan: unlimited tuition posts."
            : "Free plan: up to 2 tuition posts."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FieldGroup className="gap-4">
            <Field data-invalid={Boolean(errors.title)}>
              <FieldLabel htmlFor="tuition-title">Title</FieldLabel>
              <Input
                id="tuition-title"
                name="title"
                placeholder="e.g. HSC Higher Math batch in Dhanmondi"
                maxLength={120}
                className="h-10"
                aria-invalid={Boolean(errors.title)}
                value={values.title}
                onChange={(event) => update("title", event.target.value)}
              />
              <FieldError>{errors.title}</FieldError>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.subject)}>
                <FieldLabel htmlFor="tuition-subject">Subject</FieldLabel>
                <Input
                  id="tuition-subject"
                  name="subject"
                  placeholder="e.g. Higher Mathematics"
                  maxLength={80}
                  className="h-10"
                  aria-invalid={Boolean(errors.subject)}
                  value={values.subject}
                  onChange={(event) => update("subject", event.target.value)}
                />
                <FieldError>{errors.subject}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.classLevel)}>
                <FieldLabel htmlFor="tuition-class-level">
                  Class level
                </FieldLabel>
                <NativeSelect
                  id="tuition-class-level"
                  name="classLevel"
                  className="w-full [&>select]:h-10"
                  aria-invalid={Boolean(errors.classLevel)}
                  value={values.classLevel}
                  onChange={(event) => update("classLevel", event.target.value)}
                >
                  <NativeSelectOption value="" disabled>
                    Select class level
                  </NativeSelectOption>
                  {classLevels.map((level) => (
                    <NativeSelectOption key={level} value={level}>
                      {level}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <FieldError>{errors.classLevel}</FieldError>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.mode)}>
                <FieldLabel htmlFor="tuition-mode">Mode</FieldLabel>
                <NativeSelect
                  id="tuition-mode"
                  name="mode"
                  className="w-full [&>select]:h-10"
                  aria-invalid={Boolean(errors.mode)}
                  value={values.mode}
                  onChange={(event) =>
                    update(
                      "mode",
                      event.target.value as TuitionFormValues["mode"]
                    )
                  }
                >
                  <NativeSelectOption value="" disabled>
                    Select mode
                  </NativeSelectOption>
                  {modes.map((mode) => (
                    <NativeSelectOption key={mode.value} value={mode.value}>
                      {mode.label}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <FieldError>{errors.mode}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.location)}>
                <FieldLabel htmlFor="tuition-location">Location</FieldLabel>
                <Input
                  id="tuition-location"
                  name="location"
                  placeholder="e.g. Dhanmondi, Dhaka"
                  maxLength={120}
                  className="h-10"
                  aria-invalid={Boolean(errors.location)}
                  value={values.location}
                  onChange={(event) => update("location", event.target.value)}
                />
                <FieldDescription>
                  {values.mode === "online"
                    ? "Not needed for online tuitions."
                    : "Area or address students will attend."}
                </FieldDescription>
                <FieldError>{errors.location}</FieldError>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.monthlyFee)}>
                <FieldLabel htmlFor="tuition-fee">Monthly fee (BDT)</FieldLabel>
                <Input
                  id="tuition-fee"
                  name="monthlyFee"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step={100}
                  placeholder="e.g. 4000"
                  className="h-10"
                  aria-invalid={Boolean(errors.monthlyFee)}
                  value={values.monthlyFee}
                  onChange={(event) => update("monthlyFee", event.target.value)}
                />
                <FieldError>{errors.monthlyFee}</FieldError>
              </Field>

              <Field data-invalid={Boolean(errors.daysPerWeek)}>
                <FieldLabel htmlFor="tuition-days">Days per week</FieldLabel>
                <NativeSelect
                  id="tuition-days"
                  name="daysPerWeek"
                  className="w-full [&>select]:h-10"
                  aria-invalid={Boolean(errors.daysPerWeek)}
                  value={values.daysPerWeek}
                  onChange={(event) =>
                    update("daysPerWeek", event.target.value)
                  }
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <NativeSelectOption key={day} value={String(day)}>
                      {day} {day === 1 ? "day" : "days"}
                    </NativeSelectOption>
                  ))}
                </NativeSelect>
                <FieldError>{errors.daysPerWeek}</FieldError>
              </Field>
            </div>

            <Field data-invalid={Boolean(errors.description)}>
              <FieldLabel htmlFor="tuition-description">Description</FieldLabel>
              <Textarea
                id="tuition-description"
                name="description"
                placeholder="What will you cover, who is it for, and how will classes run?"
                rows={5}
                maxLength={1000}
                aria-invalid={Boolean(errors.description)}
                value={values.description}
                onChange={(event) => update("description", event.target.value)}
              />
              <FieldDescription>
                {values.description.length}/1000 characters.
              </FieldDescription>
              <FieldError>{errors.description}</FieldError>
            </Field>

            <Field data-invalid={Boolean(bannerError)}>
              <FieldLabel htmlFor="tuition-banner">Banner image</FieldLabel>

              {bannerPreview ? (
                <div className="overflow-hidden rounded-lg border border-border/60">
                  {/* Local preview of the picked file, not an optimizable asset. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="h-40 w-full object-cover"
                  />
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-3">
                <Input
                  id="tuition-banner"
                  name="banner"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="max-w-sm"
                  disabled={uploadingBanner}
                  onChange={handleBannerChange}
                />
                {uploadingBanner ? (
                  <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Spinner /> Uploading…
                  </span>
                ) : null}
                {bannerUrl ? (
                  <span className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
                    <CircleCheckIcon className="size-4" /> Uploaded
                  </span>
                ) : null}
              </div>

              <FieldDescription>
                Optional. PNG, JPG or WebP up to 5 MB. Uploaded to ImgBB.
              </FieldDescription>
              <FieldError>{bannerError}</FieldError>
            </Field>
          </FieldGroup>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" size="lg" disabled={uploadingBanner}>
              <PlusCircleIcon />
              Post tuition
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={resetForm}
              disabled={uploadingBanner}
            >
              Clear
            </Button>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ImagePlusIcon className="size-4" />
              Posts go live after admin approval.
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export { PostTuitionForm }
