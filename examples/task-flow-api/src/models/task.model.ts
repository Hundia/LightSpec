/**
 * Task Model
 *
 * TypeScript interfaces and types for the Task entity.
 *
 * A Task represents a unit of work within a List. Tasks have:
 * - A status lifecycle: todo → in-progress → done
 * - A priority level: low | medium | high
 * - An optional description for additional context
 *
 * Design notes:
 * - TaskRow represents the raw DB row (snake_case, matches SQLite schema)
 * - Task is the application-level representation (camelCase)
 * - Status transitions are validated by Zod in routes, enforced by DB CHECK
 * - Ownership is verified at service level (list must belong to requesting user)
 */

import type { TaskStatus, TaskPriority } from '../db/schema.js';

// Re-export for convenience in service and route files
export type { TaskStatus, TaskPriority };

// ---------------------------------------------------------------------------
// Raw database row type
// ---------------------------------------------------------------------------

/**
 * Represents a row from the `tasks` table.
 * Column names exactly match the SQLite schema.
 */
export interface TaskRow {
  /** UUID v4 primary key */
  id: string;

  /** FK → lists.id — the list this task belongs to */
  list_id: string;

  /** Task title / headline */
  title: string;

  /** Optional longer description — can be null in DB */
  description: string | null;

  /** Current status in the task lifecycle */
  status: TaskStatus;

  /** Task importance level */
  priority: TaskPriority;

  /** Unix millisecond timestamp — when the task was created */
  created_at: number;

  /** Unix millisecond timestamp — when the task was last modified */
  updated_at: number;
}

// ---------------------------------------------------------------------------
// Application-level Task type
// ---------------------------------------------------------------------------

/**
 * Application-level task representation.
 * camelCase field names, null converted to undefined for cleaner JSON.
 */
export interface Task {
  /** UUID v4 primary key */
  id: string;

  /** FK → lists.id */
  listId: string;

  /** Task title */
  title: string;

  /** Optional description — undefined if not set */
  description?: string;

  /** Current status */
  status: TaskStatus;

  /** Priority level */
  priority: TaskPriority;

  /** Unix millisecond timestamp */
  createdAt: number;

  /** Unix millisecond timestamp */
  updatedAt: number;
}

// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

/**
 * Input to create a new task.
 * Validated by Zod before reaching the service layer.
 */
export interface CreateTaskInput {
  /** The list this task belongs to */
  listId: string;

  /** Task title (required) */
  title: string;

  /** Optional description */
  description?: string;

  /**
   * Initial priority — defaults to 'medium' if not provided.
   * The default is applied by the service layer.
   */
  priority?: TaskPriority;
}

/**
 * Input for PUT /tasks/:id — update task details.
 * All fields are optional; at least one must be present (enforced by Zod).
 */
export interface UpdateTaskInput {
  /** New title */
  title?: string;

  /** New or updated description */
  description?: string;

  /** New priority level */
  priority?: TaskPriority;
}

/**
 * Input for PATCH /tasks/:id/status — transition task status.
 * Only status is updatable via this endpoint.
 */
export interface UpdateTaskStatusInput {
  /** The new status value */
  status: TaskStatus;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

/**
 * Returned by POST /tasks (201).
 */
export interface CreateTaskResult {
  id: string;
  listId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: number;
}

/**
 * Returned by PATCH /tasks/:id/status (200).
 * Minimal response — just the updated fields.
 */
export interface UpdateStatusResult {
  id: string;
  status: TaskStatus;
  updatedAt: number;
}

/**
 * Returned by GET /tasks?listId=X (200).
 * Array of task summaries — all fields except description for brevity.
 */
export interface TaskSummary {
  id: string;
  listId: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: number;
  updatedAt: number;
}

// ---------------------------------------------------------------------------
// Status transition helpers
// ---------------------------------------------------------------------------

/**
 * Valid status transition map.
 * Defines which status values can follow which.
 * Not enforced at runtime (any valid status is accepted), but useful for docs.
 *
 * Intended flow: todo → in-progress → done
 * Backwards transitions are allowed by the API (for flexibility).
 */
export const STATUS_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  'todo': ['in-progress', 'done'],
  'in-progress': ['todo', 'done'],
  'done': ['todo', 'in-progress'],
};

// ---------------------------------------------------------------------------
// Helper: map TaskRow → Task
// ---------------------------------------------------------------------------

/**
 * Converts a raw database TaskRow to an application-level Task.
 *
 * @param row - Raw row from the tasks table
 * @returns Application-level Task object with camelCase fields
 */
export function rowToTask(row: TaskRow): Task {
  const task: Task = {
    id: row.id,
    listId: row.list_id,
    title: row.title,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };

  // Only include description if it's non-null
  if (row.description !== null && row.description !== undefined) {
    task.description = row.description;
  }

  return task;
}

/**
 * Converts a TaskRow to a TaskSummary for GET /tasks responses.
 *
 * @param row - Raw row from the tasks table
 * @returns TaskSummary for list responses
 */
export function rowToTaskSummary(row: TaskRow): TaskSummary {
  return {
    id: row.id,
    listId: row.list_id,
    title: row.title,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
