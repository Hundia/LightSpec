/**
 * List Model
 *
 * TypeScript interfaces and types for the List entity.
 *
 * A List is a named collection of tasks owned by a single user.
 * Lists are the primary organizational unit in the Task Flow API.
 *
 * Design notes:
 * - ListRow represents the raw database row (snake_case)
 * - List is the application-level type (camelCase, includes taskCount)
 * - taskCount is computed at query time via SQL subquery, not stored
 * - All mutations go through service layer; routes only handle HTTP concerns
 */

// ---------------------------------------------------------------------------
// Raw database row type
// ---------------------------------------------------------------------------

/**
 * Represents a row from the `lists` table.
 * Does not include taskCount — that's computed separately.
 */
export interface ListRow {
  /** UUID v4 primary key */
  id: string;

  /** FK → users.id — the owner of this list */
  user_id: string;

  /** Display name for this list */
  title: string;

  /** Unix millisecond timestamp — when this list was created */
  created_at: number;

  /** Unix millisecond timestamp — when this list was last modified */
  updated_at: number;
}

/**
 * Extended row type that includes the computed task count.
 * Returned by JOIN queries in list.service.ts.
 */
export interface ListRowWithCount extends ListRow {
  /** Number of tasks associated with this list */
  task_count: number;
}

// ---------------------------------------------------------------------------
// Application-level List type
// ---------------------------------------------------------------------------

/**
 * Application-level list representation.
 * camelCase field names, includes computed taskCount.
 */
export interface List {
  /** UUID v4 primary key */
  id: string;

  /** FK → users.id — the owner of this list */
  userId: string;

  /** Display name for this list */
  title: string;

  /** Number of tasks in this list (computed, not stored) */
  taskCount: number;

  /** Unix millisecond timestamp */
  createdAt: number;

  /** Unix millisecond timestamp */
  updatedAt: number;
}

/**
 * Minimal list summary — used in API list responses where full details aren't needed.
 */
export interface ListSummary {
  id: string;
  title: string;
  taskCount: number;
  createdAt: number;
}

// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

/**
 * Data required to create a new list.
 * Validated via Zod in routes/lists.ts before reaching the service.
 */
export interface CreateListInput {
  /** ID of the authenticated user creating this list */
  userId: string;

  /** Display title for the new list */
  title: string;
}

/**
 * Data allowed when updating an existing list.
 * Currently only title is editable; userId is taken from auth context.
 */
export interface UpdateListInput {
  /** New title for the list */
  title: string;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

/**
 * Returned by POST /lists.
 * A subset of list fields — just what the client needs after creation.
 */
export interface CreateListResult {
  id: string;
  title: string;
  createdAt: number;
}

/**
 * Returned by PUT /lists/:id.
 */
export interface UpdateListResult {
  id: string;
  title: string;
  updatedAt: number;
}

// ---------------------------------------------------------------------------
// Helper: map ListRow + count → List
// ---------------------------------------------------------------------------

/**
 * Converts a raw database row (with optional task_count) to an application List.
 *
 * @param row - Raw list row, optionally with task_count
 * @returns Application-level List object
 */
export function rowToList(row: ListRowWithCount): List {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    taskCount: row.task_count ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Converts a ListRow to a ListSummary for GET /lists responses.
 * Includes computed taskCount from the extended row.
 *
 * @param row - Extended row with task_count
 * @returns ListSummary suitable for array responses
 */
export function rowToListSummary(row: ListRowWithCount): ListSummary {
  return {
    id: row.id,
    title: row.title,
    taskCount: row.task_count ?? 0,
    createdAt: row.created_at,
  };
}

/**
 * Converts a plain ListRow (no task_count) to a CreateListResult.
 * Used when returning a newly created list where taskCount is 0.
 *
 * @param row - Plain list row (no task count computed)
 * @returns CreateListResult for 201 responses
 */
export function rowToCreateResult(row: ListRow): CreateListResult {
  return {
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
  };
}
