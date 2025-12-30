# Pastebin-Lite (MERN)

A small Pastebin-like application built with a **stateless Express API** and a **React (Vite) frontend**.

## Architecture

- Frontend: React + Vite + Tailwind
- Backend: Node.js + Express
- Database: MongoDB (Atlas or local)

The backend is stateless (no in-memory session/paste cache) and relies on MongoDB for persistence and atomic updates.

## Data model

Collection: `pastes`

- `_id`: String (nanoid)
- `content`: String
- `createdAt`: Date
- `expiresAt`: Date | null
- `maxViews`: Number | null
- `viewCount`: Number

An index is defined on `expiresAt` for efficient lookups.

## API

- `GET /api/healthz` - health check (includes a DB ping)
- `POST /api/pastes` - create paste
- `GET /api/pastes/:id` - fetch paste JSON (increments view count)
- `GET /p/:id` - server-rendered HTML view (also increments view count)

## Concurrency safety (atomic view counting)

Paste fetch uses a **single MongoDB atomic operation** (`findOneAndUpdate` + `$inc`) that:

- Matches only non-expired documents (`expiresAt` is null OR `expiresAt > now`)
- Matches only documents that still have views remaining (`viewCount < maxViews` when `maxViews` is set)
- Increments `viewCount` in the same operation

This prevents race conditions under concurrency (no separate "read then write" flow).

## Deterministic testing time

When `TEST_MODE=1`, you can force the backend's notion of "now" by sending the header:

- `x-test-now-ms: <epoch_ms>`

If not provided (or not in test mode), the backend uses real time.

## Local development

### Backend

1. Copy env:
   - `backend/.env.example` -> `backend/.env`
2. Set `MONGODB_URI`
3. Install and run:

```bash
npm install
npm run dev
```

Run from the `backend/` folder.

### Frontend

1. Copy env:
   - `frontend/.env.example` -> `frontend/.env`
2. Install and run:

```bash
npm install
npm run dev
```

Run from the `frontend/` folder.

## Notes

- Frontend renders paste content as plain text inside a `<pre>` (React escapes by default), preventing XSS.
- Server HTML endpoint escapes content before sending.
