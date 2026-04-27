# Centlead Frontend

Next.js 16 frontend for Centlead — an AI-powered lead intelligence platform that discovers, enriches, and ranks business opportunities.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| UI | Ant Design 6 + Tailwind CSS 4 |
| State / Data | TanStack React Query 5 |
| HTTP | Axios |
| Auth | Custom JWT (cookie + localStorage) |
| Animations | Framer Motion + Three.js |
| Notifications | react-hot-toast |

## Prerequisites

- Node.js 20+
- [centlead-backend](../centlead-backend) running on `http://localhost:5000`

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env — set NEXT_PUBLIC_API_URL to your backend URL

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000` |

## Scripts

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── (auth)/                 # Auth pages (login, signup)
│   ├── app/                    # Protected dashboard pages
│   │   ├── layout.tsx          # Dashboard layout + /me verification check
│   │   ├── page.tsx            # Dashboard home
│   │   ├── jobs/               # Jobs pages
│   │   ├── leads/              # Leads pages
│   │   ├── team/               # Team management
│   │   ├── billing/            # Billing
│   │   └── settings/           # Settings
│   ├── verify-email/           # Email verification handler
│   ├── reset-password/         # Password reset form
│   └── sso-callback/           # Google OAuth callback handler
├── components/
│   ├── auth/                   # LoginForm, SignUpForm, AuthLayout
│   └── layout/                 # Sidebar, TopNav, NavBar
├── providers/
│   ├── AuthProvider.tsx        # JWT auth context (login, signup, logout)
│   ├── ThemeProvider.tsx       # Light/dark theme
│   └── Providers.tsx           # Root provider composition
├── hooks/                      # React Query hooks (useJobs, useLeads, etc.)
├── lib/
│   ├── axios.ts                # Axios instance
│   └── queryClient.ts          # React Query client config
├── constants/
│   ├── envConstant.ts          # Typed env vars
│   └── apiRoutes.ts            # API route constants
├── types/                      # Shared TypeScript types
├── utils/
│   └── localStorage.ts         # Token helpers
└── proxy.ts                    # Next.js middleware (route protection)
```

## Auth Flow

Route protection is handled server-side via `src/proxy.ts` (Next.js middleware), which checks for an `auth_token` cookie.

| Route | Behaviour |
|---|---|
| `/app/*` | Requires `auth_token` cookie — redirects to `/login` if missing |
| `/login`, `/signup` | Redirects to `/app` if already authenticated |
| `/verify-email` | Verifies token, auto-logs in, redirects to `/app` |
| `/reset-password` | Resets password, auto-logs in (if verified), redirects to `/app` |
| `/sso-callback` | Handles Google OAuth token, redirects to `/app` |

**Cookie vs localStorage:**
- The `auth_token` **cookie** is the proxy gate — only set after a verified auth action (login, email verification, Google OAuth, password reset for a verified account).
- The JWT in **localStorage** is used for `Authorization: Bearer` headers in API calls.
- Signup stores the token in localStorage only (no cookie) so unverified users cannot access `/app`.

The dashboard layout calls `GET /api/auth/me` on mount (React Query, 5-min cache). If `emailVerified` is `false`, it clears the token and redirects to `/login` as an extra security layer.

## Path Aliases

```ts
@components/*   →   src/components/
@providers/*    →   src/providers/
@hooks/*        →   src/hooks/
@lib/*          →   src/lib/
@constants/*    →   src/constants/
@utils/*        →   src/utils/
@appTypes/*     →   src/types/
```

## Related

- [centlead-backend](https://github.com/Abhisek0721/centlead-backend) — NestJS API, RabbitMQ job pipeline, Prisma + PostgreSQL
