/**
 * Lists Integration Tests
 *
 * Tests for GET/POST/PUT/DELETE /lists.
 *
 * 6 tests:
 *   1. GET /lists with no auth → 401
 *   2. POST /lists creates list → 201 with id
 *   3. GET /lists returns own lists → 200 array
 *   4. PUT /lists/:id updates title → 200 with new title
 *   5. GET /lists — user B cannot see user A's lists → 200 empty
 *   6. DELETE /lists/:id → 204, then GET returns empty
 */

import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import type { Application } from 'express';
import { createTestApp, registerUser, authHeader, createList } from './helpers.js';

// ---------------------------------------------------------------------------
// Test setup
// ---------------------------------------------------------------------------

describe('Lists API', () => {
  let app: Application;

  // Token for user A (primary test user)
  let tokenA: string;

  beforeEach(async () => {
    // Fresh DB for each test
    ({ app } = createTestApp());

    // Register user A
    tokenA = await registerUser(app, 'alice@lists.test', 'password123');
  });

  // -------------------------------------------------------------------------
  // Authorization check
  // -------------------------------------------------------------------------

  it('returns 401 when accessing GET /lists without authentication', async () => {
    // Act — no Authorization header
    const res = await request(app).get('/lists');

    // Assert — unauthorized
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  // -------------------------------------------------------------------------
  // POST /lists — create
  // -------------------------------------------------------------------------

  it('creates a new list and returns 201 with id and title', async () => {
    // Act
    const res = await request(app)
      .post('/lists')
      .set(authHeader(tokenA))
      .send({ title: 'My Project Tasks' });

    // Assert
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title', 'My Project Tasks');
    expect(res.body).toHaveProperty('createdAt');

    // id should be a UUID
    expect(res.body.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );

    // createdAt should be a number (Unix ms)
    expect(typeof res.body.createdAt).toBe('number');
  });

  // -------------------------------------------------------------------------
  // GET /lists — read own lists
  // -------------------------------------------------------------------------

  it('returns all lists for the authenticated user with task counts', async () => {
    // Arrange — create two lists
    await createList(app, tokenA, 'Shopping List');
    await createList(app, tokenA, 'Work Tasks');

    // Act
    const res = await request(app)
      .get('/lists')
      .set(authHeader(tokenA));

    // Assert
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);

    // Each list should have the expected shape
    for (const list of res.body) {
      expect(list).toHaveProperty('id');
      expect(list).toHaveProperty('title');
      expect(list).toHaveProperty('taskCount');
      expect(list).toHaveProperty('createdAt');
      expect(typeof list.taskCount).toBe('number');
    }

    // Should contain both list titles (order may vary)
    const titles = res.body.map((l: { title: string }) => l.title);
    expect(titles).toContain('Shopping List');
    expect(titles).toContain('Work Tasks');
  });

  // -------------------------------------------------------------------------
  // PUT /lists/:id — update
  // -------------------------------------------------------------------------

  it('updates a list title and returns 200 with the new title', async () => {
    // Arrange — create a list first
    const { id } = await createList(app, tokenA, 'Original Title');

    // Act — update the title
    const res = await request(app)
      .put(`/lists/${id}`)
      .set(authHeader(tokenA))
      .send({ title: 'Updated Title' });

    // Assert
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', id);
    expect(res.body).toHaveProperty('title', 'Updated Title');
    expect(res.body).toHaveProperty('updatedAt');
    expect(typeof res.body.updatedAt).toBe('number');
  });

  // -------------------------------------------------------------------------
  // Cross-user isolation
  // -------------------------------------------------------------------------

  it("does not expose user A's lists to user B", async () => {
    // Arrange — user A has a list
    await createList(app, tokenA, 'Secret List');

    // Register user B
    const tokenB = await registerUser(app, 'bob@lists.test', 'password456');

    // Act — user B fetches their lists
    const res = await request(app)
      .get('/lists')
      .set(authHeader(tokenB));

    // Assert — user B sees only their own lists (none)
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  // -------------------------------------------------------------------------
  // DELETE /lists/:id — delete
  // -------------------------------------------------------------------------

  it('deletes a list and subsequent GET returns empty array', async () => {
    // Arrange — create a list
    const { id } = await createList(app, tokenA, 'Temporary List');

    // Act — delete the list
    const deleteRes = await request(app)
      .delete(`/lists/${id}`)
      .set(authHeader(tokenA));

    // Assert — 204 No Content
    expect(deleteRes.status).toBe(204);

    // Verify the list is gone
    const getRes = await request(app)
      .get('/lists')
      .set(authHeader(tokenA));

    expect(getRes.status).toBe(200);
    expect(getRes.body.length).toBe(0);
  });
});
