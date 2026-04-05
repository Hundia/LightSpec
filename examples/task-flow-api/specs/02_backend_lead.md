---
role: backend_lead
generated_by: lightspec-graduate
source: .lsp/spec.md
date: 2026-04-05
status: draft
---
# Backend Lead Spec

## Technical Design

### Architecture

The project follows a layered monolith pattern with clear separation between transport (routes), business logic (services), and persistence (db). The Express app is created by a factory function (`createApp`) so tests can import it without starting a real server.

```
HTTP Request
  └─► Express Router (routes/)
        └─► Service Layer (services/)
              └─► SQLite via better-sqlite3 (db/connection.ts)
```

- **Entry:** `src/index.ts` — bootstraps DB, calls `createApp`, starts HTTP server
- **App factory:** `src/app.ts` — mounts middleware, routes, error handler
- **Config:** `src/config/env.ts` — typed env variables with defaults
- **Auth middleware:** `src/middleware/auth.ts` — JWT verification, attaches `req.user`
- **Error handler:** `src/middleware/errors.ts` — catches thrown errors, maps to HTTP status

### API / Endpoints

#### Authentication

| Method | Path | Request Body | Response |
|--------|------|--------------|----------|
| POST | /auth/register | `{ email: string, password: string }` | `201 { token, userId }` |
| POST | /auth/login | `{ email: string, password: string }` | `200 { token, userId }` |

#### Lists (requires `Authorization: Bearer <token>`)

| Method | Path | Request | Response |
|--------|------|---------|----------|
| GET | /lists | — | `200 [{ id, title, taskCount, createdAt }]` |
| POST | /lists | `{ title: string }` | `201 { id, title, createdAt }` |
| PUT | /lists/:id | `{ title: string }` | `200 { id, title, updatedAt }` |
| DELETE | /lists/:id | — | `204` |

#### Tasks (requires auth; scoped to caller's lists)

| Method | Path | Request | Response |
|--------|------|---------|----------|
| GET | /tasks?listId=X | `?listId=<uuid>` | `200 task[]` |
| POST | /tasks | `{ listId, title, description?, priority? }` | `201 task` |
| PUT | /tasks/:id | `{ title?, description?, priority? }` | `200 task` |
| PATCH | /tasks/:id/status | `{ status: 'todo' \| 'in-progress' \| 'done' }` | `200 { id, status, updatedAt }` |
| DELETE | /tasks/:id | — | `204` |

#### Error Format

All errors return `{ "error": "description" }`:

| Status | Meaning |
|--------|---------|
| 400 | Validation failed (Zod) |
| 401 | Missing or invalid JWT |
| 403 | Forbidden — resource belongs to another user |
| 404 | Resource not found |
| 409 | Conflict — duplicate email on register |

### Data Model

#### users
| Field | Type | Notes |
|-------|------|-------|
| id | TEXT (UUID) | Primary key |
| email | TEXT | UNIQUE NOT NULL |
| password_hash | TEXT | bcrypt hashed |
| created_at | INTEGER | Unix ms |

#### lists
| Field | Type | Notes |
|-------|------|-------|
| id | TEXT (UUID) | Primary key |
| user_id | TEXT | FK → users.id |
| title | TEXT | NOT NULL |
| created_at | INTEGER | Unix ms |
| updated_at | INTEGER | Unix ms |

#### tasks
| Field | Type | Notes |
|-------|------|-------|
| id | TEXT (UUID) | Primary key |
| list_id | TEXT | FK → lists.id |
| title | TEXT | NOT NULL |
| description | TEXT | nullable |
| status | TEXT | CHECK: todo / in-progress / done |
| priority | TEXT | CHECK: low / medium / high |
| created_at | INTEGER | Unix ms |
| updated_at | INTEGER | Unix ms |

### Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4 | HTTP framework |
| better-sqlite3 | latest | Synchronous SQLite driver |
| jsonwebtoken | latest | JWT sign/verify |
| bcrypt | latest | Password hashing |
| zod | latest | Request validation schemas |
| vitest | latest | Test runner |
| supertest | latest | HTTP integration testing |

## Implementation Notes

_Add backend implementation decisions here._
