/**
 * Utility Helpers
 *
 * Shared utility functions used across the Task Flow API.
 *
 * Functions:
 * - generateId()        — UUID v4 via Node crypto (no external package)
 * - hashPassword()      — bcrypt hash
 * - comparePassword()   — bcrypt compare
 * - signToken()         — JWT sign
 * - verifyToken()       — JWT verify
 * - generateTimestamp() — current Unix milliseconds
 * - safeJsonParse()     — parse JSON without throwing
 * - paginate()          — slice arrays for pagination
 * - isValidUUID()       — validate UUID v4 format
 */

import { createHash, randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '../models/user.model.js';

// ---------------------------------------------------------------------------
// ID generation
// ---------------------------------------------------------------------------

/**
 * Generates a new UUID v4 using Node's built-in crypto module.
 * No external uuid package required — available since Node 14.17.
 *
 * @returns A UUID v4 string, e.g. '110e8400-e29b-41d4-a716-446655440000'
 */
export function generateId(): string {
  return randomUUID();
}

// ---------------------------------------------------------------------------
// Password hashing (bcrypt)
// ---------------------------------------------------------------------------

/**
 * Hashes a plain-text password using bcrypt.
 *
 * @param password - The plain-text password to hash
 * @param rounds   - Number of salt rounds (default: 10; use 4 in tests for speed)
 * @returns The bcrypt hash string
 */
export function hashPassword(password: string, rounds: number = 10): string {
  return bcrypt.hashSync(password, rounds);
}

/**
 * Compares a plain-text password against a bcrypt hash.
 *
 * @param password - The plain-text password to verify
 * @param hash     - The stored bcrypt hash
 * @returns `true` if the password matches the hash, `false` otherwise
 */
export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

// ---------------------------------------------------------------------------
// JWT token utilities
// ---------------------------------------------------------------------------

/**
 * Signs a JWT token for the given userId.
 *
 * @param userId    - The user's UUID to embed in the token payload
 * @param secret    - The JWT signing secret (from config)
 * @param expiresIn - Token expiry string: '7d', '1h', '15m', etc.
 * @returns A signed JWT string
 */
export function signToken(
  userId: string,
  secret: string,
  expiresIn: string = '7d'
): string {
  const payload: Pick<JwtPayload, 'userId'> = { userId };
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
}

/**
 * Verifies and decodes a JWT token.
 *
 * @param token  - The JWT string to verify
 * @param secret - The JWT signing secret (must match the one used to sign)
 * @returns The decoded payload if valid
 * @throws JsonWebTokenError if the token is invalid or expired
 */
export function verifyToken(token: string, secret: string): JwtPayload {
  return jwt.verify(token, secret) as JwtPayload;
}

// ---------------------------------------------------------------------------
// Timestamp utilities
// ---------------------------------------------------------------------------

/**
 * Returns the current time as Unix milliseconds (Date.now()).
 * Used for created_at and updated_at fields in DB inserts/updates.
 *
 * @returns Current Unix timestamp in milliseconds
 */
export function generateTimestamp(): number {
  return Date.now();
}

/**
 * Converts a Unix millisecond timestamp to an ISO 8601 string.
 *
 * @param ms - Unix milliseconds
 * @returns ISO 8601 date string, e.g. '2024-01-15T10:30:00.000Z'
 */
export function timestampToIso(ms: number): string {
  return new Date(ms).toISOString();
}

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

/**
 * Validates that a string is a valid UUID v4 format.
 *
 * @param value - The string to test
 * @returns `true` if the string is a valid UUID v4
 */
export function isValidUUID(value: string): boolean {
  const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(value);
}

/**
 * Validates that an email address is in a valid format.
 * Uses a simple regex suitable for basic validation.
 * For production use, consider a more comprehensive validation library.
 *
 * @param email - The email string to validate
 * @returns `true` if the email appears valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ---------------------------------------------------------------------------
// Safe JSON utilities
// ---------------------------------------------------------------------------

/**
 * Safely parses a JSON string without throwing.
 *
 * @param input - The string to parse
 * @returns The parsed value, or `null` if parsing fails
 */
export function safeJsonParse<T = unknown>(input: string): T | null {
  try {
    return JSON.parse(input) as T;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Array / pagination helpers
// ---------------------------------------------------------------------------

/**
 * Paginates an array by returning a slice for the given page and page size.
 *
 * @param items    - The full array to paginate
 * @param page     - The 1-based page number
 * @param pageSize - Number of items per page
 * @returns A slice of the input array for the requested page
 */
export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const offset = (page - 1) * pageSize;
  return items.slice(offset, offset + pageSize);
}

/**
 * Calculates the total number of pages for a given item count and page size.
 *
 * @param totalItems - Total number of items
 * @param pageSize   - Number of items per page
 * @returns Total page count (minimum 1)
 */
export function totalPages(totalItems: number, pageSize: number): number {
  if (pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

// ---------------------------------------------------------------------------
// Object helpers
// ---------------------------------------------------------------------------

/**
 * Removes undefined and null values from an object.
 * Useful for building partial UPDATE payloads where only provided fields
 * should be included in the SQL SET clause.
 *
 * @param obj - Input object potentially containing undefined/null values
 * @returns A new object with only defined, non-null properties
 */
export function removeNullish<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  const result: Partial<T> = {};
  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (obj[key] !== undefined && obj[key] !== null) {
      result[key] = obj[key];
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Gravatar helper (for future user avatars feature)
// ---------------------------------------------------------------------------

/**
 * Generates a Gravatar URL for the given email.
 * Uses MD5 hash of the lowercased, trimmed email (Gravatar standard).
 *
 * @param email - User's email address
 * @param size  - Avatar size in pixels (default: 80)
 * @returns Gravatar URL string
 */
export function gravatarUrl(email: string, size: number = 80): string {
  const normalized = email.trim().toLowerCase();
  const hash = createHash('md5').update(normalized).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}
