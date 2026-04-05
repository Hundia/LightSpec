/**
 * Server Entry Point
 *
 * Creates the database connection, initializes the schema, builds the
 * Express app, and starts the HTTP server.
 *
 * This file is the production entry point: `node dist/index.js`
 * For development: `tsx watch src/index.ts`
 *
 * The app factory (createApp) is in app.ts, not here, so tests can
 * import createApp without starting a real server.
 */

import { createDb, createTables } from './db/connection.js';
import { createApp } from './app.js';
import { config } from './config/env.js';

// ---------------------------------------------------------------------------
// Bootstrap the server
// ---------------------------------------------------------------------------

/**
 * Starts the Task Flow API server.
 * Handles database initialization and graceful shutdown signals.
 */
async function bootstrap(): Promise<void> {
  // Step 1: Open the database connection
  const db = createDb(config.dbPath);

  // Step 2: Create tables if they don't exist
  createTables(db);

  if (!config.isTest) {
    console.log(`[db] Database initialized at: ${config.dbPath === ':memory:' ? 'in-memory' : config.dbPath}`);
  }

  // Step 3: Create the Express app with the db instance
  const app = createApp(db);

  // Step 4: Start listening
  const server = app.listen(config.port, () => {
    console.log(`[server] Task Flow API running at http://localhost:${config.port}`);
    console.log(`[server] Environment: ${config.nodeEnv}`);
    console.log(`[server] Health check: GET http://localhost:${config.port}/health`);
  });

  // -------------------------------------------------------------------------
  // Graceful shutdown handlers
  // -------------------------------------------------------------------------
  // When the process receives a termination signal (SIGTERM from Docker,
  // SIGINT from Ctrl+C), we:
  // 1. Stop accepting new connections
  // 2. Close the database connection cleanly
  // 3. Exit with code 0

  const shutdown = (signal: string): void => {
    console.log(`\n[server] Received ${signal} — shutting down gracefully`);

    server.close(() => {
      console.log('[server] HTTP server closed');

      try {
        db.close();
        console.log('[db] Database connection closed');
      } catch (err) {
        console.error('[db] Error closing database:', err);
      }

      process.exit(0);
    });

    // Force shutdown after 10 seconds if graceful shutdown stalls
    setTimeout(() => {
      console.error('[server] Graceful shutdown timed out — forcing exit');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    console.error('[server] Unhandled Promise Rejection at:', promise, 'reason:', reason);
    // In production, you might want to exit: process.exit(1)
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err) => {
    console.error('[server] Uncaught Exception:', err);
    shutdown('uncaughtException');
  });
}

// Run the bootstrap function
bootstrap().catch((err) => {
  console.error('[server] Fatal error during startup:', err);
  process.exit(1);
});
