import { describe, it, expect } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';
import { detectStack } from '../../src/scanner/detect-stack.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES = path.join(__dirname, '../fixtures');

describe('detectStack', () => {
  it('detects Node.js and TypeScript from package.json with ts deps', async () => {
    const stack = await detectStack(path.join(FIXTURES, 'node-project'));
    expect(stack.languages).toContain('javascript');
    expect(stack.languages).toContain('typescript');
  });

  it('detects Express framework from dependencies', async () => {
    const stack = await detectStack(path.join(FIXTURES, 'node-project'));
    expect(stack.frameworks).toContain('express');
  });

  it('detects vitest as a test framework', async () => {
    const stack = await detectStack(path.join(FIXTURES, 'node-project'));
    expect(stack.testFrameworks).toContain('vitest');
  });

  it('detects tsup as a build tool', async () => {
    const stack = await detectStack(path.join(FIXTURES, 'node-project'));
    expect(stack.buildTools).toContain('tsup');
  });

  it('detects Python from requirements.txt', async () => {
    const stack = await detectStack(path.join(FIXTURES, 'python-project'));
    expect(stack.languages).toContain('python');
  });

  it('detects Flask framework from Python project', async () => {
    const stack = await detectStack(path.join(FIXTURES, 'python-project'));
    expect(stack.frameworks).toContain('flask');
  });

  it('detects pytest as test framework from Python project', async () => {
    const stack = await detectStack(path.join(FIXTURES, 'python-project'));
    expect(stack.testFrameworks).toContain('pytest');
  });

  it('detects Go language from go.mod', async () => {
    const stack = await detectStack(path.join(FIXTURES, 'go-project'));
    expect(stack.languages).toContain('go');
  });

  it('detects testify from go.mod', async () => {
    const stack = await detectStack(path.join(FIXTURES, 'go-project'));
    expect(stack.testFrameworks).toContain('testify');
  });

  it('returns empty/minimal stack for empty project', async () => {
    const stack = await detectStack(path.join(FIXTURES, 'empty-project'));
    expect(stack.languages).toHaveLength(0);
    expect(stack.frameworks).toHaveLength(0);
    expect(stack.testFrameworks).toHaveLength(0);
    expect(stack.packageManager).toBeNull();
  });

  it('detects npm package manager from package-lock.json presence or package.json', async () => {
    const stack = await detectStack(path.join(FIXTURES, 'node-project'));
    // node-project has package.json → defaults to npm if no lockfile
    expect(stack.packageManager).toBe('npm');
  });

  it('returns arrays not null for all fields', async () => {
    const stack = await detectStack(path.join(FIXTURES, 'node-project'));
    expect(Array.isArray(stack.languages)).toBe(true);
    expect(Array.isArray(stack.frameworks)).toBe(true);
    expect(Array.isArray(stack.testFrameworks)).toBe(true);
    expect(Array.isArray(stack.buildTools)).toBe(true);
  });
});
