/**
 * Express Application Factory
 *
 * Creates and configures the Express application.
 * Exported as a factory function (createApp) so it can be instantiated
 * with different database instances for tests vs production.
 *
 * This module does NOT start the HTTP server — that's index.ts.
 * This separation allows tests to use supertest without binding a port.
 *
 * Usage:
 *   // Production (index.ts):
 *   const db = createDb(config.dbPath);
 *   createTables(db);
 *   const app = createApp(db);
 *   app.listen(config.port);
 *
 *   // Tests (tests/helpers.ts):
 *   const db = new Database(':memory:');
 *   createTables(db);
 *   const app = createApp(db);
 *   const request = supertest(app);
 *
 * Middleware stack (in order):
 *   1. express.json()       — parse JSON request bodies
 *   2. requestLogger        — log incoming requests (dev only)
 *   3. securityHeaders      — add basic security headers
 *   4. Routes               — auth, lists, tasks (auth required on lists/tasks)
 *   5. notFoundHandler      — 404 for unmatched routes
 *   6. errorHandler         — global error handler (must be last)
 */

import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import type { DatabaseType as Database } from './db/sqlite-compat.js';
import { createAuthRouter } from './routes/auth.js';
import { createListsRouter } from './routes/lists.js';
import { createTasksRouter } from './routes/tasks.js';
import { authMiddleware } from './middleware/auth.js';
import { errorHandler, notFoundHandler } from './middleware/errors.js';
import { config } from './config/env.js';

// ---------------------------------------------------------------------------
// App factory
// ---------------------------------------------------------------------------

/**
 * Creates a fully configured Express application.
 *
 * @param db - A better-sqlite3 Database instance with tables already created.
 * @returns Configured Express Application ready to listen or use with supertest.
 */
export function createApp(db: Database): Application {
  const app = express();

  // -------------------------------------------------------------------------
  // Global middleware
  // -------------------------------------------------------------------------

  // Parse JSON request bodies — sets req.body
  app.use(express.json());

  // Parse URL-encoded bodies (for form submissions, though API uses JSON)
  app.use(express.urlencoded({ extended: true }));

  // Basic security headers
  app.use(securityHeadersMiddleware);

  // Request logger (skip in test mode to reduce noise)
  if (!config.isTest) {
    app.use(requestLoggerMiddleware);
  }

  // -------------------------------------------------------------------------
  // Health check (no auth required)
  // -------------------------------------------------------------------------

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: config.nodeEnv,
    });
  });

  // -------------------------------------------------------------------------
  // API routes
  // -------------------------------------------------------------------------

  // Auth routes — public (no JWT required)
  app.use('/auth', createAuthRouter(db));

  // Lists routes — protected (JWT required)
  app.use('/lists', authMiddleware, createListsRouter(db));

  // Tasks routes — protected (JWT required)
  app.use('/tasks', authMiddleware, createTasksRouter(db));

  // -------------------------------------------------------------------------
  // Error handling (must be AFTER all routes)
  // -------------------------------------------------------------------------

  // 404 handler — catches any unmatched routes
  app.use(notFoundHandler);

  // Global error handler — catches errors passed to next(err)
  app.use(errorHandler);

  return app;
}

// ---------------------------------------------------------------------------
// Security headers middleware
// ---------------------------------------------------------------------------

/**
 * Adds basic security headers to all responses.
 * Not a replacement for a full helmet.js setup, but provides basic protection.
 */
function securityHeadersMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  // Prevent browsers from MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Deny framing (clickjacking protection)
  res.setHeader('X-Frame-Options', 'DENY');

  // Disable referrer in cross-origin requests
  res.setHeader('Referrer-Policy', 'no-referrer');

  // Don't send server version
  res.removeHeader('X-Powered-By');

  next();
}

// ---------------------------------------------------------------------------
// Request logger middleware
// ---------------------------------------------------------------------------

/**
 * Logs each incoming request with method, URL, and response status.
 * Only active in development mode (skipped in test and production).
 *
 * Output example:
 *   [2024-01-15T10:30:00.000Z] POST /auth/login → 200 (45ms)
 */
function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();
  const { method, url } = req;

  // Log after response is sent using the 'finish' event
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    const status = res.statusCode;

    // Color-code status in dev
    const statusStr = status >= 400 ? `\x1b[31m${status}\x1b[0m` : `\x1b[32m${status}\x1b[0m`;
    console.log(`[${timestamp}] ${method} ${url} → ${statusStr} (${duration}ms)`);
  });

  next();
}
