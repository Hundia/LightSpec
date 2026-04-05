/**
 * User Model
 *
 * TypeScript interfaces and types for the User entity.
 *
 * Design notes:
 * - UserRow represents the raw database row (snake_case columns, no password exposure)
 * - User is the application-level representation (camelCase, no password_hash)
 * - CreateUserInput is what the auth service receives after validation
 * - AuthResult is what the auth endpoints return to clients
 *
 * The password_hash is intentionally kept only in UserRow and never
 * included in the User interface to prevent accidental serialization
 * in API responses.
 */

// ---------------------------------------------------------------------------
// Raw database row type
// ---------------------------------------------------------------------------

/**
 * Represents a row returned from the `users` table.
 * Column names match the SQLite schema exactly (snake_case).
 * This type is used in repository/service queries and should NOT
 * be sent directly to API clients.
 */
export interface UserRow {
  /** UUID v4 primary key */
  id: string;

  /** Unique email address — used as the login identifier */
  email: string;

  /**
   * bcrypt hash of the user's password.
   * NEVER expose this in API responses.
   */
  password_hash: string;

  /** Unix millisecond timestamp when the account was created */
  created_at: number;
}

// ---------------------------------------------------------------------------
// Application-level User type (safe to share with routes)
// ---------------------------------------------------------------------------

/**
 * Safe user representation — no password hash included.
 * Used in JWT payloads and API response bodies.
 */
export interface User {
  /** UUID v4 primary key */
  id: string;

  /** Email address */
  email: string;

  /** ISO 8601 string or Unix ms timestamp for when the account was created */
  createdAt: number;
}

// ---------------------------------------------------------------------------
// Input types (validated request bodies)
// ---------------------------------------------------------------------------

/**
 * Data required to create a new user account.
 * Produced by Zod validation in the auth routes.
 */
export interface CreateUserInput {
  /** Valid email address */
  email: string;

  /**
   * Plain text password — will be hashed before storage.
   * Must be at least 8 characters (enforced by Zod schema).
   */
  password: string;
}

/**
 * Data required to authenticate (login).
 * Identical shape to CreateUserInput but semantically different.
 */
export interface LoginUserInput {
  email: string;
  password: string;
}

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

/**
 * Successful auth response returned to the client.
 * Returned by both /auth/register and /auth/login.
 */
export interface AuthResult {
  /** Signed JWT — include in subsequent requests as: Authorization: Bearer <token> */
  token: string;

  /** The authenticated user's ID (UUID) */
  userId: string;

  /** Email address of the authenticated user */
  email: string;
}

// ---------------------------------------------------------------------------
// JWT payload type
// ---------------------------------------------------------------------------

/**
 * The payload embedded inside the signed JWT.
 * Verified by the auth middleware on protected routes.
 */
export interface JwtPayload {
  /** The authenticated user's UUID */
  userId: string;

  /** Standard JWT claim: issued at (Unix seconds) */
  iat?: number;

  /** Standard JWT claim: expires at (Unix seconds) */
  exp?: number;
}

// ---------------------------------------------------------------------------
// Helper: map UserRow → User (strip sensitive fields, convert names)
// ---------------------------------------------------------------------------

/**
 * Converts a raw database UserRow to a safe User object.
 * Strips password_hash and converts snake_case to camelCase.
 *
 * @param row - Raw row from the users table
 * @returns Safe user object suitable for API responses
 */
export function rowToUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    createdAt: row.created_at,
  };
}
