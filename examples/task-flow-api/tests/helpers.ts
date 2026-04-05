/**
 * Test Helpers
 *
 * Shared utilities for integration tests.
 *
 * Provides:
 * - createTestApp()  — creates a fresh in-memory DB + Express app for each test
 * - registerUser()   — helper to register a test user and return the token
 * - loginUser()      — helper to login and return a token
 * - authHeader()     — builds the Authorization header object
 *
 * Each test file should call createTestApp() in beforeEach to get a clean
 * database for every test, ensuring test isolation.
 *
 * Usage:
 *   import { createTestApp, registerUser, authHeader } from './helpers.js';
 *
 *   describe('Lists API', () => {
 *     let app: Application;
 *     let token: string;
 *
 *     beforeEach(async () => {
 *       ({ app } = createTestApp());
 *       token = await registerUser(app, 'test@example.com', 'password123');
 *     });
 *
 *     it('creates a list', async () => {
 *       const res = await request(app)
 *         .post('/lists')
 *         .set(authHeader(token))
 *         .send({ title: 'My List' });
 *       expect(res.status).toBe(201);
 *     });
 *   });
 */

import { Database } from '../src/db/sqlite-compat.js';
import request from 'supertest';
import type { Application } from 'express';
import { createApp } from '../src/app.js';
import { createTables } from '../src/db/connection.js';

// ---------------------------------------------------------------------------
// App factory for tests
// ---------------------------------------------------------------------------

/**
 * Creates a fresh Express application backed by an in-memory SQLite database.
 *
 * Call this in beforeEach() to get test isolation — each test gets a clean DB.
 *
 * @returns Object containing the Express app and the Database instance
 */
export function createTestApp(): { app: Application; db: Database } {
  // Fresh in-memory database — isolated per test
  const db = new Database(':memory:');

  // Create all tables and indexes
  createTables(db);

  // Create the Express app with the in-memory DB injected
  const app = createApp(db);

  return { app, db };
}

// ---------------------------------------------------------------------------
// User registration helper
// ---------------------------------------------------------------------------

/**
 * Registers a new user and returns the JWT token.
 * Throws if registration fails (non-201 response).
 *
 * @param app      - Express Application (from createTestApp)
 * @param email    - Email address for the new user
 * @param password - Password for the new user
 * @returns The JWT token string
 */
export async function registerUser(
  app: Application,
  email: string,
  password: string
): Promise<string> {
  const res = await request(app)
    .post('/auth/register')
    .send({ email, password });

  if (res.status !== 201) {
    throw new Error(
      `registerUser failed: expected 201, got ${res.status}. Body: ${JSON.stringify(res.body)}`
    );
  }

  const token = res.body.token as string;
  if (!token) {
    throw new Error('registerUser: no token in response body');
  }

  return token;
}

// ---------------------------------------------------------------------------
// Login helper
// ---------------------------------------------------------------------------

/**
 * Logs in with the given credentials and returns the JWT token.
 * Throws if login fails.
 *
 * @param app      - Express Application
 * @param email    - Email address
 * @param password - Password
 * @returns The JWT token string
 */
export async function loginUser(
  app: Application,
  email: string,
  password: string
): Promise<string> {
  const res = await request(app)
    .post('/auth/login')
    .send({ email, password });

  if (res.status !== 200) {
    throw new Error(
      `loginUser failed: expected 200, got ${res.status}. Body: ${JSON.stringify(res.body)}`
    );
  }

  const token = res.body.token as string;
  if (!token) {
    throw new Error('loginUser: no token in response body');
  }

  return token;
}

// ---------------------------------------------------------------------------
// Auth header builder
// ---------------------------------------------------------------------------

/**
 * Builds the Authorization header object for supertest requests.
 *
 * Usage:
 *   .set(authHeader(token))
 *
 * @param token - JWT token string
 * @returns Object suitable for supertest's .set()
 */
export function authHeader(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

// ---------------------------------------------------------------------------
// List creation helper
// ---------------------------------------------------------------------------

/**
 * Creates a list via the API and returns its ID and title.
 *
 * @param app   - Express Application
 * @param token - JWT token
 * @param title - List title
 * @returns The created list's id
 */
export async function createList(
  app: Application,
  token: string,
  title: string
): Promise<{ id: string; title: string; createdAt: number }> {
  const res = await request(app)
    .post('/lists')
    .set(authHeader(token))
    .send({ title });

  if (res.status !== 201) {
    throw new Error(
      `createList failed: expected 201, got ${res.status}. Body: ${JSON.stringify(res.body)}`
    );
  }

  return res.body as { id: string; title: string; createdAt: number };
}

// ---------------------------------------------------------------------------
// Task creation helper
// ---------------------------------------------------------------------------

/**
 * Creates a task via the API and returns the task object.
 *
 * @param app     - Express Application
 * @param token   - JWT token
 * @param listId  - ID of the parent list
 * @param title   - Task title
 * @returns The created task object
 */
export async function createTask(
  app: Application,
  token: string,
  listId: string,
  title: string,
  opts?: { description?: string; priority?: 'low' | 'medium' | 'high' }
): Promise<{ id: string; listId: string; title: string; status: string; priority: string; createdAt: number }> {
  const res = await request(app)
    .post('/tasks')
    .set(authHeader(token))
    .send({ listId, title, ...opts });

  if (res.status !== 201) {
    throw new Error(
      `createTask failed: expected 201, got ${res.status}. Body: ${JSON.stringify(res.body)}`
    );
  }

  return res.body;
}

// ---------------------------------------------------------------------------
// Test data factories
// ---------------------------------------------------------------------------

/**
 * Generates a unique test email using a timestamp suffix.
 * Useful when tests run in the same process and need different emails.
 *
 * @param prefix - Optional prefix for the email (default: 'test')
 * @returns A unique email string like 'test-1705312200000@example.com'
 */
export function uniqueEmail(prefix: string = 'test'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
}
