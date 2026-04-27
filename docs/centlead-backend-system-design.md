# Centlead Backend System Design

## Overview

Centlead backend is designed as a scalable job processing system that
collects business leads, enriches them with data, analyzes them using
AI, and ranks opportunities.

Architecture style: - Modular monolith initially - Worker-based
asynchronous processing - Queue driven architecture

Primary stack: - NestJS with FastifyAdapter - PostgreSQL - Prisma ORM - RabbitMQ - Redis -
Clerk (authentication) - Resend (email) - WHOP (payments) - Docker
Compose

------------------------------------------------------------------------

# Infrastructure

Services managed with Docker Compose:

-   postgres
-   rabbitmq
-   redis
-   api (nestjs with fastify adapter. Eg: NestFactory.create(AppModule, new FastifyAdapter()))
-   workers (nestjs worker container)

Example services:

postgres rabbitmq redis api worker

------------------------------------------------------------------------

# Authentication

Authentication provider: Clerk

Reasons: - OAuth support - Google login support - user management
handled externally - no need for Google business verification

Frontend authentication handled by Clerk SDK.

Backend receives Clerk JWT.

JWT verification middleware validates:

-   user id
-   email
-   workspace id

------------------------------------------------------------------------

# Token Management

Tokens stored temporarily in Redis.

Types:

invite_token email_verification_token job_execution_token

Redis TTL example:

invite_token: 24h verification_token: 24h

------------------------------------------------------------------------

# Workspace Architecture

All resources belong to workspace.

Relationship:

User → Workspace Workspace → Jobs Workspace → Leads Workspace → Credits

Tables:

users workspaces workspace_members workspace_invitations jobs leads
subscriptions credit_transactions

------------------------------------------------------------------------

# Role System

Roles:

owner admin member viewer

Permissions:

Owner - billing - invite members - remove members

Admin - manage jobs - invite members

Member - create jobs - view leads

Viewer - view leads only

------------------------------------------------------------------------

# Team Invite Flow

1 Invite member

Owner enters email and role.

2 Backend generates invite token

Stored in Redis.

3 Email sent using Resend

Template variables:

workspace_name invite_link

4 User opens invite link

If not registered: create account via Clerk

If registered: join workspace

5 workspace_members record created

------------------------------------------------------------------------

# Job Processing Pipeline

User creates job

Job stored in DB

Job pushed to RabbitMQ

Queue pipeline:

job_queue crawler_queue ai_queue

Workers:

Search Worker Crawler Worker AI Worker

------------------------------------------------------------------------

# Lead Collection

Search Worker calls:

Google Places API

Returns businesses.

Stored as leads.

Fields:

name phone website address

------------------------------------------------------------------------

# Website Crawling

Crawler Worker:

Visits website

Extracts:

emails contact page social links technology stack

Data saved to lead record.

------------------------------------------------------------------------

# AI Lead Scoring

AI Worker analyzes leads.

Batch processing used.

Example batch size:

50 leads

Prompt contains:

user goal lead information

AI returns JSON scoring results.

Stored in analysis_json.

------------------------------------------------------------------------

# Credit System

Credits belong to workspace.

Actions consume credits.

Example:

lead_generation = 1 credit website_crawl = 1 credit ai_scoring = 2
credits

Credits reset every billing cycle.

Extra purchased credits do not expire.

------------------------------------------------------------------------

# Subscription System

Payment gateway:

WHOP

Plans:

Starter Growth Pro Agency

WHOP webhook events:

subscription_created subscription_renewed subscription_cancelled

Backend updates workspace subscription.

------------------------------------------------------------------------

# Free Trial

7 day trial

300 credits

Restrictions:

AI scoring mandatory max 100 leads per job exports allowed

------------------------------------------------------------------------

# AI Toggle UX

Do NOT display:

AI toggle disabled

Instead show:

AI lead intelligence enabled during trial. Upgrade to customize
analysis.

------------------------------------------------------------------------

# AI Disable Attempt

If user tries to disable AI during trial:

Show message:

AI scoring is part of the Centlead intelligence engine.

Upgrade to a paid plan to disable AI scoring and generate unlimited raw
leads.

------------------------------------------------------------------------

# Queue Scaling

RabbitMQ queues:

job_queue crawler_queue ai_queue

Workers scale horizontally.

Multiple worker containers can run simultaneously.

------------------------------------------------------------------------

# API Modules (NestJS)

Modules:

auth workspace team jobs leads credits billing notifications

------------------------------------------------------------------------

# Database

PostgreSQL with Prisma ORM.

JSON fields used for:

analysis_json lead_metadata

Indexes required:

workspace_id job_id score created_at

------------------------------------------------------------------------

# Logging

System logs:

job execution crawler errors AI responses credit usage

------------------------------------------------------------------------

# Future Improvements

Email verification LinkedIn enrichment CRM integrations automated
outreach
