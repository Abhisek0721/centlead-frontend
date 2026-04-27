# Centlead -- System Design

## Technology Stack

Backend - NestJS

Queue System - RabbitMQ

Database - PostgreSQL

ORM - Prisma

Frontend - Next.js

Workers - Search Worker - Website Crawler Worker - AI Analysis Worker

------------------------------------------------------------------------

# Scalable Job Architecture

User creates job ↓ Job stored in database ↓ Job pushed to queue ↓ Search
worker fetches leads ↓ Leads stored ↓ Crawler worker extracts website
data ↓ AI worker analyzes leads ↓ Scores stored ↓ Leads returned to user

------------------------------------------------------------------------

# Worker Design

## Search Worker

Responsibilities: - Call Google Places API - Retrieve businesses - Store
leads

## Crawler Worker

Responsibilities: - Visit website - Extract emails - Extract contact
data - Detect tech stack

## AI Worker

Responsibilities: - Analyze leads - Apply scoring - Generate explanation

------------------------------------------------------------------------

# AI Scoring Strategy

Batch analysis instead of per-lead requests.

Example:

Send 50 leads in one AI prompt.

AI returns structured JSON scoring results.

Benefits: - 90% lower AI cost - Faster processing

------------------------------------------------------------------------

# Lead Storage Model

Use structured columns + JSON.

Columns: - id - job_id - name - website - score

JSON: analysis_json

Example:

{ "has_website": true, "website_quality": "poor", "issues": \["no mobile
optimization"\] }

------------------------------------------------------------------------

# Queue Strategy

Queues:

job_queue\
crawler_queue\
ai_queue

Workers scale horizontally.

This allows Centlead to process thousands of jobs concurrently.

------------------------------------------------------------------------

# Scaling Strategy

To scale system:

-   Add more crawler workers
-   Add more AI workers
-   Use Redis caching for duplicate websites
-   Batch AI analysis

------------------------------------------------------------------------

# Future Improvements

Potential features:

-   Lead email verification
-   LinkedIn enrichment
-   CRM integrations
-   Sales outreach automation
