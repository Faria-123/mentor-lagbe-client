import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: ["student", "tutor", "admin"],
          input: true,
          defaultValue: "student",
        },
        phone: {
          type: "string",
          required: false,
          input: true,
        },
        bio: {
          type: "string",
          required: false,
          input: true,
        },
      },
    }),
  ],
})

export const { signIn, signUp, useSession, signOut } = authClient
