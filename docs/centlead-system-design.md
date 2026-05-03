# Centlead — System Design

## Technology Stack

| Layer | Technology |
|---|---|
| Backend | NestJS (FastifyAdapter) |
| Queue | RabbitMQ |
| Database | PostgreSQL |
| ORM | Prisma |
| Cache / Tokens | Redis |
| Frontend | Next.js 16 (App Router) |
| Auth | Custom JWT — bcryptjs + Passport JWT + Google OAuth |
| Email | Resend |
| Payments | WHOP |

Workers: Search Worker · Crawler Worker · AI Analysis Worker

---

# Job Architecture

```
User creates job
  ↓ Job stored in PostgreSQL (status: pending)
  ↓ Job ID pushed to job_queue (RabbitMQ)
  ↓ Search Worker processes job
  ↓ Leads stored in PostgreSQL
  ↓ Lead IDs (with website) pushed to crawler_queue
  ↓ Crawler Worker enriches leads
  ↓ Lead IDs pushed to ai_queue
  ↓ AI Worker scores leads
  ↓ Scores stored → job status: completed
  ↓ Frontend shows ranked leads
```

---

# Worker Design

## Search Worker

- Listens on `job_queue`
- Calls Google Places **Text Search (New)** API (`places:searchText`)
- Filters to businesses with rating ≥ 3.8 (`minRating`)
- Paginates using `nextPageToken` until `maxLeads` reached or 10-page cap hit
- Creates `Lead` records: name, address, website, phone
- Emits `crawler_queue` message for each lead that has a website
- Updates job status → `running` on start, `completed` on finish, `failed` on error

## Crawler Worker

- Listens on `crawler_queue`
- Visits lead website
- Extracts: emails, contact data, social links, tech stack
- Updates lead record with enriched data

## AI Worker

- Listens on `ai_queue`
- Receives batch of lead IDs
- Sends batched leads + goal prompt + analysisSchema to OpenAI
- Stores per-lead: `score`, `reason`, `analysisJson`

---

# Google Places API

Endpoint: `POST https://places.googleapis.com/v1/places:searchText`

Required headers:
```
X-Goog-Api-Key: <GOOGLE_PLACES_API_KEY>
X-Goog-FieldMask: places.displayName,places.formattedAddress,places.location,places.websiteUri,places.nationalPhoneNumber,nextPageToken
```

Request body:
```json
{
  "textQuery": "restaurants near guwahati",
  "minRating": 3.8,
  "pageToken": ""
}
```

Response contains `places[]` and optionally `nextPageToken` for the next page.

---

# AI Scoring Strategy

Batch analysis — 50 leads per AI request.

Benefits:
- 90% lower cost vs per-lead requests
- Faster end-to-end job completion

Prompt includes:
- User goal
- Lead data
- `analysisSchema` from the Job (defines expected JSON output structure)

AI returns consistent JSON per lead. Frontend renders dynamic columns from `analysisSchema`.

---

# Lead Storage Model

Structured columns + JSON:

| Column | Type | Source |
|---|---|---|
| name | String | Places API |
| address | String | Places API |
| website | String? | Places API |
| phone | String? | Places API |
| email | String? | Crawler |
| score | Float? | AI Worker |
| reason | String? | AI Worker |
| analysisJson | Json? | AI Worker |

---

# Queue Strategy

| Queue | Durable | Purpose |
|---|---|---|
| `job_queue` | yes | Trigger search worker |
| `crawler_queue` | yes | Trigger crawler worker |
| `ai_queue` | yes | Trigger AI worker |

Workers scale horizontally — multiple containers can consume from the same queue concurrently.

---

# Auth Flow

Email/password:
1. `POST /auth/signup` — hash password, create user, send verification OTP
2. `POST /auth/verify-email` — verify OTP, mark `emailVerified: true`
3. `POST /auth/login` — verify password, return JWT

Google OAuth:
1. `GET /auth/google` → redirect to Google consent
2. `GET /auth/google/callback` → upsert user, return JWT

JWT payload: `{ sub: userId, email }`

---

# Redis Key Patterns

| Key | TTL | Purpose |
|---|---|---|
| `email_verification:{userId}` | 24h | Email OTP |
| `invite_token:{token}` | 24h | Workspace invite |
| `password_reset:{userId}` | 15min | Password reset OTP |

---

# Scaling Strategy

- Add more search/crawler/AI worker containers
- Redis caching for duplicate website crawls
- Batch AI analysis (already implemented)
- Horizontal DB read replicas for lead queries

---

# Future Improvements

- Email verification enforcement on login
- LinkedIn enrichment
- CRM integrations (HubSpot, Salesforce)
- Sales outreach automation
- Lead deduplication across jobs
