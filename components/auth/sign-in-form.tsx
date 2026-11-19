"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRightIcon, CheckCircle2Icon } from "lucide-react"

import { PasswordInput } from "@/components/auth/password-input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"

type SignInValues = {
  email: string
  password: string
  remember: boolean
  next: string | null
}

function SignInForm({ next }: { next?: string }) {
  const [collected, setCollected] = React.useState<SignInValues | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const values: SignInValues = {
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      remember: formData.get("remember") === "on",
      next: next ?? null,
    }

    const result = await authClient.signIn.email({
      email: values.email, // required, The email address of the user.
      password: values.password, // required, The password of the user. It should be at least 8 characters long and max 128 by default.
      rememberMe: values.remember, // If false, the user will be signed out when the browser is closed. (optional) (default: true)
      callbackURL: values.next ?? "/", // An optional URL to redirect to after the user signs in.
    })

    const { error } = result as unknown as {
      data?: unknown
      error?: { message?: string }
    }

    if (error) {
      console.error("[sign-in] error", error)
      return
    }

    console.log("[sign-in] signed in", {
      email: values.email,
      remember: values.remember,
    })

    setCollected(values)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <FieldGroup className="gap-4">
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
            autoComplete="current-password"
            placeholder="Enter your password"
            required
          />
        </Field>
      </FieldGroup>

      <Field orientation="horizontal">
        <Checkbox id="remember" name="remember" />
        <FieldLabel
          htmlFor="remember"
          className="font-normal text-muted-foreground"
        >
          Keep me signed in
        </FieldLabel>
      </Field>

      <Button type="submit" size="lg" className="h-11 w-full">
        Sign in
        <ArrowRightIcon aria-hidden="true" />
      </Button>

      {collected ? (
        <Alert className="border-brand/30 bg-brand/5">
          <CheckCircle2Icon className="text-brand" aria-hidden="true" />
          <AlertTitle>Form details collected</AlertTitle>
          <AlertDescription>
            Sign-in is not connected yet. We captured the details for{" "}
            <span className="font-medium text-foreground">
              {collected.email}
            </span>
            {collected.next ? (
              <>
                {" "}
                and will send you back to{" "}
                <span className="font-medium text-foreground">
                  {collected.next}
                </span>
              </>
            ) : null}
            . The payload is in the browser console.
          </AlertDescription>
        </Alert>
      ) : null}

      <p className="text-center text-sm text-muted-foreground">
        New to MentorLagbe?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  )
}

export { SignInForm }
