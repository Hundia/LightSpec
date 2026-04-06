# Sprint 41 Summary — First-Run to First-Value

**Date:** 2026-04-05
**Status:** ✅ COMPLETE
**Theme:** Remove every barrier between `npm install` and a working spec-driven workflow

## Overview

Sprint 41 addressed the top NPS-blocking issues from the Sprint 40 DX usability study (NPS: -67). Eight tickets across 3 phases delivered: a standalone LightSpec quick-start doc, Go route extraction, `lsp done`/`undone` commands, scanner confidence signals, `lsp init-backlog` bridge, provider error recovery, and `lsp graduate` quality improvements.

## Completed Tickets

| ID | Ticket | Status | Key Change | Docs |
|----|--------|--------|-----------|------|
| 41.1 | LIGHTSPEC_QUICKSTART.md | ✅ | Standalone entry point, install-first, 3-provider setup | `/opt/LightSpec/LIGHTSPEC_QUICKSTART.md` |
| 41.2 | Go route extraction | ✅ | `extractGoRoutes()` + `hasApi` fix for `main.go` | `docs/cli/03_scanner.md` |
| 41.3 | `lsp done` + path robustness | ✅ | done/undone commands + upward `.lsp/` search | `docs/cli/07_new_commands.md` |
| 41.4 | Scanner confidence signals | ✅ | Detection Confidence section + JSON confidence obj | `docs/cli/03_scanner.md` |
| 41.5 | `lsp init-backlog` | ✅ | tasks.md → specs/backlog.md bridge | `docs/cli/07_new_commands.md` |
| 41.6 | Provider error messages | ✅ | 3-option recovery table + TTY fix | `docs/cli/07_new_commands.md` |
| 41.7 | graduate role filtering | ✅ | --dry-run, role filter, project name, CLAUDE.md guard | `docs/cli/06_graduation_path.md` |
| 41.8 | QA + sprint close | ✅ | 154/154 tests pass | `sprints/sprint-41/summary.md` |

## Documentation Updated

| Doc File | Change | Related Tickets |
|----------|--------|-----------------|
| `/opt/LightSpec/LIGHTSPEC_QUICKSTART.md` | New standalone quick-start (3-provider, 3-command walkthrough) | 41.1 |
| `/opt/FitnessAiManager/autospec/QUICKSTART.md` | Added cross-reference link to LIGHTSPEC_QUICKSTART.md | 41.1 |
| `docs/cli/07_new_commands.md` | New — documents `lsp done`, `lsp undone`, `lsp init-backlog` | 41.3, 41.5 |

## QA & Test Results

| Suite | Pass | Fail | Total | Notes |
|-------|------|------|-------|-------|
| CLI unit + integration | 154 | 0 | 154 | 18 test files |
| Build | ✅ | 0 | 1 | `npm run build` exits 0, 36ms |

### DoD Verification

| DoD Item | Result |
|----------|--------|
| `LIGHTSPEC_QUICKSTART.md` exists, starts with `npm install -g lightspec` | ✅ |
| All 3 providers covered in quickstart | ✅ |
| `extractGoRoutes()` in `detect-routes.ts` with `**/*.go` glob | ✅ |
| `detect-architecture.ts` checks `main.go` for Go `hasApi` detection | ✅ |
| `buildConfidenceSignals()` in `scan.ts`, "Detection Confidence" output section | ✅ |
| `cli/src/commands/done.ts` exists | ✅ |
| `index.ts` registers both `done` and `undone` | ✅ |
| `cli/src/commands/init-backlog.ts` exists | ✅ |
| `index.ts` registers `init-backlog` | ✅ |
| `resolver.ts` contains "No LLM provider found" with 3-option help | ✅ |
| `graduate.ts` has `--dry-run` flag | ✅ |
| `graduate.ts` replaces `[Project Name]` with actual project name | ✅ |
| `graduate.ts` checks `hasFrontend`/`hasDatabase` for role filtering | ✅ |
| Tickets 41.1–41.7 all ✅ in backlog.md | ✅ |
| QUICKSTART.md cross-reference to LIGHTSPEC_QUICKSTART.md | ✅ |

## Key Files Modified

| File | Change |
|------|--------|
| `cli/src/commands/done.ts` | New — `lsp done` / `lsp undone` commands |
| `cli/src/commands/init-backlog.ts` | New — `lsp init-backlog` bridge |
| `cli/src/scanner/detect-routes.ts` | Added `extractGoRoutes()` with `**/*.go` glob |
| `cli/src/scanner/detect-architecture.ts` | Go `hasApi` detection via `main.go` glob |
| `cli/src/commands/scan.ts` | `buildConfidenceSignals()` + "Detection Confidence" section |
| `cli/src/commands/init.ts` | Provider-first order, TTY check |
| `cli/src/providers/resolver.ts` | Actionable 3-option provider error message |
| `cli/src/commands/graduate.ts` | Role filter, `--dry-run`, project name substitution, CLAUDE.md guard |
| `cli/src/index.ts` | Register `done`, `undone`, `init-backlog` |
| `LIGHTSPEC_QUICKSTART.md` | New standalone quick-start |
| `docs/cli/07_new_commands.md` | New command reference for Sprint 41 commands |
| `specs/backlog.md` | Tickets 41.1–41.8 marked ✅, Sprint 41 status ✅ Done |
| `viewer/src/data/backlog.ts` | Sprint 41 entry added with all tickets `done` |

## Sprint 40 DX Study Issues Addressed

| Issue | Severity | Sprint 40 Persona | Fix |
|-------|---------|------------------|-----|
| No install instructions | 5 (blocker) | Alex (junior) | 41.1 |
| Provider setup undisclosed | 5 (blocker) | Alex (junior) | 41.6 |
| Go routes not extracted | 4 | Jordan (senior) | 41.2 |
| LSS→skill gap | 4 | Sam (mid) | 41.5 |
| Scanner false confidence | 3 | Sam + Jordan | 41.4 |
| No task completion command | 2 | Alex + Jordan | 41.3 |
| Graduate produces stubs | 3 | All personas | 41.7 |

## Retrospective

**What went well:**
- Parallel Batch 1 (4 agents) and Batch 2 (3 agents in worktrees) with zero merge conflicts
- All 154 tests passed after merge — no regressions
- Sprint 40 research directly drove every ticket — no guesswork about priority
- Build time excellent: 36ms for tsup compilation

**What to improve:**
- `lsp graduate` scan-result.json dependency required a minor fix to `init.ts` — should be documented as an integration contract
- Worktree isolation required manual verification of merge state
