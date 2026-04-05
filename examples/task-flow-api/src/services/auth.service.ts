/**
 * Auth Service
 *
 * Business logic for user registration and authentication.
 *
 * Responsibilities:
 * - Register a new user (hash password, insert into DB)
 * - Login an existing user (verify password, return JWT)
 * - Find user by email or ID
 *
 * This service does NOT handle HTTP concerns — those live in routes/auth.ts.
 * It throws AppError subclasses that the global error handler maps to HTTP responses.
 */

import type { DatabaseType as Database } from '../db/sqlite-compat.js';
import {
  generateId,
  hashPassword,
  comparePassword,
  signToken,
  generateTimestamp,
} from '../utils/helpers.js';
import { config } from '../config/env.js';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from '../middleware/errors.js';
import type {
  UserRow,
  CreateUserInput,
  LoginUserInput,
  AuthResult,
} from '../models/user.model.js';

// ---------------------------------------------------------------------------
// Auth Service class
// ---------------------------------------------------------------------------

/**
 * Service that handles all authentication operations.
 * Receives a Database instance via constructor injection — no global state.
 */
export class AuthService {
  private readonly db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  // -------------------------------------------------------------------------
  // register — create a new user account
  // -------------------------------------------------------------------------

  /**
   * Registers a new user with the given email and password.
   *
   * Steps:
   * 1. Check if email is already taken (409 if so)
   * 2. Hash the password with bcrypt
   * 3. Insert the user into the DB
   * 4. Sign and return a JWT
   *
   * @param input - Validated registration data (email + password)
   * @returns AuthResult with JWT token and user info
   * @throws ConflictError if email is already registered
   */
  register(input: CreateUserInput): AuthResult {
    const { email, password } = input;

    // Step 1: Check for duplicate email
    const existing = this.findByEmail(email);
    if (existing) {
      throw new ConflictError('Email is already registered');
    }

    // Step 2: Hash the password
    const passwordHash = hashPassword(password, config.bcryptRounds);

    // Step 3: Insert the new user
    const userId = generateId();
    const now = generateTimestamp();

    const insertStmt = this.db.prepare<[string, string, string, number]>(`
      INSERT INTO users (id, email, password_hash, created_at)
      VALUES (?, ?, ?, ?)
    `);

    insertStmt.run(userId, email, passwordHash, now);

    // Step 4: Sign and return a JWT
    const token = signToken(userId, config.jwtSecret, config.jwtExpiresIn);

    return {
      token,
      userId,
      email,
    };
  }

  // -------------------------------------------------------------------------
  // login — authenticate an existing user
  // -------------------------------------------------------------------------

  /**
   * Authenticates a user with email and password.
   *
   * Steps:
   * 1. Find user by email (401 if not found — don't leak existence info)
   * 2. Compare password against stored bcrypt hash (401 if wrong)
   * 3. Sign and return a JWT
   *
   * @param input - Validated login data (email + password)
   * @returns AuthResult with JWT token and user info
   * @throws UnauthorizedError if credentials are invalid
   */
  login(input: LoginUserInput): AuthResult {
    const { email, password } = input;

    // Step 1: Find user by email
    const user = this.findByEmail(email);

    if (!user) {
      // Don't reveal whether the email exists — generic "invalid credentials"
      throw new UnauthorizedError('Invalid email or password');
    }

    // Step 2: Verify password
    const passwordValid = comparePassword(password, user.password_hash);
    if (!passwordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Step 3: Sign and return a JWT
    const token = signToken(user.id, config.jwtSecret, config.jwtExpiresIn);

    return {
      token,
      userId: user.id,
      email: user.email,
    };
  }

  // -------------------------------------------------------------------------
  // findByEmail — lookup a user by email address
  // -------------------------------------------------------------------------

  /**
   * Looks up a user by email address.
   *
   * @param email - The email address to search for (case-insensitive)
   * @returns The UserRow if found, or undefined if not found
   */
  findByEmail(email: string): UserRow | undefined {
    const stmt = this.db.prepare<[string], UserRow>(`
      SELECT id, email, password_hash, created_at
      FROM users
      WHERE email = ?
    `);

    return stmt.get(email.toLowerCase()) ?? undefined;
  }

  // -------------------------------------------------------------------------
  // findById — lookup a user by ID
  // -------------------------------------------------------------------------

  /**
   * Looks up a user by their UUID.
   *
   * @param userId - The user's UUID
   * @returns The UserRow if found
   * @throws NotFoundError if no user with that ID exists
   */
  findById(userId: string): UserRow {
    const stmt = this.db.prepare<[string], UserRow>(`
      SELECT id, email, password_hash, created_at
      FROM users
      WHERE id = ?
    `);

    const user = stmt.get(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  // -------------------------------------------------------------------------
  // userExists — check if a user ID exists (lightweight check)
  // -------------------------------------------------------------------------

  /**
   * Checks whether a user with the given ID exists.
   * More efficient than findById when you don't need the full row.
   *
   * @param userId - The user's UUID
   * @returns true if the user exists
   */
  userExists(userId: string): boolean {
    const stmt = this.db.prepare<[string], { count: number }>(`
      SELECT COUNT(*) as count FROM users WHERE id = ?
    `);

    const result = stmt.get(userId);
    return (result?.count ?? 0) > 0;
  }

  // -------------------------------------------------------------------------
  // listUsers — admin utility (not exposed via API in this version)
  // -------------------------------------------------------------------------

  /**
   * Returns all registered users (without password hashes).
   * Not exposed as an API endpoint — for internal/admin use only.
   *
   * @returns Array of user rows (no password_hash)
   */
  listUsers(): Omit<UserRow, 'password_hash'>[] {
    const stmt = this.db.prepare<[], Omit<UserRow, 'password_hash'>>(`
      SELECT id, email, created_at FROM users ORDER BY created_at DESC
    `);

    return stmt.all();
  }
}
