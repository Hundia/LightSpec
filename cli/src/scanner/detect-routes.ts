/**
 * detect-routes.ts
 * Detects HTTP API routes defined in source files.
 * Supports Express, Fastify, NestJS (Node/TS), Flask (Python), and Go (Gin/Echo/Fiber/Chi).
 * Pure function — file reads only, no LLM calls.
 */

import { readFile } from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import type { ProjectRoutes, TechStack } from './types.js';

interface RouteEntry {
  method: string;
  path: string;
  file: string;
}

const IGNORE_DIRS = ['node_modules/**', '.git/**', 'dist/**', 'build/**', 'coverage/**'];

// ────────────────────────────────────────────────────────────────────────────
// Route extraction helpers
// ────────────────────────────────────────────────────────────────────────────

/**
 * Extract Express/Fastify/Koa style routes:
 *   router.get('/path', handler)
 *   app.post('/path', handler)
 *   fastify.put('/path', async (req, reply) => { ... })
 */
function extractExpressRoutes(content: string, filePath: string): RouteEntry[] {
  const routes: RouteEntry[] = [];
  // Matches: router.get('/...') or app.post('/...') etc.
  const re = /(?:router|app|fastify|server)\s*\.\s*(get|post|put|patch|delete|options|head)\s*\(\s*['"`]([^'"`]+)['"`]/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    routes.push({ method: m[1].toUpperCase(), path: m[2], file: filePath });
  }
  return routes;
}

/**
 * Extract NestJS decorator routes:
 *   @Get('/path')  @Post()  @Put(':id')  etc.
 */
function extractNestRoutes(content: string, filePath: string): RouteEntry[] {
  const routes: RouteEntry[] = [];
  const re = /@(Get|Post|Put|Patch|Delete|Options|Head)\s*\(\s*(?:['"`]([^'"`]*)['"`])?\s*\)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    routes.push({ method: m[1].toUpperCase(), path: m[2] ?? '/', file: filePath });
  }
  return routes;
}

/**
 * Extract Flask routes:
 *   @app.route('/path', methods=['GET', 'POST'])
 *   @bp.route('/path')
 */
function extractFlaskRoutes(content: string, filePath: string): RouteEntry[] {
  const routes: RouteEntry[] = [];
  const re = /@(?:app|bp|blueprint)\s*\.route\s*\(\s*['"`]([^'"`]+)['"`](?:[^)]*methods\s*=\s*\[([^\]]+)\])?/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const routePath = m[1];
    const methods = m[2]
      ? m[2].split(',').map(s => s.trim().replace(/['"` ]/g, '').toUpperCase()).filter(Boolean)
      : ['GET'];
    for (const method of methods) {
      routes.push({ method, path: routePath, file: filePath });
    }
  }
  return routes;
}

/**
 * Extract Go HTTP routes from Gin, Echo, Fiber, and Chi.
 *
 * Gin/Echo use uppercase: r.GET("/path", h), e.GET("/path", h)
 * Fiber/Chi use mixed-case: app.Get("/path", h), r.Get("/path", h)
 *
 * Single regex captures both forms, with the method name in capture group 1
 * and the route path in capture group 2.
 */
export async function extractGoRoutes(projectPath: string): Promise<RouteEntry[]> {
  const routes: RouteEntry[] = [];

  let goFiles: string[] = [];
  try {
    goFiles = await glob('**/*.go', {
      cwd: projectPath,
      ignore: ['vendor/**', '*_test.go'],
      absolute: true,
    });
  } catch {
    return routes;
  }

  // Matches: .<METHOD>( "<path>" where METHOD is GET/Post/DELETE etc.
  // Covers uppercase (Gin/Echo) and TitleCase (Fiber/Chi)
  const routeRe = /\.\s*(GET|POST|PUT|PATCH|DELETE|OPTIONS|HEAD|Get|Post|Put|Patch|Delete|Options|Head)\s*\(\s*["'`]([^"'`]+)["'`]/g;

  for (const file of goFiles) {
    let content = '';
    try {
      content = await readFile(file, 'utf-8');
    } catch {
      continue;
    }

    routeRe.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = routeRe.exec(content)) !== null) {
      const method = match[1].toUpperCase();
      const routePath = match[2];
      routes.push({ method, path: routePath, file: path.relative(projectPath, file) });
    }
  }

  return routes;
}

// ────────────────────────────────────────────────────────────────────────────
// Main export
// ────────────────────────────────────────────────────────────────────────────

export async function detectRoutes(
  projectPath: string,
  techStack: TechStack,
): Promise<ProjectRoutes> {
  const routes: RouteEntry[] = [];
  let framework: string | null = null;

  // Determine which extractor to use based on detected frameworks
  const hasNest = techStack.frameworks.includes('nestjs');
  const hasExpress = techStack.frameworks.includes('express');
  const hasFastify = techStack.frameworks.includes('fastify');
  const hasFlask = techStack.frameworks.includes('flask');

  if (hasNest) {
    framework = 'nestjs';
  } else if (hasExpress) {
    framework = 'express';
  } else if (hasFastify) {
    framework = 'fastify';
  } else if (hasFlask) {
    framework = 'flask';
  }

  // Scan TS/JS files for Express/Fastify/NestJS routes
  if (hasNest || hasExpress || hasFastify || (!hasFlask && techStack.languages.includes('typescript'))) {
    let files: string[] = [];
    try {
      files = await glob(['**/*.ts', '**/*.js', '!**/*.d.ts'], {
        cwd: projectPath,
        ignore: IGNORE_DIRS,
        nodir: true,
      });
    } catch {
      files = [];
    }

    for (const file of files) {
      let content = '';
      try {
        content = await readFile(`${projectPath}/${file}`, 'utf-8');
      } catch {
        continue;
      }

      if (hasNest) {
        routes.push(...extractNestRoutes(content, file));
      } else {
        routes.push(...extractExpressRoutes(content, file));
      }

      // Auto-detect if framework wasn't in stack
      if (!framework) {
        if (extractNestRoutes(content, file).length > 0) framework = 'nestjs';
        else if (extractExpressRoutes(content, file).length > 0) framework = 'express';
      }
    }
  }

  // Scan Python files for Flask routes
  if (hasFlask || techStack.languages.includes('python')) {
    let files: string[] = [];
    try {
      files = await glob('**/*.py', {
        cwd: projectPath,
        ignore: IGNORE_DIRS,
        nodir: true,
      });
    } catch {
      files = [];
    }

    for (const file of files) {
      let content = '';
      try {
        content = await readFile(`${projectPath}/${file}`, 'utf-8');
      } catch {
        continue;
      }
      const flaskRoutes = extractFlaskRoutes(content, file);
      if (flaskRoutes.length > 0) {
        routes.push(...flaskRoutes);
        if (!framework) framework = 'flask';
      }
    }
  }

  // Scan Go files for Gin/Echo/Fiber/Chi routes
  const GO_FRAMEWORKS = ['gin', 'echo', 'fiber', 'chi'];
  const hasGoFramework = techStack.frameworks.some(f =>
    GO_FRAMEWORKS.includes(f.toLowerCase()),
  );

  if (hasGoFramework || techStack.languages.includes('go')) {
    const goRoutes = await extractGoRoutes(projectPath);
    if (goRoutes.length > 0) {
      routes.push(...goRoutes);
      if (!framework) framework = 'go-http';
    }
  }

  // Deduplicate routes (same method+path+file)
  const seen = new Set<string>();
  const uniqueRoutes = routes.filter(r => {
    const key = `${r.method}:${r.path}:${r.file}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { routes: uniqueRoutes, framework };
}
