/**
 * List Service
 *
 * Business logic for CRUD operations on task lists.
 *
 * Responsibilities:
 * - Create a list for a user
 * - Get all lists for a user (with task counts)
 * - Update a list's title (ownership verified)
 * - Delete a list (ownership verified, cascades to tasks)
 *
 * Authorization:
 * - All methods that target a specific list verify that the requesting user
 *   owns the list, throwing ForbiddenError if they don't.
 * - User can only see their own lists (user_id filter on all queries).
 *
 * This service does NOT handle HTTP — routes/lists.ts handles that.
 */

import type { DatabaseType as Database } from '../db/sqlite-compat.js';
import { generateId, generateTimestamp } from '../utils/helpers.js';
import {
  NotFoundError,
  ForbiddenError,
} from '../middleware/errors.js';
import type {
  ListRow,
  ListRowWithCount,
  CreateListInput,
  UpdateListInput,
  CreateListResult,
  UpdateListResult,
  ListSummary,
} from '../models/list.model.js';
import {
  rowToCreateResult,
  rowToListSummary,
} from '../models/list.model.js';

// ---------------------------------------------------------------------------
// List Service class
// ---------------------------------------------------------------------------

/**
 * Service that handles all task list operations.
 * Receives a Database instance via constructor injection.
 */
export class ListService {
  private readonly db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  // -------------------------------------------------------------------------
  // createList — create a new list for a user
  // -------------------------------------------------------------------------

  /**
   * Creates a new task list owned by the given user.
   *
   * @param input - userId and title for the new list
   * @returns The created list's essential fields
   */
  createList(input: CreateListInput): CreateListResult {
    const { userId, title } = input;
    const id = generateId();
    const now = generateTimestamp();

    const stmt = this.db.prepare<[string, string, string, number, number]>(`
      INSERT INTO lists (id, user_id, title, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, userId, title, now, now);

    return {
      id,
      title,
      createdAt: now,
    };
  }

  // -------------------------------------------------------------------------
  // getLists — get all lists for a user with task counts
  // -------------------------------------------------------------------------

  /**
   * Returns all lists owned by the given user, each with a taskCount.
   * taskCount is computed via a correlated subquery for efficiency.
   *
   * Lists are ordered by creation date, newest first.
   *
   * @param userId - The authenticated user's ID
   * @returns Array of ListSummary objects
   */
  getLists(userId: string): ListSummary[] {
    const stmt = this.db.prepare<[string], ListRowWithCount>(`
      SELECT
        l.id,
        l.user_id,
        l.title,
        l.created_at,
        l.updated_at,
        (
          SELECT COUNT(*) FROM tasks t WHERE t.list_id = l.id
        ) AS task_count
      FROM lists l
      WHERE l.user_id = ?
      ORDER BY l.created_at DESC
    `);

    const rows = stmt.all(userId);
    return rows.map(rowToListSummary);
  }

  // -------------------------------------------------------------------------
  // getListById — fetch a single list with task count
  // -------------------------------------------------------------------------

  /**
   * Fetches a single list by ID, including its task count.
   * Does NOT verify ownership — use verifyOwnership() before calling this
   * if you need to check that the user owns the list.
   *
   * @param listId - The list's UUID
   * @returns The ListRowWithCount if found
   * @throws NotFoundError if no list with that ID exists
   */
  getListById(listId: string): ListRowWithCount {
    const stmt = this.db.prepare<[string], ListRowWithCount>(`
      SELECT
        l.id,
        l.user_id,
        l.title,
        l.created_at,
        l.updated_at,
        (
          SELECT COUNT(*) FROM tasks t WHERE t.list_id = l.id
        ) AS task_count
      FROM lists l
      WHERE l.id = ?
    `);

    const row = stmt.get(listId);
    if (!row) {
      throw new NotFoundError('List not found');
    }

    return row;
  }

  // -------------------------------------------------------------------------
  // updateList — update a list's title
  // -------------------------------------------------------------------------

  /**
   * Updates the title of an existing list.
   * Verifies that the requesting user owns the list.
   *
   * @param listId  - The list's UUID
   * @param userId  - The authenticated user's ID
   * @param input   - The updated fields (currently just title)
   * @returns The updated list's fields
   * @throws NotFoundError if the list doesn't exist
   * @throws ForbiddenError if the user doesn't own the list
   */
  updateList(listId: string, userId: string, input: UpdateListInput): UpdateListResult {
    // Verify existence and ownership
    this.verifyOwnership(listId, userId);

    const now = generateTimestamp();

    const stmt = this.db.prepare<[string, number, string]>(`
      UPDATE lists SET title = ?, updated_at = ? WHERE id = ?
    `);

    stmt.run(input.title, now, listId);

    return {
      id: listId,
      title: input.title,
      updatedAt: now,
    };
  }

  // -------------------------------------------------------------------------
  // deleteList — delete a list and all its tasks
  // -------------------------------------------------------------------------

  /**
   * Deletes a list and all its tasks (cascade via FK constraint).
   * Verifies that the requesting user owns the list.
   *
   * @param listId - The list's UUID
   * @param userId - The authenticated user's ID
   * @throws NotFoundError if the list doesn't exist
   * @throws ForbiddenError if the user doesn't own the list
   */
  deleteList(listId: string, userId: string): void {
    // Verify existence and ownership
    this.verifyOwnership(listId, userId);

    const stmt = this.db.prepare<[string]>(`
      DELETE FROM lists WHERE id = ?
    `);

    stmt.run(listId);
    // Tasks are deleted automatically via ON DELETE CASCADE
  }

  // -------------------------------------------------------------------------
  // verifyOwnership — internal authorization check
  // -------------------------------------------------------------------------

  /**
   * Verifies that the given list exists and belongs to the given user.
   *
   * @param listId - The list's UUID
   * @param userId - The requesting user's UUID
   * @throws NotFoundError if the list doesn't exist
   * @throws ForbiddenError if the user doesn't own the list
   * @returns The raw ListRow (useful for callers that need list data)
   */
  verifyOwnership(listId: string, userId: string): ListRow {
    const stmt = this.db.prepare<[string], ListRow>(`
      SELECT id, user_id, title, created_at, updated_at
      FROM lists
      WHERE id = ?
    `);

    const list = stmt.get(listId);

    if (!list) {
      throw new NotFoundError('List not found');
    }

    if (list.user_id !== userId) {
      throw new ForbiddenError('You do not have permission to access this list');
    }

    return list;
  }

  // -------------------------------------------------------------------------
  // listExists — lightweight existence check
  // -------------------------------------------------------------------------

  /**
   * Checks whether a list with the given ID exists.
   *
   * @param listId - The list's UUID
   * @returns true if the list exists
   */
  listExists(listId: string): boolean {
    const stmt = this.db.prepare<[string], { count: number }>(`
      SELECT COUNT(*) as count FROM lists WHERE id = ?
    `);

    const result = stmt.get(listId);
    return (result?.count ?? 0) > 0;
  }

  // -------------------------------------------------------------------------
  // getTaskCountForList — get the number of tasks in a list
  // -------------------------------------------------------------------------

  /**
   * Returns the count of tasks in a given list.
   * Useful for validation or business rules.
   *
   * @param listId - The list's UUID
   * @returns Number of tasks in the list
   */
  getTaskCountForList(listId: string): number {
    const stmt = this.db.prepare<[string], { count: number }>(`
      SELECT COUNT(*) as count FROM tasks WHERE list_id = ?
    `);

    const result = stmt.get(listId);
    return result?.count ?? 0;
  }
}
