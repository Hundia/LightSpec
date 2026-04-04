/**
 * Gemini CLI Provider
 * Secondary provider — zero API key needed, uses existing gemini auth.
 * Prompts delivered via stdin (avoids OS arg limits).
 */

import { execa } from 'execa';
import { LLMProvider, GenerateOptions, ProviderError } from './interface.js';

export class GeminiCliProvider implements LLMProvider {
  readonly name = 'gemini-cli';
  readonly requiresApiKey = false;
  readonly timeoutMs = 120_000;

  async isAvailable(): Promise<boolean> {
    try {
      const { exitCode } = await execa('which', ['gemini'], { reject: false });
      return exitCode === 0;
    } catch {
      return false;
    }
  }

  async *generate(prompt: string, options: GenerateOptions): AsyncIterable<string> {
    const args: string[] = ['--print'];

    if (options.model) {
      args.push('--model', options.model);
    }

    if (options.systemPrompt) {
      args.push('--system', options.systemPrompt);
    }

    try {
      const result = await execa('gemini', args, {
        input: prompt,
        timeout: this.timeoutMs,
      });

      yield result.stdout;
    } catch (error) {
      throw this.parseError(error);
    }
  }

  parseError(error: unknown): ProviderError {
    const err = error as { stderr?: string; message?: string; timedOut?: boolean };
    const stderr = err.stderr || err.message || '';

    if (err.timedOut) {
      return {
        type: 'timeout',
        message: `Gemini CLI timed out after ${this.timeoutMs / 1000}s.`,
        retryable: true,
      };
    }
    if (
      stderr.includes('rate limit') ||
      stderr.includes('429') ||
      stderr.includes('RESOURCE_EXHAUSTED')
    ) {
      return {
        type: 'rate_limit',
        message: 'Gemini rate limit reached. Wait 60s and retry.',
        retryable: true,
      };
    }
    if (
      stderr.includes('auth') ||
      stderr.includes('login') ||
      stderr.includes('UNAUTHENTICATED')
    ) {
      return {
        type: 'auth',
        message: 'Gemini auth expired. Run: gemini auth login',
        retryable: false,
      };
    }
    if (stderr.includes('not found') || stderr.includes('ENOENT')) {
      return {
        type: 'unknown',
        message: 'Gemini CLI not found. Install: npm i -g @google/gemini-cli',
        retryable: false,
      };
    }
    return {
      type: 'unknown',
      message: `Gemini CLI error: ${stderr.slice(0, 200)}`,
      retryable: false,
      rawError: stderr,
    };
  }
}
