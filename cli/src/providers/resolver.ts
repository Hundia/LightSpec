/**
 * Provider Resolver
 * Auto-detection priority chain: Claude Code CLI → Gemini CLI → Anthropic API.
 */

import { LLMProvider } from './interface.js';
import { ClaudeCodeProvider } from './claude-code.provider.js';
import { GeminiCliProvider } from './gemini-cli.provider.js';
import { AnthropicApiProvider } from './anthropic-api.provider.js';

const PROVIDERS: LLMProvider[] = [
  new ClaudeCodeProvider(),
  new GeminiCliProvider(),    // Priority 2
  new AnthropicApiProvider(), // Priority 3
];

/**
 * Resolve which LLM provider to use.
 *
 * @param override - Optional provider name from --provider flag
 * @returns The first available provider in priority order
 * @throws Error with actionable install instructions if no provider found
 */
export async function resolveProvider(override?: string): Promise<LLMProvider> {
  if (override) {
    const provider = PROVIDERS.find(p => p.name === override);
    if (!provider) {
      throw new Error(
        `Unknown provider: ${override}. Available: ${PROVIDERS.map(p => p.name).join(', ')}`,
      );
    }
    if (!(await provider.isAvailable())) {
      throw new Error(`Provider ${override} is not available. Run: autospec doctor`);
    }
    return provider;
  }

  for (const provider of PROVIDERS) {
    if (await provider.isAvailable()) return provider;
  }

  const PROVIDER_HELP = `No LLM provider found. Set up one of these:

  Option 1 — Claude Code (recommended, no API key needed)
    npm install -g @anthropic-ai/claude-code

  Option 2 — Anthropic API
    export ANTHROPIC_API_KEY=sk-ant-...
    Get free credits: https://console.anthropic.com

  Option 3 — Gemini API
    export GEMINI_API_KEY=...
    Free tier: https://aistudio.google.com

Then re-run: lsp init .`;

  throw new Error(PROVIDER_HELP);
}

/**
 * Return all registered providers (used by `autospec doctor`).
 */
export function getAllProviders(): LLMProvider[] {
  return [...PROVIDERS];
}
