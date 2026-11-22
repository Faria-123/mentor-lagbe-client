<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Repository guide

MentorLagbe client: Next.js 16 (App Router, Turbopack) + Tailwind v4 + shadcn. The assignment spec is `Assignment 9-Category_001.pdf` at the repo root.

## Commands

- `npm run dev`, `npm run build` (Next.js 16 + Turbopack).
- `npm run typecheck` — `tsc --noEmit`; currently passes.
- `npm run lint` — ESLint flat config over the whole repo. For focused checks use `npx eslint <path>`; there is no `next lint` subcommand.
- Format only files you change: `npx prettier --write <files>`. Avoid `npm run format`; it rewrites every TS/TSX file and 26 files currently fail `prettier --check` at baseline.
- No test runner and no CI are configured. Verify with typecheck → lint → build.

Baseline: `npm run lint` reports 2 pre-existing errors (`react-hooks/set-state-in-effect`) in `components/ui/carousel.tsx` and `hooks/use-mobile.ts`. Don't attribute them to your change unless you edited those files.

## Build requires `.env`

`next build` (and `next dev`) fail without a `.env` file present: `lib/auth.ts` constructs a `MongoClient` from `BETTER_AUTH_DB_URI` at module import, and the `/api/auth/[...all]` route pulls it in during page-data collection. The failure surfaces as `Failed to collect page data for /api/auth/[...all]`.

`.env` is gitignored; `.env.example` only documents `NEXT_PUBLIC_DEMO_AUTH`. The vars actually read by code:

- `BETTER_AUTH_DB_URI` — required, build fails without it.
- `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET` — Better Auth server/client config.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — optional; build prints a warning if absent but succeeds.
- `NEXT_PUBLIC_DEMO_AUTH` — no longer read by any live code; only the commented-out demo session in `components/session-provider.tsx` mentions it (`.env.example` still documents it).

## Auth (Better Auth + MongoDB)

- Server config in `lib/auth.ts` (`user.additionalFields`: `role`, `phone`, `bio`), client in `lib/auth-client.ts`, catch-all handler `app/api/auth/[...all]/route.ts`. Sign-in/sign-up forms live in `components/auth/` and call `authClient.*` directly.
- `inferAdditionalFields(...)` must sit inside the `plugins: []` array of `createAuthClient`. Better Auth reads additional fields from `options.plugins` only — spreading it at the top level silently drops them from `session.user.*` and from `updateUser`'s input type.
- `components/session-provider.tsx` wraps `authClient.useSession()` and exposes `{ user, isPending, signOut }` (`user` is a mapped `SessionUser` from `lib/types.ts`). It is consumed by `components/site/navbar.tsx` and `components/pricing/subscribe-button.tsx`.
- Two `useSession` exports exist: import the one from `@/components/session-provider` in components; the `lib/auth-client` one is Better Auth's raw hook and is used inside the provider.
- `authClient.updateUser()` refreshes the session cookie and flips Better Auth's client session signal, so `useSession()` re-renders and the navbar avatar picks up a new `user.image` with no manual refetch.
- Private routes must wait for `isPending === false` before redirecting to `/sign-in` — see the guard in `components/profile/profile-form.tsx`; otherwise reloading while signed in bounces the user to login.

## Structure

- `app/(public)/` — landing, pricing, how-it-works. `app/(auth)/` — sign-in, sign-up, wrapped in `AuthShell`. New pages go in the matching route group.
- `app/dashboard/` — authenticated pages (currently `profile/`), no layout yet; it sits directly under the root layout (navbar + footer). Client-side form components go in `components/profile/`.
- `@/*` maps to the repository root (`@/components/...`, `@/lib/...`), not `src/`.
- Route groups are `(public)` / `(auth)`; there is no `src/` directory.

## Conventions and quirks

- Tailwind CSS v4 is CSS-first: there is no `tailwind.config.*`. Imports, theme tokens, and the dark variant are in `app/globals.css`; Prettier sorts classes against that file (`.prettierrc` → `tailwindStylesheet`).
- shadcn uses the `base-nova` style (`components.json`) built on `@base-ui/react`, **not** Radix. Inspect `components/ui` before creating anything; add/update with `npx shadcn@latest add <name>`.
- `cn` is the `cn` npm package (clsx + tailwind-merge replacement; its `engines` require Node 22+). Components import it from `"cn"`; `@/lib/utils` only re-exports it.
- UI primitives use `data-slot` attributes and `cva` variants; keep new components consistent.
- `lib/highlighter.tsx` is a Shiki highlighter with lazy per-language imports. Register new languages in its `languages` map and examples in `aliases`.
- Theme handling is client-side via `components/theme-provider.tsx`; pressing `d` toggles dark mode outside typing targets. Don't add a conflicting global `d` shortcut.
