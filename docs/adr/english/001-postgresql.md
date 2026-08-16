# 1. Use PostgreSQL for data persistence

Date: 2026-07-29
Status: Accepted

## Context

The project required a database to store information regarding users, plans, subscriptions, payments, emails, etc.

## Decision

I decided to use PostgreSQL as the database.

## Alternatives considered

- **MongoDB** — discarded because the domain (users, plans, subscriptions,
  payments) is strongly relational; NoSQL would add unnecessary
  complexity when modeling these relationships
- **SQLite** — good for rapid prototyping, but unsuitable for production
  environments with multiple simultaneous connections

## Rationale

- Relationships between user, plan, subscription, and payment benefit from
  foreign keys and constraints (prevents inconsistent state)
- ACID transactions are important: payment confirmation and subscription
  status updates need to be atomic
- Mature ecosystem within Node/TS (Prisma, TypeORM, Drizzle)
- Easy to containerize with Docker; runs in any environment

## Consequences

- Need to manage migrations as the schema evolves
- Need to run Postgres locally (Docker) or use a managed service
  (e.g., Supabase, Neon, RDS) — hosting decision deferred to another ADR
- If the project experiences high read volume, it may be necessary to
  evaluate read replicas or caching (Redis) later on