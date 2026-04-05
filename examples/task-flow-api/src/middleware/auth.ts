/**
 * Authentication Middleware
 *
 * Verifies the JWT token on incoming requests and attaches the userId
 * to the request object for use in route handlers and services.
 *
 * Usage:
 *   app.use('/lists', authMiddleware, listsRouter);
 *   app.use('/tasks', authMiddleware, tasksRouter);
 *
 * Token format (Authorization header):
 *   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 * On success: sets req.userId and calls next()
 * On failure: returns 401 with { error: 'Unauthorized' }
 *
 * TypeScript augmentation:
 *   Express's Request type is extended below to include `userId: string`.
 *   Import augmentation from this file to get type safety in route handlers.
 */

import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/helpers.js';
import { config } from '../config/env.js';

// ---------------------------------------------------------------------------
// Extend Express Request to include userId
// ---------------------------------------------------------------------------

declare global {
  namespace Express {
    interface Request {
      /**
       * Set by authMiddleware after successful JWT verification.
       * Contains the authenticated user's UUID.
       */
      userId?: string;
    }
  }
}

// ---------------------------------------------------------------------------
// Auth middleware
// ---------------------------------------------------------------------------

/**
 * Express middleware that verifies a Bearer JWT token.
 *
 * Reads the Authorization header, extracts the token, verifies it
 * using the configured JWT secret, and attaches userId to the request.
 *
 * @param req  - Express Request (will have req.userId set on success)
 * @param res  - Express Response
 * @param next - Express NextFunction (called on success)
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  // ---------------------------------------------------------------------------
  // Step 1: Extract the Authorization header
  // ---------------------------------------------------------------------------
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // ---------------------------------------------------------------------------
  // Step 2: Parse the Bearer token
  // ---------------------------------------------------------------------------
  // Expected format: "Bearer <token>"
  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0]?.toLowerCase() !== 'bearer') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const token = parts[1];

  if (!token || token.trim() === '') {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // ---------------------------------------------------------------------------
  // Step 3: Verify the JWT signature and expiry
  // ---------------------------------------------------------------------------
  try {
    const payload = verifyToken(token, config.jwtSecret);

    if (!payload.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Attach userId to the request for downstream handlers
    req.userId = payload.userId;

    next();
  } catch (err) {
    // jwt.verify throws on:
    //   - Invalid signature (JsonWebTokenError)
    //   - Token expired (TokenExpiredError)
    //   - Malformed token (JsonWebTokenError)
    // All of these should result in 401
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
}

// ---------------------------------------------------------------------------
// Optional auth middleware (sets userId if present, doesn't require it)
// ---------------------------------------------------------------------------

/**
 * Like authMiddleware but doesn't fail if no token is provided.
 * Useful for endpoints that have different behavior for logged-in users.
 *
 * If a token IS present and invalid, still returns 401.
 * If no token is present, calls next() without setting userId.
 *
 * @param req  - Express Request
 * @param res  - Express Response
 * @param next - Express NextFunction
 */
export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];

  // No token present — continue without setting userId
  if (!authHeader) {
    next();
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0]?.toLowerCase() !== 'bearer') {
    // Malformed header — treat as no token
    next();
    return;
  }

  const token = parts[1];
  if (!token) {
    next();
    return;
  }

  try {
    const payload = verifyToken(token, config.jwtSecret);
    if (payload.userId) {
      req.userId = payload.userId;
    }
    next();
  } catch {
    // Invalid token — return 401 (different from missing token)
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
}

// ---------------------------------------------------------------------------
// requireAuth helper — asserts userId is set (use after authMiddleware)
// ---------------------------------------------------------------------------

/**
 * Type guard that asserts req.userId is defined.
 * Use in route handlers after authMiddleware to get a typed userId.
 *
 * @param req - Express Request (should have userId set by authMiddleware)
 * @throws Error if userId is not set (indicates middleware misconfiguration)
 * @returns The userId string
 */
export function requireAuth(req: Request): string {
  if (!req.userId) {
    throw new Error(
      'requireAuth called but req.userId is not set. ' +
      'Ensure authMiddleware is applied before this route handler.'
    );
  }
  return req.userId;
}
