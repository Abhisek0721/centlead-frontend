# Centlead Backend System Design

## Overview

Centlead backend is a scalable job processing system that collects
business leads via Google Places API, enriches them through website
crawling, scores them with AI, and ranks opportunities for the user.

Architecture style:
- Modular monolith
- Worker-based asynchronous processing
- Queue-driven architecture

Primary stack:
- NestJS with FastifyAdapter
- PostgreSQL
- Prisma ORM
- RabbitMQ
- Redis
- Custom JWT auth (email/password + Google OAuth via Passport)
- Resend (email)
- WHOP (payments)
- Docker Compose

---

# Infrastructure

Services managed with Docker Compose:

- postgres
- rabbitmq
- redis
- api (NestJS with FastifyAdapter)
- workers (NestJS worker container)

---

# Authentication

Authentication is handled with a custom JWT system — no third-party auth provider.

Two login methods:
- Email + password (bcryptjs hashing, salt rounds: 12)
- Google OAuth (Passport `passport-google-oauth20`)

On successful login or signup, a signed JWT is returned:

```
{ sub: userId, email }
```

JWT is verified on every protected request via `JwtAuthGuard` (Passport JWT strategy).

Token signing uses `envConstant.JWT_SECRET` and `envConstant.JWT_EXPIRES_IN` (default: 7d).

Email verification flow:
1. On signup, a 6-digit OTP is generated and stored in Redis with a 24h TTL
2. OTP sent via Resend
3. User submits OTP → `emailVerified` set to `true` on User record

---

# Token Management

Tokens stored in Redis.

Types:

| Key pattern | TTL | Purpose |
|---|---|---|
| `email_verification:{userId}` | 24h | OTP for email verify |
| `invite_token:{token}` | 24h | Workspace invite links |
| `password_reset:{userId}` | 15min | Password reset OTP |

---

# Workspace Architecture

All resources belong to a workspace.

Relationship:

```
User → Workspace (owner)
Workspace → WorkspaceMember[]
Workspace → Jobs[]
Workspace → Leads[]
Workspace → Credits[]
Workspace → Subscriptions[]
```

---

# Role System

Roles (enum `Role`):

```
owner | admin | member | viewer
```

Permissions:

| Role | Can do |
|---|---|
| owner | billing, invite, remove members |
| admin | manage jobs, invite members |
| member | create jobs, view leads |
| viewer | view leads only |

---

# Team Invite Flow

1. Owner enters email and role
2. Backend creates `WorkspaceInvitation` record (status: pending, expiresAt: +24h)
3. Email sent via Resend with invite link containing invitation ID
4. User opens invite link → if unregistered, prompted to create account
5. Backend accepts invite: `WorkspaceMember` record created, invitation status set to `accepted`

---

# Job Processing Pipeline

```
User creates job
  ↓ Job stored in DB (status: pending)
  ↓ Job ID pushed to job_queue
  ↓ Search Worker: calls Google Places API, stores leads, pushes to crawler_queue
  ↓ Crawler Worker: visits websites, extracts data, updates leads
  ↓ AI Worker: batch-analyzes leads, stores score + analysisJson
  ↓ Job status → completed
```

---

# Lead Collection (Search Worker)

Search Worker calls the Google Places **Text Search (New)** API:

```
POST https://places.googleapis.com/v1/places:searchText
```

Headers:
- `X-Goog-Api-Key: GOOGLE_PLACES_API_KEY`
- `X-Goog-FieldMask: places.displayName,places.formattedAddress,places.location,places.websiteUri,places.nationalPhoneNumber,nextPageToken`

Body:
```json
{
  "textQuery": "<searchQuery from job>",
  "minRating": 3.8,
  "pageToken": "<nextPageToken or empty string>"
}
```

Pagination: Worker follows `nextPageToken` until exhausted, `maxLeads` is reached, or a safety cap of 10 pages is hit.

Each place is stored as a `Lead` record with: `name`, `formattedAddress`, `websiteUri`, `nationalPhoneNumber`.

Leads with a website are pushed to `crawler_queue` for enrichment.

---

# Website Crawling (Crawler Worker)

Crawler Worker receives `CrawlerQueuePayload` from `crawler_queue`.

Responsibilities (planned):
- Visit website
- Extract emails, contact links, social links
- Detect tech stack
- Update lead record with crawled data

---

# AI Lead Scoring (AI Worker)

AI Worker receives lead IDs from `ai_queue`.

Batch processing: 50 leads per AI request (90% cost reduction vs per-lead).

Prompt contains:
- User's goal prompt
- Leads data
- Job's `analysisSchema` (defines what fields to return)

AI returns structured JSON. Stored in `lead.analysisJson`, `lead.score`, `lead.reason`.

---

# Credit System

Credits belong to workspace.

| Action | Credits consumed |
|---|---|
| lead_generation | 1 |
| website_crawl | 1 |
| ai_scoring | 2 |

Credits reset every billing cycle. Unused subscription credits do not carry forward. Purchased extra credits do not expire.

---

# Subscription System

Payment gateway: WHOP

Plans: Starter · Growth · Pro · Agency

WHOP webhook events handled:
- `subscription_created`
- `subscription_renewed`
- `subscription_cancelled`

Backend updates workspace `plan`, `monthlyCredits`, and `creditsRemaining` on webhook.

---

# Free Trial

- Duration: 7 days (`trialEndsAt` on Workspace)
- Credits: 300
- AI scoring mandatory, cannot be disabled
- Max 100 leads per job
- Exports allowed

---

# API Modules (NestJS)

| Module | Responsibility |
|---|---|
| auth | signup, login, Google OAuth, email verify, password reset |
| workspace | workspace CRUD, settings |
| team | member management, invitations |
| jobs | create/list/get jobs |
| leads | list/get leads |
| credits | credit balance, usage |
| billing | subscription, WHOP webhooks |
| notifications | email sending via Resend |
| places | Google Places API integration |

---

# Queue Architecture

| Queue | Producer | Consumer |
|---|---|---|
| `job_queue` | jobs.service | JobConsumer |
| `crawler_queue` | JobConsumer | CrawlerConsumer |
| `ai_queue` | CrawlerConsumer (planned) | AiConsumer |

Workers scale horizontally — multiple worker containers can process queues concurrently.

---

# Database

PostgreSQL with Prisma ORM.

JSON fields:
- `Job.analysisSchema` — AI output schema definition
- `Lead.analysisJson` — per-lead AI analysis result

Indexes on all `workspaceId`, `jobId`, `score`, `createdAt` fields.

---

# Future Improvements

- Website crawling implementation
- AI scoring implementation
- Email verification enforcement on login
- LinkedIn enrichment
- CRM integrations
- Automated outreach
