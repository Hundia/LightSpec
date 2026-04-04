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
}
