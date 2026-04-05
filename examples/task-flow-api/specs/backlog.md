# Project Backlog

> Graduated from LightSpec on 2026-04-05.
> Review and expand tickets with your team.

## Sprint 1 — Initial Implementation

_Converted from LSP task list:_

---
generated_by: lightspec
version: 0.1.0
date: 2026-04-05
---
# Task List

| # | Task | Priority | Estimate | Status |
|---|------|----------|----------|--------|
| 1 | Set up TypeScript project, tsconfig, package.json scripts | High | 1h | [x] done |
| 2 | Implement env config with defaults (src/config/env.ts) | High | 30m | [x] done |
| 3 | Create SQLite connection factory and table DDL | High | 1h | [x] done |
| 4 | Implement auth service: register + login with bcrypt | High | 2h | [x] done |
| 5 | Implement JWT middleware (src/middleware/auth.ts) | High | 1h | [x] done |
| 6 | Add auth routes with Zod validation | High | 1h | [x] done |
| 7 | Define List + Task TypeScript interfaces/models | Medium | 1h | [x] done |
| 8 | Implement list service (CRUD + ownership check) | High | 2h | [x] done |
| 9 | Add list routes with auth middleware | High | 1h | [x] done |
| 10 | Implement task service (CRUD + status patch) | High | 2h | [x] done |
| 11 | Add task routes (GET with listId filter, status PATCH) | High | 1h | [x] done |
| 12 | Build createApp factory with error handler middleware | High | 1h | [x] done |
| 13 | Write auth integration tests (5 cases) | Medium | 1h | [ ] todo |
| 14 | Write lists integration tests (6 cases) | Medium | 1h | [ ] todo |
| 15 | Write tasks integration tests (6 cases) | Medium | 1h | [ ] todo |
| 16 | Write error handling tests (3 cases) | Medium | 30m | [ ] todo |
| 17 | Verify all 20 tests pass with npm test | High | 30m | [ ] todo |
