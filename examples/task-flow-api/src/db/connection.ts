/**
 * Database Connection Module
 *
 * Provides the better-sqlite3 database connection and table initialization.
 *
 * Design decisions:
 * - Synchronous API: better-sqlite3 is fully synchronous, so no async/await.
 * - Factory function: createDb(path) lets tests use ':memory:' for isolation.
 * - Foreign keys: PRAGMA foreign_keys = ON is set immediately after opening.
 * - WAL mode: enabled for better concurrent read performance in file-based mode.
 *
 * Usage:
 *   // Production / dev (file-based):
 *   const db = createDb('./taskflow.db');
 *
 *   // Tests (in-memory, fresh each time):
 *   const db = createDb(':memory:');
 *   createTables(db);
 */

import Database from './sqlite-compat.js';
import type { DatabaseType } from './sqlite-compat.js';
import { ALL_DDL_STATEMENTS } from './schema.js';

// ---------------------------------------------------------------------------
// Re-export Database type for consumers
// ---------------------------------------------------------------------------

export type { DatabaseType as Database };
export { Database };

// ---------------------------------------------------------------------------
// createDb — open (or create) a SQLite database at the given path
// ---------------------------------------------------------------------------

/**
 * Opens a SQLite database connection.
 *
 * @param path - File path for a persistent DB, or ':memory:' for an in-memory DB.
 *               Defaults to ':memory:' to be safe when called without arguments.
 * @returns A better-sqlite3 Database instance ready for use.
 */
export function createDb(path: string = ':memory:'): DatabaseType {
  const db = new Database(path);

  // Enable foreign key enforcement — SQLite disables this by default
  db.pragma('foreign_keys = ON');

  // Enable WAL (Write-Ahead Log) for better concurrency in file-based mode.
  // In-memory mode doesn't benefit, but it's harmless to set.
  db.pragma('journal_mode = WAL');

  // Busy timeout: wait up to 5 seconds if the DB is locked before throwing.
  // Useful for multi-process access to a file-based database.
  db.pragma('busy_timeout = 5000');

  return db;
}

// ---------------------------------------------------------------------------
// createTables — run all DDL statements to initialize the schema
// ---------------------------------------------------------------------------

/**
 * Creates all database tables and indexes using IF NOT EXISTS.
 * Safe to call on an already-initialized database — it won't drop data.
 *
 * @param db - An open better-sqlite3 Database instance.
 */
export function createTables(db: DatabaseType): void {
  // Run all DDL in a transaction for atomicity.
  // If any statement fails, the transaction is rolled back.
  const initTransaction = db.transaction(() => {
    for (const statement of ALL_DDL_STATEMENTS) {
      db.prepare(statement).run();
    }
  });

  initTransaction();
}

// ---------------------------------------------------------------------------
// dropTables — used in test teardown to reset state between test runs
// ---------------------------------------------------------------------------

/**
 * Drops all application tables in reverse dependency order.
 * Used in test helpers to reset database state between test suites.
 *
 * WARNING: This permanently destroys all data in the affected tables.
 *
 * @param db - An open better-sqlite3 Database instance.
 */
export function dropTables(db: DatabaseType): void {
  const dropTransaction = db.transaction(() => {
    // Drop in reverse FK order: tasks → lists → users
    db.prepare('DROP TABLE IF EXISTS tasks').run();
    db.prepare('DROP TABLE IF EXISTS lists').run();
    db.prepare('DROP TABLE IF EXISTS users').run();
  });

  dropTransaction();
}

// ---------------------------------------------------------------------------
// resetTables — drop + recreate all tables (convenience for tests)
// ---------------------------------------------------------------------------

/**
 * Drops and recreates all tables. Provides a clean slate between tests.
 *
 * @param db - An open better-sqlite3 Database instance.
 */
export function resetTables(db: DatabaseType): void {
  dropTables(db);
  createTables(db);
}

// ---------------------------------------------------------------------------
// getTableStats — diagnostic helper for debugging
// ---------------------------------------------------------------------------

/**
 * Returns the row count for each table.
 * Useful for debugging test state or checking if seeding worked.
 *
 * @param db - An open better-sqlite3 Database instance.
 * @returns Object with counts for users, lists, and tasks.
 */
export function getTableStats(db: DatabaseType): { users: number; lists: number; tasks: number } {
  const countUsers = db.prepare<[], { count: number }>('SELECT COUNT(*) as count FROM users').get();
  const countLists = db.prepare<[], { count: number }>('SELECT COUNT(*) as count FROM lists').get();
  const countTasks = db.prepare<[], { count: number }>('SELECT COUNT(*) as count FROM tasks').get();

  return {
    users: countUsers?.count ?? 0,
    lists: countLists?.count ?? 0,
    tasks: countTasks?.count ?? 0,
  };
}
