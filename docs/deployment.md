# WayPay Production Deployment Guide 🚀

This guide explains how to deploy **WayPay** to production using **Railway** (for the database, Redis, and Spring Boot backend) and **Vercel** or **Railway** (for the Next.js frontend).

---

## 1. Prerequisites & API Accounts

You need production-ready accounts for the following services:
- **Railway Account**: To host the database, Redis, and backend service.
- **Stripe Account**: To process payments (UPI, cards, net banking).
- **Clerk Account**: For user authentication.
- **Resend Account**: To send emails (e.g., welcome emails, transactions receipts).

---

## 2. Step 1: Database & Cache (Railway)

1. Sign in to [Railway](https://railway.app/).
2. Create a **New Project**.
3. Add a **PostgreSQL** database service.
4. Add a **Redis** database service.

Railway will automatically provision these databases and expose environment variables like `DATABASE_URL` and `REDIS_URL`.

---

## 3. Step 2: Deploy Spring Boot Backend (Railway)

1. Click **+ Add Service** in your Railway project.
2. Select **GitHub Repo** and choose the repository containing `waypay`.
3. In the service settings, set the **Root Directory** to `backend`.
4. Set the **Build Command** to:
   ```bash
   npx -y docker-build
   ```
   *(Railway will automatically detect the `Dockerfile` inside the `backend` directory).*

5. Add the following **Environment Variables** in the Railway console:

| Variable | Value / Source | Description |
|---|---|---|
| `SERVER_PORT` | `8080` | Port for Spring Boot |
| `SPRING_PROFILES_ACTIVE` | `prod` | Enable production configuration |
| `POSTGRES_HOST` | `${{Postgres.PGHOST}}` | Binds PG Host from Railway PG |
| `POSTGRES_PORT` | `${{Postgres.PGPORT}}` | Binds PG Port |
| `POSTGRES_DB` | `${{Postgres.PGDATABASE}}` | Binds PG Database |
| `POSTGRES_USER` | `${{Postgres.PGUSER}}` | Binds PG User |
| `POSTGRES_PASSWORD` | `${{Postgres.PGPASSWORD}}` | Binds PG Password |
| `REDIS_HOST` | `${{Redis.REDISHOST}}` | Binds Redis Host |
| `REDIS_PORT` | `${{Redis.REDISPORT}}` | Binds Redis Port |
| `REDIS_PASSWORD` | `${{Redis.REDISPASSWORD}}` | Binds Redis Password |
| `STRIPE_API_KEY` | `sk_live_...` | Stripe Live/Test Secret Key |
| `STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Stripe Live/Test Publishable Key |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Set up in Step 4 below |
| `CLERK_JWKS_URL` | `https://clerk.yourdomain.com/.well-known/jwks.json` | Clerk JWKS endpoint for token checks |
| `RESEND_API_KEY` | `re_...` | Resend API Key |
| `APP_URL` | `https://your-frontend.vercel.app` | Production frontend domain |
| `APP_ENCRYPTION_KEY` | *(A random 32-character string)* | Key used to encrypt Aadhaar/PAN in DB |

6. Under the service settings, generate a public domain (e.g. `https://waypay-backend.up.railway.app`). Note this down as your **Backend Live URL**.

---

## 4. Step 3: Configure Stripe & Webhooks

1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/).
2. Select **Developers** > **Webhooks**.
3. Click **Add Endpoint** and enter:
   ```
   https://your-backend.up.railway.app/api/v1/webhook/stripe
   ```
4. Under **Select events to listen to**, choose:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Click **Add Endpoint** and reveal the **Signing Secret** (`whsec_...`).
6. Paste this secret back into Railway as `STRIPE_WEBHOOK_SECRET`.

---

## 5. Step 4: Deploy Next.js Frontend (Vercel or Railway)

### Option A: Deploy to Vercel (Recommended)
1. Import the repository into Vercel.
2. In build settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
3. Add the following **Environment Variables**:

| Variable | Value | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://your-backend.up.railway.app` | Live backend URL |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_...` | Clerk Production Publishable Key |
| `CLERK_SECRET_KEY` | `sk_live_...` | Clerk Production Secret Key |

4. Click **Deploy**. Vercel will build and assign a domain. Update `APP_URL` in the Railway backend service with this live frontend domain.

---

## 6. Verification Checklist

Once both services are deployed:
1. Open the frontend domain.
2. Register a new user (the webhook should automatically sync the user to the PostgreSQL DB via `/api/v1/auth/sync`).
3. Access the dashboard, select **Add Money**, input a test amount, and test both Stripe Checkout and direct UPI.
4. Verify that transactions succeed and the wallet balance updates in real-time.
