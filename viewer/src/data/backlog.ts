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
  }
]
