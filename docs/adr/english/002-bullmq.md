# ADR-001: Use BullMQ for queue management

Date: 18/08/26
Status: Accepted

## Context

The project needs to send emails asynchronously (e.g., registration confirmation, 
daily content emails) without blocking the user's main request
while the email is being processed.

To achieve this, a queue manager is required that supports:
- Automatic retries in case of sending failure
- Concurrency control (to avoid exceeding email provider limits)
- Job persistence (to avoid losing emails if the process crashes)

## Decision

We have decided to use **BullMQ** as the queue manager for sending emails.

## Alternatives considered

- **AWS SQS** — discarded because it requires credential management and additional 
  AWS infrastructure, and offers less native flexibility for job scheduling and 
  prioritization compared to BullMQ.
- **RabbitMQ** — discarded because it brings robustness and features (exchanges, 
  advanced routing) that are unnecessary for the project's current volume, 
  adding unnecessary operational complexity (a new service to deploy, monitor, and maintain).

## Justification

- It has native support for configurable retries, rate limiting, and job scheduling,
  covering the requirements outlined in the context without extra code.
- Good integration with TypeScript/NestJS and mature documentation.
- The team is already familiar with Redis, which reduces the learning curve and the
  risk of configuration errors.

## Consequences

**Positive**
- Good developer experience, with a simple, typed API.
- Native support for retries and rate limiting, reducing custom code.

**Negative**
- Requires manual configuration for a Dead Letter Queue (DLQ), unlike
  solutions such as SQS, which offer this as a managed feature. - Durability guarantees depend on the Redis persistence configuration
  (AOF/RDB), which must be set up correctly—it is not automatic as it is
  in a managed service.