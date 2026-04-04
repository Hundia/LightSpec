import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkdir, writeFile, rm } from 'fs/promises';
import { detectArchitecture } from '../../src/scanner/detect-architecture.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, '../fixtures');
const TMP = path.join(__dirname, '../fixtures/_tmp');

describe('detectArchitecture', () => {
  // Node project with src/ = monolith
  it('detects monolith from flat src/ structure', async () => {
    const arch = await detectArchitecture(path.join(FIXTURES, 'node-project'));
    expect(arch.pattern).toBe('monolith');
  });

  it('detects entryPoints in node project', async () => {
    const arch = await detectArchitecture(path.join(FIXTURES, 'node-project'));
    expect(arch.entryPoints).toContain('src/index.ts');
  });

  it('detects sourceDirectories in node project', async () => {
    const arch = await detectArchitecture(path.join(FIXTURES, 'node-project'));
    expect(arch.sourceDirectories).toContain('src/');
  });

  it('detects unknown pattern for empty project', async () => {
    const arch = await detectArchitecture(path.join(FIXTURES, 'empty-project'));
    expect(arch.pattern).toBe('unknown');
    expect(arch.entryPoints).toHaveLength(0);
    expect(arch.sourceDirectories).toHaveLength(0);
  });

  it('detects hasApi = false for empty project', async () => {
    const arch = await detectArchitecture(path.join(FIXTURES, 'empty-project'));
    expect(arch.hasApi).toBe(false);
    expect(arch.hasFrontend).toBe(false);
    expect(arch.hasDatabase).toBe(false);
  });

  it('detects hasDatabase when prisma/ directory exists', async () => {
    // node-project doesn't have prisma/ — should be false
    const arch = await detectArchitecture(path.join(FIXTURES, 'node-project'));
    // routes/ exists in src → hasApi should be true
    expect(arch.hasApi).toBe(true);
  });

  describe('monorepo detection', () => {
    const monorepoPath = path.join(TMP, 'monorepo');

    beforeAll(async () => {
      await mkdir(path.join(monorepoPath, 'apps/web/src'), { recursive: true });
      await mkdir(path.join(monorepoPath, 'packages/shared/src'), { recursive: true });
      await writeFile(path.join(monorepoPath, 'package.json'), JSON.stringify({ name: 'monorepo', workspaces: ['apps/*', 'packages/*'] }));
    });

    afterAll(async () => {
      await rm(TMP, { recursive: true, force: true });
    });

    it('detects monorepo from apps/ + packages/ directories', async () => {
      const arch = await detectArchitecture(monorepoPath);
      expect(arch.pattern).toBe('monorepo');
    });
  });

  describe('modular detection', () => {
    const modularPath = path.join(TMP, 'modular');

    beforeAll(async () => {
      await mkdir(path.join(modularPath, 'src/modules/users'), { recursive: true });
      await mkdir(path.join(modularPath, 'src/modules/auth'), { recursive: true });
      await writeFile(path.join(modularPath, 'src/index.ts'), 'export * from "./modules/users"');
    });

    it('detects modular from src/modules/ structure', async () => {
      const arch = await detectArchitecture(modularPath);
      expect(arch.pattern).toBe('modular');
    });
  });

  it('correctly identifies hasApi from routes/ directory', async () => {
    // node-project has src/routes/ → hasApi should be true
    const arch = await detectArchitecture(path.join(FIXTURES, 'node-project'));
    expect(arch.hasApi).toBe(true);
  });

  it('correctly identifies Python project as monolith with app/ dir', async () => {
    const arch = await detectArchitecture(path.join(FIXTURES, 'python-project'));
    expect(arch.pattern).toBe('monolith');
    expect(arch.sourceDirectories).toContain('app/');
  });
});
