"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  GraduationCapIcon,
  PresentationIcon,
} from "lucide-react"

import { PasswordInput } from "@/components/auth/password-input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "cn"
import type { UserRole } from "@/lib/types"
import { authClient } from "@/lib/auth-client"

type SignUpValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: Extract<UserRole, "student" | "tutor">
}

const roleOptions = [
  {
    value: "student" as const,
    label: "Student",
    description: "Find a tutor",
    icon: GraduationCapIcon,
  },
  {
    value: "tutor" as const,
    label: "Tutor",
    description: "Post tuitions",
    icon: PresentationIcon,
  },
]

function SignUpForm({
  defaultRole = "student",
}: {
  defaultRole?: Extract<UserRole, "student" | "tutor">
}) {
  const [error, setError] = React.useState<string | null>(null)
  const [collected, setCollected] = React.useState<SignUpValues | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const values: SignUpValues = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
      role: formData.get("role") === "tutor" ? "tutor" : "student",
    }

    if (values.password !== values.confirmPassword) {
      setCollected(null)
      setError("The two passwords do not match.")
      return
    }

    // TODO: replace this with authClient.signUp.email(values) once auth is wired.
    const { data, error } = await authClient.signUp.email({
      name: values.name, // required, The name of the user.
      email: values.email, // required, The email address of the user.
      password: values.password, // required, The password of the user. It should be at least 8 characters long and max 128 by default.
      // role: values.role
      callbackURL: "/", // An optional URL to redirect to after the user signs up.
    });
    // console.log("[sign-up] collected form data", {
    //   name: values.name,
    //   email: values.email,
    //   password: "••••••••",
    //   role: values.role,
    // })
    console.log(values);
    if (error) {
      console.error("[sign-up] error", error);

    }
    if (data) {
      console.log("[sign-up] data", data);
    }
    // setError(null)
    // setCollected(values)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FieldGroup className="gap-4">
        <Field>
          <FieldLabel htmlFor="name">Full name</FieldLabel>
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            required
            className="h-10"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            className="h-10"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="new-password"
            placeholder="Create a password"
            minLength={8}
            required
          />
          <FieldDescription>Use at least 8 characters.</FieldDescription>
        </Field>

        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Type your password again"
            minLength={8}
            required
            aria-invalid={error ? true : undefined}
          />
        </Field>

        <Field>
          <div>
            <p
              id="role-label"
              className="mb-2 text-sm leading-none font-medium"
            >
              I am joining as
            </p>

            <div
              role="radiogroup"
              aria-labelledby="role-label"
              className="grid grid-cols-2 gap-3"
            >
              {roleOptions.map(({ value, label, description, icon: Icon }) => (
                <label
                  key={value}
                  className={cn(
                    "group relative flex cursor-pointer items-start gap-2.5 rounded-xl border border-border/70 bg-background/60 p-3 transition-colors",
                    "hover:border-brand/40 has-[:checked]:border-brand has-[:checked]:bg-brand/5",
                    "has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50"
                  )}
                >
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    defaultChecked={defaultRole === value}
                    className="sr-only"
                  />
                  <Icon
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block text-sm font-medium">{label}</span>
                    <span className="block text-xs text-muted-foreground">
                      {description}
                    </span>
                  </span>
                  <CheckCircle2Icon
                    className="absolute top-2 right-2 size-3.5 text-brand opacity-0 transition-opacity group-has-[:checked]:opacity-100"
                    aria-hidden="true"
                  />
                </label>
              ))}
            </div>
          </div>
        </Field>
      </FieldGroup>

      {error ? (
        <p role="alert" className="text-sm font-normal text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="h-11 w-full">
        Create account
        <ArrowRightIcon aria-hidden="true" />
      </Button>

      {collected ? (
        <Alert className="border-brand/30 bg-brand/5">
          <CheckCircle2Icon className="text-brand" aria-hidden="true" />
          <AlertTitle>Form details collected</AlertTitle>
          <AlertDescription>
            Account creation is not connected yet. We captured a{" "}
            <span className="font-medium text-foreground">
              {collected.role}
            </span>{" "}
            account for{" "}
            <span className="font-medium text-foreground">
              {collected.email}
            </span>
            . The payload is in the browser console.
          </AlertDescription>
        </Alert>
      ) : null}

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}

export { SignUpForm }
