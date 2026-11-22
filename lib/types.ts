export type UserRole = "student" | "tutor" | "admin"

export type Plan = "free" | "pro"

/**
 * Shape of the authenticated user used by the UI.
 * Matches the `users` collection described in the assignment brief.
 */
export type SessionUser = {
  id: string
  name: string
  email: string
  image?: string | null
  phone?: string | null
  bio?: string | null
  role: UserRole
  plan: Plan
}
