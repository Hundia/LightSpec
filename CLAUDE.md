# Claude Code Memory — LightSpec

## About This Project

LightSpec is a lightweight Spec-Driven Development CLI tool. **This project develops itself using AutoSpec's SDD methodology.** Use `/sprint-run`, `/execute-ticket`, `/sprint-status` etc. in Claude Code.

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
├── .claude/commands/       # 10 SDD skill files
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
│   │   ├── scanner/        # 5 detection modules
│   │   ├── pipeline/       # depth-router, generate-spec, task-extractor
│   │   ├── commands/       # init, scan, status, graduate
│   │   ├── providers/      # anthropic, claude-code, gemini
│   │   └── prompts/        # 6 Handlebars templates
│   └── tests/              # Unit, integration, E2E tests
├── presentation/           # React 18 + Framer Motion landing + slide deck
│   └── src/
│       ├── components/
│       │   ├── landing/    # 8 landing page sections
│       │   ├── slides/     # 16 slide components
│       │   └── backgrounds/ # Animated background effects
│       └── data/           # slides-en.ts, slides-he.ts, landing-en.ts, landing-he.ts
├── viewer/                 # React 18 + Tailwind warm palette (10 pages)
│   └── src/
│       ├── data/           # backlog.ts, docs.ts, specs.ts, sprints.ts
│       └── pages/          # Dashboard, Docs, Specs, Backlog, Sprints, LspPage...
├── CLAUDE.md               # This file
├── QUICKSTART.md           # Usage guide
└── README.md               # GitHub README
```

## Key Commands

```bash
# CLI
cd cli && npm run build         # Compile TypeScript → dist/
cd cli && npm test              # Run vitest test suite
cd cli && npm run dev           # tsup --watch (development)
npm link                        # Make lsp available globally

# Presentation
cd presentation && npm run dev  # Vite dev server :5173
cd presentation && npm run build

# Viewer
cd viewer && npm run dev        # Vite dev server :5174
cd viewer && npm run build

# Tests
cd cli && npx vitest run                              # All tests
cd cli && npx vitest run tests/scanner/              # Scanner only
cd cli && npx vitest run --coverage                  # With coverage
```

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

Sprint 38 🔄 In Progress — see `specs/backlog.md` for active tickets.

7 tickets remaining: 38.5, 38.6, 38.7, 38.8, 38.9, 38.15, 38.17
