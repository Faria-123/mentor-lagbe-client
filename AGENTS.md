<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Repository guide

## Commands

- `npm run dev`, `npm run build` (Next.js 16 + Turbopack).
- `npm run typecheck` — `tsc --noEmit`; currently passes.
- `npm run lint` — `eslint` flat config over the whole repo. For focused checks use `npx eslint <path>`; there is no `next lint`.
- Format only files you change: `npx prettier --write <files>`. Avoid `npm run format`; it rewrites every TS/TSX file and currently changes 26 baseline files.
- No test runner or CI is configured. Verify changes with typecheck, lint, and build.

Baseline: `npm run lint` currently reports 2 errors in `components/ui/carousel.tsx` and `hooks/use-mobile.ts` (`react-hooks/set-state-in-effect`). Don't attribute them to your change unless you edited those files.

## Conventions and quirks

- `@/*` maps to the repository root (`@/components/...`, `@/lib/...`), not `src/`; the App Router lives in `app/`.
- Tailwind CSS v4 is CSS-first: there is no `tailwind.config.*`. Imports, theme tokens, and the dark variant are in `app/globals.css`; Prettier sorts classes against that file.
- shadcn is configured with the `base-nova` style (`components.json`) and built on `@base-ui/react`, not Radix. Inspect `components/ui` before creating anything; add/update with `npx shadcn@latest add <name>`.
- `cn` is the `cn` npm package (a clsx + tailwind-merge replacement, requires Node 22+). Existing components import `cn` from `"cn"`; `@/lib/utils` only re-exports it.
- UI primitives use `data-slot` attributes and `cva` variants; keep new components consistent.
- `lib/highlighter.tsx` is a Shiki highlighter with lazy per-language imports. Register any new language in its `languages` map and examples in `aliases`.
- Theme handling is client-side via `components/theme-provider.tsx`; pressing `d` toggles dark mode outside typing targets. Don't add a conflicting global `d` shortcut.
