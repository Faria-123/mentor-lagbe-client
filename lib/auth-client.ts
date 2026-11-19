import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  ...inferAdditionalFields({
    user: {
      role: {
        type: ["student", "tutor", "admin"],
        input: true,
        defaultValue: "student",
      },
    },
  }),
})

export const { signIn, signUp, useSession, signOut } = authClient
