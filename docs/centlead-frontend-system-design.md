# Centlead Frontend System Design

## Stack

| Tool | Version | Purpose |
|---|---|---|
| Next.js | 16.2 | Framework (App Router) |
| React | 19 | UI runtime |
| Ant Design | 6.x | Component library |
| Tailwind CSS | 4 | Utility styling |
| Framer Motion | 12 | Animations and page transitions |
| TanStack React Query | 5 | Server state, caching |
| Axios | 1.x | HTTP client |
| React Hot Toast | 2.x | Notifications |
| Lucide React | 1.x | Icons |

Auth: custom JWT (email/password + Google OAuth) — no third-party auth provider.

---

# App Structure

```
/               → Landing page
/auth/login     → Login
/auth/signup    → Sign up
/auth/verify    → Email verification
/app            → Web application (authenticated)
  /app/dashboard
  /app/jobs
  /app/leads
  /app/team
  /app/billing
  /app/settings
```

---

# Auth Layout

`/auth/*` pages use `AuthLayoutShell`:
- Left: form area with AnimatePresence page transitions (Framer Motion)
- Right: dark panel — three-zone layout:
  - **Zone 1 (Pitch):** "Lead Intelligence Platform" badge + gradient headline + subtitle
  - **Zone 2 (Proof):** Browser frame product mockup with floating "Job running" and "+48 leads" cards
  - **Zone 3 (Numbers):** 10× pipeline growth · 94% lead score accuracy · 50+ enrichment sources

---

# JWT Storage

JWT stored in `localStorage` via helper in `src/lib/auth.ts` (or `localStorage.ts`).

Functions: `setToken`, `getToken`, `removeToken`

Every Axios request includes:

```
Authorization: Bearer <token>
```

---

# Theme

Design system:
- Background: white (`#FAFAFA` / `#FFFFFF`)
- Brand: indigo `#4F46E5` → purple `#7C3AED` gradient
- Dark mode: supported via `data-theme="dark"` on `<html>`

Dark mode colors:
- Background: `#09090F`
- Brand: `#818CF8`

Ant Design custom theme token applied via `AntdRegistry` in `layout.tsx`.

---

# Layout

App shell (`/app` route group):
- Sidebar navigation
- Top navigation bar (workspace switcher, credits display, user menu)
- Content panel

Sidebar items: Dashboard · Jobs · Leads · Team · Billing · Settings

---

# Job Creation Flow

User fills:
- Search Query (e.g. "restaurants near guwahati")
- Goal Prompt (e.g. "find restaurants without websites")
- Max Leads (optional)
- AI Toggle (locked ON during trial)

During trial: AI toggle shows "AI lead intelligence enabled during trial. Upgrade to customize analysis."

---

# Job Results UI

Table view with columns:
- Business Name
- Address
- Website
- Phone
- Score (highlighted, color-coded)
- Reason

Sorted by score descending (highest opportunities first).

---

# Lead Details

Click lead → opens Ant Design drawer.

Details shown:
- Contact info (phone, email, address)
- Website link
- AI analysis fields (from `analysisJson`)
- Score and reason
- AI explanation

---

# Credit Display

Top navigation shows: **Credits Remaining: 1,450**

Trial banner: "7-day trial active · 300 credits available"

---

# Team Management

Members list table: Name · Role · Actions

Invite modal fields: email · role

---

# Billing Page

Shows:
- Current plan
- Credits remaining
- Upgrade CTA

Payment handled by WHOP (redirect to WHOP checkout).

---

# React Query Usage

Cached queries:
- `jobs` — list and status polling
- `leads` — list by job
- `workspace` — workspace info, credits
- `team` — members list

Polling: job status refetches every few seconds while `status === 'running'`.

---

# Notifications

React Hot Toast used for:
- Job created
- Invite sent
- Error alerts
- Success messages

---

# Loading UX

Skeleton loaders for tables and cards.

Job processing status: shows "Processing leads..." while job is running.

---

# Empty States

Example:

```
No jobs yet.
Create your first lead discovery job.
```

---

# Conversion Prompts

On trial limit hit → upgrade modal:

"Upgrade to unlock unlimited lead intelligence."

On AI disable attempt:

"AI scoring is part of the Centlead intelligence engine. Upgrade to a paid plan to disable AI scoring."

---

# Landing Page (`/`)

Sections:
- Hero with product mockup
- Features
- Pricing
- Testimonials / social proof
- FAQ

CTA: "Start free trial"

---

# Key UX Goal

User discovers 5–10 high-opportunity leads within minutes of creating their first job. That moment drives subscription upgrades.
