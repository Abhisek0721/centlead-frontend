# Centlead -- Product Specification

## Overview

Centlead is an **AI-powered lead intelligence platform** that helps
users discover **high-opportunity business leads**.

Instead of only providing raw lead lists, Centlead analyzes businesses
using AI and ranks them based on the user's goal.

Example use cases: - Find businesses without websites - Find outdated
websites - Find companies hiring specific developers - Find potential
SaaS customers

Core idea:

Raw Leads → AI Analysis → Ranked Opportunities

------------------------------------------------------------------------

# Product Flow

## 1. User Creates Job

User provides:

Search query: Example: gym trainers in guwahati

Goal / description: Example: "I want gym trainers who don't have
websites or whose websites look outdated so I can sell them a new
website."

Optional toggle: AI Lead Scoring (ON / OFF)

### Trial Rule

During free trial: - AI scoring is automatically enabled - Users cannot
disable it

------------------------------------------------------------------------

# Job Processing Pipeline

User creates job ↓ Job stored ↓ Search worker fetches businesses (Google
Maps / Places API) ↓ Leads stored ↓ Crawler worker visits websites ↓ AI
worker analyzes leads ↓ Scores saved ↓ Leads ranked

------------------------------------------------------------------------

# Lead Analysis Example

  Business       Website   Website Quality   Score
  -------------- --------- ----------------- -------
  FitLife Gym    No        ---               95
  Power Gym      Yes       Poor              82
  Muscle House   Yes       Average           60

Another example:

Goal: find IT companies hiring blockchain developers

  Company       Blockchain Hiring   Score
  ------------- ------------------- -------
  ABC Tech      Yes                 95
  XYZ Systems   No                  30

------------------------------------------------------------------------

# Lead Analysis JSON

Example:

{ "has_website": false, "website_quality": "none", "score": 95,
"reason": "No website found" }

------------------------------------------------------------------------

# Database Structure

## Jobs Table

Fields: - id - user_id - search_query - goal_prompt - ai_enabled -
analysis_schema - status - created_at

## Leads Table

Fields: - id - job_id - name - website - phone - score - analysis_json -
created_at

Example analysis JSON:

{ "has_website": true, "website_quality": "poor", "issues": \["outdated
design"\], "reason": "Website exists but outdated" }

------------------------------------------------------------------------

# Credit System

Centlead uses **credits** for usage.

Example credit cost:

  Action          Credits
  --------------- ---------
  Generate Lead   1
  Website Crawl   1
  AI Scoring      2

Example job:

100 leads analyzed

Credits consumed:

100 lead generation\
100 website crawl\
200 AI scoring

Total = 400 credits

------------------------------------------------------------------------

# Subscription Plans

## Starter

\$29/month

2000 credits per month

Features: - Lead generation - AI scoring - Export leads

------------------------------------------------------------------------

## Growth

\$79/month

8000 credits

Features: - Advanced AI scoring - Website analysis - Lead exports

------------------------------------------------------------------------

## Pro

\$149/month

25000 credits

Features: - Team accounts - Advanced filters - Bulk jobs

------------------------------------------------------------------------

## Agency

\$299/month

100000 credits

Features: - API access - Team collaboration - Priority processing

------------------------------------------------------------------------

# Credit Reset Policy

Subscription credits reset every billing cycle.

Example:

Month 1: 2000 credits\
Month 2: reset → 2000 credits

Unused subscription credits do NOT carry forward.

Extra purchased credits do not expire.

------------------------------------------------------------------------

# Free Trial

Trial Duration: 7 days

Trial Credits: 300 credits

Trial Rules: - AI scoring mandatory - Max 100 leads per job - Exports
allowed - AI analysis enabled automatically

Goal: Allow users to experience the **AI-powered lead intelligence
value** quickly.

------------------------------------------------------------------------

# UX Messaging Rules

## Do NOT say

"AI toggle disabled"

## Instead say

"AI lead intelligence enabled during trial. Upgrade to customize
analysis."

------------------------------------------------------------------------

# Trial Experience Rules

7-day trial\
300 credits\
AI scoring mandatory\
Max 100 leads per job\
Exports allowed

------------------------------------------------------------------------

# When User Tries To Disable AI

Do not block harshly.

Show a conversion message.

Example UX:

"AI scoring is part of the Centlead intelligence engine.

Upgrade to a paid plan to disable AI scoring and generate unlimited raw
leads."

------------------------------------------------------------------------

# AI Cost Optimization

Leads should be analyzed in batches.

Example:

50 leads per AI request

instead of

1 lead per request

This can reduce AI cost by up to **90%**.

------------------------------------------------------------------------

# Target Customers

Primary buyers:

-   Web development agencies
-   SEO agencies
-   Freelancers selling websites
-   B2B SaaS sales teams
-   Recruiters

Common use case:

Find businesses without websites.

------------------------------------------------------------------------

# Product Differentiation

Most tools provide:

Raw leads

Centlead provides:

AI-ranked opportunities

This turns a lead list into **actionable prospects**.

------------------------------------------------------------------------

# Key Product Goal

Users should discover **5--10 high opportunity leads within minutes**.

That moment creates the "aha moment" and drives subscription upgrades.
