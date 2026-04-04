---
title: LightSpec Architecture
sprint: 37
created: 2026-03-27
---

# LightSpec Architecture

## Overview

LightSpec is a standalone CLI package (`lightspec`) living at `lightspec/cli/`. It uses a locally owned provider infrastructure and is otherwise independent. The architecture is intentionally flat — five modules with clear boundaries and a linear data flow.

---

## Directory Structure

```
lightspec/cli/
├── package.json              # name: "lightspec", bin: { lsp }
├── tsconfig.json             # ES2022, bundler moduleResolution
├── vitest.config.ts          # tests/**/*.test.ts
├── src/
│   ├── index.ts              # Commander.js program, 4 commands
│   ├── commands/
│   │   ├── init.ts           # lsp init — scan + route + generate
│   │   ├── scan.ts           # lsp scan — brownfield analysis only
│   │   ├── status.ts         # lsp status — task list progress
│   │   └── graduate.ts       # lsp graduate — promote to AutoSpec
│   ├── scanner/
│   │   ├── types.ts          # Core interfaces (BrownfieldContext, ScanResult, etc.)
│   │   ├── detect-stack.ts   # Package manager + language + framework detection
│   │   ├── detect-architecture.ts  # Directory pattern → architecture type
│   │   ├── detect-tests.ts   # Test framework + test file counting
│   │   ├── detect-routes.ts  # API route extraction from source files
│   │   ├── detect-docs.ts    # README + spec file discovery
│   │   ├── complexity-scorer.ts    # 0-100 score → depth level
│   │   └── index.ts          # Barrel export
│   ├── pipeline/
│   │   ├── depth-router.ts   # depth → DepthPlan (templates + output files)
│   │   ├── generate-spec.ts  # LLM call with Handlebars template
│   │   ├── task-extractor.ts # Parse task list from generated Markdown
│   │   └── index.ts
│   ├── providers/
│   │   ├── interface.ts      # LLMProvider interface + shared types
│   │   ├── resolver.ts       # resolveProvider() — selects provider from env
│   │   ├── anthropic-api.ts  # Anthropic API provider
│   │   ├── claude-code.ts    # Claude Code subprocess provider
│   │   └── gemini-cli.ts     # Gemini CLI subprocess provider
│   ├── prompts/system/
│   │   ├── micro.hbs         # Micro depth prompt template
│   │   ├── standard.hbs      # Standard depth prompt template
│   │   ├── full-product.hbs  # Full: product spec prompt
│   │   ├── full-technical.hbs
│   │   └── full-quality.hbs
│   └── utils/
│       ├── file.ts           # File I/O helpers
│       ├── timer.ts          # Duration tracking
│       └── output.ts         # Terminal output (ora + chalk)
├── tests/
│   ├── scanner/              # Unit tests for scanner modules
│   ├── pipeline/             # Unit tests for pipeline modules
│   ├── commands/             # Integration tests for commands
│   └── fixtures/             # node-project, python-project, go-project, empty-project
└── dist/                     # Built output (tsup ESM + .d.ts)
    └── prompts/              # Copied from src/prompts/ at build time
```

---

## Module Dependency Graph

```
CLI Entry (index.ts)
    │
    ├── commands/init.ts
    │       ├── scanner/ (scanProject)
    │       ├── pipeline/depth-router.ts
    │       ├── pipeline/generate-spec.ts
    │       │       └── providers/ (resolveProvider)
    │       ├── pipeline/task-extractor.ts
    │       └── utils/ (file, timer, output)
    │
    ├── commands/scan.ts
    │       └── scanner/ (scanProject)
    │
    ├── commands/status.ts
    │       └── utils/file.ts
    │
    └── commands/graduate.ts
            └── utils/ (file, output)
```

The scanner module has no dependencies outside `fs`, `glob`, and Node built-ins — it never calls an LLM. This is deliberate: scanning is fast, deterministic, and fully testable without mocks.

---

## Provider Layer

Providers are owned locally in `cli/src/providers/` — interface.ts, resolver.ts, and three concrete providers (anthropic-api, claude-code, gemini-cli). No external dependency on AutoSpec.

```typescript
// cli/src/providers/resolver.ts
export function resolveProvider(name?: string): LLMProvider { ... }
export function getAllProviders(): LLMProvider[] { ... }

// cli/src/providers/interface.ts
export interface LLMProvider { ... }
export type { GenerateOptions, ProviderError, GenerateResult };
```

This self-contained design means LightSpec works as a fully standalone package. Adding a new provider requires only adding a new file in `cli/src/providers/` and registering it in `resolver.ts`.

---

## Data Flow

```
1. SCAN
   lsp init <path>
       │
       ▼
   scanProject(path, scope?)
       ├── detectStack()         → TechStack
       ├── detectArchitecture()  → Architecture
       ├── detectRoutes()        → ProjectRoutes
       ├── detectDocs()          → ProjectDocs
       ├── detectTests()         → TestInfo
       └── gatherMetrics()       → ProjectMetrics
       │
       ▼
   scoreComplexity(BrownfieldContext)
       └── ScanResult { suggestedDepth, complexityScore, summary, reasoning }

2. ROUTE
   planDepth(depth | override)
       └── DepthPlan { templates[], outputFiles[], maxTokens, estimatedSeconds }

3. GENERATE
   generateSpec(plan, context, srsContent?)
       ├── Load Handlebars template from dist/prompts/system/
       ├── Compile template with { context, srs, projectName }
       ├── resolveProvider(providerName?)
       └── provider.generate(prompt) → spec Markdown

4. EXTRACT
   extractTasks(specMarkdown)
       └── tasks.md (checkbox list)

5. WRITE
   writeOutput(outputDir, plan, specs, tasks, metadata)
       └── .lsp/
           ├── spec.md (or product.md + technical.md + quality.md)
           ├── tasks.md
           └── .meta.json
```

---

## Output Structure

All LightSpec outputs live in `.lsp/` (configurable via `-o`):

```
.lsp/
├── spec.md          # Micro or Standard: unified spec
├── tasks.md         # Generated task checklist
└── .meta.json       # Generation metadata
```

For full depth:
```
.lsp/
├── product.md       # What: personas, user stories, success metrics
├── technical.md     # How: architecture, API, schema, deployment
├── quality.md       # Verify: test plan, acceptance criteria, benchmarks
├── tasks.md
└── .meta.json
```

`.meta.json` records version, generated timestamp, depth, complexity score, provider, model, duration, project path, scope, and output file list. This enables `lsp status` to show accurate context and `lsp graduate` to understand what was generated.

---

## Zero-Config Design Principles

1. **No config file required.** LightSpec reads the project, not a `.lsprc.json`. If you want overrides, use CLI flags.
2. **No required environment variables for scanning.** `lsp scan` works with zero env setup — it only reads the filesystem.
3. **LLM generation gracefully degrades.** If no provider API key is found, `lsp init` shows the scan results and depth recommendation, then exits with instructions rather than crashing.
4. **Sensible defaults everywhere.** Output goes to `.lsp/`. Depth is auto-detected. Provider is auto-resolved from available env vars.

---

## Key Types Overview

The core type hierarchy flows from scan to result:

- `TechStack` — languages, frameworks, package manager, test frameworks, build tools
- `Architecture` — pattern (monolith/modular/monorepo/microservices), entry points, source directories, API/frontend/DB flags
- `ProjectRoutes` — extracted route list with method, path, source file
- `ProjectDocs` — README content, spec files, other docs
- `ProjectMetrics` — file count, line count, source files, test files, test coverage
- `BrownfieldContext` — aggregates all five above
- `ScanResult` — context + suggestedDepth + complexityScore + summary + reasoning
- `DepthPlan` — templates, output files, token limit, estimated seconds
