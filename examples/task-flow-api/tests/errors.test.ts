/**
 * Error Handling Integration Tests
 *
 * Tests for error responses and edge cases.
 *
 * 3 tests:
 *   1. GET /nonexistent → 404 with { error: 'Not found' }
 *   2. POST /lists with no auth → 401 with { error: 'Unauthorized' }
 *   3. POST /auth/register with missing email → 400 with { error } containing 'email'
 */

import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import type { Application } from 'express';
import { createTestApp } from './helpers.js';

// ---------------------------------------------------------------------------
// Test setup
// ---------------------------------------------------------------------------

describe('Error Handling', () => {
  let app: Application;

  beforeEach(() => {
    ({ app } = createTestApp());
  });

  // -------------------------------------------------------------------------
  // 404 — Route not found
  // -------------------------------------------------------------------------

  it('returns 404 with { error: "Not found" } for unmatched routes', async () => {
    // Act — hit a route that doesn't exist
    const res = await request(app).get('/nonexistent');

    // Assert
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error', 'Not found');
  });

  // -------------------------------------------------------------------------
  // 401 — Missing authentication
  // -------------------------------------------------------------------------

  it('returns 401 with { error: "Unauthorized" } when accessing protected route without auth', async () => {
    // Act — POST /lists without an Authorization header
    const res = await request(app)
      .post('/lists')
      .send({ title: 'Test List' });
      // Note: no .set(authHeader(...))

    // Assert
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Unauthorized');
  });

  // -------------------------------------------------------------------------
  // 400 — Validation error
  // -------------------------------------------------------------------------

  it('returns 400 with an error mentioning "email" when registering with missing email', async () => {
    // Act — POST /auth/register with no email field
    const res = await request(app)
      .post('/auth/register')
      .send({ password: 'somepassword123' });  // No email

    // Assert — 400 with error mentioning 'email'
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(typeof res.body.error).toBe('string');

    // The error message should reference 'email' in some way
    expect(res.body.error.toLowerCase()).toContain('email');
  });
});
