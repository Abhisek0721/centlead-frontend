# Centlead Frontend System Design

## Stack

Framework: Next.js

UI library: Ant Design

State management: TanStack React Query

HTTP client: Axios

Notifications: React Hot Toast

Auth: Clerk

------------------------------------------------------------------------

# App Structure

Pages:

/ -\> Landing Page

/app -\> Web Application

Sections:

Dashboard Jobs Leads Team Billing Settings

------------------------------------------------------------------------

# Theme

Recommended theme:

Dark modern SaaS theme

Primary color: Electric Blue

Background: Dark slate

Accent color: Purple gradient

Reason:

Feels modern Matches AI brand Better for data heavy UI

------------------------------------------------------------------------

# Layout

Main layout:

Sidebar navigation Top navigation bar Content panel

Sidebar items:

Dashboard Jobs Leads Team Billing Settings

------------------------------------------------------------------------

# Job Creation Flow

User clicks:

Create Job

Fields:

Search Query Goal Prompt AI Toggle

During trial:

AI toggle locked.

------------------------------------------------------------------------

# AI Toggle Messaging

Display:

AI lead intelligence enabled during trial. Upgrade to customize
analysis.

------------------------------------------------------------------------

# Job Results UI

Table view

Columns:

Business Name Website Phone Score Reason

Score highlighted.

Top opportunities shown first.

------------------------------------------------------------------------

# Lead Details

Click lead to open drawer.

Details:

contact info website analysis AI explanation emails

------------------------------------------------------------------------

# Credit Display

Header shows:

Remaining credits

Example:

Credits Remaining: 1450

------------------------------------------------------------------------

# Trial Display

Banner:

7 day trial active

300 credits available

------------------------------------------------------------------------

# Team Management

Team page

Members list

Columns:

Name Role Actions

Invite member button.

Invite modal:

email role

------------------------------------------------------------------------

# Billing Page

Shows:

Current plan Credits remaining Upgrade plan

Payment handled by WHOP.

------------------------------------------------------------------------

# API Integration

Axios used.

Global axios instance.

Headers include:

Authorization Bearer Token

------------------------------------------------------------------------

# Local Storage Helper

localStorage.ts

Functions:

setToken getToken removeToken

Used for JWT storage.

------------------------------------------------------------------------

# React Query Usage

Used for:

jobs leads workspace team

Caching enabled.

------------------------------------------------------------------------

# Notifications

React Hot Toast used for:

job created invite sent error alerts success messages

------------------------------------------------------------------------

# Loading UX

Skeleton loaders used.

Job processing shows:

Processing leads...

------------------------------------------------------------------------

# Empty States

Example:

No jobs yet.

Create your first lead discovery job.

------------------------------------------------------------------------

# Conversion Prompts

If user hits trial limits:

Show upgrade modal.

Message:

Upgrade to unlock unlimited lead intelligence.

------------------------------------------------------------------------

# Landing Page

Sections:

Hero Product demo Features Pricing Testimonials FAQ

CTA:

Start free trial

------------------------------------------------------------------------

# Key UX Goal

User must discover high opportunity leads within minutes.

This creates the conversion moment.
