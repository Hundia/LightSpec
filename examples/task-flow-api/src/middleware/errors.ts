/**
 * Global Error Handler Middleware
 *
 * Express error-handling middleware that catches all unhandled errors
 * thrown or passed to next(err) in route handlers and services.
 *
 * Express identifies error handlers by their 4-parameter signature:
 *   (err, req, res, next)
 *
 * This middleware:
 * - Handles known error types (AppError, ValidationError, etc.)
 * - Logs unexpected errors in development/production
 * - Never exposes internal error details to clients in production
 * - Handles 404s for unmatched routes
 *
 * Usage in app.ts:
 *   app.use(notFoundHandler);   // Must come after all routes
 *   app.use(errorHandler);      // Must be the last middleware
 */

import type { Request, Response, NextFunction } from 'express';

// ---------------------------------------------------------------------------
// Custom error classes
// ---------------------------------------------------------------------------

/**
 * Base application error class.
 * Extend this for domain-specific errors that should map to HTTP status codes.
 */
export class AppError extends Error {
  /** HTTP status code to return */
  public readonly statusCode: number;

  /** Whether this error should be logged (false for expected user errors) */
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    // Restore prototype chain (needed when extending built-in classes in TS)
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * 400 Bad Request — used when request data fails business validation
 * (as opposed to schema validation handled by Zod in route handlers).
 */
export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

/**
 * 401 Unauthorized — authentication required or credentials invalid.
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

/**
 * 403 Forbidden — authenticated but not allowed to access this resource.
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

/**
 * 404 Not Found — resource doesn't exist.
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * 409 Conflict — duplicate resource (e.g., email already registered).
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

/**
 * 422 Unprocessable Entity — data is valid format but fails business rules.
 */
export class UnprocessableError extends AppError {
  constructor(message: string) {
    super(message, 422);
    this.name = 'UnprocessableError';
  }
}

// ---------------------------------------------------------------------------
// 404 handler for unmatched routes
// ---------------------------------------------------------------------------

/**
 * Catches any request that doesn't match a registered route.
 * Must be registered AFTER all route handlers.
 *
 * Returns: 404 { error: 'Not found' }
 */
export function notFoundHandler(req: Request, res: Response, _next: NextFunction): void {
  res.status(404).json({ error: 'Not found' });
}

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------

/**
 * Express global error handler.
 * Receives errors thrown in route handlers or passed via next(err).
 *
 * Must be registered as the LAST middleware in app.ts.
 * Express identifies error handlers by their 4-parameter signature.
 *
 * @param err  - The error that was thrown or passed to next()
 * @param req  - Express Request
 * @param res  - Express Response
 * @param next - Express NextFunction (must be included even if unused)
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // ---------------------------------------------------------------------------
  // Case 1: Known application errors (AppError subclasses)
  // ---------------------------------------------------------------------------
  if (err instanceof AppError) {
    if (!err.isOperational) {
      // Non-operational errors are programming bugs — log them
      console.error('[error] Non-operational AppError:', err);
    }

    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // ---------------------------------------------------------------------------
  // Case 2: SQLite UNIQUE constraint violations
  // ---------------------------------------------------------------------------
  // better-sqlite3 throws a SqliteError with code SQLITE_CONSTRAINT_UNIQUE
  // when a UNIQUE constraint is violated (e.g., duplicate email).
  if (err.message?.includes('UNIQUE constraint failed')) {
    // Extract the field name from the error: "UNIQUE constraint failed: users.email"
    const match = err.message.match(/UNIQUE constraint failed: \w+\.(\w+)/);
    const field = match?.[1] ?? 'field';
    res.status(409).json({ error: `${field} already exists` });
    return;
  }

  // ---------------------------------------------------------------------------
  // Case 3: SQLite CHECK constraint violations
  // ---------------------------------------------------------------------------
  if (err.message?.includes('CHECK constraint failed')) {
    res.status(400).json({ error: 'Invalid value for constrained field' });
    return;
  }

  // ---------------------------------------------------------------------------
  // Case 4: JWT errors (shouldn't reach here if auth middleware is correct)
  // ---------------------------------------------------------------------------
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // ---------------------------------------------------------------------------
  // Case 5: Unknown errors — log and return generic 500
  // ---------------------------------------------------------------------------
  console.error('[error] Unhandled error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  res.status(500).json({ error: 'Internal server error' });
}

// ---------------------------------------------------------------------------
// Re-export for convenience
// ---------------------------------------------------------------------------
export type { Request, Response, NextFunction };
