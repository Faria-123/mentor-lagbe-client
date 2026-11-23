<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Repository guide

MentorLagbe client: Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4 + shadcn (`base-nova`). Built against `Assignment 9-Category_001.pdf` at the repo root, so several features are deliberate stubs.

## Commands

- `npm run dev`, `npm run build` (Next.js 16 + Turbopack).
- `npm run typecheck` — `tsc --noEmit`; passes.
- `npm run lint` — ESLint flat config over the whole repo. For focused checks use `npx eslint <path>`; there is no `next lint` subcommand.
- Format only files you change: `npx prettier --write <files>`. Never run `npm run format`: it globs all TS/TSX and would rewrite the 28 files that already fail `prettier --check` (most of `components/ui/*`, the `app/dashboard/**` placeholders, `app/layout.tsx`, `app/api/auth/[...all]/route.ts`, `next.config.ts`). Re-run the check instead of trusting that list.
- No test runner and no CI are configured. Verify in order: `typecheck` → `lint` → `build`.

## Baseline failures

- `npm run lint` exits 1 with exactly 2 `react-hooks/set-state-in-effect` errors, in `components/ui/carousel.tsx` and `hooks/use-mobile.ts`, and 0 warnings. Anything else is yours.
- `npm run build` passes, but there is a trap: Better Auth's raw `useSession` (from `@/lib/auth-client`) only works in client components. If a component that calls it gets pulled into static prerender, the build fails with `TypeError: (0, ...useRef) is not a function`. Use `@/components/session-provider` or add `"use client"` (this is why `app/components/DashboardSidebar.tsx` is a client component).
- Expect `user null` noise from the debug `console.log` in `components/site/navbar.tsx` and a "Social provider google is missing clientId or clientSecret" warning when Google keys are absent. Both are pre-existing, not failures.

## Build requires `.env`

`next build` (and `next dev`) fail without a `.env` file present: `lib/auth.ts` constructs a `MongoClient` from `BETTER_AUTH_DB_URI` at module import, and the `/api/auth/[...all]` route pulls it in during page-data collection. The failure surfaces as `Failed to collect page data for /api/auth/[...all]`.

`.env` is gitignored; `.env.example` only documents `NEXT_PUBLIC_DEMO_AUTH`. Vars actually referenced by code:

- `BETTER_AUTH_DB_URI` — required, build fails without it (database name is hard-coded as `mentorlagbe`).
- `BETTER_AUTH_URL` — client `baseURL` in `lib/auth-client.ts`; also read by Better Auth on the server.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — optional; build warns but succeeds.
- `IMGBB_API_KEY` — optional; `POST /api/upload` returns 503 without it, so the tuition form shows "Image upload is not configured" while the rest of the form still works.
- `NEXT_PUBLIC_DEMO_AUTH` — no longer read; only mentioned in a commented-out demo block in `components/session-provider.tsx`.

## Auth (Better Auth + MongoDB)

- Server config in `lib/auth.ts` (`user.additionalFields`: `role`, `phone`, `bio`), client in `lib/auth-client.ts`, catch-all handler `app/api/auth/[...all]/route.ts`. Sign-in/sign-up forms live in `components/auth/` and call `authClient.*` directly.
- `inferAdditionalFields(...)` must sit inside the `plugins: []` array of `createAuthClient`. Better Auth reads additional fields from `options.plugins` only — spreading it at the top level silently drops them from `session.user.*` and from `updateUser`'s input type. The field list is duplicated between `lib/auth.ts` and `lib/auth-client.ts`; keep them in sync.
- `components/session-provider.tsx` wraps `authClient.useSession()` and exposes `{ user, isPending, signOut }` (`user` is a mapped `SessionUser` from `lib/types.ts`). It is consumed by `components/site/navbar.tsx` and `components/pricing/subscribe-button.tsx`.
- Two `useSession` exports exist: import the one from `@/components/session-provider` in components; the `lib/auth-client` one is Better Auth's raw hook and is only used inside the provider (see the build failure above for why not to call it elsewhere).
- `authClient.updateUser()` refreshes the session cookie and flips Better Auth's client session signal, so `useSession()` re-renders and the navbar avatar picks up a new `user.image` with no manual refetch.
- Private routes must wait for `isPending === false` before redirecting to `/sign-in` — see the guard in `components/profile/profile-form.tsx`; otherwise reloading while signed in bounces the user to login. Sign-in honours `?next=` (see `app/(auth)/sign-in/page.tsx`).

## Structure

- `app/(public)/` — landing, pricing, how-it-works. `app/(auth)/` — sign-in, sign-up, wrapped in `AuthShell`. New pages go in the matching route group.
- `app/dashboard/` — `profile/` is the only real page; `student/`, `tutor/`, `admin/` are unformatted placeholders. Its `layout.tsx` renders `SidebarProvider` + `DashboardSidebar` with **no auth check**, and there is no `middleware.ts` — these routes prerender as static. The only guard in the app is client-side, in `components/profile/profile-form.tsx`. New dashboard pages must add their own guard.
- Sidebar links per role live in `lib/dashboard-menu.ts` (`DashboardMenuItem` type + `menuItemByRole`). Add a route there when you add a `app/dashboard/<role>/...` page; `DashboardSidebar` picks the list from `user.role` and highlights the exact matching URL.
- `app/components/` is a second, non-standard component folder holding only `DashboardSidebar.tsx`, imported by `app/dashboard/layout.tsx` via the relative `../components/...` path (not the `@/components` alias). Prefer `components/<feature>/` for new work.
- Navbar, footer, and the dashboard sidebar link to routes that do not exist yet (`/tuitions`, `/about`, `/dashboard/student/my-applications`, `/dashboard/tutor/*`, `/dashboard/admin/users`, `/dashboard/admin/tuitions`, `/dashboard/admin/transactions`). They are planned placeholders, not broken links to fix.
- `@/*` maps to the repository root (`@/components/...`, `@/lib/...`), not `src/`. There is no `src/` directory.

## Conventions and quirks

- Tailwind CSS v4 is CSS-first: there is no `tailwind.config.*`. Imports, theme tokens (`--brand`, `--footer`), and the dark variant live in `app/globals.css`; Prettier sorts classes against that file (`.prettierrc` → `tailwindStylesheet`).
- shadcn uses the `base-nova` style (`components.json`) built on `@base-ui/react`, **not** Radix. Composition uses `render={<Link href="..." />}`, not `asChild`. Inspect `components/ui` before creating anything; add/update with `npx shadcn@latest add <name>`.
- `cn` is the `cn` npm package (clsx + tailwind-merge replacement; `engines: node >=22`). Components import it from `"cn"`; `@/lib/utils` only re-exports it.
- UI primitives use `data-slot` attributes and `cva` variants; keep new components consistent.
- `lib/highlighter.tsx` is a Shiki highlighter with lazy per-language imports. Register new languages in its `languages` map and examples in `aliases`.
- Tuition banner images upload through `POST /api/upload` (server-only `IMGBB_API_KEY`) using the `uploadBannerImage` helper in `lib/imgbb.ts`; never ship the ImgBB key to the client.
- Payments are not wired: `POST /api/stripe/checkout` does not exist and there is no Stripe dependency. `components/pricing/subscribe-button.tsx` handles the failed fetch by showing a "not connected yet" message — that fallback is intentional, not a bug.
- Theme handling is client-side via `components/theme-provider.tsx`; pressing `d` toggles dark mode outside typing targets. Don't add a conflicting global `d` shortcut.
