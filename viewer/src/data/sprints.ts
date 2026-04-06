import type { GraphNode, GraphEdge } from '../components/diagrams/DependencyGraph'
import type { Actor, Message, ActivationBar } from '../components/diagrams/SequenceDiagram'
import type { TimelinePhase, TimelineMilestone } from '../components/diagrams/SprintTimeline'
import type { AgentData } from '../components/diagrams/AgentCapabilityRadar'
import type { FlowStep, FlowConnection } from '../components/diagrams/FlowDiagram'

export interface SprintPlanning {
  overview: string
  architectureNotes?: string
  flowSteps?: FlowStep[]
  flowConnections?: FlowConnection[]
  dependencyGraph?: { nodes: GraphNode[]; edges: GraphEdge[] }
  sequenceDiagram?: { actors: Actor[]; messages: Message[]; activationBars?: ActivationBar[] }
}

export interface SprintRetrospective {
  completedAt: string
  timeline?: { phases: TimelinePhase[]; milestones?: TimelineMilestone[]; columns: string[]; totalRows?: number }
  agentRadar?: { agents: AgentData[]; axes: { key: string; label: string }[] }
  keyMetrics?: { label: string; value: string | number }[]
  highlights?: string[]
  challenges?: string[]
}

export interface SprintVisualization {
  sprintId: string
  title: string
  planning?: SprintPlanning
  retrospective?: SprintRetrospective
}

export const sprintVisualizations: Record<string, SprintVisualization> = {
  '37': {
    sprintId: '37',
    title: 'Foundation — CLI + Presentation',
    planning: {
      overview: 'Bootstrap LightSpec: CLI scaffold with brownfield scanner, adaptive depth pipeline, 6 prompt templates, 12 presentation slides, landing page, and viewer bootstrap. 31 tickets across 4 parallel waves.',
      architectureNotes: 'Wave 1: Scanner layer (detect-stack, detect-architecture, detect-tests, detect-routes, complexity-scorer). Wave 2: Pipeline (depth-router, generate-spec, task-extractor) + CLI commands. Wave 3: Presentation site (landing + slides). Wave 4: Viewer + QA.',
    },
    retrospective: {
      completedAt: '2026-03-27',
      highlights: [
        'CLI scaffold with 5 scanner modules + complexity scorer',
        '6 Handlebars prompt templates (micro/standard/full depth)',
        '12 slide components + landing page with 5 sections',
        'Adaptive depth (micro/standard/full) auto-selected by score',
        'lsp graduate command for AutoSpec upgrade path',
      ],
      challenges: [
        'Coordinating 4 parallel waves without file conflicts',
        'Handlebars template design for 3 depth levels',
      ],
      keyMetrics: [
        { label: 'CLI Modules', value: 12 },
        { label: 'Prompt Templates', value: 6 },
        { label: 'Slide Components', value: 12 },
        { label: 'Points Delivered', value: 134 },
      ],
    },
  },
  '38': {
    sprintId: '38',
    title: 'Presentation Polish — Enterprise Grade',
    planning: {
      overview: 'Polish the presentation to enterprise quality: 4 new slides (LiveDemo, UseCases, Architecture, Stats), word-by-word animations, mobile hamburger menu, data extraction to i18n files, GPU acceleration, accessibility audit.',
    },
    retrospective: {
      completedAt: '',
      highlights: [
        'prefers-reduced-motion support + useReducedMotion hook',
        'Mobile hamburger navigation menu',
        'Data extracted to landing-en.ts + landing-he.ts',
        'GPU acceleration hints on background effects',
        'Keyboard navigation for tabbed slides',
        'Copy-to-clipboard on terminal blocks',
        'Gradient text on all major headings',
      ],
      challenges: [
        '4 new slides (38.5-38.8) still pending',
        'Word-by-word tagline animation (38.9) pending',
      ],
      keyMetrics: [
        { label: 'Completed Tickets', value: 11 },
        { label: 'Pending Tickets', value: 6 },
        { label: 'Points Done', value: 27 },
      ],
    },
  },
  '42': {
    sprintId: '42',
    title: 'Launch Readiness — Marketing Page + Content Pipeline',
    planning: {
      overview: 'Build a Marketing Hub page in the viewer at /#/marketing: a living launch dashboard with Next Action card, KPI row, and 4 tabs (Posts / Articles / Milestones / Channels). Backed by marketing.ts with 26 typed seed items — 5 LinkedIn posts with real hooks, 5 articles, 8 launch milestones, 6 channels — all wired with blockedBy dependency chains.',
      architectureNotes: 'Phase 1: marketing.ts interfaces + seed. Phase 2: 4 card components (PostCard, ArticleCard, MilestoneCard, ChannelRow) + KpiRow stub. Phase 3: MarketingPage assembly — shell, NextActionCard logic, tab wiring. Phase 4: viewer infrastructure (resolveBlockers helper, backlog.ts, sidebar nav). Phase 5: QA + docs + sprint close.',
      flowSteps: [
        { id: 'data', label: 'marketing.ts', description: 'Types + 26-item seed with blockedBy chains', type: 'start' as const },
        { id: 'cards', label: 'Card Components', description: 'PostCard, ArticleCard, MilestoneCard, ChannelRow', type: 'process' as const },
        { id: 'page', label: 'MarketingPage', description: 'Tab shell + KpiRow + NextActionCard', type: 'process' as const },
        { id: 'wire', label: 'Tab Wiring', description: 'Posts, Articles, Milestones, Channels tabs', type: 'process' as const },
        { id: 'infra', label: 'Infrastructure', description: 'Route, sidebar nav, resolveBlockers()', type: 'process' as const },
        { id: 'qa', label: 'QA + Docs', description: 'Build verification + docs/viewer update', type: 'end' as const },
      ],
      flowConnections: [
        { from: 'data', to: 'cards', label: 'types' },
        { from: 'data', to: 'page', label: 'stub' },
        { from: 'cards', to: 'wire', label: 'components' },
        { from: 'page', to: 'wire', label: 'shell' },
        { from: 'wire', to: 'infra', label: 'complete page' },
        { from: 'infra', to: 'qa', label: 'build' },
      ],
    },
    retrospective: {
      completedAt: '2026-04-06',
      highlights: [
        'marketing.ts: 26-item typed seed with cross-collection blockedBy dependency chains',
        'NextActionCard resolves full dependency graph and surfaces the single most important action',
        '"Set Live (session)" toggle: React useState only — non-persistent by design',
        'docs/viewer/01_overview.md updated to 11 pages — CLAUDE.md Rule 2 satisfied',
        'Build: ✓ 3.50s, zero TypeScript errors',
      ],
      challenges: [
        'resolveBlockers() spans all 3 collections (posts, articles, milestones) — cross-collection dependency resolution',
      ],
      keyMetrics: [
        { label: 'Tickets Delivered', value: 19 },
        { label: 'Points Delivered', value: 45 },
        { label: 'New Files', value: 9 },
        { label: 'Seed Items', value: 26 },
        { label: 'Build Time (s)', value: 3.5 },
      ],
    },
  },
}
