/**
 * Auth Routes
 *
 * Handles HTTP concerns for authentication endpoints.
 * Business logic is delegated to AuthService.
 *
 * Routes:
 *   POST /auth/register  — Register a new user
 *   POST /auth/login     — Authenticate an existing user
 *
 * This is a factory function (createAuthRouter) that takes a db instance
 * so the router can be used in both the main app and tests.
 */

import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { DatabaseType as Database } from '../db/sqlite-compat.js';
import { AuthService } from '../services/auth.service.js';
import {
  registerSchema,
  loginSchema,
  getFirstZodError,
} from '../utils/validators.js';

// ---------------------------------------------------------------------------
// Router factory
// ---------------------------------------------------------------------------

/**
 * Creates and returns an Express Router for auth endpoints.
 *
 * @param db - better-sqlite3 Database instance (injected for testability)
 * @returns Express Router with /register and /login routes
 */
export function createAuthRouter(db: Database): Router {
  const router = Router();
  const authService = new AuthService(db);

  // -------------------------------------------------------------------------
  // POST /auth/register
  // -------------------------------------------------------------------------

  /**
   * @route   POST /auth/register
   * @desc    Register a new user account
   * @access  Public
   *
   * Request body:
   *   { email: string, password: string }
   *
   * Responses:
   *   201 { token: string, userId: string, email: string }
   *   400 { error: string }  — validation failed
   *   409 { error: string }  — email already registered
   */
  router.post('/register', (req: Request, res: Response, next: NextFunction): void => {
    // Step 1: Validate request body with Zod
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: getFirstZodError(result.error) });
      return;
    }

    // Step 2: Call service (may throw ConflictError)
    try {
      const authResult = authService.register(result.data);
      res.status(201).json(authResult);
    } catch (err) {
      next(err);
    }
  });

  // -------------------------------------------------------------------------
  // POST /auth/login
  // -------------------------------------------------------------------------

  /**
   * @route   POST /auth/login
   * @desc    Authenticate with email + password, get a JWT
   * @access  Public
   *
   * Request body:
   *   { email: string, password: string }
   *
   * Responses:
   *   200 { token: string, userId: string, email: string }
   *   400 { error: string }  — validation failed
   *   401 { error: string }  — invalid credentials
   */
  router.post('/login', (req: Request, res: Response, next: NextFunction): void => {
    // Step 1: Validate request body
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: getFirstZodError(result.error) });
      return;
    }

    // Step 2: Call service (may throw UnauthorizedError)
    try {
      const authResult = authService.login(result.data);
      res.status(200).json(authResult);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
