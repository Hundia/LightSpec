export type TicketStatus = 'todo' | 'in-progress' | 'qa' | 'done' | 'blocked'

export interface Ticket {
  id: string
  title: string
  owner: string
  points: number
  status: TicketStatus
  dependencies: string[]
}

export interface Sprint {
  number: string
  name: string
  theme: string
  status: TicketStatus
  totalPoints: number
  tickets: Ticket[]
}

export const backlogData: Sprint[] = [
  {
    number: '37',
    name: 'Sprint 37',
    theme: 'Foundation — CLI + Presentation',
    status: 'done',
    totalPoints: 134,
    tickets: [
      // Wave 1: Foundation + Scanner
      { id: '37.1', title: 'cli/ package scaffold', owner: 'DevOps', points: 3, status: 'done', dependencies: [] },
      { id: '37.2', title: 'Provider layer: cli/src/providers/index.ts', owner: 'Backend', points: 2, status: 'done', dependencies: ['37.1'] },
      { id: '37.3', title: 'Scanner: detect-stack.ts', owner: 'Backend', points: 5, status: 'done', dependencies: ['37.1'] },
      { id: '37.4', title: 'Scanner: detect-architecture.ts', owner: 'Backend', points: 5, status: 'done', dependencies: ['37.1'] },
      { id: '37.5', title: 'Scanner: detect-tests, detect-routes, detect-docs', owner: 'Backend', points: 5, status: 'done', dependencies: ['37.3'] },
      { id: '37.6', title: 'Scanner: complexity-scorer.ts', owner: 'Backend', points: 5, status: 'done', dependencies: ['37.3', '37.4', '37.5'] },
      { id: '37.7', title: 'Scanner unit tests: 15+ tests', owner: 'QA', points: 5, status: 'done', dependencies: ['37.3', '37.4', '37.5', '37.6'] },
      { id: '37.8', title: 'Design docs: 01_philosophy, 02_architecture, 03_scanner', owner: 'Docs', points: 3, status: 'done', dependencies: ['37.1'] },
      { id: '37.9', title: 'Design doc: 04_adaptive_depth', owner: 'Docs', points: 1, status: 'done', dependencies: ['37.6'] },
      // Wave 2: Pipeline + CLI
      { id: '37.10', title: 'Prompt templates: 6 Handlebars files', owner: 'Backend', points: 8, status: 'done', dependencies: ['37.6'] },
      { id: '37.11', title: 'Pipeline: depth-router.ts', owner: 'Backend', points: 3, status: 'done', dependencies: ['37.10'] },
      { id: '37.12', title: 'Pipeline: generate-spec.ts', owner: 'Backend', points: 8, status: 'done', dependencies: ['37.11', '37.2'] },
      { id: '37.13', title: 'Pipeline: task-extractor.ts', owner: 'Backend', points: 3, status: 'done', dependencies: ['37.12'] },
      { id: '37.14', title: 'CLI: index.ts + init + scan commands', owner: 'Backend', points: 5, status: 'done', dependencies: ['37.12', '37.13'] },
      { id: '37.15', title: 'CLI: status + graduate commands', owner: 'Backend', points: 5, status: 'done', dependencies: ['37.14'] },
      { id: '37.16', title: 'Pipeline + CLI unit tests: 15+ tests', owner: 'QA', points: 5, status: 'done', dependencies: ['37.12', '37.13', '37.14', '37.15'] },
      { id: '37.17', title: 'Design docs: 05_prompts, 06_graduation_path', owner: 'Docs', points: 3, status: 'done', dependencies: ['37.10', '37.15'] },
      // Wave 3: Presentation
      { id: '37.18', title: 'Scaffold presentation/: package.json, vite, tailwind', owner: 'Frontend', points: 3, status: 'done', dependencies: [] },
      { id: '37.19', title: 'Landing: Navigation, HeroSection, ProblemSection', owner: 'Frontend', points: 8, status: 'done', dependencies: ['37.18'] },
      { id: '37.20', title: 'Landing: AdaptiveDepth, Brownfield, Comparison sections', owner: 'Frontend', points: 5, status: 'done', dependencies: ['37.18'] },
      { id: '37.21', title: 'Landing: QuickStartSection, Footer', owner: 'Frontend', points: 3, status: 'done', dependencies: ['37.18'] },
      { id: '37.22', title: '12 presentation slide components', owner: 'Frontend', points: 8, status: 'done', dependencies: ['37.18'] },
      { id: '37.23', title: 'Slide data: slides-en.ts, slides-he.ts', owner: 'Frontend', points: 3, status: 'done', dependencies: ['37.22'] },
      { id: '37.24', title: 'Background effects: 5 animated backgrounds', owner: 'UI', points: 2, status: 'done', dependencies: ['37.18'] },
      // Wave 4: Viewer + QA
      { id: '37.25', title: 'Viewer: LspPage.tsx at /lsp route', owner: 'Frontend', points: 8, status: 'done', dependencies: [] },
      { id: '37.26', title: 'Viewer: Sidebar nav + App.tsx route', owner: 'Frontend', points: 2, status: 'done', dependencies: ['37.25'] },
      { id: '37.27', title: 'Viewer: LightSpec sprint data in backlog.ts', owner: 'Frontend', points: 3, status: 'done', dependencies: ['37.25'] },
      { id: '37.28', title: 'Integration tests: lsp init on fixtures', owner: 'QA', points: 8, status: 'done', dependencies: [] },
      { id: '37.29', title: 'E2E: lsp init on LightSpec repo', owner: 'QA', points: 5, status: 'done', dependencies: [] },
      { id: '37.30', title: 'Graduate test: lsp graduate → valid AutoSpec structure', owner: 'QA', points: 3, status: 'done', dependencies: ['37.15'] },
      { id: '37.31', title: 'Sprint close: backlog, pages.yml, summary', owner: 'PM', points: 3, status: 'done', dependencies: [] },
    ]
  },
  {
    number: '38',
    name: 'Sprint 38',
    theme: 'Presentation Polish — Enterprise Grade',
    status: 'in-progress',
    totalPoints: 52,
    tickets: [
      { id: '38.1', title: 'prefers-reduced-motion global support + useReducedMotion hook', owner: 'Frontend', points: 3, status: 'done', dependencies: [] },
      { id: '38.2', title: 'Mobile hamburger menu for Navigation', owner: 'Frontend', points: 5, status: 'done', dependencies: [] },
      { id: '38.3', title: 'Extract hardcoded data to landing-en.ts + landing-he.ts', owner: 'Frontend', points: 3, status: 'done', dependencies: [] },
      { id: '38.4', title: 'GPU acceleration hints on BackgroundEffects', owner: 'Frontend', points: 3, status: 'done', dependencies: [] },
      { id: '38.5', title: 'LiveDemoSlide.tsx — lsp init typing simulation', owner: 'Frontend', points: 5, status: 'todo', dependencies: ['38.3'] },
      { id: '38.6', title: 'UseCasesSlide.tsx — 3-column depth mapping cards', owner: 'Frontend', points: 3, status: 'todo', dependencies: ['38.3'] },
      { id: '38.7', title: 'ArchitectureSlide.tsx — interactive SVG pipeline', owner: 'Frontend', points: 5, status: 'todo', dependencies: ['38.1'] },
      { id: '38.8', title: 'StatsSlide.tsx — useSpring counters + testimonial', owner: 'Frontend', points: 3, status: 'todo', dependencies: ['38.3'] },
      { id: '38.9', title: 'Word-by-word tagline animation on TitleSlide + HeroSection', owner: 'Frontend', points: 2, status: 'todo', dependencies: ['38.1'] },
      { id: '38.10', title: 'Keyboard navigation for tabbed slides', owner: 'Frontend', points: 3, status: 'done', dependencies: [] },
      { id: '38.11', title: 'Hover states across all components', owner: 'Frontend', points: 2, status: 'done', dependencies: [] },
      { id: '38.12', title: 'Terminal mobile overflow fix + copy-to-clipboard', owner: 'Frontend', points: 3, status: 'done', dependencies: [] },
      { id: '38.13', title: 'Gradient text on all major headings', owner: 'Frontend', points: 2, status: 'done', dependencies: [] },
      { id: '38.14', title: 'Color accessibility audit', owner: 'Frontend', points: 2, status: 'done', dependencies: [] },
      { id: '38.15', title: 'Wire 4 new slides into PresentationPage (16 total)', owner: 'Frontend', points: 3, status: 'todo', dependencies: ['38.5', '38.6', '38.7', '38.8'] },
      { id: '38.16', title: 'Viewer backlog.ts Sprint 38 entry', owner: 'Frontend', points: 2, status: 'done', dependencies: [] },
      { id: '38.17', title: 'Build verification + visual QA — 16 slides', owner: 'QA', points: 3, status: 'todo', dependencies: ['38.15', '38.16'] },
    ]
  },
  {
    number: '40',
    name: 'Sprint 40',
    theme: 'DX Usability Study — Developer Experience Research',
    status: 'done',
    totalPoints: 38,
    tickets: [
      // Wave 1: Persona Trials
      { id: '40.1', title: 'Persona A: Junior developer trial', owner: 'Research', points: 5, status: 'done', dependencies: [] },
      { id: '40.2', title: 'Persona B: Mid-level developer trial', owner: 'Research', points: 5, status: 'done', dependencies: [] },
      { id: '40.3', title: 'Persona C: Senior developer trial', owner: 'Research', points: 5, status: 'done', dependencies: [] },
      // Wave 2: Research Analysis
      { id: '40.4', title: 'Experience Researcher synthesis', owner: 'Research', points: 5, status: 'done', dependencies: ['40.1', '40.2', '40.3'] },
      { id: '40.5', title: 'Expert Review 1: DX Tooling Specialist', owner: 'Research', points: 3, status: 'done', dependencies: ['40.4'] },
      { id: '40.6', title: 'Expert Review 2: SDD Methodology Expert', owner: 'Research', points: 3, status: 'done', dependencies: ['40.4'] },
      // Wave 3: Synthesis + Sprint Close
      { id: '40.7', title: 'PM synthesis + final report', owner: 'PM', points: 8, status: 'done', dependencies: ['40.5', '40.6'] },
      { id: '40.8', title: 'QA verification', owner: 'QA', points: 2, status: 'done', dependencies: ['40.7'] },
      { id: '40.9', title: 'Sprint close', owner: 'PM', points: 2, status: 'done', dependencies: ['40.8'] },
    ]
  },
  {
    number: '41',
    name: 'Sprint 41',
    theme: 'First-Run to First-Value — Unblock the Pipeline',
    status: 'done',
    totalPoints: 35,
    tickets: [
      // Phase 1: First-Run Experience
      { id: '41.1', title: 'LightSpec standalone quick-start document', owner: 'Docs', points: 3, status: 'done', dependencies: [] },
      { id: '41.2', title: 'Go route extraction in detect-routes.ts', owner: 'CLI', points: 5, status: 'done', dependencies: [] },
      { id: '41.3', title: 'lsp done command + lsp status path robustness', owner: 'CLI', points: 2, status: 'done', dependencies: [] },
      // Phase 2: Pipeline Integration
      { id: '41.4', title: 'Scanner confidence signals in lsp scan output', owner: 'CLI', points: 5, status: 'done', dependencies: ['41.2'] },
      { id: '41.5', title: 'lsp init-backlog bridge command', owner: 'CLI', points: 5, status: 'done', dependencies: [] },
      { id: '41.6', title: 'Provider error messages with recovery guidance', owner: 'CLI', points: 3, status: 'done', dependencies: [] },
      // Phase 3: Graduate Quality
      { id: '41.7', title: 'lsp graduate role filtering + quality fixes', owner: 'CLI', points: 5, status: 'done', dependencies: [] },
      { id: '41.8', title: 'Sprint 41 QA + sprint close', owner: 'QA', points: 2, status: 'done', dependencies: ['41.1', '41.2', '41.3', '41.4', '41.5', '41.6', '41.7'] },
    ]
  },
  {
    number: '39',
    name: 'Sprint 39',
    theme: "Developer's Guide — Task Flow API + Interactive Tutorial",
    status: 'in-progress',
    totalPoints: 64,
    tickets: [
      // Phase 1: Foundation
      { id: '39.1', title: 'task-flow-api scaffold: package.json, tsconfig, vitest.config, SQLite schema', owner: 'Backend', points: 3, status: 'in-progress', dependencies: [] },
      { id: '39.2', title: 'task-flow-api auth routes + service (register, login, JWT)', owner: 'Backend', points: 5, status: 'in-progress', dependencies: ['39.1'] },
      { id: '39.3', title: 'task-flow-api lists + tasks routes + services (CRUD, status transitions)', owner: 'Backend', points: 5, status: 'in-progress', dependencies: ['39.2'] },
      { id: '39.4', title: 'task-flow-api 20 integration tests (Vitest + supertest, all passing)', owner: 'QA', points: 5, status: 'in-progress', dependencies: ['39.3'] },
      // Phase 2: Guide Site
      { id: '39.5', title: 'Guide scaffold: Vite + AutoDeck engine + GuidePage + StepPanel split-panel layout', owner: 'Frontend', points: 5, status: 'in-progress', dependencies: [] },
      { id: '39.6', title: 'Display components: TerminalBlock, FileViewer, FileTree, SpecViewer, TaskListView, DirTree, StatsRow', owner: 'Frontend', points: 5, status: 'in-progress', dependencies: ['39.5'] },
      { id: '39.7', title: 'steps-en.ts data architecture + real CLI output capture for steps 3–6', owner: 'Backend', points: 3, status: 'in-progress', dependencies: ['39.4', '39.5'] },
      { id: '39.8', title: 'Sprint 39 SDD: backlog tickets, viewer data, agents/sprint-39-brief.md', owner: 'PM', points: 3, status: 'in-progress', dependencies: [] },
      // Phase 3: Guide Content
      { id: '39.9', title: 'Guide steps 1–3: Welcome, Project Tour, lsp scan', owner: 'Frontend', points: 5, status: 'todo', dependencies: ['39.6', '39.7'] },
      { id: '39.10', title: 'Guide steps 4–6: lsp init, Spec Review, lsp status', owner: 'Frontend', points: 5, status: 'todo', dependencies: ['39.7'] },
      { id: '39.11', title: 'Guide steps 7–9: /execute-ticket, Sprint Progress, /plan-sprint', owner: 'Frontend', points: 5, status: 'todo', dependencies: ['39.6'] },
      { id: '39.12', title: 'Guide steps 10–12: Sprint 2 Init, lsp graduate, Continuity', owner: 'Frontend', points: 5, status: 'todo', dependencies: ['39.6'] },
      { id: '39.13', title: 'DiffViewer.tsx and TimelineView.tsx display components', owner: 'Frontend', points: 2, status: 'todo', dependencies: ['39.5'] },
      // Phase 4: Integration + QA
      { id: '39.14', title: 'Wire all 12 steps into GuidePage registry, chapter sidebar complete', owner: 'Frontend', points: 3, status: 'todo', dependencies: ['39.9', '39.10', '39.11', '39.12'] },
      { id: '39.15', title: 'GitHub Actions update: guide build + nest guide/dist at presentation/dist/guide/', owner: 'DevOps', points: 3, status: 'todo', dependencies: ['39.5'] },
      { id: '39.16', title: 'Final QA: all builds + 20 e2e tests + naming checks + sprint-39 summary', owner: 'QA', points: 2, status: 'todo', dependencies: ['39.14', '39.15'] },
    ]
  },
  {
    number: '42',
    name: 'Sprint 42',
    theme: 'Launch Readiness — Marketing Page + Content Pipeline',
    status: 'done',
    totalPoints: 45,
    tickets: [
      // Phase 1: Data Foundation
      { id: '42.1', title: 'marketing.ts — interfaces + stub seed', owner: 'Frontend', points: 3, status: 'done', dependencies: [] },
      { id: '42.2', title: 'marketing.ts — full 26-item seed content', owner: 'Frontend', points: 2, status: 'done', dependencies: ['42.1'] },
      // Phase 2: Card Components
      { id: '42.3', title: 'PostCard.tsx — LinkedIn post card', owner: 'Frontend', points: 3, status: 'done', dependencies: ['42.1'] },
      { id: '42.4', title: 'ArticleCard.tsx — article card', owner: 'Frontend', points: 3, status: 'done', dependencies: ['42.1'] },
      { id: '42.5', title: 'MilestoneCard.tsx — launch milestone card', owner: 'Frontend', points: 2, status: 'done', dependencies: ['42.1'] },
      { id: '42.6', title: 'ChannelRow.tsx — channel table row', owner: 'Frontend', points: 2, status: 'done', dependencies: ['42.1'] },
      { id: '42.7', title: 'KpiRow.tsx + NextActionCard stub + card visual QA', owner: 'QA', points: 3, status: 'done', dependencies: ['42.3', '42.4', '42.5', '42.6'] },
      // Phase 3: Page Assembly
      { id: '42.8', title: 'MarketingPage.tsx — page shell + route + launchLive toggle', owner: 'Frontend', points: 3, status: 'done', dependencies: ['42.1'] },
      { id: '42.9', title: 'NextActionCard.tsx — full blockedBy resolution algorithm', owner: 'Frontend', points: 2, status: 'done', dependencies: ['42.1'] },
      { id: '42.10', title: 'Wire Posts tab — PostCard grid + filter pills', owner: 'Frontend', points: 3, status: 'done', dependencies: ['42.7', '42.8'] },
      { id: '42.11', title: 'Wire Articles + Milestones tabs', owner: 'Frontend', points: 2, status: 'done', dependencies: ['42.7', '42.8'] },
      { id: '42.12', title: 'Wire Channels tab + KpiRow reactivity', owner: 'Frontend', points: 2, status: 'done', dependencies: ['42.7', '42.8'] },
      // Phase 4: Viewer Infrastructure
      { id: '42.13', title: 'marketing.ts finalize + resolveBlockers() export', owner: 'Frontend', points: 3, status: 'done', dependencies: ['42.2', '42.12'] },
      { id: '42.14', title: 'backlog.ts — Sprint 42 entry (19 tickets, 45 pts)', owner: 'Frontend', points: 2, status: 'done', dependencies: ['42.1'] },
      { id: '42.15', title: 'Sidebar nav entry — Marketing + TrendingUp icon', owner: 'Frontend', points: 2, status: 'done', dependencies: ['42.8'] },
      // Phase 5: QA + Close
      { id: '42.16', title: 'Integration QA — all 7 deliverables', owner: 'QA', points: 3, status: 'done', dependencies: ['42.8', '42.9', '42.10', '42.11', '42.12', '42.13', '42.14', '42.15'] },
      { id: '42.17', title: 'Viewer build verification + visual smoke test', owner: 'QA', points: 2, status: 'done', dependencies: ['42.16'] },
      { id: '42.18', title: 'Sprint close + sprints/sprint-42/summary.md', owner: 'PM', points: 2, status: 'done', dependencies: ['42.17'] },
      { id: '42.19', title: 'Update docs/viewer/01_overview.md (pages 11 total, routing, data layer)', owner: 'Docs', points: 1, status: 'done', dependencies: ['42.13'] },
    ]
  }
]
