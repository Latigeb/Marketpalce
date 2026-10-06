# Marketpalce

Web app

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- Zod

## Current status

The repository has been initialized with a foundation Next.js app and a database schema starting point for the marketplace domain model.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```
3. Set `DATABASE_URL` to your PostgreSQL connection string.
4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
5. Run the app:
   ```bash
   npm run dev
   ```

## Prisma

The database schema includes the initial models for users, profiles, categories, listings, service requests, quotes, orders, payments, payouts, review, messaging, notifications, and audit logging.

## Next milestones

- Add authentication and role-based authorization
- Build listing pages and search/indexing
- Implement service request and quote flow
- Add order state transitions and payment-safe processing
- Extend provider dashboards and admin tools

## Environment

See `.env.example` for the base environment variable set.























































































































































































































































































































































"""
