---
title: LightSpec Developer's Guide — Overview
sprint: 39
created: 2026-04-05
---

# LightSpec Developer's Guide

The Developer's Guide is an interactive 12-step split-panel tutorial at `/opt/LightSpec/guide/` that demonstrates the complete LightSpec workflow using a real example project (Task Flow API).

## Purpose

Show — not tell — how LightSpec is used. Every step shows real CLI outputs, real spec content, and real code. Built on AutoDeck's dark slate+amber visual engine.

## Architecture

```
guide/
├── src/
│   ├── engine/
│   │   └── BackgroundEffects.tsx   ← AutoDeck engine (copied)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── GuidePage.tsx        ← 12-step shell, navigation
│   │   │   └── StepPanel.tsx        ← 40/60 split panel
│   │   └── display/
│   │       ├── TerminalBlock.tsx    ← macOS terminal with line types
│   │       ├── FileTree.tsx         ← animated file tree
│   │       ├── FileViewer.tsx       ← syntax-highlighted file content
│   │       ├── TaskListView.tsx     ← tasks.md status board
│   │       ├── StatsRow.tsx         ← animated stat cards
│   │       └── DirTree.tsx          ← flat directory listing
│   └── data/
│       └── steps-en.ts              ← all 12 steps data
├── vite.config.ts                   ← base: /LightSpec/guide/
└── package.json
```

## 12 Steps

| # | Title | Skill |
|---|-------|-------|
| 1 | Welcome | — |
| 2 | Project Tour | — |
| 3 | `lsp scan` | lsp scan |
| 4 | `lsp init` | lsp init |
| 5 | Reading the Spec | — |
| 6 | `lsp status` | lsp status |
| 7 | /execute-ticket | /execute-ticket |
| 8 | Sprint Progress | — |
| 9 | /plan-sprint | /plan-sprint |
| 10 | Sprint 2 Init | lsp init |
| 11 | `lsp graduate` | lsp graduate |
| 12 | Continuity | — |

## Design System

- Background: `bg-slate-950`
- Accent: `text-amber-400`, `border-amber-500/30`, `bg-amber-500/10`
- Left panel: `border-l-2 border-l-amber-500/30`
- Terminal: macOS chrome, `bg-slate-950/90`
- Fonts: Inter (prose), JetBrains Mono (terminal/code)

## GitHub Pages

Served at `hundia.github.io/LightSpec/guide/`
Built by `.github/workflows/pages.yml` — guide/dist nested into presentation/dist/guide/

## Sprint 39

- Introduced in Sprint 39 (2026-04-05)
- Example project: Task Flow API (Express + SQLite + JWT, 20 e2e tests)
- All outputs captured from real `lsp` CLI runs
