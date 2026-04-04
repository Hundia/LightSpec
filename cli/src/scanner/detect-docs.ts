/**
 * detect-docs.ts
 * Detects documentation files in a project.
 * Reads README.md, finds spec-like files, and lists other doc files.
 * Pure function — file reads only, no LLM calls.
 */

import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { glob } from 'glob';
import path from 'path';
import type { ProjectDocs } from './types.js';

const README_MAX_LINES = 500;
const IGNORE_DIRS = ['node_modules/**', '.git/**', 'dist/**', 'build/**', 'coverage/**'];

/** Directories and file patterns that indicate spec-like content */
const SPEC_DIR_NAMES = ['specs', 'spec', 'docs/spec', 'docs/specs', '.lsp', '.autospec'];
const SPEC_FILE_PATTERNS = [
  '**/*spec*.md',
  '**/*srs*.md',
  '**/*requirements*.md',
  '**/*prd*.md',
  '**/SPEC.md',
  '**/SPECS.md',
  '**/SRS.md',
  '**/REQUIREMENTS.md',
  '**/backlog.md',
];

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

async function readReadme(projectPath: string): Promise<string | null> {
  const candidates = ['README.md', 'readme.md', 'Readme.md', 'README.MD'];
  for (const name of candidates) {
    const fullPath = path.join(projectPath, name);
    if (!existsSync(fullPath)) continue;
    try {
      const content = await readFile(fullPath, 'utf-8');
      const lines = content.split('\n');
      return lines.slice(0, README_MAX_LINES).join('\n');
    } catch {
      return null;
    }
  }
  return null;
}

async function findExistingSpecs(projectPath: string): Promise<string[]> {
  const results = new Set<string>();

  // Check well-known spec directories
  for (const dir of SPEC_DIR_NAMES) {
    const dirPath = path.join(projectPath, dir);
    if (!existsSync(dirPath)) continue;
    try {
      const files = await glob('**/*.md', {
        cwd: dirPath,
        nodir: true,
        ignore: IGNORE_DIRS,
      });
      for (const f of files) {
        results.add(path.join(dir, f));
      }
    } catch {
      // ignore
    }
  }

  // Check pattern-matched spec files
  try {
    const files = await glob(SPEC_FILE_PATTERNS, {
      cwd: projectPath,
      nodir: true,
      ignore: [...IGNORE_DIRS, 'README.md', 'readme.md'],
    });
    for (const f of files) {
      results.add(f);
    }
  } catch {
    // ignore
  }

  return Array.from(results).sort();
}

async function findOtherDocs(projectPath: string, existingSpecs: string[]): Promise<string[]> {
  const specSet = new Set(existingSpecs);
  const results: string[] = [];

  // Markdown files in root
  try {
    const rootMd = await glob('*.md', {
      cwd: projectPath,
      nodir: true,
    });
    for (const f of rootMd) {
      if (f.toLowerCase() === 'readme.md') continue;
      if (!specSet.has(f)) results.push(f);
    }
  } catch {
    // ignore
  }

  // Markdown files under docs/ directory
  const docsPath = path.join(projectPath, 'docs');
  if (existsSync(docsPath)) {
    try {
      const docsMd = await glob('**/*.md', {
        cwd: docsPath,
        nodir: true,
        ignore: IGNORE_DIRS,
      });
      for (const f of docsMd) {
        const fullRel = path.join('docs', f);
        if (!specSet.has(fullRel)) results.push(fullRel);
      }
    } catch {
      // ignore
    }
  }

  return [...new Set(results)].sort();
}

// ────────────────────────────────────────────────────────────────────────────
// Main export
// ────────────────────────────────────────────────────────────────────────────

export async function detectDocs(projectPath: string): Promise<ProjectDocs> {
  const [readme, existingSpecs] = await Promise.all([
    readReadme(projectPath),
    findExistingSpecs(projectPath),
  ]);

  const otherDocs = await findOtherDocs(projectPath, existingSpecs);

  return { readme, existingSpecs, otherDocs };
}
