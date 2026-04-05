/**
 * Task Routes
 *
 * Handles HTTP concerns for task endpoints.
 * All routes require authentication (JWT middleware applied in app.ts).
 * Business logic is delegated to TaskService.
 *
 * Routes:
 *   GET    /tasks?listId=<uuid>   — Get all tasks in a list
 *   POST   /tasks                 — Create a task in a list
 *   PUT    /tasks/:id             — Update task details
 *   PATCH  /tasks/:id/status      — Update task status only
 *   DELETE /tasks/:id             — Delete a task
 *
 * Authorization:
 *   Tasks are scoped to lists. Every operation verifies that the
 *   authenticated user owns the parent list.
 */

import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { DatabaseType as Database } from '../db/sqlite-compat.js';
import { TaskService } from '../services/task.service.js';
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  getTasksQuerySchema,
  getFirstZodError,
} from '../utils/validators.js';
import { requireAuth } from '../middleware/auth.js';

// ---------------------------------------------------------------------------
// Router factory
// ---------------------------------------------------------------------------

/**
 * Creates and returns an Express Router for task endpoints.
 *
 * @param db - better-sqlite3 Database instance (injected for testability)
 * @returns Express Router with task CRUD routes
 */
export function createTasksRouter(db: Database): Router {
  const router = Router();
  const taskService = new TaskService(db);

  // -------------------------------------------------------------------------
  // GET /tasks?listId=<uuid>
  // -------------------------------------------------------------------------

  /**
   * @route   GET /tasks
   * @desc    Get all tasks in a specific list
   * @access  Private (requires JWT, must own the list)
   *
   * Query params:
   *   listId (required) — UUID of the list
   *   status  (optional) — filter by status: 'todo' | 'in-progress' | 'done'
   *   priority (optional) — filter by priority: 'low' | 'medium' | 'high'
   *
   * Responses:
   *   200 [{ id, listId, title, status, priority, createdAt, updatedAt }]
   *   400 { error: string }  — missing or invalid listId
   *   401 { error: string }  — unauthorized
   *   403 { error: string }  — not the list owner
   *   404 { error: string }  — list not found
   */
  router.get('/', (req: Request, res: Response, next: NextFunction): void => {
    // Validate query parameters
    const result = getTasksQuerySchema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({ error: getFirstZodError(result.error) });
      return;
    }

    try {
      const userId = requireAuth(req);
      const { listId } = result.data;

      let tasks = taskService.getTasks(userId, listId);

      // Optional client-side filtering (could also be done in SQL)
      if (result.data.status) {
        tasks = tasks.filter(t => t.status === result.data.status);
      }
      if (result.data.priority) {
        tasks = tasks.filter(t => t.priority === result.data.priority);
      }

      res.status(200).json(tasks);
    } catch (err) {
      next(err);
    }
  });

  // -------------------------------------------------------------------------
  // POST /tasks
  // -------------------------------------------------------------------------

  /**
   * @route   POST /tasks
   * @desc    Create a new task in a list
   * @access  Private (requires JWT, must own the list)
   *
   * Request body:
   *   { listId: string, title: string, description?: string, priority?: string }
   *
   * Responses:
   *   201 { id, listId, title, description?, status, priority, createdAt }
   *   400 { error: string }  — validation failed
   *   401 { error: string }  — unauthorized
   *   403 { error: string }  — not the list owner
   *   404 { error: string }  — list not found
   */
  router.post('/', (req: Request, res: Response, next: NextFunction): void => {
    // Validate request body
    const result = createTaskSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: getFirstZodError(result.error) });
      return;
    }

    try {
      const userId = requireAuth(req);
      const task = taskService.createTask(userId, result.data);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  });

  // -------------------------------------------------------------------------
  // PATCH /tasks/:id/status  (must come before PUT /:id to avoid conflict)
  // -------------------------------------------------------------------------

  /**
   * @route   PATCH /tasks/:id/status
   * @desc    Update only the status of a task
   * @access  Private (requires JWT, must own the parent list)
   *
   * Path params:
   *   id — UUID of the task
   *
   * Request body:
   *   { status: 'todo' | 'in-progress' | 'done' }
   *
   * Responses:
   *   200 { id, status, updatedAt }
   *   400 { error: string }  — invalid status value
   *   401 { error: string }  — unauthorized
   *   403 { error: string }  — not the list owner
   *   404 { error: string }  — task not found
   */
  router.patch('/:id/status', (req: Request, res: Response, next: NextFunction): void => {
    // Validate request body
    const result = updateTaskStatusSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: getFirstZodError(result.error) });
      return;
    }

    try {
      const userId = requireAuth(req);
      const taskId = req.params['id'] as string;

      const updated = taskService.updateTaskStatus(userId, taskId, result.data);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  });

  // -------------------------------------------------------------------------
  // PUT /tasks/:id
  // -------------------------------------------------------------------------

  /**
   * @route   PUT /tasks/:id
   * @desc    Update task details (title, description, priority)
   * @access  Private (requires JWT, must own the parent list)
   *
   * Path params:
   *   id — UUID of the task
   *
   * Request body (at least one field required):
   *   { title?: string, description?: string, priority?: string }
   *
   * Responses:
   *   200 { id, listId, title, description?, status, priority, createdAt, updatedAt }
   *   400 { error: string }  — validation failed
   *   401 { error: string }  — unauthorized
   *   403 { error: string }  — not the list owner
   *   404 { error: string }  — task not found
   */
  router.put('/:id', (req: Request, res: Response, next: NextFunction): void => {
    // Validate request body
    const result = updateTaskSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: getFirstZodError(result.error) });
      return;
    }

    try {
      const userId = requireAuth(req);
      const taskId = req.params['id'] as string;

      const updated = taskService.updateTask(userId, taskId, result.data);
      res.status(200).json(updated);
    } catch (err) {
      next(err);
    }
  });

  // -------------------------------------------------------------------------
  // DELETE /tasks/:id
  // -------------------------------------------------------------------------

  /**
   * @route   DELETE /tasks/:id
   * @desc    Delete a task
   * @access  Private (requires JWT, must own the parent list)
   *
   * Path params:
   *   id — UUID of the task
   *
   * Responses:
   *   204 (no body)          — deleted successfully
   *   401 { error: string }  — unauthorized
   *   403 { error: string }  — not the list owner
   *   404 { error: string }  — task not found
   */
  router.delete('/:id', (req: Request, res: Response, next: NextFunction): void => {
    try {
      const userId = requireAuth(req);
      const taskId = req.params['id'] as string;

      taskService.deleteTask(userId, taskId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
}
