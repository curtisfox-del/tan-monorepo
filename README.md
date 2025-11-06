# TAN Monorepo (Web + Mobile + Shared Packages)

## Structure
- `apps/web` — Next.js (Vercel), Prisma (Postgres), NextAuth (JWT)
- `apps/mobile` — Expo (React Native iOS/Android) with nativewind + react-query
- `packages/api` — Shared REST API client used by mobile
- `packages/types` — Shared zod schemas & TS types

## Quickstart

### 1) Install
```bash
npm install
```

### 2) Configure env
Copy `apps/web/.env.example` to `apps/web/.env.local` and fill values.

### 3) Database
```bash
npm run prisma:push
npm run seed
```

### 4) Run Web
```bash
npm run dev -w apps/web
```

### 5) Run Mobile (Expo)
```bash
cd apps/mobile
npm install
npx expo start
# set EXPO_PUBLIC_API_BASE in app config to your web URL (e.g. http://localhost:3000)
```

## Deploy
- Web → Vercel. Build command: `npm run build` (workspace web).
- Mobile → EAS build (`eas build -p ios|android`).