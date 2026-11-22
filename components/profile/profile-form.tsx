"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SaveIcon } from "lucide-react"

import { useSession } from "@/components/session-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import type { SessionUser } from "@/lib/types"

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

/**
 * Guards the private profile route: waits for the session to resolve before
 * deciding, so reloading while signed in never bounces back to /sign-in.
 */
function ProfileForm() {
  const { user, isPending } = useSession()
  const router = useRouter()

  React.useEffect(() => {
    if (!isPending && !user) {
      router.replace("/sign-in?next=/dashboard/profile")
    }
  }, [isPending, user, router])

  if (isPending || !user) {
    return <ProfileFormSkeleton />
  }

  return <ProfileFormFields key={user.id} user={user} />
}

function ProfileFormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-72" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-11 w-32" />
      </CardContent>
    </Card>
  )
}

function ProfileFormFields({ user }: { user: SessionUser }) {
  const [name, setName] = React.useState(user.name)
  const [phone, setPhone] = React.useState(user.phone ?? "")
  const [bio, setBio] = React.useState(user.bio ?? "")
  const [image, setImage] = React.useState(user.image ?? "")
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const trimmedName = name.trim()
  const trimmedImage = image.trim()

  // Live preview: valid URL wins, empty clears to initials, half-typed URLs
  // keep showing the saved picture instead of flickering to the fallback.
  const previewImage =
    trimmedImage === ""
      ? null
      : isValidHttpUrl(trimmedImage)
        ? trimmedImage
        : (user.image ?? null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!trimmedName) {
      setError("Please enter your name.")
      return
    }

    if (trimmedImage && !isValidHttpUrl(trimmedImage)) {
      setError("Enter a valid image URL starting with http:// or https://.")
      return
    }

    setSaving(true)

    try {
      const result = await authClient.updateUser({
        name: trimmedName,
        image: trimmedImage || null,
        phone: phone.trim() || null,
        bio: bio.trim() || null,
      })

      const { error: updateError } = result as unknown as {
        data?: unknown
        error?: { message?: string }
      }

      if (updateError) {
        toast.add({
          type: "error",
          title: "Could not update profile",
          description: updateError.message ?? "Please try again.",
        })
        return
      }

      toast.add({
        type: "success",
        title: "Profile updated",
        description: "Your navbar picture and details are up to date.",
      })
    } catch {
      toast.add({
        type: "error",
        title: "Could not update profile",
        description: "Something went wrong. Please try again.",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile details</CardTitle>
        <CardDescription>
          This is what people see across MentorLagbe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex items-center gap-4">
          <Avatar className="size-16">
            {previewImage ? <AvatarImage src={previewImage} alt="" /> : null}
            <AvatarFallback className="bg-brand/10 text-sm font-semibold text-brand">
              {getInitials(trimmedName || user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">{trimmedName || user.name}</p>
            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel htmlFor="profile-name">Full name</FieldLabel>
              <Input
                id="profile-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                required
                maxLength={100}
                className="h-10"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="profile-phone">Phone</FieldLabel>
              <Input
                id="profile-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+880 1XXX XXXXXX"
                maxLength={30}
                className="h-10"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
              <FieldDescription>Optional.</FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="profile-bio">Bio</FieldLabel>
              <Textarea
                id="profile-bio"
                name="bio"
                placeholder="Tell tutors a little about yourself"
                maxLength={500}
                rows={4}
                value={bio}
                onChange={(event) => setBio(event.target.value)}
              />
              <FieldDescription>
                Optional. Up to 500 characters.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="profile-image">
                Profile picture URL
              </FieldLabel>
              <Input
                id="profile-image"
                name="image"
                type="text"
                inputMode="url"
                placeholder="https://example.com/your-photo.jpg"
                className="h-10"
                value={image}
                onChange={(event) => setImage(event.target.value)}
              />
              <FieldDescription>
                Paste a direct image link (http or https). Leave empty to show
                your initials instead. The navbar updates as soon as you save.
              </FieldDescription>
            </Field>
          </FieldGroup>

          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            size="lg"
            className="h-11 w-full"
            disabled={saving}
          >
            {saving ? <Spinner /> : <SaveIcon aria-hidden="true" />}
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export { ProfileForm }
