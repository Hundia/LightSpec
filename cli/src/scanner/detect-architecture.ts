// lsp/src/scanner/detect-architecture.ts — Detect project architecture from directory patterns

import { existsSync } from 'fs';
import { readdir } from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import type { Architecture } from './types.js';

async function listDirs(dirPath: string): Promise<string[]> {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    return entries
      .filter(e => e.isDirectory())
      .map(e => e.name);
  } catch {
    return [];
  }
}

async function listFiles(dirPath: string): Promise<string[]> {
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    return entries
      .filter(e => e.isFile())
      .map(e => e.name);
  } catch {
    return [];
  }
}

function detectApiPresence(dirs: string[], files: string[]): boolean {
  const apiDirSignals = ['routes', 'controllers', 'handlers', 'endpoints', 'api'];
  const apiFileSignals = ['router.ts', 'router.js', 'routes.ts', 'routes.js', 'app.py', 'main.go'];

  return (
    apiDirSignals.some(d => dirs.includes(d)) ||
    apiFileSignals.some(f => files.includes(f))
  );
}

function detectFrontendPresence(dirs: string[], files: string[]): boolean {
  const frontendDirSignals = ['pages', 'views', 'components', 'public', 'assets', 'templates'];
  const frontendFileSignals = ['index.html', 'vite.config.ts', 'vite.config.js', 'next.config.js', 'nuxt.config.ts'];

  return (
    frontendDirSignals.some(d => dirs.includes(d)) ||
    frontendFileSignals.some(f => files.includes(f))
  );
}

function detectDatabasePresence(dirs: string[], files: string[]): boolean {
  const dbDirSignals = ['migrations', 'prisma', 'db', 'database', 'alembic', 'schema'];
  const dbFileSignals = [
    'schema.prisma',
    'schema.sql',
    'models.py',
    'database.py',
    'db.ts',
    'db.js',
  ];

  return (
    dbDirSignals.some(d => dirs.includes(d)) ||
    dbFileSignals.some(f => files.includes(f))
  );
}

export async function detectArchitecture(projectPath: string): Promise<Architecture> {
  const rootDirs = await listDirs(projectPath);
  const rootFiles = await listFiles(projectPath);

  // Collect source directories
  const sourceDirectories: string[] = [];
  const candidateSrcDirs = ['src', 'lib', 'app', 'pkg', 'cmd', 'internal'];
  for (const d of candidateSrcDirs) {
    if (rootDirs.includes(d)) sourceDirectories.push(`${d}/`);
  }

  // Collect entry points
  const entryPoints: string[] = [];
  const candidateEntries = [
    'src/index.ts', 'src/index.js',
    'src/main.ts', 'src/main.js',
    'src/app.ts', 'src/app.js',
    'main.go', 'main.py', 'app.py',
    'index.ts', 'index.js',
  ];
  for (const entry of candidateEntries) {
    if (existsSync(path.join(projectPath, entry))) {
      entryPoints.push(entry);
    }
  }

  // Check src/ subdirectories for pattern detection
  const srcPath = path.join(projectPath, 'src');
  const srcDirs = existsSync(srcPath) ? await listDirs(srcPath) : [];
  const srcFiles = existsSync(srcPath) ? await listFiles(srcPath) : [];

  // Check app/ subdirectories
  const appPath = path.join(projectPath, 'app');
  const appDirs = existsSync(appPath) ? await listDirs(appPath) : [];
  const appFiles = existsSync(appPath) ? await listFiles(appPath) : [];

  // Detect pattern
  let pattern: Architecture['pattern'] = 'unknown';

  // Monorepo: has apps/ + packages/ directories (or workspaces config)
  const hasAppsDir = rootDirs.includes('apps');
  const hasPackagesDir = rootDirs.includes('packages');
  const hasWorkspacesDir = rootDirs.includes('packages') || rootDirs.includes('libs');
  const hasPnpmWorkspace = existsSync(path.join(projectPath, 'pnpm-workspace.yaml'));
  const hasLernaJson = existsSync(path.join(projectPath, 'lerna.json'));
  const hasNxJson = existsSync(path.join(projectPath, 'nx.json'));
  const hasTurborepo = existsSync(path.join(projectPath, 'turbo.json'));

  if (
    (hasAppsDir && hasPackagesDir) ||
    (hasAppsDir && hasWorkspacesDir) ||
    hasPnpmWorkspace ||
    hasLernaJson ||
    hasNxJson ||
    hasTurborepo
  ) {
    pattern = 'monorepo';
  }
  // Modular: has src/modules/ or src/features/ or similar
  else if (
    srcDirs.includes('modules') ||
    srcDirs.includes('features') ||
    appDirs.includes('modules') ||
    appDirs.includes('features') ||
    rootDirs.includes('modules')
  ) {
    pattern = 'modular';
  }
  // Microservices: has services/ directory at root
  else if (rootDirs.includes('services') || rootDirs.includes('microservices')) {
    pattern = 'microservices';
  }
  // Monolith: has a non-trivial src/ structure (but not modular)
  else if (sourceDirectories.length > 0 || entryPoints.length > 0) {
    pattern = 'monolith';
  }

  // Gather all dirs/files for presence detection
  const allDirs = [...rootDirs, ...srcDirs, ...srcFiles, ...appDirs, ...appFiles];
  const allFiles = [...rootFiles, ...srcFiles, ...appFiles];

  let hasApi = detectApiPresence(allDirs, allFiles);

  // Additional check for Go projects: main.go anywhere outside vendor/ signals an API
  if (!hasApi) {
    try {
      const mainGoFiles = await glob('**/main.go', {
        cwd: projectPath,
        ignore: ['vendor/**'],
      });
      if (mainGoFiles.length > 0) {
        hasApi = true;
      }
    } catch {
      // ignore glob errors
    }
  }

  // Check for common Go API directory patterns
  if (!hasApi) {
    try {
      const goApiDirs = await glob(
        '{internal/http,pkg/api,cmd/server,cmd/api,api,handler,handlers}/',
        { cwd: projectPath, ignore: ['vendor/**'] },
      );
      if (goApiDirs.length > 0) {
        hasApi = true;
      }
    } catch {
      // ignore glob errors
    }
  }

  const hasFrontend = detectFrontendPresence(rootDirs, rootFiles);
  const hasDatabase = detectDatabasePresence(allDirs, allFiles);

  return {
    pattern,
    entryPoints,
    sourceDirectories,
    hasApi,
    hasFrontend,
    hasDatabase,
  };
}
