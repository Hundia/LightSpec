/**
 * Database Schema Definitions
 *
 * Contains all CREATE TABLE SQL statements for the Task Flow API.
 * Tables are created with IF NOT EXISTS so this is safe to run repeatedly.
 *
 * Schema overview:
 *   users  — authentication accounts
 *   lists  — task lists owned by a user
 *   tasks  — individual tasks belonging to a list
 *
 * All timestamps are stored as INTEGER (Unix milliseconds via Date.now()).
 * All IDs are UUID v4 strings (TEXT).
 * Foreign keys are enforced via PRAGMA foreign_keys = ON (set in connection.ts).
 */

// ---------------------------------------------------------------------------
// Users table
// ---------------------------------------------------------------------------
// Stores registered user accounts.
// - email must be globally unique (enforced at DB level + 409 at API level)
// - password_hash stores the bcrypt hash (never the plaintext password)
// ---------------------------------------------------------------------------

export const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id            TEXT    PRIMARY KEY,
    email         TEXT    UNIQUE NOT NULL,
    password_hash TEXT    NOT NULL,
    created_at    INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  )
`;

// ---------------------------------------------------------------------------
// Lists table
// ---------------------------------------------------------------------------
// A list belongs to exactly one user (user_id FK → users.id).
// Deleting a user cascades to delete their lists (ON DELETE CASCADE).
// The taskCount field is computed at query time via a subquery — not stored.
// ---------------------------------------------------------------------------

export const CREATE_LISTS_TABLE = `
  CREATE TABLE IF NOT EXISTS lists (
    id         TEXT    PRIMARY KEY,
    user_id    TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title      TEXT    NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  )
`;

// ---------------------------------------------------------------------------
// Tasks table
// ---------------------------------------------------------------------------
// A task belongs to exactly one list (list_id FK → lists.id).
// Deleting a list cascades to delete its tasks (ON DELETE CASCADE).
//
// Status values: 'todo' | 'in-progress' | 'done'
// Priority values: 'low' | 'medium' | 'high'
//
// Both status and priority use CHECK constraints so the DB itself
// rejects invalid values even if the API validation layer fails.
// ---------------------------------------------------------------------------

export const CREATE_TASKS_TABLE = `
  CREATE TABLE IF NOT EXISTS tasks (
    id          TEXT    PRIMARY KEY,
    list_id     TEXT    NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
    title       TEXT    NOT NULL,
    description TEXT,
    status      TEXT    NOT NULL DEFAULT 'todo'
                        CHECK (status IN ('todo', 'in-progress', 'done')),
    priority    TEXT    NOT NULL DEFAULT 'medium'
                        CHECK (priority IN ('low', 'medium', 'high')),
    created_at  INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    updated_at  INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
  )
`;

// ---------------------------------------------------------------------------
// Index definitions
// ---------------------------------------------------------------------------
// These indexes speed up the most common query patterns:
//   - Fetching all lists for a user  → lists.user_id
//   - Fetching all tasks for a list  → tasks.list_id
//   - Looking up a user by email     → users.email (already covered by UNIQUE)
// ---------------------------------------------------------------------------

export const CREATE_LISTS_USER_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_lists_user_id ON lists(user_id)
`;

export const CREATE_TASKS_LIST_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_tasks_list_id ON tasks(list_id)
`;

export const CREATE_TASKS_STATUS_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)
`;

export const CREATE_TASKS_PRIORITY_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority)
`;

// ---------------------------------------------------------------------------
// All DDL statements in execution order
// ---------------------------------------------------------------------------
// Tables must be created before their dependent indexes.
// The order within tables matters: users before lists (FK), lists before tasks (FK).
// ---------------------------------------------------------------------------

export const ALL_DDL_STATEMENTS: string[] = [
  CREATE_USERS_TABLE,
  CREATE_LISTS_TABLE,
  CREATE_TASKS_TABLE,
  CREATE_LISTS_USER_INDEX,
  CREATE_TASKS_LIST_INDEX,
  CREATE_TASKS_STATUS_INDEX,
  CREATE_TASKS_PRIORITY_INDEX,
];

// ---------------------------------------------------------------------------
// Type aliases for valid enum values (mirrors CHECK constraints above)
// ---------------------------------------------------------------------------

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export const VALID_STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done'];
export const VALID_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];
