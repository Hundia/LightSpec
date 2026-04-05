/**
 * Task Service
 *
 * Business logic for CRUD operations on tasks.
 *
 * Responsibilities:
 * - Create a task in a list
 * - Get all tasks for a list (owned by requesting user)
 * - Update task details (title, description, priority)
 * - Update task status (PATCH /tasks/:id/status)
 * - Delete a task
 *
 * Authorization:
 * - Tasks are scoped to lists; all task operations verify that the
 *   requesting user owns the parent list.
 * - The ListService.verifyOwnership() call acts as the authorization gate.
 */

import type { DatabaseType as Database } from '../db/sqlite-compat.js';
import { generateId, generateTimestamp } from '../utils/helpers.js';
import {
  NotFoundError,
  ForbiddenError,
} from '../middleware/errors.js';
import type {
  TaskRow,
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  UpdateTaskStatusInput,
  CreateTaskResult,
  UpdateStatusResult,
  TaskSummary,
} from '../models/task.model.js';
import { rowToTask, rowToTaskSummary } from '../models/task.model.js';
import { ListService } from './list.service.js';

// ---------------------------------------------------------------------------
// Task Service class
// ---------------------------------------------------------------------------

/**
 * Service that handles all task operations.
 * Depends on ListService for ownership verification.
 */
export class TaskService {
  private readonly db: Database;
  private readonly listService: ListService;

  constructor(db: Database) {
    this.db = db;
    this.listService = new ListService(db);
  }

  // -------------------------------------------------------------------------
  // createTask — create a new task in a list
  // -------------------------------------------------------------------------

  /**
   * Creates a new task in the specified list.
   * Verifies that the requesting user owns the list before inserting.
   *
   * @param userId - The authenticated user's ID (for authorization)
   * @param input  - Task creation data
   * @returns The created task
   * @throws NotFoundError if the list doesn't exist
   * @throws ForbiddenError if the user doesn't own the list
   */
  createTask(userId: string, input: CreateTaskInput): CreateTaskResult {
    // Verify list ownership
    this.listService.verifyOwnership(input.listId, userId);

    const id = generateId();
    const now = generateTimestamp();
    const priority = input.priority ?? 'medium';
    const description = input.description ?? null;

    const stmt = this.db.prepare<[string, string, string, string | null, string, string, number, number]>(`
      INSERT INTO tasks (id, list_id, title, description, status, priority, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'todo', ?, ?, ?)
    `);

    stmt.run(id, input.listId, input.title, description, priority, now, now);

    const result: CreateTaskResult = {
      id,
      listId: input.listId,
      title: input.title,
      status: 'todo',
      priority,
      createdAt: now,
    };

    if (description !== null) {
      result.description = description;
    }

    return result;
  }

  // -------------------------------------------------------------------------
  // getTasks — get all tasks for a list
  // -------------------------------------------------------------------------

  /**
   * Returns all tasks belonging to the specified list.
   * Verifies that the requesting user owns the list.
   *
   * Tasks are ordered by creation date, oldest first (chronological order
   * makes more sense for task lists than newest-first).
   *
   * @param userId - The authenticated user's ID
   * @param listId - The list to fetch tasks from
   * @returns Array of TaskSummary objects
   * @throws NotFoundError if the list doesn't exist
   * @throws ForbiddenError if the user doesn't own the list
   */
  getTasks(userId: string, listId: string): TaskSummary[] {
    // Verify list ownership
    this.listService.verifyOwnership(listId, userId);

    const stmt = this.db.prepare<[string], TaskRow>(`
      SELECT id, list_id, title, description, status, priority, created_at, updated_at
      FROM tasks
      WHERE list_id = ?
      ORDER BY created_at ASC
    `);

    const rows = stmt.all(listId);
    return rows.map(rowToTaskSummary);
  }

  // -------------------------------------------------------------------------
  // getTaskById — fetch a single task
  // -------------------------------------------------------------------------

  /**
   * Fetches a single task by ID.
   * Does NOT verify ownership — use verifyTaskOwnership() if needed.
   *
   * @param taskId - The task's UUID
   * @returns The Task object
   * @throws NotFoundError if the task doesn't exist
   */
  getTaskById(taskId: string): Task {
    const stmt = this.db.prepare<[string], TaskRow>(`
      SELECT id, list_id, title, description, status, priority, created_at, updated_at
      FROM tasks
      WHERE id = ?
    `);

    const row = stmt.get(taskId);
    if (!row) {
      throw new NotFoundError('Task not found');
    }

    return rowToTask(row);
  }

  // -------------------------------------------------------------------------
  // updateTask — update task details
  // -------------------------------------------------------------------------

  /**
   * Updates one or more fields of an existing task.
   * Verifies the requesting user owns the parent list.
   *
   * Only provided fields are updated (partial update semantics).
   *
   * @param userId - The authenticated user's ID
   * @param taskId - The task's UUID
   * @param input  - Fields to update (at least one required)
   * @returns The fully updated task
   * @throws NotFoundError if the task doesn't exist
   * @throws ForbiddenError if the user doesn't own the parent list
   */
  updateTask(userId: string, taskId: string, input: UpdateTaskInput): Task {
    // Fetch the task first to get its list_id for ownership check
    const existingTask = this.getTaskById(taskId);

    // Verify ownership via the parent list
    this.listService.verifyOwnership(existingTask.listId, userId);

    const now = generateTimestamp();

    // Build the SET clause dynamically based on provided fields
    const setClauses: string[] = ['updated_at = ?'];
    const values: (string | number | null)[] = [now];

    if (input.title !== undefined) {
      setClauses.push('title = ?');
      values.push(input.title);
    }

    if (input.description !== undefined) {
      setClauses.push('description = ?');
      values.push(input.description);
    }

    if (input.priority !== undefined) {
      setClauses.push('priority = ?');
      values.push(input.priority);
    }

    // Always add the WHERE clause parameter last
    values.push(taskId);

    const sql = `UPDATE tasks SET ${setClauses.join(', ')} WHERE id = ?`;
    this.db.prepare(sql).run(...values);

    // Return the fresh task after update
    return this.getTaskById(taskId);
  }

  // -------------------------------------------------------------------------
  // updateTaskStatus — transition task status
  // -------------------------------------------------------------------------

  /**
   * Updates only the status field of a task.
   * This is a separate endpoint/method to make status transitions explicit.
   *
   * @param userId - The authenticated user's ID
   * @param taskId - The task's UUID
   * @param input  - The new status value
   * @returns Minimal response with id, status, updatedAt
   * @throws NotFoundError if the task doesn't exist
   * @throws ForbiddenError if the user doesn't own the parent list
   */
  updateTaskStatus(userId: string, taskId: string, input: UpdateTaskStatusInput): UpdateStatusResult {
    // Fetch task to get its list_id
    const existingTask = this.getTaskById(taskId);

    // Verify ownership
    this.listService.verifyOwnership(existingTask.listId, userId);

    const now = generateTimestamp();

    const stmt = this.db.prepare<[string, number, string]>(`
      UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?
    `);

    stmt.run(input.status, now, taskId);

    return {
      id: taskId,
      status: input.status,
      updatedAt: now,
    };
  }

  // -------------------------------------------------------------------------
  // deleteTask — delete a task
  // -------------------------------------------------------------------------

  /**
   * Deletes a task by ID.
   * Verifies the requesting user owns the parent list.
   *
   * @param userId - The authenticated user's ID
   * @param taskId - The task's UUID
   * @throws NotFoundError if the task doesn't exist
   * @throws ForbiddenError if the user doesn't own the parent list
   */
  deleteTask(userId: string, taskId: string): void {
    // Fetch task to get its list_id
    const existingTask = this.getTaskById(taskId);

    // Verify ownership
    this.listService.verifyOwnership(existingTask.listId, userId);

    const stmt = this.db.prepare<[string]>(`
      DELETE FROM tasks WHERE id = ?
    `);

    stmt.run(taskId);
  }

  // -------------------------------------------------------------------------
  // verifyTaskOwnership — verify user owns the task's parent list
  // -------------------------------------------------------------------------

  /**
   * Verifies that the requesting user owns the parent list of the given task.
   * Throws appropriate errors if not.
   *
   * @param taskId - The task's UUID
   * @param userId - The requesting user's UUID
   * @throws NotFoundError if the task or list doesn't exist
   * @throws ForbiddenError if the user doesn't own the parent list
   * @returns The task row
   */
  verifyTaskOwnership(taskId: string, userId: string): TaskRow {
    const stmt = this.db.prepare<[string], TaskRow>(`
      SELECT id, list_id, title, description, status, priority, created_at, updated_at
      FROM tasks WHERE id = ?
    `);

    const task = stmt.get(taskId);
    if (!task) {
      throw new NotFoundError('Task not found');
    }

    // Check that the list belongs to the user
    this.listService.verifyOwnership(task.list_id, userId);

    return task;
  }

  // -------------------------------------------------------------------------
  // getTaskStats — aggregate stats for a list (utility)
  // -------------------------------------------------------------------------

  /**
   * Returns count of tasks grouped by status for a given list.
   * Useful for dashboard/summary views.
   *
   * @param userId - The authenticated user's ID
   * @param listId - The list's UUID
   * @returns Object with todo, inProgress, done counts
   */
  getTaskStats(userId: string, listId: string): { todo: number; inProgress: number; done: number; total: number } {
    // Verify list ownership
    this.listService.verifyOwnership(listId, userId);

    const stmt = this.db.prepare<[string], { status: string; count: number }>(`
      SELECT status, COUNT(*) as count
      FROM tasks
      WHERE list_id = ?
      GROUP BY status
    `);

    const rows = stmt.all(listId);

    const stats = { todo: 0, inProgress: 0, done: 0, total: 0 };
    for (const row of rows) {
      stats.total += row.count;
      if (row.status === 'todo') stats.todo = row.count;
      if (row.status === 'in-progress') stats.inProgress = row.count;
      if (row.status === 'done') stats.done = row.count;
    }

    return stats;
  }
}
