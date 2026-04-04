/**
 * Anthropic API Provider
 * Uses @anthropic-ai/sdk with dynamic import — SDK is only loaded when this provider is selected.
 * API key resolved via 5-level env cascade (see cli/src/utils/env.ts).
 */

import { LLMProvider, GenerateOptions, ProviderError } from './interface.js';

export class AnthropicApiProvider implements LLMProvider {
  readonly name = 'anthropic-api';
  readonly requiresApiKey = true;
  readonly timeoutMs = 60_000;

  private getApiKey(): string | undefined {
    return process.env.ANTHROPIC_API_KEY;
  }

  async isAvailable(): Promise<boolean> {
    return !!this.getApiKey();
  }

  async *generate(prompt: string, options: GenerateOptions): AsyncIterable<string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw {
        type: 'auth',
        message: 'ANTHROPIC_API_KEY not set. Run: export ANTHROPIC_API_KEY=sk-ant-...',
        retryable: false,
      } as ProviderError;
    }

    // Dynamic import — only loads SDK when actually used
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey });

    const model = options.model || 'claude-sonnet-4-20250514';

    try {
      const stream = client.messages.stream({
        model,
        max_tokens: options.maxTokens || 8192,
        ...(options.systemPrompt ? { system: options.systemPrompt } : {}),
        messages: [{ role: 'user', content: prompt }],
      });

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          yield event.delta.text;
        }
      }
    } catch (error) {
      throw this.parseError(error);
    }
  }

  parseError(error: unknown): ProviderError {
    const err = error as {
      status?: number;
      message?: string;
      error?: { type?: string };
    };
    const status = err.status;
    const message = err.message || '';
    const errorType = err.error?.type || '';

    if (status === 401 || status === 403) {
      return {
        type: 'auth',
        message: 'Invalid ANTHROPIC_API_KEY. Check your key at console.anthropic.com',
        retryable: false,
      };
    }
    if (status === 429) {
      return {
        type: 'rate_limit',
        message: 'Anthropic API rate limit. Wait 60s and retry.',
        retryable: true,
      };
    }
    if (status === 500 || status === 503 || status === 529) {
      return {
        type: 'network',
        message: 'Anthropic API server error. Retrying...',
        retryable: true,
      };
    }
    if (errorType === 'not_found_error' || message.includes('model')) {
      return {
        type: 'model_not_found',
        message: 'Model not found. Try: claude-sonnet-4-20250514',
        retryable: false,
      };
    }
    return {
      type: 'unknown',
      message: `Anthropic API error: ${message.slice(0, 200)}`,
      retryable: false,
      rawError: message,
    };
  }
}
