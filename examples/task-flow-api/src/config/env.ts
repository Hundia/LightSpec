/**
 * Environment Configuration
 *
 * Centralizes all environment variable access with sensible defaults.
 * Import this module wherever you need env-based configuration — never
 * read process.env directly elsewhere in the codebase.
 *
 * Usage:
 *   import { config } from '../config/env.js';
 *   const port = config.port;
 */

// ---------------------------------------------------------------------------
// Type definition for the configuration object
// ---------------------------------------------------------------------------

export interface AppConfig {
  /** HTTP port the Express server listens on */
  port: number;

  /** Node environment: 'development' | 'production' | 'test' */
  nodeEnv: string;

  /**
   * JWT signing secret.
   * MUST be overridden via JWT_SECRET env var in production.
   * The default 'dev-secret-change-in-prod' is intentionally weak.
   */
  jwtSecret: string;

  /**
   * SQLite database file path.
   * Defaults to ':memory:' for in-memory mode (used in tests).
   * Set DB_PATH=./taskflow.db for a persistent file-based database.
   */
  dbPath: string;

  /** Whether the app is running in test mode */
  isTest: boolean;

  /** Whether the app is running in production mode */
  isProduction: boolean;

  /** Whether the app is running in development mode */
  isDevelopment: boolean;

  /**
   * bcrypt salt rounds.
   * Lower in test to speed up password hashing in tests.
   * Default 10 is suitable for production.
   */
  bcryptRounds: number;

  /**
   * JWT token expiry string.
   * Uses jsonwebtoken's string format: '7d', '1h', '15m', etc.
   */
  jwtExpiresIn: string;
}

// ---------------------------------------------------------------------------
// Helper: parse an integer env var with a fallback
// ---------------------------------------------------------------------------

function parseIntEnv(key: string, defaultValue: number): number {
  const raw = process.env[key];
  if (raw === undefined || raw === '') return defaultValue;
  const parsed = parseInt(raw, 10);
  if (isNaN(parsed)) {
    console.warn(`[config] Warning: env var ${key}="${raw}" is not a valid integer. Using default: ${defaultValue}`);
    return defaultValue;
  }
  return parsed;
}

// ---------------------------------------------------------------------------
// Helper: read a string env var with a fallback
// ---------------------------------------------------------------------------

function parseStringEnv(key: string, defaultValue: string): string {
  const raw = process.env[key];
  if (raw === undefined || raw.trim() === '') return defaultValue;
  return raw.trim();
}

// ---------------------------------------------------------------------------
// Build and export the config object
// ---------------------------------------------------------------------------

const nodeEnv = parseStringEnv('NODE_ENV', 'development');
const isTest = nodeEnv === 'test';
const isProduction = nodeEnv === 'production';
const isDevelopment = nodeEnv === 'development';

export const config: AppConfig = {
  // Server
  port: parseIntEnv('PORT', 3000),
  nodeEnv,

  // Auth
  jwtSecret: parseStringEnv('JWT_SECRET', 'dev-secret-change-in-prod'),
  jwtExpiresIn: parseStringEnv('JWT_EXPIRES_IN', '7d'),

  // Database
  // Tests typically pass ':memory:' explicitly; file path used in dev/prod
  dbPath: parseStringEnv('DB_PATH', ':memory:'),

  // Derived flags
  isTest,
  isProduction,
  isDevelopment,

  // Bcrypt: use fewer rounds in test to keep tests fast
  bcryptRounds: isTest ? 4 : parseIntEnv('BCRYPT_ROUNDS', 10),
};

// ---------------------------------------------------------------------------
// Warn if running in production with the default secret
// ---------------------------------------------------------------------------

if (isProduction && config.jwtSecret === 'dev-secret-change-in-prod') {
  console.error(
    '[config] CRITICAL: JWT_SECRET is set to the default development value in production. ' +
    'Set a strong random secret via the JWT_SECRET environment variable immediately.'
  );
}

// ---------------------------------------------------------------------------
// Log active config on startup (non-sensitive values only)
// ---------------------------------------------------------------------------

if (!isTest) {
  console.log('[config] Loaded configuration:', {
    port: config.port,
    nodeEnv: config.nodeEnv,
    dbPath: config.dbPath === ':memory:' ? ':memory:' : '[file]',
    jwtExpiresIn: config.jwtExpiresIn,
    bcryptRounds: config.bcryptRounds,
  });
}
