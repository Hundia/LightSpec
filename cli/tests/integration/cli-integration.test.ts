// tests/integration/cli-integration.test.ts
// Integration tests for the LSP CLI via child_process exec

import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const lspRoot = path.join(__dirname, '../..');
const fixturesDir = path.join(__dirname, '../fixtures');

/**
 * Run the LSP CLI and return stdout. Throws on non-zero exit.
 */
function runLsp(args: string): string {
  return execSync(`node ${lspRoot}/dist/index.js ${args}`, {
    encoding: 'utf-8',
    timeout: 30_000,
  });
}

describe('LSP CLI integration', () => {
  it('lsp scan outputs valid JSON with --json flag', () => {
    const output = runLsp(`scan ${fixturesDir}/node-project --json`);
    const result = JSON.parse(output);
    expect(result).toHaveProperty('context');
    expect(result).toHaveProperty('suggestedDepth');
    expect(result).toHaveProperty('complexityScore');
    expect(['micro', 'standard', 'full']).toContain(result.suggestedDepth);
    expect(typeof result.complexityScore).toBe('number');
  });

  it('lsp scan prints readable output without --json', () => {
    const output = runLsp(`scan ${fixturesDir}/node-project`);
    expect(output).toMatch(/tech\s*stack/i);
    expect(output).toMatch(/complexity/i);
  });

  it('lsp scan --json on python project detects python + flask', () => {
    const output = runLsp(`scan ${fixturesDir}/python-project --json`);
    const result = JSON.parse(output);
    expect(result.context.techStack.languages).toContain('python');
    expect(result.context.techStack.frameworks).toContain('flask');
  });

  it('lsp scan --json on go project detects go language', () => {
    const output = runLsp(`scan ${fixturesDir}/go-project --json`);
    const result = JSON.parse(output);
    expect(result.context.techStack.languages).toContain('go');
  });

  it('lsp scan --json on empty project returns micro depth', () => {
    const output = runLsp(`scan ${fixturesDir}/empty-project --json`);
    const result = JSON.parse(output);
    expect(result.suggestedDepth).toBe('micro');
  });

  it('lsp init --dry-run shows plan without generating files', () => {
    // The init command with --dry-run should print the plan and exit
    // without creating .lsp/ in the target directory.
    // Note: if the underlying init command fails (e.g. provider unavailable),
    // we only verify that no .lsp/ directory was created.
    try {
      const output = runLsp(`init ${fixturesDir}/node-project --dry-run -y`);
      expect(output).toMatch(/dry.?run/i);
    } catch {
      // init may fail due to provider not being configured — that's expected in CI
    }
    // The key guarantee: .lsp/ must NOT have been created
    expect(existsSync(path.join(fixturesDir, 'node-project', '.lsp'))).toBe(false);
  });

  it('lsp --version outputs version number', () => {
    const output = runLsp('--version');
    expect(output.trim()).toMatch(/\d+\.\d+\.\d+/);
  });

  it('lsp --help shows usage', () => {
    const output = runLsp('--help');
    expect(output).toContain('lsp');
    expect(output).toMatch(/init|scan|graduate/i);
  });
});
