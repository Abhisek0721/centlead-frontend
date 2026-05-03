# Centlead — Product Specification

## Overview

Centlead is an **AI-powered lead intelligence platform** that helps users discover high-opportunity business leads.

Instead of raw lead lists, Centlead analyzes businesses using AI and ranks them based on the user's specific goal.

Core pipeline:

```
Raw Leads → AI Analysis → Ranked Opportunities
```

Example use cases:
- Find businesses without websites
- Find outdated websites ripe for redesign
- Find companies hiring specific developers
- Find potential SaaS customers in a niche

---

# Product Flow

## 1. User Creates a Job

User provides:
- **Search query** — e.g. "gym trainers in guwahati"
- **Goal / prompt** — e.g. "I want gym trainers who don't have websites so I can sell them a new one"
- **Max leads** (optional) — cap on how many leads to collect
- **AI toggle** — ON/OFF (locked ON during free trial)

## 2. Lead Collection

Search worker queries **Google Places API** (`places:searchText`) for the given query.

Filters: minimum rating ≥ 3.8.

Collected fields per lead: name, address, phone, website.

## 3. Website Crawling

Crawler worker visits each lead's website.

Extracts: emails, contact links, social profiles, tech stack.

## 4. AI Scoring

AI worker analyzes leads in batches of ~50.

Prompt includes the user's goal and `analysisSchema`.

Returns: `score` (0–100), `reason`, and structured `analysisJson`.

## 5. Results

Leads ranked by score. User sees the highest opportunities at the top.

---

# Lead Analysis Example

Goal: sell website development to businesses without websites

| Business | Website | Website Quality | Score |
|---|---|---|---|
| FitLife Gym | No | — | 95 |
| Power Gym | Yes | Poor | 82 |
| Muscle House | Yes | Average | 60 |

Analysis JSON example:

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

# Credit System

Credits belong to a workspace.

| Action | Credits |
|---|---|
| Lead generation | 1 |
| Website crawl | 1 |
| AI scoring | 2 |

Example job (100 leads, AI on):
- 100 lead generation = 100 credits
- 100 website crawls = 100 credits
- 100 AI scorings = 200 credits
- **Total: 400 credits**

Credits reset every billing cycle. Purchased extra credits do not expire.

---

# Subscription Plans

| Plan | Price | Monthly Credits |
|---|---|---|
| Starter | $29/mo | 2,000 |
| Growth | $79/mo | 8,000 |
| Pro | $149/mo | 25,000 |
| Agency | $299/mo | 100,000 |

Payment gateway: **WHOP**

---

# Free Trial

- Duration: 7 days
- Credits: 300
- AI scoring: mandatory (cannot disable)
- Max leads per job: 100
- Exports: allowed

Goal: user experiences AI-ranked leads within minutes → creates the "aha moment" → drives upgrade.

---

# UX Messaging Rules

**Do NOT show:**
> "AI toggle disabled"

**Instead show:**
> "AI lead intelligence enabled during trial. Upgrade to customize analysis."

**When user tries to disable AI during trial:**
> "AI scoring is part of the Centlead intelligence engine. Upgrade to a paid plan to disable AI scoring and generate unlimited raw leads."

---

# AI Cost Optimization

Batch analysis: ~50 leads per AI request instead of 1.

Result: up to **90% cost reduction** on AI inference.

---

# Target Customers

| Segment | Use case |
|---|---|
| Web dev agencies | Find businesses without websites |
| SEO agencies | Find businesses with poor web presence |
| Freelancers | Find clients needing site redesigns |
| B2B SaaS sales | Find companies in a target niche |
| Recruiters | Find companies hiring specific roles |

---

# Product Differentiation

Most tools provide: raw lead lists

Centlead provides: AI-ranked, goal-matched opportunities

This turns a lead list into **actionable prospects**.

---

# Key Product Goal

Users should discover **5–10 high-opportunity leads within minutes** of their first job.

That moment creates the conversion event that drives subscription upgrades.
