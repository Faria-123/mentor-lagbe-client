"use client"

import * as React from "react"
import {
  CircleCheckIcon,
  ImagePlusIcon,
  PlusCircleIcon,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { uploadBannerImage } from "@/lib/imgbb"
import {
  classLevels,
  emptyTuitionValues,
  tuitionModes,
  validateTuitionValues,
  type TuitionFormErrors,
  type TuitionFormValues,
} from "@/lib/tuition"

type TuitionFormProps = {
  initialValues?: TuitionFormValues
  initialBannerUrl?: string | null
  submitLabel: string
  submitIcon?: LucideIcon
  onSubmit: (values: TuitionFormValues, bannerUrl: string | null) => void
  onCancel?: () => void
}

/** Shared create/edit form. Remount with a `key` to reset it. */
function TuitionForm({
  initialValues = emptyTuitionValues,
  initialBannerUrl = null,
  submitLabel,
  submitIcon: SubmitIcon = PlusCircleIcon,
  onSubmit,
  onCancel,
}: TuitionFormProps) {
  const formId = React.useId()
  const [values, setValues] = React.useState<TuitionFormValues>(initialValues)
  const [errors, setErrors] = React.useState<TuitionFormErrors>({})
  const [bannerUrl, setBannerUrl] = React.useState<string | null>(
    initialBannerUrl
  )
  const [bannerPreview, setBannerPreview] = React.useState<string | null>(
    initialBannerUrl
  )
  const [bannerError, setBannerError] = React.useState<string | null>(null)
  const [uploadingBanner, setUploadingBanner] = React.useState(false)

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
    setBannerUrl(initialBannerUrl)
    setBannerPreview(initialBannerUrl)
    setBannerError(null)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateTuitionValues(values)
    setErrors(nextErrors)

    if (uploadingBanner) {
      setBannerError("Wait for the banner upload to finish.")
      return
    }

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    onSubmit(values, bannerUrl)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FieldGroup className="gap-4">
        <Field data-invalid={Boolean(errors.title)}>
          <FieldLabel htmlFor={`${formId}-title`}>Title</FieldLabel>
          <Input
            id={`${formId}-title`}
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
            <FieldLabel htmlFor={`${formId}-subject`}>Subject</FieldLabel>
            <Input
              id={`${formId}-subject`}
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
            <FieldLabel htmlFor={`${formId}-class-level`}>
              Class level
            </FieldLabel>
            <NativeSelect
              id={`${formId}-class-level`}
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
            <FieldLabel htmlFor={`${formId}-mode`}>Mode</FieldLabel>
            <NativeSelect
              id={`${formId}-mode`}
              name="mode"
              className="w-full [&>select]:h-10"
              aria-invalid={Boolean(errors.mode)}
              value={values.mode}
              onChange={(event) =>
                update("mode", event.target.value as TuitionFormValues["mode"])
              }
            >
              <NativeSelectOption value="" disabled>
                Select mode
              </NativeSelectOption>
              {tuitionModes.map((mode) => (
                <NativeSelectOption key={mode.value} value={mode.value}>
                  {mode.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>
            <FieldError>{errors.mode}</FieldError>
          </Field>

          <Field data-invalid={Boolean(errors.location)}>
            <FieldLabel htmlFor={`${formId}-location`}>Location</FieldLabel>
            <Input
              id={`${formId}-location`}
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
            <FieldLabel htmlFor={`${formId}-fee`}>Monthly fee (BDT)</FieldLabel>
            <Input
              id={`${formId}-fee`}
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
            <FieldLabel htmlFor={`${formId}-days`}>Days per week</FieldLabel>
            <NativeSelect
              id={`${formId}-days`}
              name="daysPerWeek"
              className="w-full [&>select]:h-10"
              aria-invalid={Boolean(errors.daysPerWeek)}
              value={values.daysPerWeek}
              onChange={(event) => update("daysPerWeek", event.target.value)}
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
          <FieldLabel htmlFor={`${formId}-description`}>Description</FieldLabel>
          <Textarea
            id={`${formId}-description`}
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
          <FieldLabel htmlFor={`${formId}-banner`}>Banner image</FieldLabel>

          {bannerPreview ? (
            <div className="overflow-hidden rounded-lg border border-border/60">
              {/* Local preview / remote URL, not an optimizable asset. */}
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
              id={`${formId}-banner`}
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
                <CircleCheckIcon className="size-4" /> Banner ready
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
          <SubmitIcon />
          {submitLabel}
        </Button>
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCancel}
            disabled={uploadingBanner}
          >
            Cancel
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={resetForm}
            disabled={uploadingBanner}
          >
            Clear
          </Button>
        )}
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <ImagePlusIcon className="size-4" />
          Posts go live after admin approval.
        </span>
      </div>
    </form>
  )
}

export { TuitionForm }
