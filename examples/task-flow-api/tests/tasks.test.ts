/**
 * Tasks Integration Tests
 *
 * Tests for GET/POST/PUT/PATCH/DELETE /tasks.
 *
 * 6 tests:
 *   1. POST /tasks creates a task in a list → 201
 *   2. GET /tasks?listId=X returns tasks for the list → 200
 *   3. PATCH /tasks/:id/status transitions todo → in-progress → 200
 *   4. PATCH /tasks/:id/status transitions in-progress → done → 200
 *   5. PUT /tasks/:id updates title + priority → 200
 *   6. DELETE /tasks/:id → 204
 */

import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import type { Application } from 'express';
import {
  createTestApp,
  registerUser,
  authHeader,
  createList,
  createTask,
} from './helpers.js';

// ---------------------------------------------------------------------------
// Test setup
// ---------------------------------------------------------------------------

describe('Tasks API', () => {
  let app: Application;
  let token: string;
  let listId: string;

  beforeEach(async () => {
    // Fresh DB + app for each test
    ({ app } = createTestApp());

    // Register a user and create a list to work with
    token = await registerUser(app, 'taskuser@example.com', 'password123');
    const list = await createList(app, token, 'My Task List');
    listId = list.id;
  });

  // -------------------------------------------------------------------------
  // POST /tasks — create
  // -------------------------------------------------------------------------

  it('creates a new task in a list and returns 201 with task details', async () => {
    // Act
    const res = await request(app)
      .post('/tasks')
      .set(authHeader(token))
      .send({
        listId,
        title: 'Write unit tests',
        description: 'Cover all edge cases',
        priority: 'high',
      });

    // Assert
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('listId', listId);
    expect(res.body).toHaveProperty('title', 'Write unit tests');
    expect(res.body).toHaveProperty('status', 'todo');        // Default status
    expect(res.body).toHaveProperty('priority', 'high');
    expect(res.body).toHaveProperty('createdAt');
    expect(typeof res.body.createdAt).toBe('number');

    // ID should be a UUID
    expect(res.body.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  // -------------------------------------------------------------------------
  // GET /tasks?listId=<id>
  // -------------------------------------------------------------------------

  it('returns all tasks for a list via GET /tasks?listId', async () => {
    // Arrange — create multiple tasks
    await createTask(app, token, listId, 'Task One');
    await createTask(app, token, listId, 'Task Two', { priority: 'low' });
    await createTask(app, token, listId, 'Task Three', { priority: 'high' });

    // Act
    const res = await request(app)
      .get(`/tasks?listId=${listId}`)
      .set(authHeader(token));

    // Assert
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(3);

    // Each task should have the expected shape
    for (const task of res.body) {
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('listId', listId);
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('status');
      expect(task).toHaveProperty('priority');
      expect(task).toHaveProperty('createdAt');
      expect(task).toHaveProperty('updatedAt');
    }

    const titles = res.body.map((t: { title: string }) => t.title);
    expect(titles).toContain('Task One');
    expect(titles).toContain('Task Two');
    expect(titles).toContain('Task Three');
  });

  // -------------------------------------------------------------------------
  // PATCH /tasks/:id/status — status transitions
  // -------------------------------------------------------------------------

  it('transitions task status from todo to in-progress', async () => {
    // Arrange
    const task = await createTask(app, token, listId, 'Fix the bug');
    expect(task.status).toBe('todo');

    // Act
    const res = await request(app)
      .patch(`/tasks/${task.id}/status`)
      .set(authHeader(token))
      .send({ status: 'in-progress' });

    // Assert
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', task.id);
    expect(res.body).toHaveProperty('status', 'in-progress');
    expect(res.body).toHaveProperty('updatedAt');
    expect(typeof res.body.updatedAt).toBe('number');
  });

  it('transitions task status from in-progress to done', async () => {
    // Arrange — create a task and move it to in-progress first
    const task = await createTask(app, token, listId, 'Deploy to production');

    await request(app)
      .patch(`/tasks/${task.id}/status`)
      .set(authHeader(token))
      .send({ status: 'in-progress' });

    // Act — move to done
    const res = await request(app)
      .patch(`/tasks/${task.id}/status`)
      .set(authHeader(token))
      .send({ status: 'done' });

    // Assert
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', task.id);
    expect(res.body).toHaveProperty('status', 'done');
  });

  // -------------------------------------------------------------------------
  // PUT /tasks/:id — update details
  // -------------------------------------------------------------------------

  it('updates task title and priority via PUT /tasks/:id', async () => {
    // Arrange
    const task = await createTask(app, token, listId, 'Original title', {
      priority: 'low',
    });

    // Act
    const res = await request(app)
      .put(`/tasks/${task.id}`)
      .set(authHeader(token))
      .send({
        title: 'Updated title',
        priority: 'high',
      });

    // Assert
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', task.id);
    expect(res.body).toHaveProperty('title', 'Updated title');
    expect(res.body).toHaveProperty('priority', 'high');
    expect(res.body).toHaveProperty('updatedAt');

    // Status should be unchanged
    expect(res.body).toHaveProperty('status', 'todo');
  });

  // -------------------------------------------------------------------------
  // DELETE /tasks/:id
  // -------------------------------------------------------------------------

  it('deletes a task and returns 204', async () => {
    // Arrange
    const task = await createTask(app, token, listId, 'Task to delete');

    // Act
    const deleteRes = await request(app)
      .delete(`/tasks/${task.id}`)
      .set(authHeader(token));

    // Assert — 204 No Content
    expect(deleteRes.status).toBe(204);

    // Verify the task is gone — GET tasks list should be empty
    const getRes = await request(app)
      .get(`/tasks?listId=${listId}`)
      .set(authHeader(token));

    expect(getRes.status).toBe(200);
    const ids = getRes.body.map((t: { id: string }) => t.id);
    expect(ids).not.toContain(task.id);
  });
});
