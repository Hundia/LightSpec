/**
 * List Routes
 *
 * Handles HTTP concerns for task list endpoints.
 * All routes require authentication (JWT middleware applied in app.ts).
 * Business logic is delegated to ListService.
 *
 * Routes:
 *   GET    /lists       — Get all lists for the authenticated user
 *   POST   /lists       — Create a new list
 *   PUT    /lists/:id   — Update a list's title
 *   DELETE /lists/:id   — Delete a list (and all its tasks)
 *
 * Authentication:
 *   The authMiddleware is applied to the /lists prefix in app.ts,
 *   so all routes here have req.userId set by the time they execute.
 */

import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { DatabaseType as Database } from '../db/sqlite-compat.js';
import { ListService } from '../services/list.service.js';
import {
  createListSchema,
  updateListSchema,
  getFirstZodError,
} from '../utils/validators.js';
import { requireAuth } from '../middleware/auth.js';

// ---------------------------------------------------------------------------
// Router factory
// ---------------------------------------------------------------------------

/**
 * Creates and returns an Express Router for list endpoints.
 *
 * @param db - better-sqlite3 Database instance (injected for testability)
 * @returns Express Router with GET, POST, PUT, DELETE routes for /lists
 */
export function createListsRouter(db: Database): Router {
  const router = Router();
  const listService = new ListService(db);

  // -------------------------------------------------------------------------
  // GET /lists
  // -------------------------------------------------------------------------

  /**
   * @route   GET /lists
   * @desc    Get all task lists for the authenticated user
   * @access  Private (requires JWT)
   *
   * Query params: none
   *
   * Responses:
   *   200 [{ id, title, taskCount, createdAt }]  — array (may be empty)
   *   401 { error: 'Unauthorized' }              — missing/invalid token
   */
  router.get('/', (req: Request, res: Response, next: NextFunction): void => {
    try {
      const userId = requireAuth(req);
      const lists = listService.getLists(userId);
      res.status(200).json(lists);
    } catch (err) {
      next(err);
    }
  });

  // -------------------------------------------------------------------------
  // POST /lists
  // -------------------------------------------------------------------------

  /**
   * @route   POST /lists
   * @desc    Create a new task list
   * @access  Private (requires JWT)
   *
   * Request body:
   *   { title: string }
   *
   * Responses:
   *   201 { id, title, createdAt }
   *   400 { error: string }  — validation failed
   *   401 { error: string }  — unauthorized
   */
  router.post('/', (req: Request, res: Response, next: NextFunction): void => {
    // Validate request body
    const result = createListSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: getFirstZodError(result.error) });
      return;
    }

    try {
      const userId = requireAuth(req);
      const list = listService.createList({
        userId,
        title: result.data.title,
      });
      res.status(201).json(list);
    } catch (err) {
      next(err);
    }
  });

  // -------------------------------------------------------------------------
  // PUT /lists/:id
  // -------------------------------------------------------------------------

  /**
   * @route   PUT /lists/:id
   * @desc    Update a list's title
   * @access  Private (requires JWT, must own the list)
   *
   * Path params:
   *   id — UUID of the list to update
   *
   * Request body:
   *   { title: string }
   *
   * Responses:
   *   200 { id, title, updatedAt }
   *   400 { error: string }  — validation failed
   *   401 { error: string }  — unauthorized
   *   403 { error: string }  — not the list owner
   *   404 { error: string }  — list not found
   */
  router.put('/:id', (req: Request, res: Response, next: NextFunction): void => {
    // Validate request body
    const result = updateListSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: getFirstZodError(result.error) });
      return;
    }

    try {
      const userId = requireAuth(req);
      const listId = req.params['id'] as string;

      const updated = listService.updateList(listId, userId, {
        title: result.data.title,
      });

      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  });

  // -------------------------------------------------------------------------
  // DELETE /lists/:id
  // -------------------------------------------------------------------------

  /**
   * @route   DELETE /lists/:id
   * @desc    Delete a list and all its tasks
   * @access  Private (requires JWT, must own the list)
   *
   * Path params:
   *   id — UUID of the list to delete
   *
   * Responses:
   *   204 (no body)          — deleted successfully
   *   401 { error: string }  — unauthorized
   *   403 { error: string }  — not the list owner
   *   404 { error: string }  — list not found
   */
  router.delete('/:id', (req: Request, res: Response, next: NextFunction): void => {
    try {
      const userId = requireAuth(req);
      const listId = req.params['id'] as string;

      listService.deleteList(listId, userId);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
}
