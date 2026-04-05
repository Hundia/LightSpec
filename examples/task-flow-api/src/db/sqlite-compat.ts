/**
 * SQLite Compatibility Shim
 *
 * This module wraps `node-sqlite3-wasm` (a pure WASM build of SQLite that
 * requires no native compilation) with an API that is compatible with
 * `better-sqlite3`. This allows the rest of the codebase to use familiar
 * better-sqlite3 patterns (prepare/run/get/all, db.transaction, db.pragma)
 * without depending on native bindings that may not compile in all environments.
 *
 * API compatibility surface:
 *   - db.prepare(sql)             → returns a Statement-like object
 *   - stmt.run(...params)         → executes INSERT/UPDATE/DELETE
 *   - stmt.get(...params)         → returns one row or undefined
 *   - stmt.all(...params)         → returns all rows
 *   - db.transaction(fn)          → returns a wrapped transaction function
 *   - db.pragma(pragmaStr)        → executes PRAGMA statement
 *   - db.prepare(sql).run()       → chainable (same as better-sqlite3)
 *
 * Usage:
 *   import Database, { type Database as DatabaseType } from './sqlite-compat.js';
 *   const db = new Database(':memory:');
 *
 * Why this approach:
 *   better-sqlite3 requires native C++ compilation with a gcc that supports
 *   C++20. In some Linux environments (Ubuntu 20.04, gcc 9.4), this compilation
 *   fails. node-sqlite3-wasm is a WASM port that works in any Node.js >= 14.
 */

// ---------------------------------------------------------------------------
// Import node-sqlite3-wasm
// ---------------------------------------------------------------------------

// node-sqlite3-wasm is a CommonJS module; we import it via createRequire
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Database: WasmDatabase } = require('node-sqlite3-wasm') as {
  Database: new (path: string) => WasmDb
};

// ---------------------------------------------------------------------------
// Internal types for the WASM layer
// ---------------------------------------------------------------------------

/**
 * Raw interface for node-sqlite3-wasm Database instance.
 * Only the methods we use are listed here.
 */
interface WasmDb {
  run(sql: string, params?: unknown[]): void;
  get(sql: string, params?: unknown[]): Record<string, unknown> | undefined;
  all(sql: string, params?: unknown[]): Record<string, unknown>[];
  prepare(sql: string): WasmStmt;
  exec(sql: string): void;
  close(): void;
  inTransaction: boolean;
}

/**
 * Raw interface for node-sqlite3-wasm Statement.
 * Params are passed as arrays.
 */
interface WasmStmt {
  run(params?: unknown[]): void;
  get(params?: unknown[]): Record<string, unknown> | undefined;
  all(params?: unknown[]): Record<string, unknown>[];
  finalize(): void;
}

// ---------------------------------------------------------------------------
// Statement wrapper — converts better-sqlite3 spread args to WASM array args
// ---------------------------------------------------------------------------

/**
 * Wraps a node-sqlite3-wasm statement to match the better-sqlite3 API.
 *
 * Key difference:
 *   better-sqlite3: stmt.run(val1, val2, val3)  — spread
 *   node-sqlite3-wasm: stmt.run([val1, val2, val3]) — array
 *
 * This wrapper converts spread to array transparently.
 */
class Statement<_BindParams extends unknown[] = unknown[], _Result = Record<string, unknown>> {
  private readonly wasmStmt: WasmStmt;
  private readonly sql: string;

  constructor(wasmStmt: WasmStmt, sql: string) {
    this.wasmStmt = wasmStmt;
    this.sql = sql;
  }

  /**
   * Returns the SQL string for this statement.
   * (better-sqlite3 exposes this as stmt.source)
   */
  get source(): string {
    return this.sql;
  }

  /**
   * Executes a write statement (INSERT, UPDATE, DELETE).
   * Accepts params as spread (better-sqlite3 style).
   *
   * @param params - Bound values as spread arguments or a single array
   * @returns this (for chaining)
   */
  run(...params: unknown[]): this {
    // If called with a single array argument, pass it directly; otherwise wrap
    const bindParams = params.length === 1 && Array.isArray(params[0])
      ? params[0] as unknown[]
      : params;
    this.wasmStmt.run(bindParams.length > 0 ? bindParams : undefined);
    return this;
  }

  /**
   * Returns the first row matching the query, or undefined if no rows.
   * Accepts params as spread (better-sqlite3 style).
   *
   * @param params - Bound values as spread arguments
   * @returns The first row as a typed object, or undefined
   */
  get(...params: unknown[]): _Result | undefined {
    const bindParams = params.length === 1 && Array.isArray(params[0])
      ? params[0] as unknown[]
      : params;
    const row = this.wasmStmt.get(bindParams.length > 0 ? bindParams : undefined);
    return row as _Result | undefined;
  }

  /**
   * Returns all rows matching the query.
   * Accepts params as spread (better-sqlite3 style).
   *
   * @param params - Bound values as spread arguments
   * @returns Array of typed row objects
   */
  all(...params: unknown[]): _Result[] {
    const bindParams = params.length === 1 && Array.isArray(params[0])
      ? params[0] as unknown[]
      : params;
    const rows = this.wasmStmt.all(bindParams.length > 0 ? bindParams : undefined);
    return rows as _Result[];
  }

  /**
   * Finalizes the statement, freeing memory.
   * Equivalent to better-sqlite3's stmt.finalize() / automatic GC.
   */
  finalize(): void {
    this.wasmStmt.finalize();
  }
}

// ---------------------------------------------------------------------------
// Database class — wraps WasmDb with better-sqlite3 compatible API
// ---------------------------------------------------------------------------

/**
 * Drop-in replacement for better-sqlite3's Database class.
 *
 * Supports:
 *   - db.prepare(sql)           → Statement with .run/.get/.all
 *   - db.pragma('foreign_keys = ON')
 *   - db.transaction(fn)        → fn wrapped in BEGIN/COMMIT/ROLLBACK
 *   - db.close()
 */
export class Database {
  /** The underlying node-sqlite3-wasm database instance */
  private readonly wasmDb: WasmDb;

  /** Whether the database is currently open */
  private _open: boolean = true;

  /**
   * Opens a SQLite database.
   *
   * @param path - File path for a persistent DB, or ':memory:' for in-memory.
   *               In-memory databases are destroyed when closed.
   */
  constructor(path: string = ':memory:') {
    this.wasmDb = new WasmDatabase(path);
  }

  /**
   * Whether the database connection is open.
   */
  get open(): boolean {
    return this._open;
  }

  /**
   * Prepares a SQL statement for repeated execution.
   * Returns a Statement wrapper with better-sqlite3 compatible API.
   *
   * @param sql - The SQL query to prepare
   * @returns Statement object with .run(), .get(), .all() methods
   */
  prepare<_BindParams extends unknown[] = unknown[], _Result = Record<string, unknown>>(
    sql: string
  ): Statement<_BindParams, _Result> {
    const wasmStmt = this.wasmDb.prepare(sql);
    return new Statement<_BindParams, _Result>(wasmStmt, sql);
  }

  /**
   * Executes a PRAGMA statement.
   * Accepts better-sqlite3's pragma string format.
   *
   * Examples:
   *   db.pragma('foreign_keys = ON')
   *   db.pragma('journal_mode = WAL')
   *   db.pragma('busy_timeout = 5000')
   *
   * @param pragmaStr - The pragma expression (without the PRAGMA keyword)
   */
  pragma(pragmaStr: string): void {
    this.wasmDb.run(`PRAGMA ${pragmaStr}`);
  }

  /**
   * Wraps a function in a SQLite transaction.
   * Returns a new function that, when called, executes the original function
   * inside a BEGIN/COMMIT block. On error, issues ROLLBACK.
   *
   * This mirrors better-sqlite3's db.transaction() API:
   *   const txn = db.transaction((items) => { ... });
   *   txn(myItems); // runs in a transaction
   *
   * @param fn - The function to wrap in a transaction
   * @returns A new function with the same signature as fn
   */
  transaction<Args extends unknown[], Return>(
    fn: (...args: Args) => Return
  ): (...args: Args) => Return {
    const wasmDb = this.wasmDb;

    return function transactionWrapper(...args: Args): Return {
      wasmDb.run('BEGIN');
      try {
        const result = fn(...args);
        wasmDb.run('COMMIT');
        return result;
      } catch (err) {
        wasmDb.run('ROLLBACK');
        throw err;
      }
    };
  }

  /**
   * Executes a SQL string directly (no parameter binding).
   * Useful for DDL statements like CREATE TABLE.
   *
   * @param sql - Raw SQL to execute
   */
  exec(sql: string): void {
    this.wasmDb.exec(sql);
  }

  /**
   * Closes the database connection and frees resources.
   */
  close(): void {
    this._open = false;
    this.wasmDb.close();
  }
}

// ---------------------------------------------------------------------------
// Default export (matches better-sqlite3's default export pattern)
// ---------------------------------------------------------------------------

export default Database;

// ---------------------------------------------------------------------------
// Re-export Database type for type-only imports
// ---------------------------------------------------------------------------
export type { Database as DatabaseType };
