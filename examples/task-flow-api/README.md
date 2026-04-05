# Task Flow API

A task management REST API built with TypeScript, Express, SQLite (better-sqlite3), and JWT authentication.

This project is the **LightSpec example project** — used to demonstrate the LightSpec complexity scorer scoring a real codebase.

## Tech Stack

- **Runtime:** Node.js (ES modules)
- **Framework:** Express 4
- **Database:** SQLite via better-sqlite3 (synchronous, no async/await needed)
- **Auth:** JWT (jsonwebtoken) + bcrypt password hashing
- **Validation:** Zod schemas
- **Testing:** Vitest + Supertest (20 integration tests)
- **Language:** TypeScript (strict mode)

## Quick Start

```bash
cp .env.example .env
npm install
npm run dev      # Start dev server (tsx watch)
npm test         # Run 20 integration tests
npm run build    # Compile TypeScript
npm start        # Run compiled JS
```

## API Overview

### Authentication

| Method | Path              | Body                        | Response             |
|--------|-------------------|-----------------------------|----------------------|
| POST   | /auth/register    | `{ email, password }`       | `201 { token, userId }` |
| POST   | /auth/login       | `{ email, password }`       | `200 { token, userId }` |

### Lists (requires `Authorization: Bearer <token>`)

| Method | Path         | Body          | Response                     |
|--------|--------------|---------------|------------------------------|
| GET    | /lists       | —             | `200 [{ id, title, taskCount, createdAt }]` |
| POST   | /lists       | `{ title }`   | `201 { id, title, createdAt }` |
| PUT    | /lists/:id   | `{ title }`   | `200 { id, title, updatedAt }` |
| DELETE | /lists/:id   | —             | `204`                        |

### Tasks (requires auth, all scoped to authenticated user's lists)

| Method | Path                  | Body / Query              | Response           |
|--------|-----------------------|---------------------------|--------------------|
| GET    | /tasks?listId=X       | `?listId=<uuid>`          | `200 [task...]`    |
| POST   | /tasks                | `{ listId, title, description?, priority? }` | `201 task` |
| PUT    | /tasks/:id            | `{ title?, description?, priority? }` | `200 task` |
| PATCH  | /tasks/:id/status     | `{ status }`              | `200 { id, status, updatedAt }` |
| DELETE | /tasks/:id            | —                         | `204`              |

### Error Format

All errors return JSON: `{ "error": "description" }`

| Status | Meaning                         |
|--------|---------------------------------|
| 400    | Validation failed               |
| 401    | Missing or invalid JWT          |
| 403    | Forbidden (wrong user)          |
| 404    | Resource not found              |
| 409    | Conflict (e.g., duplicate email)|

## Project Structure

```
src/
├── index.ts           Server entry point
├── app.ts             Express app factory (test-friendly)
├── config/
│   └── env.ts         Environment variable configuration
├── db/
│   ├── connection.ts  Database connection + table creation
│   └── schema.ts      SQL schema definitions
├── middleware/
│   ├── auth.ts        JWT verification middleware
│   └── errors.ts      Global error handler
├── models/
│   ├── user.model.ts  User TypeScript interfaces
│   ├── list.model.ts  List TypeScript interfaces
│   └── task.model.ts  Task TypeScript interfaces
├── routes/
│   ├── auth.ts        Auth route handlers
│   ├── lists.ts       List route handlers
│   └── tasks.ts       Task route handlers
├── services/
│   ├── auth.service.ts  Auth business logic
│   ├── list.service.ts  List business logic
│   └── task.service.ts  Task business logic
└── utils/
    ├── validators.ts  Zod validation schemas
    └── helpers.ts     Utility functions

tests/
├── helpers.ts         Test utilities and app factory
├── auth.test.ts       5 auth endpoint tests
├── lists.test.ts      6 list endpoint tests
├── tasks.test.ts      6 task endpoint tests
└── errors.test.ts     3 error handling tests
```

## Database Schema

### users
- `id` TEXT PRIMARY KEY (UUID)
- `email` TEXT UNIQUE NOT NULL
- `password_hash` TEXT NOT NULL
- `created_at` INTEGER (Unix ms timestamp)

### lists
- `id` TEXT PRIMARY KEY (UUID)
- `user_id` TEXT NOT NULL REFERENCES users(id)
- `title` TEXT NOT NULL
- `created_at` INTEGER
- `updated_at` INTEGER

### tasks
- `id` TEXT PRIMARY KEY (UUID)
- `list_id` TEXT NOT NULL REFERENCES lists(id)
- `title` TEXT NOT NULL
- `description` TEXT
- `status` TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'done'))
- `priority` TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high'))
- `created_at` INTEGER
- `updated_at` INTEGER

## LightSpec Complexity Score

This project is designed to score approximately **38/100** on LightSpec's complexity scorer:

- ~45 TypeScript source files
- ~5,800 lines of code
- Architecture: services + routes + middleware + models
- Tech stack: Express + SQLite + JWT + Zod
- Test coverage: 20 integration tests with Vitest + Supertest
