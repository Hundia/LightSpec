# Backend Lead Spec — LightSpec CLI

## Architecture Overview

The CLI lives entirely in `cli/src/` and is structured into 5 modules:

```
cli/src/
├── scanner/              # Project analysis — no LLM required
│   ├── detect-stack.ts   # Read package.json, Gemfile, requirements.txt, go.mod, etc.
│   ├── detect-architecture.ts  # Directory structure → monorepo, MVC, microservices, flat
│   ├── detect-tests.ts   # Find test files, estimate coverage, detect frameworks
│   ├── detect-routes.ts  # Parse Express/NestJS/Flask/Rails routes
│   ├── detect-docs.ts    # Find README, docs/, CONTRIBUTING.md, OpenAPI specs
│   └── complexity-scorer.ts    # Heuristic score 0–100 → depth routing
├── pipeline/             # LLM-powered spec generation
│   ├── depth-router.ts   # depth level → template selection
│   ├── generate-spec.ts  # Orchestrates scan → prompt → LLM → output
│   └── task-extractor.ts # Parse markdown checklist from generated spec
├── commands/             # Commander.js command handlers
│   ├── init.ts           # `lsp init [path]` — full scan + generate flow
│   ├── scan.ts           # `lsp scan [path]` — scanner only, no LLM
│   ├── status.ts         # `lsp status` — read .lsp/tasks.md, show progress
│   └── graduate.ts       # `lsp graduate` — convert .lsp/ → AutoSpec scaffold
├── providers/            # LLM provider abstraction (inlined locally)
│   └── index.ts          # Re-exports: anthropic, claude-code, gemini
└── prompts/              # Handlebars template files
    ├── analyze.hbs       # Initial project analysis prompt
    ├── micro.hbs         # Micro-depth spec template (< 200 LOC)
    ├── standard.hbs      # Standard-depth spec template (500–1K LOC)
    ├── full-product.hbs  # Full-depth: product + user stories
    ├── full-technical.hbs # Full-depth: architecture + API
    └── full-quality.hbs  # Full-depth: QA + test plan
```

## Technology Stack

| Library | Purpose | Version constraint |
|---------|---------|-------------------|
| TypeScript (ESM) | Language | `^5.3` |
| tsup | Bundler: `src/` → `dist/` ESM + types | `^8.0` |
| vitest | Test runner | `^1.0` |
| Commander.js | CLI argument parsing | `^12.0` |
| Chalk | Terminal color output | `^5.0` |
| Ora | Spinner (async UX) | `^8.0` |
| Handlebars | Prompt template rendering | `^4.7` |
| fs-extra | File system utilities | `^11.0` |
| glob | File pattern matching | `^10.0` |
| yaml | Parse/write YAML frontmatter | `^2.0` |

## Provider Layer

Providers are **inlined locally** in `cli/src/providers/` — no dependency on the AutoSpec or FitnessAiManager repo. Auto-detection order:

1. **Claude Code** — if running inside Claude Code session (`ANTHROPIC_AUTH_TOKEN` set by harness)
2. **Anthropic API** — if `ANTHROPIC_API_KEY` env var is set
3. **Gemini CLI** — if `gemini` binary is available in `$PATH`

Provider interface:
```typescript
interface Provider {
  generate(prompt: string, options?: GenerateOptions): Promise<string>
}
```

## Build

```bash
tsup src/index.ts --format esm --dts --clean
# Output: dist/index.js (< 2KB), dist/index.d.ts
```

Binary entry in `package.json`:
```json
{ "bin": { "lsp": "./dist/index.js" } }
```

## Key Implementation Conventions

- **ESM only** — `"type": "module"` in package.json, all imports use `.js` extension
- **No default exports** — named exports only for testability
- **No side effects at module level** — nothing runs on import, only when functions are called
- **Graceful degradation** — if no LLM provider available, `lsp init` falls back to `lsp scan` output only
- **Idempotent output** — running `lsp init` twice on the same project should produce deterministic output (same scan metadata, same depth routing, same prompt)
- **`.lsp/` output is gitignore-safe by default** — but users can commit it; no secrets written

## Test Strategy

- **Unit tests** (`cli/tests/scanner/`, `cli/tests/pipeline/`, `cli/tests/commands/`): test each module in isolation with mock file systems
- **Integration tests** (`cli/tests/integration/`): run scanner against real fixture projects in `cli/tests/fixtures/`
- **E2E** (`cli/tests/e2e/`): run `lsp init` against `/opt/LightSpec/` itself (self-referential validation — the spec this produces should be coherent)
- Coverage target: 80% on scanner + pipeline modules

## Complexity Scoring Heuristic

| Factor | Weight | Signal |
|--------|--------|--------|
| LOC (lines of code) | 25% | < 200 → low, 200–1K → medium, > 1K → high |
| Number of top-level modules | 20% | < 3 → low, 3–7 → medium, > 7 → high |
| Has tests? | 15% | Yes → +10pts, No → 0 |
| Has routes? | 15% | API routes found → +15pts |
| Has docs? | 10% | README + more → +5pts |
| Dependency count | 15% | < 5 → low, 5–20 → medium, > 20 → high |

Final score 0–100 → depth routing: 0–30 = micro, 31–70 = standard, 71–100 = full.
