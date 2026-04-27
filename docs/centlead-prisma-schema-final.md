# Centlead Prisma Schema (Final Correct Version)

Database: PostgreSQL\
ORM: Prisma\
Architecture: Workspace-based multi-tenant SaaS

This schema supports:

-   Clerk authentication
-   Workspace teams
-   AI lead scoring
-   Job-based AI schema
-   Credit usage tracking
-   WHOP subscriptions

------------------------------------------------------------------------

# User

Users are authenticated with **Clerk**.\
We keep a local reference to connect users to workspaces.

``` prisma
model User {
  id            String   @id
  email         String   @unique
  createdAt     DateTime @default(now())

  memberships   WorkspaceMember[]
}
```

------------------------------------------------------------------------

# Workspace

All resources belong to a workspace.

``` prisma
model Workspace {
  id                String   @id @default(uuid())
  name              String
  ownerId           String

  plan              String
  monthlyCredits    Int
  creditsRemaining  Int

  createdAt         DateTime @default(now())

  owner             User     @relation(fields: [ownerId], references: [id])
  members           WorkspaceMember[]
  jobs              Job[]
  leads             Lead[]
  subscriptions     Subscription[]
  credits           CreditTransaction[]
}
```

------------------------------------------------------------------------

# WorkspaceMember

``` prisma
model WorkspaceMember {
  id           String   @id @default(uuid())
  workspaceId  String
  userId       String
  role         Role

  createdAt    DateTime @default(now())

  workspace    Workspace @relation(fields: [workspaceId], references: [id])
  user         User      @relation(fields: [userId], references: [id])
}

enum Role {
  owner
  admin
  member
  viewer
}
```

------------------------------------------------------------------------

# WorkspaceInvitation

``` prisma
model WorkspaceInvitation {
  id           String   @id @default(uuid())
  workspaceId  String
  email        String
  role         Role

  token        String   @unique
  status       InvitationStatus

  expiresAt    DateTime
  createdAt    DateTime @default(now())

  workspace    Workspace @relation(fields: [workspaceId], references: [id])
}

enum InvitationStatus {
  pending
  accepted
  expired
}
```

------------------------------------------------------------------------

# Job

Each job represents a **lead discovery request**.

Important field:

`analysisSchema`

This schema defines how AI must analyze each lead.

``` prisma
model Job {
  id            String   @id @default(uuid())
  workspaceId   String
  createdById   String

  searchQuery   String
  goalPrompt    String

  aiEnabled     Boolean

  analysisSchema Json

  status        JobStatus

  createdAt     DateTime @default(now())

  workspace     Workspace @relation(fields: [workspaceId], references: [id])
  leads         Lead[]
}

enum JobStatus {
  pending
  running
  completed
  failed
}
```

------------------------------------------------------------------------

# analysisSchema Example

Example stored in `Job.analysisSchema`

``` json
{
  "fields": [
    {
      "name": "has_website",
      "type": "boolean"
    },
    {
      "name": "website_quality",
      "type": "string",
      "allowed_values": ["none","poor","average","good"]
    },
    {
      "name": "website_issues",
      "type": "array"
    }
  ],
  "score_definition": "Businesses without websites get highest score",
  "reason": "string"
}
```

Purpose:

-   Ensures AI returns consistent JSON
-   Enables dynamic columns in frontend
-   Enables filtering

------------------------------------------------------------------------

# Lead

Each lead belongs to a job.

AI analysis result is stored in:

-   `analysisJson`
-   `score`
-   `reason`

``` prisma
model Lead {
  id            String   @id @default(uuid())

  workspaceId   String
  jobId         String

  name          String
  website       String?
  phone         String?
  email         String?

  score         Float?
  reason        String?

  analysisJson  Json?

  createdAt     DateTime @default(now())

  workspace     Workspace @relation(fields: [workspaceId], references: [id])
  job           Job       @relation(fields: [jobId], references: [id])
}
```

------------------------------------------------------------------------

# Example Lead Analysis Result

``` json
{
  "has_website": false,
  "website_quality": "none",
  "website_issues": [],
  "score": 95,
  "reason": "This business has no website which makes it a strong opportunity to sell website development services."
}
```

------------------------------------------------------------------------

# CreditTransaction

Tracks credit usage.

``` prisma
model CreditTransaction {
  id            String   @id @default(uuid())
  workspaceId   String

  amount        Int
  reason        String

  createdAt     DateTime @default(now())

  workspace     Workspace @relation(fields: [workspaceId], references: [id])
}
```

Example reasons:

-   lead_generation
-   website_crawl
-   ai_scoring

------------------------------------------------------------------------

# Subscription

Managed through **WHOP payment gateway**.

``` prisma
model Subscription {
  id            String   @id @default(uuid())
  workspaceId   String

  provider      String
  externalId    String

  plan          String
  status        SubscriptionStatus

  renewsAt      DateTime
  createdAt     DateTime @default(now())

  workspace     Workspace @relation(fields: [workspaceId], references: [id])
}

enum SubscriptionStatus {
  active
  canceled
  past_due
}
```

------------------------------------------------------------------------

# Index Recommendations

Add indexes for performance.

``` prisma
@@index([workspaceId])
@@index([jobId])
@@index([createdAt])
@@index([score])
```

------------------------------------------------------------------------

# Final Data Flow

User creates job\
→ AI generates analysisSchema\
→ Schema saved in Job

Workers fetch leads\
→ Website crawler enriches leads

AI worker analyzes leads

Each lead stores:

-   score
-   reason
-   analysisJson

Frontend renders columns dynamically from analysisSchema.
