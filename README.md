# PitchPass

Court booking platform for sports facilities. Players discover and book courts; owners manage availability and reservations in real time.

## Stack

| Layer | Tech |
|-------|------|
| API | NestJS 10, Prisma 5, PostgreSQL, Socket.io, Firebase Admin |
| Web | Next.js 14, React 18, TailwindCSS, TanStack Query, Firebase |
| Mobile | Expo 51, React Native 0.74, Expo Router, NativeWind |
| Shared | `@pitch-pass/types`, `@pitch-pass/config` (pnpm workspace packages) |
| Auth | Firebase Authentication (all clients) |
| Cache | Redis (via ioredis) |

## Monorepo structure

```
PitchPass/
├── apps/
│   ├── api/          # NestJS backend
│   ├── web/          # Next.js dashboard
│   └── mobile/       # Expo React Native app
├── packages/
│   ├── types/        # Shared TypeScript types
│   └── config/       # Shared constants and env helpers
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+
- Redis 7+
- Firebase project with Authentication enabled
- Firebase service account JSON (for API)

## Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local   # copy only the WEB section
cp .env.example apps/mobile/.env      # copy only the MOBILE section
```

**`apps/api/.env`**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/pitchpass"
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk@your-project.iam.gserviceaccount.com"
REDIS_URL="redis://localhost:6379"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
NODE_ENV="development"
```

**`apps/web/.env.local`**
```env
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_APP_ID="..."
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
```

**`apps/mobile/.env`**
```env
EXPO_PUBLIC_FIREBASE_API_KEY="..."
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
EXPO_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
EXPO_PUBLIC_API_URL="http://192.168.x.x:3001"
EXPO_PUBLIC_SOCKET_URL="http://192.168.x.x:3001"
```

> For mobile, replace `192.168.x.x` with your machine's local IP so the device/emulator can reach the API.

### 3. Set up the database

```bash
cd apps/api
pnpm prisma migrate dev --name init
pnpm prisma generate
```

### 4. Get Firebase service account key

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click **Generate new private key**
3. Copy `project_id`, `private_key`, and `client_email` into `apps/api/.env`

## Running in development

Open three terminals (or use a process manager):

```bash
# Terminal 1 — API
pnpm --filter @pitch-pass/api dev

# Terminal 2 — Web
pnpm --filter @pitch-pass/web dev

# Terminal 3 — Mobile
pnpm --filter @pitch-pass/mobile start
```

Or run all at once (if you add a root dev script):

```bash
pnpm dev
```

The API runs on `http://localhost:3001` and the web app on `http://localhost:3000`.

## Database models

| Model | Description |
|-------|-------------|
| `User` | Firebase-linked user with role (PLAYER / OWNER / ADMIN) |
| `Court` | Sports court with location, surface type, price per hour |
| `TimeSlot` | Bookable time window for a court |
| `Booking` | Reservation linking a user to a time slot, includes QR code |

## Scripts reference

| Command | Description |
|---------|-------------|
| `pnpm --filter @pitch-pass/api dev` | Start API in watch mode |
| `pnpm --filter @pitch-pass/web dev` | Start Next.js dev server |
| `pnpm --filter @pitch-pass/mobile start` | Start Expo dev server |
| `pnpm --filter @pitch-pass/api prisma migrate dev` | Run DB migrations |
| `pnpm --filter @pitch-pass/api prisma studio` | Open Prisma Studio |
| `pnpm --filter <app> typecheck` | Run TypeScript check |

## Environment files are git-ignored

`.env`, `.env.local`, and `.env.*.local` are listed in `.gitignore` and will **not** be committed. Never commit real credentials. Use `.env.example` as the reference template.
