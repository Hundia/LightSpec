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

---

## Sprint 40: DX Usability Study — Developer Experience Research (~38 pts)

**Theme:** Simulate a comprehensive usability study with 3 developer personas + independent expert reviewers to produce prioritized DX improvements for Sprint 41
**Status:** ✅ Done

### Wave 1: Persona Trials — PARALLEL (15 pts)

| ID | Ticket | Owner | Model | Points | Status | Deps |
|----|--------|-------|-------|--------|--------|------|
| 40.1 | Persona A: Junior developer trial | Research | Sonnet | 5 | ✅ | — |
| 40.2 | Persona B: Mid-level developer trial | Research | Sonnet | 5 | ✅ | — |
| 40.3 | Persona C: Senior developer trial | Research | Sonnet | 5 | ✅ | — |

### Wave 2: Research Analysis — SEQUENTIAL then PARALLEL (11 pts)

| ID | Ticket | Owner | Model | Points | Status | Deps |
|----|--------|-------|-------|--------|--------|------|
| 40.4 | Experience Researcher synthesis | Research | Sonnet | 5 | ✅ | 40.1–40.3 |
| 40.5 | Expert Review 1: DX Tooling Specialist | Research | Sonnet | 3 | ✅ | 40.4 |
| 40.6 | Expert Review 2: SDD Methodology Expert | Research | Sonnet | 3 | ✅ | 40.4 |

### Wave 3: Synthesis + Sprint Close (12 pts)

| ID | Ticket | Owner | Model | Points | Status | Deps |
|----|--------|-------|-------|--------|--------|------|
| 40.7 | PM synthesis + final report | PM | Opus | 8 | ✅ | 40.5, 40.6 |
| 40.8 | QA verification | QA | Sonnet | 2 | ✅ | 40.7 |
| 40.9 | Sprint close | PM | Haiku | 2 | ✅ | 40.8 |

### Definition of Done
- [ ] All 9 research output files exist under `docs/research/dx_study_sprint40/`
- [ ] QA checklist passes all format gates (independence check included)
- [ ] `final_report.md` severity×effort matrix has ≥10 items with evidence
- [ ] `new_backlog_tickets.md` has ≥5 Sprint 41 tickets in valid LightSpec format
- [ ] `specs/backlog.md` updated with Sprint 41 skeleton
- [ ] `sprints/sprint-40/summary.md` created

---

## Sprint 41: First-Run to First-Value — Unblock the Pipeline (~35 pts)

**Theme:** Remove every barrier between `npm install` and a working spec-driven workflow
**Status:** ✅ Done
**Motivation:** Sprint 40 DX study (NPS: -67). Top blockers: (1) no LightSpec quick-start or provider setup guide, (2) LSS output does not connect to the skill layer, (3) scanner presents false confidence on polyglot projects. Fixing these three issues addresses the root cause of detractor scores from both junior and senior personas.

### Phase 1: First-Run Experience — PARALLEL (10 pts)

These tickets have no dependencies and address the first 5 minutes of a new user's experience.

| ID | Ticket | Description | Owner | Model | Points | Status | Deps |
|----|--------|-------------|-------|-------|--------|--------|------|
| 41.1 | LightSpec standalone quick-start document | Create `LIGHTSPEC_QUICKSTART.md` as the canonical entry point for new users. Must include: (1) `npm install -g lightspec` as first command, (2) LightSpec vs AutoSpec decision criteria (solo/small/brownfield -> LightSpec; team/SRS/full ceremony -> AutoSpec), (3) provider setup table covering Claude Code (no key needed), Anthropic API (free credit link), Gemini API (free tier link) with cost context, (4) three-command walkthrough (`lsp scan .`, `lsp init .`, `lsp status`), (5) complete CLI flag reference for all commands. Must NOT reference AutoSpec workflows, role specs, or sprint skills. Cross-link from main QUICKSTART.md. Include provider error recovery instructions that will be reproduced verbatim in `init.ts` error output. **Study evidence:** Alex sev-5 blocker ("Couldn't find any install command"); researcher Category 1+2 consensus; both reviewers Priority #1. Verify: a developer with no prior LightSpec exposure can go from zero to generated spec following only this document. | Docs | sonnet | 3 | ✅ | — |
| 41.2 | Implement Go route extraction in `detect-routes.ts` | Add `extractGoRoutes()` function to `cli/src/scanner/detect-routes.ts` with a `**/*.go` file glob. Implement regex patterns for Gin (`r.GET("/path", handler)`), Echo (`e.GET("/path", handler)`), Fiber (`app.Get("/path", handler)`), and Chi (`r.Get("/path", handler)`) as documented in `docs/lss/03_scanner.md`. Update `detectRoutes()` framework resolution chain to include Go frameworks. Add 3 integration tests: minimal Gin file with 3 routes, Echo file with 2 routes, and a Go project with no HTTP framework (should return empty routes gracefully). Update `hasApi` detection in `detect-architecture.ts` to recognize `main.go` at any depth (not just project root) and common Go directory patterns (`internal/http/`, `pkg/api/`, `cmd/server/`). **Study evidence:** Jordan sev-4 source-verified ("documented feature that is not implemented"); both reviewers identified as critical trust issue. Verify: `lsp scan` on a Go+Gin project with 3 routes returns `routes.length === 3` and `hasApi: true`. | CLI | sonnet | 5 | ✅ | — |
| 41.3 | `lsp done <id>` command + `lsp status` path robustness | Two task management improvements. (1) Add `lsp done <id>` command that reads `.lsp/tasks.md`, finds task row by ID, sets Done column to `[x]`, writes file back. Add `lsp undone <id>` as inverse. Validate task ID exists; print confirmation with task description; error helpfully if task already done or not found. (2) Fix `lsp status`, `lsp done`, and `lsp graduate` to search upward from `process.cwd()` to filesystem root looking for `.lsp/` directory, so running from a subdirectory works. Add `--dir <path>` flag as explicit override. **Study evidence:** Alex sev-2 + Jordan sev-2 ("no CLI command like `lsp done 3`"); researcher Category 6 ("most universally noted gap"); both reviewers ranked as Priority #6. Verify: `lsp done 3` marks task #3 done; running `lsp status` from `src/` subdirectory succeeds. | CLI | haiku | 2 | ✅ | — |

### Phase 2: Pipeline Integration (13 pts)

These tickets connect the LSS output to the skill layer and add scanner trust signals. Depends on Phase 1 for Go route work.

| ID | Ticket | Description | Owner | Model | Points | Status | Deps |
|----|--------|-------------|-------|-------|--------|--------|------|
| 41.4 | Scanner confidence signals in `lsp scan` output | Add a "Detection Confidence" section to `lsp scan` output (both pretty-print and `--json` modes) that surfaces what the scanner could not detect. Specific additions: (1) if `routes.length === 0` and `techStack.frameworks` includes a Go/Rust/Ruby framework, print "Route extraction not supported for [language] -- consider using --srs to provide route documentation"; (2) if `hasApi: false`, list the directory names that would trigger detection; (3) if `architecture.pattern === 'unknown'`, explain what structures trigger pattern detection; (4) if line count used sampling heuristic, note "Line count is estimated from sampling." Add `confidence` object to `--json` output with per-signal levels (HIGH/LOW/NOT_SUPPORTED). No scoring logic changes -- output presentation only. **Study evidence:** Sam sev-3 ("It doesn't print what it couldn't detect"); Jordan sev-4 ("The tool shows confidence without surfacing the gap"); researcher Insight 3; both reviewers Priority #4. Verify: Go project with gin framework shows route confidence warning; TypeScript project with `routes/` directory shows no warnings. | CLI | sonnet | 5 | ✅ | 41.2 |
| 41.5 | `lsp init-backlog` bridge command | Add `lsp init-backlog` CLI command that reads `.lsp/tasks.md` and creates a minimal `specs/backlog.md` in AutoSpec Sprint 1 format. Each task becomes a backlog ticket with: ID (1.N), title from task description, Status 🔲, Owner=Fullstack, Model=sonnet, Points estimated from time column (30m->1pt, 1h->2pts, 2h->3pts, 4h->5pts). Create `specs/` directory if it does not exist. Error helpfully if `.lsp/tasks.md` not found ("Run `lsp init` first"). Do not require or trigger graduation. Add a note to `lsp init` success output: "Ready for AutoSpec skills? Run `lsp init-backlog` to create specs/backlog.md." Document in LIGHTSPEC_QUICKSTART.md as optional step 4. **Study evidence:** Sam sev-4 ("I ended up manually reformatting tasks into specs/backlog.md"); researcher Insight 2 ("structural handshake failure"); both reviewers Priority #2-3. Verify: `/execute-ticket` on a ticket from the generated backlog.md succeeds without manual editing. | CLI | sonnet | 5 | ✅ | — |
| 41.6 | Provider error messages with recovery guidance | Update `init.ts` provider resolution failure to print actionable recovery instructions instead of bare "No LLM provider available" + raw error. New error output format: (1) "No LLM provider found. Set up one of these:" (2) table listing: `claude` CLI (link to install), `ANTHROPIC_API_KEY` (link to console, note free credit), `GEMINI_API_KEY` (link to AI Studio, note free tier). (3) "Then re-run: lsp init ." Also: move provider resolution to BEFORE the confirmation prompt so users see which provider will be used before saying Y. Add `process.stdin.isTTY` check -- if not a TTY and `--yes` not passed, exit with clear message "Non-interactive mode detected. Use --yes flag." instead of hanging on readline. **Study evidence:** Alex sev-5 ("error message gives no actionable recovery path"); Jordan ("readline blocks indefinitely in CI"); Reviewer 1 adoption risk "H likelihood, H impact." Verify: running `lsp init` without any provider shows the recovery table; running in a pipe without `--yes` exits cleanly. | CLI | haiku | 3 | ✅ | — |

### Phase 3: Graduate Quality (10 pts)

Improves the graduation output so the upgrade framing matches the actual output quality.

| ID | Ticket | Description | Owner | Model | Points | Status | Deps |
|----|--------|-------------|-------|-------|--------|--------|------|
| 41.7 | `lsp graduate` project-type-aware role filtering + quality fixes | Four targeted improvements to `graduate.ts`: (1) **Role filtering:** Before generating role spec files, read `.lsp/` scan metadata. Skip `03_frontend_lead.md` if `hasFrontend: false`. Skip `04_db_architect.md` if `hasDatabase: false`. Add `--roles` flag for explicit selection (`lsp graduate --roles=pm,backend,qa`). (2) **CLAUDE.md placeholder fix:** Replace `[Project Name]` with `path.basename(process.cwd())` -- a one-line fix that eliminates the most universal polish signal. (3) **CLAUDE.md overwrite guard:** If `CLAUDE.md` already exists, prompt "CLAUDE.md already exists. Overwrite? [y/N]" before writing. Respect `--yes` flag. (4) **Dry-run mode:** Add `lsp graduate --dry-run` that prints extraction plan per role: "EXTRACTED (8 lines from 'Technical Design' heading)" / "FALLBACK (no matching heading found)" / "SKIPPED (hasFrontend: false)" without writing any files. **Study evidence:** All 3 personas rated graduation negatively (sev-3 each); researcher Insight 4 ("four independent failure modes"); both reviewers Priority #5. Verify: a CLI-only project (no frontend, no DB) generates exactly PM + Backend + QA role specs; `--dry-run` shows extraction confidence per role; existing CLAUDE.md not overwritten without confirmation. | CLI | sonnet | 5 | ✅ | — |
| 41.8 | Sprint 41 QA + sprint close | Verify all 7 implementation tickets. Run `cd cli && npm run build && npm test`. Verify LIGHTSPEC_QUICKSTART.md end-to-end walkthrough. Verify `lsp scan` on Go fixture shows confidence warnings. Verify `lsp done` works from subdirectory. Verify `lsp init-backlog` output is compatible with `/execute-ticket`. Update `specs/backlog.md` statuses. Create `sprints/sprint-41/summary.md`. Update viewer backlog data. | QA | haiku | 2 | ✅ | 41.1-41.7 |

### Definition of Done
- [ ] `LIGHTSPEC_QUICKSTART.md` exists and a new user can follow it to generated spec without reading any other document
- [ ] `lsp scan` on a Go+Gin project extracts routes and reports `hasApi: true`
- [ ] `lsp scan` on a Go project shows "Detection Confidence" section with route extraction status
- [ ] `lsp done 3` marks task #3 complete in `.lsp/tasks.md`; `lsp status` from a subdirectory works
- [ ] `lsp init-backlog` creates `specs/backlog.md` from `.lsp/tasks.md` in valid Sprint 1 format
- [ ] `lsp init` without provider shows actionable recovery table with provider setup links
- [ ] `lsp init` in non-TTY context exits cleanly instead of hanging
- [ ] `lsp graduate --dry-run` shows extraction plan; `lsp graduate` on a CLI-only project skips frontend/DB role files
- [ ] Generated CLAUDE.md contains actual project name, not `[Project Name]`
- [ ] All CLI tests pass (`cd cli && npm test`)
- [ ] NPS-blocking issues from Sprint 40 study are addressed: junior can complete first run, senior sees honest scanner output, mid-level can reach skill layer without manual reformatting

---

## Sprint 42: Launch Readiness — Marketing Page + Content Pipeline (~45 pts)

**Theme:** Build the `MarketingPage` viewer experience and the full launch content pipeline — 5 LinkedIn posts, 5 articles, 8 milestones, 6 channels — so the team has a single, version-controlled source of truth for the LightSpec public launch.
**Status:** ✅ Done

### Problem Statement
LightSpec has a working CLI, polished presentation, and interactive guide. The marketing strategy exists as prose but has no viewer interface, no dependency graph, and no tracking surface. Sprint 42 builds: (1) a `marketing.ts` data module encoding all launch content with statuses and inter-dependencies; (2) a `MarketingPage` viewer at `/#/marketing` with a Next Action card, KPI row, and tabbed views; (3) full documentation and QA coverage.

### User Stories
- As the marketing lead, I want to open `/#/marketing` and see the one post or article that is unblocked and ready to publish today, so I never have to manually scan dependency lists.
- As a team member, I want to mark the launch as "Set Live" (session only) and see all downstream content unblock in real time, so I can walk through the launch sequence in planning sessions.
- As a developer, I want all launch content (posts, articles, milestones, channels) in a typed TypeScript module, so content changes go through the same PR review process as code.

### Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Data location | `viewer/src/data/marketing.ts` | Consistent with `backlog.ts`, `specs.ts`, `docs.ts` pattern |
| Page layout | Tab-based (Posts / Articles / Milestones / Channels) | Matches LspPage.tsx pattern |
| "Set Live" toggle | React `useState` only — no persistence | Session-only; button label communicates transience |
| 42.8/42.9 dependency | Depends on 42.1 types only (stub approach) | Decouples Phase 2 card work from Phase 3 page assembly |
| Status → Badge mapping | `draft`→`todo`, `ready`→`in-progress`, `published`→`done` | Reuses existing BadgeVariant tokens |

### Phase 1: Data Foundation (5 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 42.1 | `marketing.ts` — interfaces + stub seed. Define TypeScript interfaces: `LinkedInPost` (id, arc, week, status, blockedBy, hook, body), `Article` (id, title, platform, week, status, blockedBy, outline), `LaunchMilestone` (id, phase, item, done, dueDate?, blockedBy?), `Channel` (id, name, type, priority, plannedPosts, notes). Add `MarketingData` root type. Stub seed with 2 items per collection. Export `marketingData: MarketingData`. | Frontend | 3 | ✅ | — | — |
| 42.2 | `marketing.ts` — full 26-item seed content. Replace stub with: 5 LinkedIn posts (post-1 status `ready` blockedBy `[]`; post-2 `draft` blockedBy `['ms-2','ms-3']`; post-3 `draft` blockedBy `['post-2']`; post-4 `draft` blockedBy `['post-3']`; post-5 `draft` blockedBy `['post-4']`). 5 articles (art-1 blockedBy `['ms-2']`; art-2 blockedBy `['post-4']`; art-3 blockedBy `['ms-5']`; art-4 blockedBy `['art-1']`; art-5 blockedBy `['post-5']`). 8 milestones (ms-1 no blockers; ms-2 blockedBy `['ms-1']`; ms-3 none; ms-4 blockedBy `['ms-2','ms-3','post-1']`; ms-5 blockedBy `['ms-4']`; ms-6 blockedBy `['ms-5']`; ms-7 blockedBy `['ms-4']`; ms-8 blockedBy `['ms-6']`). 6 channels. | Frontend | 2 | ✅ | 42.1 | — |

### Phase 2: Individual Card Components (13 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 42.3 | `PostCard.tsx` — LinkedIn post card. Renders arc label badge, week, status badge (ready=sage, draft=amber, blocked=red), hook text (large), body (collapsed 3 lines + expand toggle), blockedBy chip list. Props: `post: LinkedInPost`, `isBlocked: boolean`. `role="article"`. | Frontend | 3 | ✅ | 42.1 | — |
| 42.4 | `ArticleCard.tsx` — article card. Renders title, platform badge (Dev.to=blue, HN=orange, LinkedIn=navy), week, status badge, outline as ordered list, blockedBy chips. Props: `article: Article`, `isBlocked: boolean`. | Frontend | 3 | ✅ | 42.1 | — |
| 42.5 | `MilestoneCard.tsx` — launch milestone card. Renders phase label (Pre-launch=slate, Launch=sage, Post-launch=terracotta), item text, done checkbox (display-only), dueDate, blockedBy chips. Props: `milestone: LaunchMilestone`, `isBlocked: boolean`, `onToggle: (id: string) => void`. | Frontend | 2 | ✅ | 42.1 | — |
| 42.6 | `ChannelRow.tsx` — channel table row. Columns: name, type badge, priority badge (high=sage, medium=amber, low=slate), plannedPosts, notes (80 chars truncated). Used inside `<table>` in Channels tab. Props: `channel: Channel`. | Frontend | 2 | ✅ | 42.1 | — |
| 42.7 | `KpiRow.tsx` + `NextActionCard.tsx` stub. (a) KpiRow: 4 stat chips — Posts Ready, Posts Drafted, Milestones Done, Articles In Progress. (b) NextActionCard stub shell with placeholder body "Wired in 42.9". Props: `data: MarketingData`, `launchLive: boolean`. QA: visual review of all 4 cards + stubs — correct Badge variants, responsive layout. | QA | 3 | ✅ | 42.3, 42.4, 42.5, 42.6 | — |

### Phase 3: MarketingPage Assembly (12 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 42.8 | `MarketingPage.tsx` — page shell. Heading "Launch Dashboard", KpiRow wired to real data, NextActionCard stub, tab bar (Posts/Articles/Milestones/Channels), placeholder tab panels. `launchLive` state + "Set Live (this session)" toggle button with sub-label "Resets on page refresh. No data is saved." Add route `<Route path="/marketing" element={<MarketingPage />} />` to App.tsx. Depends on 42.1 only (stub approach). | Frontend | 3 | ✅ | 42.1 | — |
| 42.9 | `NextActionCard.tsx` — full Next Action logic. Algorithm: (1) collect all items; (2) filter not-done; (3) resolve blockedBy across all collections; (4) if `launchLive === false`, surface ms-2 gate message; (5) if `launchLive === true` (session-only React state, no localStorage, no persistence, resets on refresh), surface first unblocked item by week ascending. Button label must read "Set Live (session)" with tooltip "Resets on page refresh. No data is saved." Acceptance: refresh resets to pre-launch state. Depends on 42.1 only. | Frontend | 2 | ✅ | 42.1 | — |
| 42.10 | Wire Posts tab. Replace placeholder with PostCard grid; pass resolved `isBlocked` boolean. Filter pills: All / Ready / Draft / Blocked. Reactive to `launchLive`. Responsive ≥ 375px. | Frontend | 3 | ✅ | 42.7, 42.8 | — |
| 42.11 | Wire Articles + Milestones tabs. Articles: ArticleCard list + filter pills. Milestones: MilestoneCard list grouped by phase with phase headings. onToggle updates local state slice; re-evaluates dependency graph; re-renders KpiRow + NextActionCard reactively. | Frontend | 2 | ✅ | 42.7, 42.8 | — |
| 42.12 | Wire Channels tab + KpiRow reactivity. Channels: `<table>` of ChannelRow components sorted by priority. KpiRow: `useMemo` on derived stats, re-computes on milestone toggle or launchLive change. Smoke test: all tabs render, Next Action updates on toggle, Set Live resets on refresh. | Frontend | 2 | ✅ | 42.7, 42.8 | — |

### Phase 4: Viewer Infrastructure (7 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 42.13 | `marketing.ts` — finalize + export audit. Verify all 26 items have correct types (no `any`). Verify all blockedBy ids resolve. Export `resolveBlockers(data: MarketingData, itemId: string): boolean` helper used by both MarketingPage and NextActionCard. | Frontend | 3 | ✅ | 42.2, 42.12 | — |
| 42.14 | `viewer/src/data/backlog.ts` — Sprint 42 entry. Add Sprint 42 record: number `'42'`, theme, status `'in-progress'`, totalPoints 45, all 19 tickets with correct ids/titles/owners/points/statuses (`todo`)/dependencies. | Frontend | 2 | ✅ | 42.1 | — |
| 42.15 | Sidebar nav item. Confirm route registered. Add "Marketing" nav entry to `bottomNavItems` in `Sidebar.tsx` with `TrendingUp` icon from lucide-react. Verify active highlight on `/#/marketing` in desktop and mobile nav. | Frontend | 2 | ✅ | 42.8 | — |

### Phase 5: QA + Close (8 pts)

| ID | Ticket | Owner | Pts | Status | Deps | Docs |
|----|--------|-------|-----|--------|------|------|
| 42.16 | Sprint 42 integration QA — all 7 deliverables: (1) Page shell: `/#/marketing` loads without errors, "Set Live" button present, session-only label visible, refresh resets state. (2) Next Action card: correct first unblocked item pre-launch, updates on launchLive toggle, does not persist. (3) KPI row: 4 chips render correct counts, update reactively. (4) Tabs: all 4 tabs render, filter pills functional, milestones grouped by phase, channels as priority-sorted table. (5) backlog.ts: Sprint 42 entry with 19 tickets, total 45 pts, no TS errors. (6) Route: `/#/marketing` navigates correctly. (7) Sidebar: "Marketing" item visible, active state correct. Run `cd viewer && npm run build`. | QA | 3 | ✅ | 42.8–42.15 | — |
| 42.17 | Viewer build verification + visual smoke test. `cd viewer && npm run build` — no TS errors, `dist/` generated. Verify MarketingPage renders at `/#/marketing` with all 4 tabs, KPI row, Next Action card visible above fold at 1280×800. Verify no layout overflow at 375px on Posts tab. Confirm no regressions on Dashboard, Backlog, LspPage. | QA | 2 | ✅ | 42.16 | — |
| 42.18 | Sprint close. Update `specs/backlog.md` Sprint 42 ticket statuses to ✅. Create `sprints/sprint-42/summary.md`: sprint number, theme, 45 pts, 19 tickets, 3-5 sentence narrative, all tickets with final status. | PM | 2 | ✅ | 42.17 | `sprints/sprint-42/summary.md` |
| 42.19 | Update `docs/viewer/01_overview.md`. Three additions: (1) Pages table: add MarketingPage row, update caption to "Pages (11 total)". (2) Routing block: add `/marketing` route after `/lsp`. (3) Data layer table: add `marketing.ts` row documenting `MarketingData`, interfaces, and `resolveBlockers()` helper. | Docs | 1 | ✅ | 42.13 | `docs/viewer/01_overview.md` |

### Definition of Done
- [ ] `marketing.ts` exports `marketingData` with 5 posts, 5 articles, 8 milestones, 6 channels — all TypeScript types satisfied, no `any`
- [ ] `resolveBlockers(data, itemId)` helper exported and used by both MarketingPage and NextActionCard
- [ ] `/#/marketing` route renders MarketingPage with all 4 tabs, KPI row, and Next Action card
- [ ] "Set Live (this session)" button present; does not write to localStorage/sessionStorage; refresh resets `launchLive` to `false`
- [ ] Next Action card surfaces ms-2 gate pre-launch; updates correctly when `launchLive === true`
- [ ] All 4 tabs render: Posts (5 cards + filter pills), Articles (5 cards + filter pills), Milestones (8 cards grouped by phase), Channels (6-row priority-sorted table)
- [ ] Milestone done-toggle updates KPI row and Next Action card reactively
- [ ] "Marketing" sidebar nav item present; active highlight on `/#/marketing`
- [ ] Sprint 42 entry in `viewer/src/data/backlog.ts` — 19 tickets, 45 pts, no TS errors
- [ ] `cd viewer && npm run build` passes with zero errors
- [ ] `docs/viewer/01_overview.md` updated: pages table (11 total), routing block, data layer table
- [ ] `sprints/sprint-42/summary.md` created
