@AGENTS.md

# Centlead Frontend — Claude Context

## What this project is
Centlead is an AI-powered lead intelligence platform. This repo is the **Next.js frontend**.
The backend lives at `../centlead-backend` (NestJS + Fastify). Full product spec is in `docs/`.

## Stack
| Package | Version | Notes |
|---|---|---|
| Next.js | 16.x | App Router, Turbopack, `src/app/` layout |
| React | 19.x | |
| Ant Design | 5.x | Dark theme via `ConfigProvider` |
| TanStack React Query | 5.x | All data fetching |
| Axios | 1.x | Single instance in `src/lib/axios.ts` |
| Clerk | 7.x | Auth — `ClerkProvider` in `Providers.tsx` |
| React Hot Toast | 2.x | Notifications |
| Tailwind CSS | 4.x | Utility classes alongside Ant Design |

## Folder structure
```
src/
  app/                          # Next.js App Router
    app/                        # /app/* routes (protected, dashboard)
      layout.tsx                # 'use client' — Sidebar + TopNav
      page.tsx                  # /app (dashboard)
      jobs/page.tsx             # /app/jobs
      jobs/[jobId]/page.tsx     # /app/jobs/:id
      leads/page.tsx
      team/page.tsx
      billing/page.tsx
      settings/page.tsx
    sign-in/[[...sign-in]]/     # Clerk sign-in
    sign-up/[[...sign-up]]/     # Clerk sign-up
    layout.tsx                  # Root layout — wraps with <Providers>
    page.tsx                    # / landing page
    globals.css
  components/
    layout/
      Sidebar.tsx               # 'use client' — nav, active state
      TopNav.tsx                # 'use client' — credits display, UserButton
  constants/
    envConstant.ts              # ALL env vars go here — never process.env elsewhere
    apiRoutes.ts                # All backend route builders
  hooks/                        # React Query hooks (one file per domain)
    useJobs.ts
    useLeads.ts
    useTeam.ts
    useBilling.ts
    useWorkspace.ts
  lib/
    axios.ts                    # Global Axios instance, auto-injects Bearer token
    queryClient.ts              # React Query client config
  providers/
    Providers.tsx               # 'use client' — Clerk + QueryClient + Antd + Toaster
  types/
    index.ts                    # All TypeScript interfaces (mirrors Prisma schema)
  utils/
    localStorage.ts             # setToken/getToken/removeToken + workspaceId helpers
  proxy.ts                      # Clerk auth middleware (Next.js 16 uses "proxy" not "middleware")
```

## Critical rules

### 1. envConstant — never use process.env directly
All environment variables must go through `src/constants/envConstant.ts`.
Never write `process.env.SOMETHING` anywhere else.

```ts
// ✅ correct
import envConstant from '@constants/envConstant';
const url = envConstant.NEXT_PUBLIC_API_URL;

// ❌ wrong
const url = process.env.NEXT_PUBLIC_API_URL;
```

### 2. Path aliases (tsconfig.json)
| Alias | Resolves to |
|---|---|
| `@constants/*` | `src/constants/*` |
| `@components/*` | `src/components/*` |
| `@hooks/*` | `src/hooks/*` |
| `@lib/*` | `src/lib/*` |
| `@appTypes/*` | `src/types/*` |
| `@utils/*` | `src/utils/*` |
| `@providers/*` | `src/providers/*` |
| `@/*` | `./*` (root) |

> Note: Use `@appTypes/*` not `@types/*` — the latter conflicts with TypeScript's built-in `@types` namespace.

### 3. 'use client' rules
- Any component using Ant Design must have `'use client'`
- Any component using React hooks (`useState`, `useEffect`, `useRouter`, etc.) must have `'use client'`
- Layouts that render Ant Design components must have `'use client'`
- Page components can be server components if they don't use hooks or Ant Design directly

### 4. Auth token flow
Clerk JWTs are synced to localStorage via `ClerkTokenSync` in `Providers.tsx` (refreshes every 55s).
The Axios instance in `src/lib/axios.ts` reads from localStorage and injects the Bearer token on every request.

### 5. New feature checklist
When adding a new API-connected feature:
1. Add types to `src/types/index.ts`
2. Add route builders to `src/constants/apiRoutes.ts`
3. Create a hook in `src/hooks/use<Feature>.ts` using React Query
4. Build the page/component using the hook

## Environment variables
See `.env.example`. Copy to `.env.local` and fill in values.
Clerk keys: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` only — secret key is backend-only.

## Commands
```bash
npm run dev      # dev server at localhost:3000
npm run build    # production build (always run this to verify before committing)
npm run lint     # ESLint
```

## Backend connection
Backend runs at `NEXT_PUBLIC_API_URL` (default `http://localhost:5000`).
All API calls go through the Axios instance in `src/lib/axios.ts`.
Backend route patterns: `GET/POST /workspaces/:workspaceId/jobs`, etc. — see `src/constants/apiRoutes.ts`.
