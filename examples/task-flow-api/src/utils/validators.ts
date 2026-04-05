/**
 * Zod Validation Schemas
 *
 * All request body validation schemas for the Task Flow API.
 * These schemas are used in route handlers to validate incoming data
 * before it reaches the service layer.
 *
 * Pattern:
 *   const result = schema.safeParse(req.body);
 *   if (!result.success) {
 *     return res.status(400).json({ error: result.error.errors[0].message });
 *   }
 *   const data = result.data;
 *
 * Each schema exports:
 * - The Zod schema object (for validation)
 * - An inferred TypeScript type (for type safety in routes)
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// Auth schemas
// ---------------------------------------------------------------------------

/**
 * Schema for POST /auth/register
 * Validates email format and minimum password length.
 */
export const registerSchema = z.object({
  email: z
    .string({ required_error: 'email is required' })
    .email('email must be a valid email address')
    .max(255, 'email must be 255 characters or fewer')
    .toLowerCase()
    .trim(),

  password: z
    .string({ required_error: 'password is required' })
    .min(8, 'password must be at least 8 characters')
    .max(128, 'password must be 128 characters or fewer'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Schema for POST /auth/login
 * Same shape as register but different semantics (no minimum password enforcement
 * on login — we just compare against the stored hash).
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: 'email is required' })
    .email('email must be a valid email address')
    .toLowerCase()
    .trim(),

  password: z
    .string({ required_error: 'password is required' })
    .min(1, 'password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ---------------------------------------------------------------------------
// List schemas
// ---------------------------------------------------------------------------

/**
 * Schema for POST /lists
 */
export const createListSchema = z.object({
  title: z
    .string({ required_error: 'title is required' })
    .min(1, 'title must not be empty')
    .max(200, 'title must be 200 characters or fewer')
    .trim(),
});

export type CreateListInput = z.infer<typeof createListSchema>;

/**
 * Schema for PUT /lists/:id
 * Same as create but explicitly named for clarity.
 */
export const updateListSchema = z.object({
  title: z
    .string({ required_error: 'title is required' })
    .min(1, 'title must not be empty')
    .max(200, 'title must be 200 characters or fewer')
    .trim(),
});

export type UpdateListInput = z.infer<typeof updateListSchema>;

// ---------------------------------------------------------------------------
// Task schemas
// ---------------------------------------------------------------------------

/**
 * Allowed task status values (mirrors DB CHECK constraint).
 */
export const taskStatusEnum = z.enum(['todo', 'in-progress', 'done'], {
  errorMap: () => ({ message: 'status must be one of: todo, in-progress, done' }),
});

/**
 * Allowed task priority values (mirrors DB CHECK constraint).
 */
export const taskPriorityEnum = z.enum(['low', 'medium', 'high'], {
  errorMap: () => ({ message: 'priority must be one of: low, medium, high' }),
});

/**
 * Schema for POST /tasks
 */
export const createTaskSchema = z.object({
  listId: z
    .string({ required_error: 'listId is required' })
    .uuid('listId must be a valid UUID'),

  title: z
    .string({ required_error: 'title is required' })
    .min(1, 'title must not be empty')
    .max(500, 'title must be 500 characters or fewer')
    .trim(),

  description: z
    .string()
    .max(2000, 'description must be 2000 characters or fewer')
    .trim()
    .optional(),

  priority: taskPriorityEnum.optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

/**
 * Schema for PUT /tasks/:id
 * All fields are optional, but at least one must be present.
 */
export const updateTaskSchema = z
  .object({
    title: z
      .string()
      .min(1, 'title must not be empty')
      .max(500, 'title must be 500 characters or fewer')
      .trim()
      .optional(),

    description: z
      .string()
      .max(2000, 'description must be 2000 characters or fewer')
      .trim()
      .optional(),

    priority: taskPriorityEnum.optional(),
  })
  .refine(
    (data) => data.title !== undefined || data.description !== undefined || data.priority !== undefined,
    { message: 'at least one of title, description, or priority must be provided' }
  );

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

/**
 * Schema for PATCH /tasks/:id/status
 */
export const updateTaskStatusSchema = z.object({
  status: taskStatusEnum,
});

export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;

// ---------------------------------------------------------------------------
// Query string schemas
// ---------------------------------------------------------------------------

/**
 * Schema for GET /tasks query parameters.
 * listId is required — tasks are always fetched scoped to a list.
 */
export const getTasksQuerySchema = z.object({
  listId: z
    .string({ required_error: 'listId query parameter is required' })
    .uuid('listId must be a valid UUID'),

  // Optional filters
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
});

export type GetTasksQuery = z.infer<typeof getTasksQuerySchema>;

// ---------------------------------------------------------------------------
// Path parameter schemas
// ---------------------------------------------------------------------------

/**
 * Schema for :id path parameters.
 * Used to validate route params before service calls.
 */
export const idParamSchema = z.object({
  id: z.string().uuid('id must be a valid UUID'),
});

export type IdParam = z.infer<typeof idParamSchema>;

// ---------------------------------------------------------------------------
// Helper: extract first Zod error message
// ---------------------------------------------------------------------------

/**
 * Extracts a human-readable error message from a Zod validation failure.
 *
 * @param error - The Zod error object from `schema.safeParse()`
 * @returns First error message string
 */
export function getFirstZodError(error: z.ZodError): string {
  const firstIssue = error.errors[0];
  if (!firstIssue) return 'Validation failed';

  // Include field path if present: "email: must be a valid email"
  if (firstIssue.path.length > 0) {
    return `${firstIssue.path.join('.')}: ${firstIssue.message}`;
  }

  return firstIssue.message;
}
