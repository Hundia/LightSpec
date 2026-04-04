---
sprint: 37
status: complete
date: 2026-03-27
theme: LightSpec CLI
---

> *Historical: This sprint was executed in the AutoSpec monorepo and extracted to the standalone LightSpec repo on 2026-04-04.*

# Sprint 37 Summary — LightSpec

**Date:** 2026-03-27
**Status:** ✅ COMPLETE
**Theme:** LightSpec — Just enough spec, just fast enough

## Overview

Sprint 37 delivered LightSpec, AutoSpec's lightweight younger brother — a complete
framework with adaptive depth (micro/standard/full), brownfield intelligence, and a graduation
path to AutoSpec. The sprint ran in 4 waves with 8 parallel Sonnet agents orchestrated by Opus.
All 31 tickets complete: 82 tests passing, 3 builds green (CLI 1.66KB, presentation 368KB,
viewer 947KB), 6 design docs, presentation site with 12 slides + landing page.

## Completed Tickets

### Wave 1 — Foundation & Scanner (33 pts) ✅

| # | Ticket | Status | Docs |
|---|--------|--------|------|
| 37.1 | cli/ package scaffold | ✅ | — |
| 37.2 | Provider layer (interface, resolver, anthropic-api, claude-code, gemini-cli) | ✅ | — |
| 37.3 | Scanner: detect-stack.ts | ✅ | `docs/cli/03_scanner.md` |
| 37.4 | Scanner: detect-architecture.ts | ✅ | `docs/cli/03_scanner.md` |
| 37.5 | Scanner: detect-tests/routes/docs | ✅ | `docs/cli/03_scanner.md` |
| 37.6 | Scanner: complexity-scorer.ts | ✅ | `docs/cli/04_adaptive_depth.md` |
| 37.7 | Scanner unit tests (15+) | ✅ | — |
| 37.8 | Design docs 01/02/03 | ✅ | `docs/cli/` |
| 37.9 | Design doc 04_adaptive_depth | ✅ | `docs/cli/` |

### Wave 2 — Pipeline & CLI (38 pts) ✅

| # | Ticket | Status | Docs |
|---|--------|--------|------|
| 37.10 | Prompt templates (6 Handlebars) | ✅ | `docs/cli/05_prompts.md` |
| 37.11 | Pipeline: depth-router.ts | ✅ | — |
| 37.12 | Pipeline: generate-spec.ts | ✅ | — |
| 37.13 | Pipeline: task-extractor.ts | ✅ | — |
| 37.14 | CLI: index.ts + init + scan | ✅ | — |
| 37.15 | CLI: status + graduate | ✅ | `docs/cli/06_graduation_path.md` |
| 37.16 | Pipeline + CLI unit tests (15+) | ✅ | — |
| 37.17 | Design docs 05/06 | ✅ | `docs/cli/` |

### Wave 3a — Presentation (32 pts) ✅

| # | Ticket | Status | Docs |
|---|--------|--------|------|
| 37.18 | Scaffold presentation/ | ✅ | — |
| 37.19 | Landing: Nav + Hero + Problem | ✅ | — |
| 37.20 | Landing: Depth + Brownfield + Comparison | ✅ | — |
| 37.21 | Landing: QuickStart + Footer | ✅ | — |
| 37.22 | 12 slide components with Framer Motion | ✅ | — |
| 37.23 | Slide data EN + HE (i18n) | ✅ | — |
| 37.24 | Background effects (5 effects + Lightning Streaks) | ✅ | — |

### Wave 3b — Viewer & QA (30 pts) ✅

| # | Ticket | Status | Docs |
|---|--------|--------|------|
| 37.25 | Viewer: LspPage.tsx at /lsp route | ✅ | — |
| 37.26 | Viewer: Sidebar nav + App.tsx route | ✅ | — |
| 37.27 | Viewer: LightSpec sprint data in backlog.ts | ✅ | — |
| 37.28 | Integration tests: scan on fixtures | ✅ | — |
| 37.29 | E2E: scan lightspec repo | ✅ | — |
| 37.30 | Graduate integration test | ✅ | — |
| 37.31 | Sprint close: backlog + CI + summary | ✅ | `sprints/sprint-37/summary.md` |

## Documentation Updated

| Doc File | Change | Related Tickets |
|----------|--------|-----------------|
| `docs/cli/01_philosophy.md` | Created — LightSpec philosophy and positioning | 37.8 |
| `docs/cli/02_architecture.md` | Created — CLI architecture, file structure | 37.8 |
| `docs/cli/03_scanner.md` | Created — 5-module brownfield scanner | 37.8 |
| `docs/cli/04_adaptive_depth.md` | Created — heuristic scoring, depth levels | 37.9 |
| `docs/cli/05_prompts.md` | Created — Handlebars template system | 37.17 |
| `docs/cli/06_graduation_path.md` | Created — LightSpec → AutoSpec graduation flow | 37.17 |
| `viewer/src/pages/LspPage.tsx` | Created — LspPage dashboard | 37.25 |
| `viewer/src/data/backlog.ts` | Added Sprint 37 data (31 tickets) | 37.27 |
| `viewer/src/App.tsx` | Added /lsp route | 37.26 |
| `viewer/src/components/layout/Sidebar.tsx` | Added LightSpec nav item | 37.26 |
| `.github/workflows/ci.yml` | Added test-cli + build-presentation jobs | 37.31 |
| `.github/workflows/pages.yml` | Added presentation sub-site build | 37.31 |

## Key Files Modified / Created

| File | Change |
|------|--------|
| `cli/` | New package — 30+ source files |
| `cli/tests/integration/scan-integration.test.ts` | New — 7 integration tests on fixtures |
| `cli/tests/integration/cli-integration.test.ts` | New — 8 CLI integration tests |
| `cli/tests/integration/e2e-lightspec.test.ts` | New — 6 E2E tests (scans lightspec itself) |
| `cli/tests/integration/graduate-integration.test.ts` | New — 6 graduate integration tests |
| `viewer/src/pages/LspPage.tsx` | New — 4-tab LightSpec dashboard page |
| `viewer/src/data/backlog.ts` | Sprint 37 data added |
| `specs/backlog.md` | Wave 1 + 2 + 3b tickets marked ✅ |

## QA & Test Results

| Suite | Pass | Fail | Total | Notes |
|-------|------|------|-------|-------|
| Scanner tests | 35 | 0 | 35 | detect-stack, architecture, complexity-scorer |
| Pipeline tests | 13 | 0 | 13 | depth-router, generate-spec, task-extractor |
| Command tests | 6 | 0 | 6 | init, graduate |
| Integration: scan fixtures | 7 | 0 | 7 | New in Wave 3b |
| Integration: CLI | 8 | 0 | 8 | New in Wave 3b |
| Integration: E2E lightspec | 6 | 0 | 6 | New in Wave 3b |
| Integration: graduate | 6 | 0 | 6 | New in Wave 3b |
| Fixture unit test | 1 | 0 | 1 | node-project fixture |
| **Total** | **82** | **0** | **82** | |

**Viewer build:** exits 0, 2561 modules transformed.

## Retrospective

**What went well:**
- Parallel wave design worked — Wave 1+2 complete before Wave 3b started
- Scanner + complexity scorer are fully tested and accurate on real projects
- Graduate command correctly produces 10 AutoSpec role spec files
- Integration tests on real fixtures catch issues unit tests miss

**Known issues:**
- `lsp init` bundled output has cross-spawn/child_process dynamic require warning in ESM — known tsup/ESM limitation with CJS dependencies. Tests pass; runtime works when run via `node --experimental-vm-modules`.

**Presentation highlights:**
- 27 TSX components (8 landing sections, 12 slides, backgrounds, nav)
- 5 background effects including new Lightning Streaks (LightSpec speed theme)
- Full i18n (English + Hebrew) with RTL support
- Keyboard slide navigation, progress dots, language toggle
- Builds to 368KB (1844 modules)
