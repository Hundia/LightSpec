// tests/providers/resolver.test.ts

import { describe, it, expect, vi, afterEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mock all provider modules so no real CLI calls or env var checks are made
// ---------------------------------------------------------------------------

vi.mock('../../src/providers/claude-code.provider.js', () => ({
  ClaudeCodeProvider: class {
    readonly name = 'claude-code';
    readonly requiresApiKey = false;
    readonly timeoutMs = 900_000;
    isAvailable = vi.fn().mockResolvedValue(false);
    generate = vi.fn();
    parseError = vi.fn();
  },
}));

vi.mock('../../src/providers/gemini-cli.provider.js', () => ({
  GeminiCliProvider: class {
    readonly name = 'gemini-cli';
    readonly requiresApiKey = false;
    readonly timeoutMs = 120_000;
    isAvailable = vi.fn().mockResolvedValue(false);
    generate = vi.fn();
    parseError = vi.fn();
  },
}));

vi.mock('../../src/providers/anthropic-api.provider.js', () => ({
  AnthropicApiProvider: class {
    readonly name = 'anthropic-api';
    readonly requiresApiKey = true;
    readonly timeoutMs = 60_000;
    isAvailable = vi.fn().mockResolvedValue(false);
    generate = vi.fn();
    parseError = vi.fn();
  },
}));

// Import after mocks are set up
const { resolveProvider } = await import('../../src/providers/resolver.js');

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('resolveProvider — error message content', () => {
  afterEach(() => {
    vi.resetModules();
  });

  it('throws when no provider is available', async () => {
    // All mocks return false for isAvailable — no provider will be found
    await expect(resolveProvider()).rejects.toThrow();
  });

  it('error message contains "No LLM provider found"', async () => {
    let caughtMessage = '';
    try {
      await resolveProvider();
    } catch (err) {
      caughtMessage = (err as Error).message;
    }
    expect(caughtMessage).toContain('No LLM provider found');
  });

  it('error message contains ANTHROPIC_API_KEY', async () => {
    let caughtMessage = '';
    try {
      await resolveProvider();
    } catch (err) {
      caughtMessage = (err as Error).message;
    }
    expect(caughtMessage).toContain('ANTHROPIC_API_KEY');
  });

  it('error message contains GEMINI_API_KEY', async () => {
    let caughtMessage = '';
    try {
      await resolveProvider();
    } catch (err) {
      caughtMessage = (err as Error).message;
    }
    expect(caughtMessage).toContain('GEMINI_API_KEY');
  });

  it('error message contains npm install instruction for Claude Code', async () => {
    let caughtMessage = '';
    try {
      await resolveProvider();
    } catch (err) {
      caughtMessage = (err as Error).message;
    }
    expect(caughtMessage).toContain('npm install -g @anthropic-ai/claude-code');
  });

  it('error message contains console.anthropic.com link', async () => {
    let caughtMessage = '';
    try {
      await resolveProvider();
    } catch (err) {
      caughtMessage = (err as Error).message;
    }
    expect(caughtMessage).toContain('console.anthropic.com');
  });

  it('error message contains lsp init . re-run instruction', async () => {
    let caughtMessage = '';
    try {
      await resolveProvider();
    } catch (err) {
      caughtMessage = (err as Error).message;
    }
    expect(caughtMessage).toContain('lsp init .');
  });
});
