# Sprint 39 Agent Brief: LightSpec Developer's Guide

**Date:** 2026-04-05
**Sprint:** 39
**Theme:** Developer's Guide — Task Flow API + Interactive Tutorial
**Orchestrator:** Opus (plan) → Sonnet (execute)

## What We're Building

Two deliverables:
1. `/opt/LightSpec/examples/task-flow-api/` — Real TypeScript + Express + SQLite API with 20 passing e2e tests
2. `/opt/LightSpec/guide/` — Interactive split-panel guide site using AutoDeck's engine, documenting the full LightSpec workflow

## Example Project: task-flow-api

TypeScript + Express + better-sqlite3 + JWT + Zod validation
Routes: /auth (register/login), /lists (CRUD), /tasks (CRUD + status)
Tests: 20 Vitest + supertest integration tests
Target complexity: ~38/100 → standard depth

## Guide Site: /opt/LightSpec/guide/

- Built on AutoDeck's BackgroundEffects engine (dark slate + amber)
- 12 steps, split-panel: left (explanation 40%) + right (output 60%)
- Component library: TerminalBlock, FileTree, FileViewer, TaskListView, DirTree, StatsRow
- Data: steps-en.ts with all 12 step definitions
- GitHub Pages: base `/LightSpec/guide/`

## Phase Structure

Phase 1 (parallel): 1A (task-flow-api), 1B (guide scaffold), 1C (SDD infra — this agent)
Phase 2 (serial after 1A): Run lsp CLI on task-flow-api, capture real outputs
Phase 3 (parallel after 1B+2A): 3A (steps 1-6), 3B (steps 7-12)
Phase 4 (serial): 4A integration + QA + pages.yml update

## Critical Design Constraints

- Guide vite base: `/LightSpec/guide/` (for GitHub Pages)
- AutoDeck BackgroundEffects uses CSS vars: --theme-bg-effect-color-1, --theme-bg-effect-color-2
- Dark slate-950 background, amber-400/500 accent throughout guide
- Steps data in `steps-en.ts` must use discriminated union ResultBlock types
- All 12 steps must have non-empty left + right arrays before wiring step

## Key Files

- `/opt/LightSpec/guide/src/data/steps-en.ts` — master data file
- `/opt/LightSpec/guide/src/components/layout/GuidePage.tsx` — 12-step shell
- `/opt/LightSpec/guide/src/components/layout/StepPanel.tsx` — split-panel
- `/opt/LightSpec/guide/src/engine/BackgroundEffects.tsx` — copied from AutoDeck
- `/opt/LightSpec/.github/workflows/pages.yml` — needs guide build step added in Phase 4
- `/opt/LightSpec/viewer/src/components/layout/Sidebar.tsx` — needs Guide link in Phase 4

## AutoDeck Engine Location

Source at `/opt/autodeck/src/engine/BackgroundEffects.tsx` — copy verbatim into guide.
