# QoreDev — AI-Native Backend OS

High-performance, minimalist infrastructure for modern developers, powered by an autonomous AI copilot.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Auth & Database | Supabase (PostgreSQL + pgvector) |
| AI | OpenAI API (gpt-4o-mini) |
| Frontend Hosting | Vercel |
| Backend/API Hosting | Railway |
| Styling | Tailwind CSS |

## Features

- **Authentication** — Email/password and magic link via Supabase Auth
- **Vector Database** — PostgreSQL with pgvector for semantic search and embeddings
- **AI Copilot** — Autonomous assistant with a "Stuck mode" that breaks problems down step by step
- **Protected Routes** — Middleware-based session management redirecting unauthenticated users

## Local Setup

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [OpenAI](https://platform.openai.com) API key

### 1. Clone and install

```bash
git clone https://github.com/your-org/qoredev.git
cd qoredev
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in each value:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Setup

Run the migration against your Supabase project using the [Supabase CLI](https://supabase.com/docs/guides/cli):

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

Or paste the contents of `supabase/migrations/00001_init.sql` directly into the **Supabase SQL Editor**.

The migration:
- Enables the `pgvector` extension
- Creates a `profiles` table (auto-populated on user sign-up via trigger)
- Creates a `documents` table with a `vector(1536)` embedding column
- Adds a `match_documents` RPC function for cosine-similarity search
- Enables Row Level Security on all tables

## Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── auth/callback/route.ts
│   ├── (dashboard)/
│   │   └── dashboard/page.tsx
│   ├── api/
│   │   ├── copilot/route.ts
│   │   └── health/route.ts
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
└── lib/
    └── supabase/
        ├── client.ts   # Browser client
        ├── server.ts   # Server Component client
        └── middleware.ts
middleware.ts            # Auth guard for /dashboard
supabase/
├── migrations/00001_init.sql
└── seed.sql
```

## Deployment

### Vercel (Frontend)

1. Import the repository on [vercel.com](https://vercel.com).
2. Add all environment variables from `.env.example` in the Vercel dashboard.
3. Deploy — Vercel auto-detects Next.js via `vercel.json`.

### Railway (API / Full-stack)

1. Create a new project on [railway.app](https://railway.app) and connect your repo.
2. Add environment variables in the Railway dashboard.
3. Railway uses `railway.toml` to build with Nixpacks and start with `npm run start`.
4. The `/api/health` endpoint is used as the health check path.

## API Reference

### `POST /api/copilot`

Requires an authenticated Supabase session (cookie-based).

**Request body:**
```json
{
  "query": "How do I set up RLS for a multi-tenant app?",
  "stuck": false
}
```

Set `stuck: true` to activate step-by-step breakdown mode.

**Response:**
```json
{ "answer": "..." }
```

### `GET /api/health`

```json
{ "status": "ok", "service": "QoreDev", "version": "0.1.0" }
```
