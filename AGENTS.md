# Agent Rules — Centlead Frontend

## Next.js 16 specifics (read before writing code)
- This is Next.js **16** — some APIs differ from v13/14 training data
- Proxy file is `src/proxy.ts` (not `middleware.ts` — that convention is deprecated in v16)
- App Router with `src/app/` directory layout
- Turbopack is used for builds
- Read `node_modules/next/dist/docs/` if unsure about a specific API

## Rules enforced in this project
1. **envConstant** — all `process.env` access is centralised in `src/constants/envConstant.ts`. Never access `process.env` directly anywhere else.
2. **Path aliases** — use `@constants/*`, `@components/*`, `@hooks/*`, `@lib/*`, `@appTypes/*`, `@utils/*`, `@providers/*`. Never use long relative imports like `../../../`.
3. **'use client'** — required on any file using Ant Design components or React hooks. Ant Design is a client-only library.
4. **Always run `npm run build`** after making changes to verify there are no TypeScript or build errors before reporting the task complete.
5. **No direct API calls in components** — always go through React Query hooks in `src/hooks/`.
6. **No hardcoded strings for routes or API paths** — use `src/constants/apiRoutes.ts`.

## Common pitfalls
- `@types/*` is a reserved TypeScript namespace. This project uses `@appTypes/*` for app-level types.
- Ant Design `Layout`, `Menu`, `Table`, etc. are all client components — they need `'use client'`.
- Clerk v7 removed `afterSignInUrl`/`afterSignUpUrl` props — use `signInFallbackRedirectUrl`/`signUpFallbackRedirectUrl` instead.
- The proxy file (`src/proxy.ts`) protects all `/app/*` routes via Clerk.

## Full project context
See `CLAUDE.md` for the complete architecture, folder structure, and feature checklist.
See `docs/` for product spec, system design, and Prisma schema.
