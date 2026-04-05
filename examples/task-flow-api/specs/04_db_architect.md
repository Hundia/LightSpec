---
role: db_architect
generated_by: lightspec-graduate
source: .lsp/spec.md
date: 2026-04-05
status: draft
---
# DB Architect Spec

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

## Migration Strategy

_Define migration approach and rollback plan here._
