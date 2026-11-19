"use client"

import * as React from "react"
import type { SessionUser } from "@/lib/types"

const STORAGE_KEY = "mentorlagbe:session"

/**
 * Temporary demo account so the authenticated navbar can be previewed
 * before BetterAuth is wired up. Set `NEXT_PUBLIC_DEMO_AUTH=true` in
 * `.env.local` to enable it.
 */
const demoUser: SessionUser = {
  id: "demo-student",
  name: "Ayesha Rahman",
  email: "ayesha@example.com",
  image: null,
  role: "student",
  plan: "free",
}

const initialUser: SessionUser | null =
  process.env.NEXT_PUBLIC_DEMO_AUTH === "true" ? demoUser : null

type SessionContextValue = {
  user: SessionUser | null
  signIn: (user: SessionUser) => void
  signOut: () => void
}

const SessionContext = React.createContext<SessionContextValue | null>(null)

/**
 * Holds the current session for the whole app.
 *
 * TODO: swap the internal state for BetterAuth's `useSession()` (or a
 * server-side session read passed down from the root layout) once auth
 * is implemented. Every consumer already talks to `useSession()`, so the
 * swap stays local to this file.
 */
function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<SessionUser | null>(initialUser)

  const signIn = React.useCallback((nextUser: SessionUser) => {
    setUser(nextUser)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
    } catch {
      // Ignore storage failures (private mode, quota, etc.).
    }
  }, [])

  const signOut = React.useCallback(() => {
    setUser(null)
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore storage failures.
    }
  }, [])

  const value = React.useMemo(
    () => ({ user, signIn, signOut }),
    [user, signIn, signOut]
  )

  return <SessionContext value={value}>{children}</SessionContext>
}

function useSession() {
  const context = React.useContext(SessionContext)

  if (!context) {
    throw new Error("useSession must be used within a <SessionProvider>")
  }

  return context
}

export { SessionProvider, useSession }
