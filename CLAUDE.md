# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## About This Project

LightSpec is a lightweight Spec-Driven Development CLI tool. **This project develops itself using AutoSpec's SDD methodology.** Use `/sprint-run`, `/execute-ticket`, `/sprint-status` etc. in Claude Code.

New users: see `LIGHTSPEC_QUICKSTART.md` for the end-to-end getting-started guide.

---

## MANDATORY Development Workflow

### Rule 1: Backlog-First Development

Every fix, feature, or change MUST be tracked in `specs/backlog.md` before or during implementation:

1. Determine if this is a **bug** (B.XX), **new feature**, or **enhancement**
2. Add ticket to `specs/backlog.md` in the appropriate sprint section
3. Set status to 🔄 In Progress when starting
4. Set status to ✅ Done when complete

**Skip ONLY when user explicitly says** "skip backlog", "don't track this"

### Rule 2: Living Documentation

Every implemented feature MUST update `docs/`:

- CLI changes → `docs/cli/`
- Presentation changes → `docs/presentation/`
- Viewer changes → `docs/viewer/`
- Deployment changes → `docs/deployment/`
- New subsystem → create new `docs/<subsystem>/` directory

### Rule 3: QA Before Done

No ticket is ✅ Done without verification:

| Change Type | QA Required |
|-------------|-------------|
| Bug fix | Reproduce first, fix, verify user flow passes |
| CLI change | `cd cli && npm run build && npm test` |
| Presentation change | `cd presentation && npm run build` + visual check |
| Viewer change | `cd viewer && npm run build` + visual check |
| Docs/config only | No QA — mark ✅ directly |
| New feature | Full test suite + new test cases if needed |

### Rule 4: Orchestrator + Agent Execution Pattern

This project uses **Opus 4.6 as Orchestrator + Sonnet 4.6 as Sprint Agents**:

1. Orchestrator writes `agents/sprint-X-brief.md` before spawning
2. Orchestrator spawns: `Agent(subagent_type=general-purpose)` with briefing
3. Agent reads brief + relevant specs + docs, implements tickets
4. Agent updates: `specs/backlog.md` (🔲→✅), docs/, `sprints/sprint-X/summary.md`
5. Orchestrator reviews summary, spawns next sprint(s)

**Parallel execution:** Sprints with no dependencies run as parallel agents in one message.

---

## Project Structure

```
/opt/LightSpec/
├── .claude/commands/       # SDD skill files
├── specs/                  # Role spec files (01-10) + backlog.md
├── agents/                 # Sprint briefing files (sprint-X-brief.md)
├── sprints/                # Sprint summaries (sprint-X/summary.md)
├── docs/                   # Living documentation
│   ├── cli/                # CLI tool docs (scanner, pipeline, commands)
│   ├── presentation/       # Presentation app docs
│   ├── viewer/             # Viewer app docs
│   └── deployment/         # CI/CD + GitHub Pages
├── cli/                    # CLI tool source (TypeScript + tsup)
│   ├── src/
│   │   ├── scanner/        # Detection modules (stack, arch, routes, tests, docs, complexity)
│   │   ├── pipeline/       # depth-router, generate-spec, task-extractor
│   │   ├── commands/       # init, scan, status, graduate, done, init-backlog
│   │   ├── providers/      # anthropic, claude-code, gemini + resolver
│   │   └── prompts/        # 6 Handlebars templates (.hbs)
│   └── tests/              # Unit (scanner/, pipeline/, providers/), commands/, integration/
├── presentation/           # React 18 + Framer Motion landing + slide deck
├── viewer/                 # React 18 + Tailwind warm palette
├── CLAUDE.md               # This file
├── LIGHTSPEC_QUICKSTART.md # New-user getting-started guide
└── README.md               # GitHub README
```

---

## Architecture: Data Flow

```
lsp init / lsp scan
  └─ scanner/           Pure detection — no LLM calls
       ├─ detect-stack.ts        (languages, frameworks, package managers)
       ├─ detect-architecture.ts (monolith / modular / monorepo / microservices)
       ├─ detect-routes.ts       (HTTP routes: Express, Gin, Echo, Flask, NestJS...)
       ├─ detect-tests.ts        (test frameworks + file counts)
       ├─ detect-docs.ts         (README, spec files)
       └─ complexity-scorer.ts   (0-100 → micro / standard / full)
  └─ pipeline/
       ├─ depth-router.ts        (depth → template list + output file names)
       ├─ generate-spec.ts       (loads .hbs templates, streams LLM completion, writes .md)
       └─ task-extractor.ts      (parses tasks from generated markdown, 3-strategy fallback)
  └─ providers/         Strategy pattern — multiple LLM backends
       ├─ resolver.ts            (auto-detect priority: Claude Code → Gemini CLI → Anthropic API)
       ├─ claude-code.provider.ts  (zero API key, uses existing Claude auth via subprocess)
       ├─ gemini-cli.provider.ts
       └─ anthropic-api.provider.ts  (ANTHROPIC_API_KEY env, model: claude-sonnet-4-20250514)
```

**Extensibility:** New providers implement `LLMProvider` interface in `providers/interface.ts` and register in `resolver.ts`. New detectors go in `scanner/`. New depth levels add an `.hbs` template in `prompts/system/` and a route in `depth-router.ts`.

---

## Key Commands

```bash
# CLI
cd cli && npm run build         # Compile TypeScript → dist/
cd cli && npm run dev           # tsup --watch (development)
cd cli && npm run typecheck     # Type-check without building
cd cli && npm test              # Run full vitest test suite
npm link                        # Make lsp available globally

# Run specific test suites
cd cli && npx vitest run tests/scanner/       # Scanner unit tests
cd cli && npx vitest run tests/commands/      # Command unit tests
cd cli && npx vitest run tests/pipeline/      # Pipeline unit tests
cd cli && npx vitest run tests/integration/   # E2E integration tests
cd cli && npx vitest run --coverage           # With coverage report
cd cli && npm run test:watch                  # Interactive watch mode

# Presentation
cd presentation && npm run dev   # Vite dev server :5173
cd presentation && npm run build

# Viewer
cd viewer && npm run dev         # Vite dev server :5174
cd viewer && npm run build
```

Test fixtures for scanner/integration tests live in `cli/tests/fixtures/` (node-project, python-project, go-gin-project, go-echo-project, empty-project).

## CLI Commands Reference

```bash
lsp init [path]          # Scan + generate specs (--depth, --provider, --model, --dry-run, -y)
lsp scan [path]          # Brownfield scanner only, no LLM (--json, --scope)
lsp status               # Show task progress from .lsp/tasks.md
lsp graduate             # Convert .lsp/ output to AutoSpec project (--dry-run, --roles, -y)
lsp done <id>            # Mark a task done in .lsp/tasks.md (--dir)
lsp undone <id>          # Revert a task to pending (--dir)
lsp init-backlog         # Convert .lsp/tasks.md → specs/backlog.md (AutoSpec bridge)
```

`lsp done/undone/status` use `findLspDir()` to search upward from CWD, so they work from any subdirectory of the project.

---

## Design System Rules (CRITICAL)

### Presentation (dark)
- Background: `#0f172a` (slate-950)
- Accent: `#f59e0b` (amber-400)
- Secondary: `#698472` (sage)
- NO RTL classes

### Viewer (warm parchment)
- Background: `#f5f3ed`
- Primary: `#698472` (sage)
- Accent: `#8e6a59` (terracotta)
- Border: `#d8d0ba` (sand)
- Text: `#1a1a1a` (charcoal)
- **NO shadcn/ui, NO @radix-ui, NO RTL classes, NO #0f172a/slate-950**

## Current Sprint

See `specs/backlog.md` for the active sprint and open tickets.
