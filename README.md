# MarketConnect

A production-oriented marketplace platform for services, properties, and vehicles.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Prisma
- Zod
- Stripe Connect-compatible architecture

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```
3. Add your PostgreSQL connection string and other secrets.
4. Run the app:
   ```bash
   npm run dev
   ```

## Project status

This repository is in the foundation phase. The initial scaffold includes:

- Next.js app router setup
- Tailwind configuration
- TypeScript configuration
- Prisma schema foundation
- MarketConnect landing page
- Environment template

## Next milestones

- Database modeling and migrations
- Authentication and authorization
- Listing domains and search
- Service requests, quotes, and orders
- Payments and payout architecture
- Admin dashboards and security hardening
