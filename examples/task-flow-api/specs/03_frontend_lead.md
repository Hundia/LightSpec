---
role: frontend_lead
generated_by: lightspec-graduate
source: .lsp/spec.md
date: 2026-04-05
status: draft
---
# Frontend Lead Spec

#### Lists (requires `Authorization: Bearer <token>`)

| Method | Path | Request | Response |
|--------|------|---------|----------|
| GET | /lists | — | `200 [{ id, title, taskCount, createdAt }]` |
| POST | /lists | `{ title: string }` | `201 { id, title, createdAt }` |
| PUT | /lists/:id | `{ title: string }` | `200 { id, title, updatedAt }` |
| DELETE | /lists/:id | — | `204` |

## Implementation Notes

_Add frontend implementation decisions here._
