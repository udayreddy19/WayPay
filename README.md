# WayPay 💳

A Stripe-powered wallet platform for India built with **Spring Boot** and **Next.js**.

## Architecture

```
                    Customer
                       │
          ┌────────────┴─────────────┐
          │                          │
      Next.js Web               Mobile App
          │                          │
          └────────────┬─────────────┘
                       │
                 Spring Boot API
                       │
      ┌────────┬─────────────┬─────────────┐
      │        │             │             │
 PostgreSQL  Redis        Stripe      Resend
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Java 21, Spring Boot 3.5, Spring Security, Spring Data JPA |
| Database | PostgreSQL 16, Redis 7 |
| Payments | Stripe (Checkout, Webhooks) |
| Auth | Clerk |
| Email | Resend |
| Analytics | PostHog |

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Java 21
- Node.js 20+

### Setup

```bash
# Clone and setup
chmod +x scripts/setup.sh
./scripts/setup.sh
```

### Development

```bash
# Terminal 1: Backend
cd backend && ./mvnw spring-boot:run

# Terminal 2: Frontend
cd frontend && npm run dev
```

### URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui |
| pgAdmin | http://localhost:5050 |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signup` | Register new user |
| POST | `/api/v1/auth/sync` | Sync Clerk user |
| GET | `/api/v1/wallet` | Get wallet balance |
| POST | `/api/v1/wallet/add-money` | Add money (Stripe) |
| POST | `/api/v1/wallet/transfer` | Transfer to user |
| GET | `/api/v1/transactions` | Transaction history |
| GET | `/api/v1/profile` | Get profile |
| PUT | `/api/v1/profile` | Update profile |
| POST | `/api/v1/kyc` | Submit KYC |
| GET | `/api/v1/kyc/status` | Check KYC status |
| POST | `/api/v1/webhook/stripe` | Stripe webhook |

## Project Structure

```
waypay/
├── frontend/           # Next.js 15 app
├── backend/            # Spring Boot 3.5 app
│   └── src/main/java/com/waypay/
│       ├── config/     # Security, Redis, Stripe, CORS
│       ├── controller/ # REST endpoints
│       ├── service/    # Business logic
│       ├── repository/ # Data access
│       ├── model/      # Entities, DTOs, Enums
│       ├── exception/  # Error handling
│       └── util/       # Helpers
├── docker/             # Docker configs
├── scripts/            # Dev utilities
└── .github/            # CI/CD workflows
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:
- Stripe (payments)
- Clerk (auth)
- Resend (email)
- PostHog (analytics)

## Deployment

For live production deployment configuration instructions (Stripe webhooks, Clerk credentials, Railway PG/Redis databases, Docker configs, and domains), see the [Deployment Guide](file:///Users/udayreddy/.gemini/antigravity-ide/scratch/waypay/docs/deployment.md).

## License

Private — All rights reserved.
