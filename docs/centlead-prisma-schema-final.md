# Centlead Prisma Schema (Current)

Database: PostgreSQL
ORM: Prisma
Architecture: Workspace-based multi-tenant SaaS

---

# User

Custom auth — no third-party provider. Supports email/password and Google OAuth.

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password      String?          // null for Google-only accounts
  firstName     String?
  lastName      String?
  googleId      String?  @unique // null for email/password accounts
  emailVerified Boolean  @default(false)
  hasUsedTrial  Boolean  @default(false)
  createdAt     DateTime @default(now())

  memberships     WorkspaceMember[]
  workspacesOwned Workspace[]
}
```

---

# Workspace

All resources belong to a workspace.

```prisma
model Workspace {
  id               String    @id @default(uuid())
  name             String
  ownerId          String
  plan             String    @default("trial")
  monthlyCredits   Int       @default(300)
  creditsRemaining Int       @default(300)
  trialEndsAt      DateTime?
  createdAt        DateTime  @default(now())

  owner         User                  @relation(fields: [ownerId], references: [id])
  members       WorkspaceMember[]
  invitations   WorkspaceInvitation[]
  jobs          Job[]
  leads         Lead[]
  subscriptions Subscription[]
  credits       CreditTransaction[]
}
```

---

# WorkspaceMember

```prisma
model WorkspaceMember {
  id          String   @id @default(uuid())
  workspaceId String
  userId      String
  role        Role
  createdAt   DateTime @default(now())

  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id])

  @@unique([workspaceId, userId])
  @@index([workspaceId])
}

enum Role {
  owner
  admin
  member
  viewer
}
```

---

# WorkspaceInvitation

Token is not stored in DB — invite is identified by record ID sent in the invite link email.

```prisma
model WorkspaceInvitation {
  id          String           @id @default(uuid())
  workspaceId String
  email       String
  role        Role
  status      InvitationStatus @default(pending)
  expiresAt   DateTime
  createdAt   DateTime         @default(now())

  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@index([workspaceId])
}

enum InvitationStatus {
  pending
  accepted
  expired
}
```

---

# Job

Each job is a lead discovery request. `analysisSchema` defines what fields the AI must return for each lead.

```prisma
model Job {
  id             String    @id @default(uuid())
  workspaceId    String
  createdById    String
  searchQuery    String
  goalPrompt     String
  aiEnabled      Boolean   @default(true)
  analysisSchema Json?
  maxLeads       Int?
  status         JobStatus @default(pending)
  createdAt      DateTime  @default(now())

  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  leads     Lead[]

  @@index([workspaceId])
  @@index([status])
  @@index([createdAt])
}

enum JobStatus {
  pending
  running
  completed
  failed
}
```

`analysisSchema` example:

```json
{
  "fields": [
    { "name": "has_website", "type": "boolean" },
    { "name": "website_quality", "type": "string", "allowed_values": ["none","poor","average","good"] },
    { "name": "website_issues", "type": "array" }
  ],
  "score_definition": "Businesses without websites get highest score",
  "reason": "string"
}
```

---

# Lead

Each lead belongs to a job. Sourced from Google Places API, optionally enriched by crawler, optionally scored by AI.

```prisma
model Lead {
  id           String   @id @default(uuid())
  workspaceId  String
  jobId        String
  name         String
  website      String?
  phone        String?
  email        String?
  address      String?
  score        Float?
  reason       String?
  analysisJson Json?
  createdAt    DateTime @default(now())

  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  job       Job       @relation(fields: [jobId], references: [id], onDelete: Cascade)

  @@index([workspaceId])
  @@index([jobId])
  @@index([score])
  @@index([createdAt])
}
```

`analysisJson` example:

```json
{
  "has_website": false,
  "website_quality": "none",
  "website_issues": [],
  "score": 95,
  "reason": "No website found — strong opportunity to sell web development services."
}
```

---

# CreditTransaction

```prisma
model CreditTransaction {
  id          String   @id @default(uuid())
  workspaceId String
  amount      Int
  reason      String
  createdAt   DateTime @default(now())

  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@index([workspaceId])
  @@index([createdAt])
}
```

Example `reason` values: `lead_generation` · `website_crawl` · `ai_scoring`

---

# Subscription

Managed through WHOP payment gateway.

```prisma
model Subscription {
  id          String             @id @default(uuid())
  workspaceId String
  provider    String             @default("whop")
  externalId  String
  plan        String
  status      SubscriptionStatus @default(active)
  renewsAt    DateTime
  createdAt   DateTime           @default(now())

  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@index([workspaceId])
}

enum SubscriptionStatus {
  active
  canceled
  past_due
}
```

---

# Data Flow Summary

```
User creates job
  → Job.analysisSchema generated by AI (planned)

Search Worker
  → Creates Lead records from Google Places API results
  → name, address, website, phone populated

Crawler Worker (planned)
  → Enriches Lead: email, additional contact data

AI Worker (planned)
  → Populates Lead.score, Lead.reason, Lead.analysisJson

Frontend renders analysisJson columns dynamically from Job.analysisSchema
```
