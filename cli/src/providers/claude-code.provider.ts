/**
 * Claude Code CLI Provider
 * Primary provider — zero API key needed, uses existing claude auth.
 * Prompts delivered via stdin (avoids OS arg limits).
 * System prompts via temp file with cleanup (avoids escape issues).
 */

import { execa } from 'execa';
import { mkdtemp, writeFile, rm } from 'fs/promises';
import path from 'path';
import os from 'os';
import { LLMProvider, GenerateOptions, ProviderError } from './interface.js';
import { registerCleanup } from '../utils/signals.js';

export class ClaudeCodeProvider implements LLMProvider {
  readonly name = 'claude-code';
  readonly requiresApiKey = false;
  readonly timeoutMs = 900_000; // 15 minutes — complex SRS specs with accumulated context can take 5-10 minutes

  async isAvailable(): Promise<boolean> {
    try {
      const { exitCode: whichExit } = await execa('which', ['claude'], { reject: false });
      if (whichExit !== 0) return false;

      // Also verify auth is active
      const { exitCode: authExit } = await execa('claude', ['auth', 'status'], {
        reject: false,
        timeout: 10_000,
      });
      return authExit === 0;
    } catch {
      return false;
    }
  }

  async *generate(prompt: string, options: GenerateOptions): AsyncIterable<string> {
    const args = ['--print', '--output-format', 'stream-json', '--verbose'];

    if (options.model) {
      args.push('--model', options.model);
    }

    let tmpDir: string | undefined;

    if (options.systemPrompt) {
      tmpDir = await mkdtemp(path.join(os.tmpdir(), 'autospec-'));
      const sysPromptFile = path.join(tmpDir, 'system.md');
      await writeFile(sysPromptFile, options.systemPrompt, 'utf8');
      args.push('--system-prompt-file', sysPromptFile);

      // Register cleanup in case of SIGINT/SIGTERM
      registerCleanup(async () => {
        if (tmpDir) {
          await rm(tmpDir, { recursive: true, force: true });
        }
      });
    }

    try {
      const proc = execa('claude', args, {
        input: prompt,
        timeout: this.timeoutMs,
        all: true,
      });

      if (!proc.stdout) {
        throw { type: 'unknown', message: 'Claude Code returned no stdout stream.', retryable: false } as ProviderError;
      }

      // Stream NDJSON lines — skip unparseable lines rather than halting
      let buffer = '';
      for await (const chunk of proc.stdout) {
        buffer += typeof chunk === 'string' ? chunk : chunk.toString('utf8');
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;
          try {
            const event = JSON.parse(trimmed);
            // Extract text content from assistant messages.
            // Claude Code CLI stream-json format: {type: "assistant", message: {content: [{type: "text", text: "..."}]}}
            // Also handle flat format (older versions): {type: "assistant", content: [...]}
            const content = event.type === 'assistant'
              ? (event.message?.content ?? event.content)
              : null;
            if (content) {
              if (typeof content === 'string') {
                yield content;
              } else if (Array.isArray(content)) {
                for (const block of content) {
                  if (block.type === 'text' && typeof block.text === 'string') {
                    yield block.text;
                  }
                }
              }
            }
            // Also check the "result" event type which contains the final text
            if (event.type === 'result' && typeof event.result === 'string' && !event.is_error) {
              // Only yield result if we got no content from assistant events (fallback)
              // We track this via a flag set before the loop
            }
          } catch {
            // Skip unparseable lines — common with stream-json format
          }
        }
      }

      // Yield any remaining buffered content
      if (buffer.trim()) {
        try {
          const event = JSON.parse(buffer.trim());
          const content = event.type === 'assistant'
            ? (event.message?.content ?? event.content)
            : null;
          if (content) {
            if (typeof content === 'string') {
              yield content;
            } else if (Array.isArray(content)) {
              for (const block of content) {
                if (block.type === 'text' && typeof block.text === 'string') {
                  yield block.text;
                }
              }
            }
          }
        } catch {
          // Ignore final unparseable fragment
        }
      }

      await proc;
    } catch (error) {
      const providerError = this.parseError(error);
      throw providerError;
    } finally {
      if (tmpDir) {
        await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
      }
    }
  }

  parseError(error: unknown): ProviderError {
    const err = error as { stderr?: string; message?: string; timedOut?: boolean; exitCode?: number };
    const stderr = err.stderr || err.message || '';

    if (err.timedOut) {
      return {
        type: 'timeout',
        message: `Claude Code timed out after ${this.timeoutMs / 1000}s. Try a shorter prompt or increase timeout.`,
        retryable: true,
      };
    }
    if (stderr.includes('rate limit') || stderr.includes('429')) {
      return {
        type: 'rate_limit',
        message: 'Rate limit reached. Wait 60s or use --provider anthropic-api.',
        retryable: true,
      };
    }
    if (stderr.includes('auth') || stderr.includes('login') || stderr.includes('401')) {
      return {
        type: 'auth',
        message: 'Auth expired. Run: claude auth login',
        retryable: false,
      };
    }
    if (stderr.includes('not found') || stderr.includes('ENOENT')) {
      return {
        type: 'unknown',
        message: 'Claude Code CLI not found. Install: npm i -g @anthropic-ai/claude-code',
        retryable: false,
      };
    }
    return {
      type: 'unknown',
      message: `Claude Code error: ${stderr.slice(0, 200)}`,
      retryable: false,
      rawError: stderr,
    };
  }
}
