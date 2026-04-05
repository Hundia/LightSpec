# LightSpec — SDD Project Backlog

**Version:** 1.0
**Created:** 2026-03-27
**Framework:** LightSpec develops itself using AutoSpec's SDD methodology

---

## Sprint 37: Foundation — CLI + Presentation (~134 pts)

**Theme:** Bootstrap LightSpec as a standalone SDD project — CLI, presentation, brownfield scanner
**Status:** ✅ Done

### Wave 1: Foundation + Scanner (34 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 37.1 | `cli/` package scaffold: package.json, tsconfig, vitest.config | DevOps | 3 | ✅ | — | — |
| 37.2 | Provider re-export layer: `cli/src/providers/index.ts` | Backend | 2 | ✅ | 37.1 | — |
| 37.3 | Scanner: `detect-stack.ts` — read manifest files for tech stack | Backend | 5 | ✅ | 37.1 | `docs/cli/03_scanner.md` |
| 37.4 | Scanner: `detect-architecture.ts` — directory structure analysis | Backend | 5 | ✅ | 37.1 | `docs/cli/03_scanner.md` |
| 37.5 | Scanner: `detect-tests.ts`, `detect-routes.ts`, `detect-docs.ts` | Backend | 5 | ✅ | 37.3 | `docs/cli/03_scanner.md` |
| 37.6 | Scanner: `complexity-scorer.ts` — heuristic scoring + depth routing | Backend | 5 | ✅ | 37.3-37.5 | `docs/cli/04_adaptive_depth.md` |
| 37.7 | Scanner unit tests: 15+ tests across all modules | QA | 5 | ✅ | 37.3-37.6 | — |
| 37.8 | Design docs: `docs/cli/01_philosophy.md`, `02_architecture.md`, `03_scanner.md` | Docs | 3 | ✅ | 37.1 | `docs/cli/` |
| 37.9 | Design doc: `docs/cli/04_adaptive_depth.md` | Docs | 1 | ✅ | 37.6 | `docs/cli/` |

### Wave 2: Pipeline + CLI (38 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 37.10 | Prompt templates: 6 Handlebars files (analyze, micro, standard, full-product/technical/quality) | Backend | 8 | ✅ | 37.6 | `docs/cli/05_prompts.md` |
| 37.11 | Pipeline: `depth-router.ts` — select template(s) by depth level | Backend | 3 | ✅ | 37.10 | — |
| 37.12 | Pipeline: `generate-spec.ts` — unified generation using providers | Backend | 8 | ✅ | 37.11, 37.2 | — |
| 37.13 | Pipeline: `task-extractor.ts` — parse task list from spec | Backend | 3 | ✅ | 37.12 | — |
| 37.14 | CLI: `index.ts` entry + `init` command + `scan` command | Backend | 5 | ✅ | 37.12, 37.13 | — |
| 37.15 | CLI: `status` command + `graduate` command | Backend | 5 | ✅ | 37.14 | `docs/cli/06_graduation_path.md` |
| 37.16 | Pipeline + CLI unit tests: 15+ tests | QA | 5 | ✅ | 37.12-37.15 | — |
| 37.17 | Design docs: `docs/cli/05_prompts.md`, `06_graduation_path.md` | Docs | 3 | ✅ | 37.10, 37.15 | `docs/cli/` |

### Wave 3: Presentation (32 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 37.18 | Scaffold `presentation/`: package.json, vite, tailwind slate+amber palette | Frontend | 3 | ✅ | — | — |
| 37.19 | Landing: Navigation, HeroSection, ProblemSection | Frontend | 8 | ✅ | 37.18 | — |
| 37.20 | Landing: AdaptiveDepthSection, BrownfieldSection, ComparisonSection | Frontend | 5 | ✅ | 37.18 | — |
| 37.21 | Landing: QuickStartSection, Footer | Frontend | 3 | ✅ | 37.18 | — |
| 37.22 | 12 presentation slide components with Framer Motion | Frontend | 8 | ✅ | 37.18 | — |
| 37.23 | Slide data: `slides-en.ts`, `slides-he.ts` (i18n) | Frontend | 3 | ✅ | 37.22 | — |
| 37.24 | Background effects: particles, circuits, gradient, lightning, hex | UI | 2 | ✅ | 37.18 | — |

### Wave 4: Viewer + QA (30 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 37.25 | Viewer: `LspPage.tsx` at `/lsp` route | Frontend | 8 | ✅ | Wave 2 | — |
| 37.26 | Viewer: Sidebar nav item + App.tsx route | Frontend | 2 | ✅ | 37.25 | — |
| 37.27 | Viewer: LightSpec sprint data in `backlog.ts` | Frontend | 3 | ✅ | 37.25 | — |
| 37.28 | Integration tests: `lsp init` on fixtures | QA | 8 | ✅ | Wave 2 | — |
| 37.29 | E2E: `lsp init` on LightSpec repo (brownfield) | QA | 5 | ✅ | Wave 2 | — |
| 37.30 | Graduate test: `lsp graduate` → valid AutoSpec structure | QA | 3 | ✅ | 37.15 | — |
| 37.31 | Sprint close: backlog update, pages.yml, summary | PM | 3 | ✅ | All | `sprints/sprint-37/summary.md` |

---

## Sprint 38: Presentation Polish — Enterprise Grade (~52 pts)

**Theme:** Elevate LightSpec presentation from 7.5/10 to 9/10 — 4 new slides, animation upgrades, accessibility, mobile fixes, interactive polish
**Status:** ✅ Done

### Phase 1: Foundation — Accessibility + Infrastructure (14 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 38.1 | `prefers-reduced-motion` global support — `useReducedMotion()` hook + CSS `@media` rule | Frontend | 3 | ✅ | — | — |
| 38.2 | Mobile hamburger menu for Navigation — slide-in drawer with AnimatePresence | Frontend | 5 | ✅ | — | — |
| 38.3 | Extract hardcoded data to `src/data/landing-en.ts` + `landing-he.ts` | Frontend | 3 | ✅ | — | — |
| 38.4 | GPU acceleration hints — `will-change: transform` on BackgroundEffects particles | Frontend | 3 | ✅ | — | — |

### Phase 2: Content — New Slides + i18n (16 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 38.5 | `LiveDemoSlide.tsx` — complete `lsp init` session with typing simulation, macOS terminal chrome | Frontend | 5 | ✅ | 38.3 | — |
| 38.6 | `UseCasesSlide.tsx` — 3-column cards (Bug Fix/New Feature/Refactor) with depth mapping | Frontend | 3 | ✅ | 38.3 | — |
| 38.7 | `ArchitectureSlide.tsx` — interactive SVG pipeline: Scanner → Depth Router → Generator → Output | Frontend | 5 | ✅ | 38.1 | — |
| 38.8 | `StatsSlide.tsx` — 3 animated counters (useSpring) + testimonial quote card | Frontend | 3 | ✅ | 38.3 | — |

### Phase 3: Polish — Animations + UX (14 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 38.9 | Word-by-word tagline animation on TitleSlide + HeroSection | Frontend | 2 | ✅ | 38.1 | — |
| 38.10 | Keyboard navigation for tabbed slides — ArrowLeft/Right, aria-selected | Frontend | 3 | ✅ | — | — |
| 38.11 | Hover states across all components — cards scale(1.03), glow borders | Frontend | 2 | ✅ | — | — |
| 38.12 | Terminal mobile overflow fix + copy-to-clipboard | Frontend | 3 | ✅ | — | — |
| 38.13 | Gradient text on all major headings | Frontend | 2 | ✅ | — | — |
| 38.14 | Color accessibility audit — bump low-contrast text | Frontend | 2 | ✅ | — | — |

### Phase 4: Integration + QA (8 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 38.15 | Wire 4 new slides into PresentationPage — imports, slideComponents registry, bgIds array, slide data EN+HE | Frontend | 3 | ✅ | 38.5-38.8 | — |
| 38.16 | Viewer `backlog.ts` Sprint 38 entry — 17 tickets, 52 pts | Frontend | 2 | ✅ | — | — |
| 38.17 | Build verification + visual QA — 16 slides render, keyboard nav, mobile, HE i18n | QA | 3 | ✅ | 38.15, 38.16 | `sprints/sprint-38/summary.md` |

---

## Sprint 39: Developer's Guide — Task Flow API + Interactive Tutorial (~64 pts)

**Theme:** Build a real example project with e2e tests + an interactive split-panel guide site using AutoDeck's engine
**Status:** ✅ Done

### Phase 1: Foundation (18 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 39.1 | `task-flow-api` scaffold: package.json, tsconfig, vitest.config, SQLite schema | Backend | 3 | ✅ | — | `examples/task-flow-api/README.md` |
| 39.2 | `task-flow-api` auth routes + service (register, login, JWT) | Backend | 5 | ✅ | 39.1 | — |
| 39.3 | `task-flow-api` lists + tasks routes + services (CRUD, status transitions) | Backend | 5 | ✅ | 39.2 | — |
| 39.4 | `task-flow-api` 20 integration tests (Vitest + supertest, all passing) | QA | 5 | ✅ | 39.3 | — |

### Phase 2: Guide Site (16 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 39.5 | Guide scaffold: Vite + AutoDeck engine + GuidePage + StepPanel split-panel layout | Frontend | 5 | ✅ | — | `docs/guide/01_overview.md` |
| 39.6 | Display components: TerminalBlock, FileViewer, FileTree, SpecViewer, TaskListView, DirTree, StatsRow | Frontend | 5 | ✅ | 39.5 | — |
| 39.7 | `steps-en.ts` data architecture + real CLI output capture for steps 3–6 | Backend | 3 | ✅ | 39.4, 39.5 | — |
| 39.8 | Sprint 39 SDD: backlog tickets, viewer data, agents/sprint-39-brief.md | PM | 3 | ✅ | — | — |

### Phase 3: Guide Content (22 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 39.9  | Guide steps 1–3: Welcome, Project Tour, `lsp scan` | Frontend | 5 | ✅ | 39.6, 39.7 | — |
| 39.10 | Guide steps 4–6: `lsp init`, Spec Review, `lsp status` | Frontend | 5 | ✅ | 39.7 | — |
| 39.11 | Guide steps 7–9: /execute-ticket, Sprint Progress, /plan-sprint | Frontend | 5 | ✅ | 39.6 | — |
| 39.12 | Guide steps 10–12: Sprint 2 Init, `lsp graduate`, Continuity | Frontend | 5 | ✅ | 39.6 | — |
| 39.13 | `DiffViewer.tsx` and `TimelineView.tsx` display components | Frontend | 2 | ✅ | 39.5 | Deferred — not needed for current 12 steps |

### Phase 4: Integration + QA (8 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 39.14 | Wire all 12 steps into GuidePage registry, chapter sidebar complete | Frontend | 3 | ✅ | 39.9–39.12 | — |
| 39.15 | GitHub Actions update: add guide build + nest `guide/dist` at `presentation/dist/guide/` in pages.yml | DevOps | 3 | ✅ | 39.5 | `docs/deployment/01_github_pages.md` |
| 39.16 | Final QA: all builds + 20 e2e tests + naming checks + sprint-39 summary | QA | 2 | ✅ | 39.14, 39.15 | `sprints/sprint-39/summary.md` |
