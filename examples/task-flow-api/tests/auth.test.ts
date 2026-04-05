/**
 * Auth Integration Tests
 *
 * Tests for POST /auth/register and POST /auth/login.
 *
 * 5 tests:
 *   1. Register new user → 201 with token
 *   2. Register duplicate email → 409
 *   3. Login valid credentials → 200 with token
 *   4. Login wrong password → 401
 *   5. Login unknown email → 401
 */

import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import type { Application } from 'express';
import { createTestApp } from './helpers.js';

// ---------------------------------------------------------------------------
// Test setup
// ---------------------------------------------------------------------------

describe('Auth API', () => {
  let app: Application;

  beforeEach(() => {
    // Fresh in-memory database for each test — full isolation
    ({ app } = createTestApp());
  });

  // -------------------------------------------------------------------------
  // POST /auth/register
  // -------------------------------------------------------------------------

  describe('POST /auth/register', () => {
    it('registers a new user and returns a JWT token', async () => {
      // Arrange
      const payload = {
        email: 'alice@example.com',
        password: 'securepassword123',
      };

      // Act
      const res = await request(app)
        .post('/auth/register')
        .send(payload);

      // Assert — 201 with token and userId
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('userId');
      expect(res.body).toHaveProperty('email', 'alice@example.com');

      // Token should be a non-empty string (JWT format: 3 parts separated by dots)
      expect(typeof res.body.token).toBe('string');
      expect(res.body.token.split('.').length).toBe(3);

      // userId should be a UUID
      expect(res.body.userId).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it('returns 409 Conflict when registering with a duplicate email', async () => {
      // Arrange — register once successfully
      const payload = {
        email: 'bob@example.com',
        password: 'firstpassword123',
      };

      await request(app).post('/auth/register').send(payload);

      // Act — attempt to register again with the same email
      const res = await request(app)
        .post('/auth/register')
        .send({
          email: 'bob@example.com',
          password: 'differentpassword456',
        });

      // Assert — 409 Conflict with an error message
      expect(res.status).toBe(409);
      expect(res.body).toHaveProperty('error');
      expect(typeof res.body.error).toBe('string');
    });
  });

  // -------------------------------------------------------------------------
  // POST /auth/login
  // -------------------------------------------------------------------------

  describe('POST /auth/login', () => {
    // Register a user before each login test
    const testEmail = 'charlie@example.com';
    const testPassword = 'mypassword123';

    beforeEach(async () => {
      await request(app)
        .post('/auth/register')
        .send({ email: testEmail, password: testPassword });
    });

    it('returns 200 with a JWT token when credentials are valid', async () => {
      // Act
      const res = await request(app)
        .post('/auth/login')
        .send({ email: testEmail, password: testPassword });

      // Assert
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('userId');
      expect(res.body).toHaveProperty('email', testEmail);

      // Token should be a valid JWT
      expect(typeof res.body.token).toBe('string');
      expect(res.body.token.split('.').length).toBe(3);
    });

    it('returns 401 when the password is incorrect', async () => {
      // Act — use the wrong password
      const res = await request(app)
        .post('/auth/login')
        .send({ email: testEmail, password: 'wrongpassword' });

      // Assert — 401 with error message
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
      expect(typeof res.body.error).toBe('string');
    });

    it('returns 401 when the email does not exist', async () => {
      // Act — use an email that was never registered
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'nobody@example.com',
          password: 'somepassword123',
        });

      // Assert — 401 (same as wrong password — don't leak existence info)
      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('error');
    });
  });
});
