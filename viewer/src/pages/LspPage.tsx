import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/primitives/Card'
import { Badge } from '../components/primitives/Badge'
import {
  Zap,
  Layers,
  Building2,
  Scan,
  GitBranch,
  ArrowRight,
  CheckCircle2,
  Clock,
  Coins,
  FileText,
  ChevronRight,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type DepthLevel = 'micro' | 'standard' | 'full'
type TabId = 'overview' | 'scanner' | 'graduation' | 'sprint'

// ─── Data ─────────────────────────────────────────────────────────────────────

const depthCards = [
  {
    id: 'micro' as DepthLevel,
    icon: Zap,
    name: 'Micro',
    tagline: 'Just enough',
    description: 'Concise, focused spec for small tasks and bug fixes. Zero overhead.',
    outputFiles: ['spec.md'],
    estimatedTime: '~15 seconds',
    tokenBudget: '4,096 tokens',
    scoreRange: '0–25',
    lineRange: '~200 lines',
    accentColor: '#698472',   // sage
    bgColor: '#dfe8e2',
    borderColor: '#698472',
  },
  {
    id: 'standard' as DepthLevel,
    icon: Layers,
    name: 'Standard',
    tagline: 'Balanced spec',
    description: 'Unified spec with architecture, API, data model, and task list. For medium-complexity features.',
    outputFiles: ['spec.md'],
    estimatedTime: '~45 seconds',
    tokenBudget: '8,192 tokens',
    scoreRange: '26–65',
    lineRange: '500–1,000 lines',
    accentColor: '#8e6a59',   // terracotta
    bgColor: '#f5f0ec',
    borderColor: '#8e6a59',
  },
  {
    id: 'full' as DepthLevel,
    icon: Building2,
    name: 'Full',
    tagline: '3-spec decomposition',
    description: 'Product, technical, and quality specs for complex systems, monorepos, and multi-team projects.',
    outputFiles: ['product.md', 'technical.md', 'quality.md'],
    estimatedTime: '~90 seconds',
    tokenBudget: '6,144 tokens/call',
    scoreRange: '66–100',
    lineRange: '3 × ~500 lines',
    accentColor: '#5a6e7f',   // steel blue
    bgColor: '#e8edf2',
    borderColor: '#5a6e7f',
  },
]

const scannerModules = [
  {
    id: 'detect-stack',
    label: 'detect-stack',
    description: 'Reads package.json, requirements.txt, go.mod — identifies languages, frameworks, package managers',
    color: '#698472',
  },
  {
    id: 'detect-architecture',
    label: 'detect-architecture',
    description: 'Analyses directory tree — monolith / modular / monorepo / microservices pattern',
    color: '#8e6a59',
  },
  {
    id: 'detect-tests',
    label: 'detect-tests',
    description: 'Counts test files, identifies test frameworks (vitest / jest / pytest)',
    color: '#698472',
  },
  {
    id: 'detect-routes',
    label: 'detect-routes',
    description: 'Greps source for HTTP route definitions — Express, NestJS, Flask',
    color: '#8e6a59',
  },
  {
    id: 'detect-docs',
    label: 'detect-docs',
    description: 'Locates README, specs, and existing documentation files',
    color: '#698472',
  },
  {
    id: 'complexity-scorer',
    label: 'complexity-scorer',
    description: 'Aggregates heuristic score (0–100) from file count, lines, architecture, stack breadth, tests',
    color: '#8e6a59',
    isOutput: true,
  },
]

const sprint37Tickets = [
  // Wave 1
  { id: '37.1', title: 'cli/ package scaffold', wave: 1, status: 'done' },
  { id: '37.2', title: 'Provider re-export layer', wave: 1, status: 'done' },
  { id: '37.3', title: 'Scanner: detect-stack.ts', wave: 1, status: 'done' },
  { id: '37.4', title: 'Scanner: detect-architecture.ts', wave: 1, status: 'done' },
  { id: '37.5', title: 'Scanner: detect-tests/routes/docs', wave: 1, status: 'done' },
  { id: '37.6', title: 'Scanner: complexity-scorer.ts', wave: 1, status: 'done' },
  { id: '37.7', title: 'Scanner unit tests (15+)', wave: 1, status: 'done' },
  { id: '37.8', title: 'Design docs: 01/02/03', wave: 1, status: 'done' },
  { id: '37.9', title: 'Design doc: 04_adaptive_depth.md', wave: 1, status: 'done' },
  // Wave 2
  { id: '37.10', title: 'Prompt templates (6 Handlebars)', wave: 2, status: 'done' },
  { id: '37.11', title: 'Pipeline: depth-router.ts', wave: 2, status: 'done' },
  { id: '37.12', title: 'Pipeline: generate-spec.ts', wave: 2, status: 'done' },
  { id: '37.13', title: 'Pipeline: task-extractor.ts', wave: 2, status: 'done' },
  { id: '37.14', title: 'CLI: index.ts + init + scan commands', wave: 2, status: 'done' },
  { id: '37.15', title: 'CLI: status + graduate commands', wave: 2, status: 'done' },
  { id: '37.16', title: 'Pipeline + CLI unit tests (15+)', wave: 2, status: 'done' },
  { id: '37.17', title: 'Design docs: 05/06', wave: 2, status: 'done' },
  // Wave 3a - LightSpec Presentation
  { id: '37.18', title: 'Scaffold presentation/', wave: '3a', status: 'done' },
  { id: '37.19', title: 'Landing: Nav + Hero + Problem', wave: '3a', status: 'done' },
  { id: '37.20', title: 'Landing: Depth + Brownfield + Comparison', wave: '3a', status: 'done' },
  { id: '37.21', title: 'Landing: QuickStart + Footer', wave: '3a', status: 'done' },
  { id: '37.22', title: '12 slide components', wave: '3a', status: 'done' },
  { id: '37.23', title: 'Slide data EN + HE', wave: '3a', status: 'done' },
  { id: '37.24', title: 'Background effects', wave: '3a', status: 'done' },
  // Wave 3b - Viewer + QA
  { id: '37.25', title: 'Viewer: LspPage.tsx', wave: '3b', status: 'done' },
  { id: '37.26', title: 'Viewer: Sidebar + App.tsx route', wave: '3b', status: 'done' },
  { id: '37.27', title: 'Viewer: LightSpec sprint data in backlog.ts', wave: '3b', status: 'done' },
  { id: '37.28', title: 'Integration tests: scan on fixtures', wave: '3b', status: 'done' },
  { id: '37.29', title: 'E2E: lsp init on LightSpec repo', wave: '3b', status: 'done' },
  { id: '37.30', title: 'Graduate integration test', wave: '3b', status: 'done' },
  { id: '37.31', title: 'Sprint close: backlog + CI + summary', wave: '3b', status: 'done' },
]

const statusStyle: Record<string, { bg: string; text: string; label: string }> = {
  done: { bg: '#dfe8e2', text: '#303b34', label: '✅ Done' },
  'in-progress': { bg: '#fef3c7', text: '#92400e', label: '🔄 In Progress' },
  todo: { bg: '#f5f3ed', text: '#574b3b', label: '🔲 Todo' },
}

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'overview', label: 'Depth Levels', icon: '⚡' },
  { id: 'scanner', label: 'Scanner', icon: '🔍' },
  { id: 'graduation', label: 'Graduation', icon: '🎓' },
  { id: 'sprint', label: 'Sprint 37', icon: '📋' },
]

// ─── Depth Card ───────────────────────────────────────────────────────────────

const DepthCard: React.FC<(typeof depthCards)[0]> = ({
  icon: Icon,
  name,
  tagline,
  description,
  outputFiles,
  estimatedTime,
  tokenBudget,
  scoreRange,
  lineRange,
  accentColor,
  bgColor,
  borderColor,
}) => (
  <Card variant="outlined">
    <CardContent className="p-5">
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: bgColor, border: `1px solid ${borderColor}` }}
        >
          <Icon size={20} style={{ color: accentColor }} />
        </div>
        <div>
          <div className="text-base font-semibold text-charcoal">{name}</div>
          <div className="text-xs" style={{ color: accentColor }}>{tagline}</div>
        </div>
      </div>

      <p className="text-sm text-sand-600 mb-4 leading-relaxed">{description}</p>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <FileText size={12} className="text-sand-600" />
          <span className="text-sand-600">Output:</span>
          <div className="flex flex-wrap gap-1">
            {outputFiles.map(f => (
              <code
                key={f}
                className="px-1.5 py-0.5 rounded font-mono"
                style={{ background: bgColor, color: accentColor, border: `1px solid ${borderColor}` }}
              >
                {f}
              </code>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={12} className="text-sand-600" />
          <span className="text-sand-600">Time:</span>
          <span className="font-medium text-charcoal">{estimatedTime}</span>
        </div>
        <div className="flex items-center gap-2">
          <Coins size={12} className="text-sand-600" />
          <span className="text-sand-600">Tokens:</span>
          <span className="font-medium text-charcoal">{tokenBudget}</span>
        </div>
        <div className="flex items-center gap-2">
          <Zap size={12} className="text-sand-600" />
          <span className="text-sand-600">Score:</span>
          <span className="font-medium text-charcoal">{scoreRange}</span>
          <span className="text-sand-600">·</span>
          <span className="text-sand-600">{lineRange}</span>
        </div>
      </div>
    </CardContent>
  </Card>
)

// ─── Page ─────────────────────────────────────────────────────────────────────

export const LspPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const waveGroups = [
    { wave: 1, label: 'Wave 1 — Foundation & Scanner', color: '#698472' },
    { wave: 2, label: 'Wave 2 — Pipeline & CLI', color: '#8e6a59' },
    { wave: '3a', label: 'Wave 3a — LightSpec Presentation', color: '#5a6e7f' },
    { wave: '3b', label: 'Wave 3b — Viewer & QA', color: '#7a6b8a' },
  ]

  return (
    <div className="space-y-6 max-w-7xl">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap size={22} className="text-sage" style={{ color: '#698472' }} />
            <h2 className="text-2xl font-light text-charcoal">LightSpec</h2>
            <Badge variant="default" size="sm">Sprint 37</Badge>
          </div>
          <p className="text-sm text-sand-600">
            Just enough spec, just fast enough — AutoSpec's lightweight younger brother
          </p>
        </div>
        <a
          href="#/lsp"
          className="text-xs px-3 py-1.5 rounded-lg border transition-colors"
          style={{ borderColor: '#d8d0ba', color: '#574b3b', background: '#faf9f5' }}
        >
          View Presentation →
        </a>
      </div>

      {/* ── KPI row ── */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '3 Depths', sub: 'micro / standard / full' },
          { label: '60s', sub: 'Max spec generation' },
          { label: '5 Modules', sub: 'Brownfield scanner' },
          { label: '0 config', sub: 'Works out of the box' },
        ].map(kpi => (
          <Card key={kpi.label} variant="outlined">
            <CardContent className="py-4 flex flex-col items-center text-center">
              <div className="text-2xl font-light text-charcoal mb-1">{kpi.label}</div>
              <div className="text-xs text-sand-600">{kpi.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Tab navigation ── */}
      <div className="flex gap-1 bg-sand-200 rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-cream shadow-subtle text-charcoal font-medium'
                : 'text-sand-600 hover:text-charcoal hover:bg-cream/50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab: Depth Levels ── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <p className="text-sm text-sand-600">
            LightSpec automatically detects project complexity and selects the appropriate spec depth.
            No config required — run <code className="px-1 py-0.5 rounded text-xs font-mono" style={{ background: '#e8e4d8' }}>lsp init</code> and
            the scanner handles the rest.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {depthCards.map(card => (
              <DepthCard key={card.id} {...card} />
            ))}
          </div>

          {/* CLI quick reference */}
          <Card variant="filled">
            <CardHeader><CardTitle>CLI Quick Reference</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                {[
                  { cmd: 'lsp init', desc: 'Scan project, detect complexity, generate specs' },
                  { cmd: 'lsp init --depth micro', desc: 'Override depth detection' },
                  { cmd: 'lsp init --scope src/api', desc: 'Scope analysis to subdirectory' },
                  { cmd: 'lsp scan', desc: 'Run brownfield scanner only (no LLM calls)' },
                  { cmd: 'lsp scan --json', desc: 'Output scan result as JSON' },
                  { cmd: 'lsp status', desc: 'Show task list progress from .lsp/tasks.md' },
                  { cmd: 'lsp graduate', desc: 'Convert .lsp/ output to full AutoSpec project' },
                ].map(item => (
                  <div key={item.cmd} className="flex items-start gap-3">
                    <code
                      className="px-2 py-0.5 rounded text-xs flex-shrink-0"
                      style={{ background: '#e8e4d8', color: '#303b34', minWidth: '200px' }}
                    >
                      {item.cmd}
                    </code>
                    <span className="text-sm text-sand-600">{item.desc}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Output structure */}
          <Card variant="outlined">
            <CardHeader><CardTitle>Output Structure</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-semibold text-sand-600 uppercase tracking-wider mb-2">Micro / Standard</div>
                  <pre
                    className="text-xs p-3 rounded-lg"
                    style={{ background: '#f0ede6', color: '#303b34', fontFamily: 'monospace' }}
                  >{`.lsp/
  spec.md       ← unified spec
  tasks.md      ← task checklist
  .meta.json    ← generation metadata`}</pre>
                </div>
                <div>
                  <div className="text-xs font-semibold text-sand-600 uppercase tracking-wider mb-2">Full</div>
                  <pre
                    className="text-xs p-3 rounded-lg"
                    style={{ background: '#f0ede6', color: '#303b34', fontFamily: 'monospace' }}
                  >{`.lsp/
  product.md    ← personas, stories
  technical.md  ← architecture, API
  quality.md    ← tests, acceptance
  tasks.md
  .meta.json`}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Tab: Scanner ── */}
      {activeTab === 'scanner' && (
        <div className="space-y-6">
          <p className="text-sm text-sand-600">
            The brownfield scanner is pure TypeScript — no LLM calls, no network requests.
            It reads manifest files and directory structures to build a <strong className="text-charcoal">BrownfieldContext</strong> before
            any generation happens.
          </p>

          {/* Module pipeline flow */}
          <Card>
            <CardHeader><CardTitle>Detection Pipeline</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scannerModules.map((mod, idx) => (
                  <div key={mod.id}>
                    <div
                      className="flex items-start gap-3 p-3 rounded-xl border"
                      style={{
                        borderColor: mod.isOutput ? mod.color : '#d8d0ba',
                        background: mod.isOutput ? '#f0ede6' : '#faf9f5',
                        borderWidth: mod.isOutput ? '2px' : '1px',
                      }}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ background: mod.color, color: '#faf9f5' }}
                      >
                        {mod.isOutput ? <Scan size={14} /> : idx + 1}
                      </div>
                      <div className="flex-1">
                        <code
                          className="text-xs font-mono font-semibold"
                          style={{ color: mod.color }}
                        >
                          {mod.label}.ts
                        </code>
                        <p className="text-xs text-sand-600 mt-0.5">{mod.description}</p>
                      </div>
                      {mod.isOutput && (
                        <Badge variant="default" size="sm">Output</Badge>
                      )}
                    </div>
                    {idx < scannerModules.length - 1 && (
                      <div className="flex justify-center my-1">
                        <ChevronRight size={14} className="text-sand-600 rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scoring algorithm */}
          <Card variant="filled">
            <CardHeader><CardTitle>Scoring Algorithm (0–100)</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { category: 'File count', max: 25, desc: '>200 files = 25pts, >50 = 15pts, >10 = 8pts, else = 2pts' },
                  { category: 'Line count', max: 20, desc: '>50K lines = 20pts, >10K = 12pts, >2K = 6pts, else = 1pt' },
                  { category: 'Architecture', max: 20, desc: 'monorepo = 20, microservices = 18, modular = 10, monolith = 5' },
                  { category: 'Stack breadth', max: 15, desc: '(languages + frameworks) × 3, capped at 15pts' },
                  { category: 'API/Frontend/DB', max: 10, desc: 'API = 4pts, frontend = 3pts, database = 3pts' },
                  { category: 'Test maturity', max: 10, desc: '>20 test files = 10pts, >5 = 6pts, >0 = 3pts' },
                ].map(row => (
                  <div key={row.category} className="flex items-start gap-3">
                    <div
                      className="text-xs font-semibold px-2 py-0.5 rounded flex-shrink-0"
                      style={{ background: '#698472', color: '#faf9f5', minWidth: '120px', textAlign: 'center' }}
                    >
                      {row.category}
                    </div>
                    <div className="text-xs text-sand-600 flex-1">{row.desc}</div>
                    <div className="text-xs font-mono text-sand-600 flex-shrink-0">max {row.max}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* BrownfieldContext shape */}
          <Card variant="outlined">
            <CardHeader><CardTitle>BrownfieldContext Shape</CardTitle></CardHeader>
            <CardContent>
              <pre
                className="text-xs p-4 rounded-lg overflow-auto"
                style={{ background: '#f0ede6', color: '#303b34', fontFamily: 'monospace' }}
              >{`interface BrownfieldContext {
  techStack: {
    languages: string[]       // ['typescript', 'python']
    frameworks: string[]      // ['react', 'express', 'nestjs']
    packageManager: string | null
    testFrameworks: string[]  // ['vitest', 'jest', 'pytest']
    buildTools: string[]      // ['vite', 'tsup', 'webpack']
  }
  architecture: {
    pattern: 'monolith' | 'modular' | 'monorepo' | 'microservices' | 'unknown'
    entryPoints: string[]
    sourceDirectories: string[]
    hasApi: boolean
    hasFrontend: boolean
    hasDatabase: boolean
  }
  routes: { routes: Route[]; framework: string | null }
  docs: { readme: string | null; existingSpecs: string[]; otherDocs: string[] }
  metrics: { totalFiles: number; totalLines: number; sourceFiles: number; testFiles: number }
}`}</pre>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Tab: Graduation ── */}
      {activeTab === 'graduation' && (
        <div className="space-y-6">
          <p className="text-sm text-sand-600">
            LightSpec is designed as a <em>stepping stone</em> into full AutoSpec. When a project
            grows beyond what a single spec can hold, <code className="px-1 py-0.5 rounded text-xs font-mono" style={{ background: '#e8e4d8' }}>lsp graduate</code> converts
            the <code className="px-1 py-0.5 rounded text-xs font-mono" style={{ background: '#e8e4d8' }}>.lsp/</code> output into
            a complete 10-role AutoSpec project structure.
          </p>

          {/* Migration flow */}
          <Card>
            <CardHeader><CardTitle>LightSpec → AutoSpec Migration Path</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-stretch gap-4">
                {/* LightSpec side */}
                <div
                  className="flex-1 p-4 rounded-xl border"
                  style={{ borderColor: '#698472', background: '#dfe8e2' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={16} style={{ color: '#698472' }} />
                    <span className="text-sm font-semibold text-charcoal">LightSpec Output</span>
                    <code className="text-xs font-mono" style={{ color: '#698472' }}>.lsp/</code>
                  </div>
                  <div className="space-y-1 text-xs text-sand-600 font-mono">
                    <div>.lsp/spec.md</div>
                    <div>.lsp/tasks.md</div>
                    <div>.lsp/.meta.json</div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex flex-col items-center justify-center gap-1">
                  <ArrowRight size={20} style={{ color: '#8e6a59' }} />
                  <code className="text-xs font-mono text-sand-600">lsp graduate</code>
                </div>

                {/* AutoSpec side */}
                <div
                  className="flex-1 p-4 rounded-xl border"
                  style={{ borderColor: '#8e6a59', background: '#f5f0ec' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <GitBranch size={16} style={{ color: '#8e6a59' }} />
                    <span className="text-sm font-semibold text-charcoal">AutoSpec Structure</span>
                  </div>
                  <div className="space-y-1 text-xs text-sand-600 font-mono">
                    <div>specs/01_product_manager.md</div>
                    <div>specs/02_backend_lead.md</div>
                    <div>specs/03_frontend_lead.md</div>
                    <div>specs/04_db_architect.md</div>
                    <div>specs/05_qa_lead.md</div>
                    <div className="text-sand-500">specs/06–10 (stubs)</div>
                    <div>specs/backlog.md</div>
                    <div>CLAUDE.md</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mapping table */}
          <Card variant="outlined">
            <CardHeader><CardTitle>Section → Role Mapping</CardTitle></CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sand">
                    <th className="text-left py-2 px-4 text-sand-600 font-medium">LightSpec Section</th>
                    <th className="text-left py-2 px-4 text-sand-600 font-medium">AutoSpec Role File</th>
                    <th className="text-left py-2 px-4 text-sand-600 font-medium">Content</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { section: 'Overview', role: '01_product_manager.md', content: 'Goals, personas, success metrics' },
                    { section: 'Technical Design', role: '02_backend_lead.md', content: 'Architecture, API design' },
                    { section: 'Frontend', role: '03_frontend_lead.md', content: 'UI/UX decisions, component design' },
                    { section: 'Data Model', role: '04_db_architect.md', content: 'Schema, entities, relationships' },
                    { section: 'Testing Strategy', role: '05_qa_lead.md', content: 'Test plan, coverage targets' },
                    { section: '(auto-generated stubs)', role: '06–10 roles', content: 'Stubs with TODO instructions' },
                    { section: 'Task List', role: 'backlog.md', content: 'Sprint 1 tickets from task table' },
                  ].map(row => (
                    <tr key={row.section} className="border-b border-sand/50 hover:bg-sand-200/30">
                      <td className="py-2 px-4 font-mono text-xs text-charcoal">{row.section}</td>
                      <td className="py-2 px-4 font-mono text-xs" style={{ color: '#698472' }}>{row.role}</td>
                      <td className="py-2 px-4 text-xs text-sand-600">{row.content}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* When to graduate */}
          <Card variant="filled">
            <CardHeader><CardTitle>When to Graduate</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    trigger: 'Project complexity grows',
                    desc: 'Task list exceeds 20 items and requires multi-role coordination',
                    icon: CheckCircle2,
                    color: '#698472',
                  },
                  {
                    trigger: 'Team grows beyond 1 developer',
                    desc: 'Multiple roles need their own spec section with clear ownership',
                    icon: CheckCircle2,
                    color: '#698472',
                  },
                  {
                    trigger: 'Recurring sprints needed',
                    desc: 'Project spans multiple sprints and needs backlog management',
                    icon: CheckCircle2,
                    color: '#698472',
                  },
                ].map(item => (
                  <div key={item.trigger} className="flex gap-3">
                    <item.icon size={16} className="flex-shrink-0 mt-0.5" style={{ color: item.color }} />
                    <div>
                      <div className="text-sm font-medium text-charcoal">{item.trigger}</div>
                      <div className="text-xs text-sand-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Tab: Sprint 37 ── */}
      {activeTab === 'sprint' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-sand-600">
              Sprint 37 delivered LightSpec in 3 parallel waves: scanner/foundation, pipeline/CLI, then viewer integration and QA.
            </p>
            <div className="flex gap-2 text-xs">
              {Object.entries(statusStyle).map(([key, val]) => (
                <span
                  key={key}
                  className="px-2 py-0.5 rounded-full"
                  style={{ background: val.bg, color: val.text }}
                >
                  {val.label}
                </span>
              ))}
            </div>
          </div>

          {waveGroups.map(wg => {
            const tickets = sprint37Tickets.filter(t => t.wave === wg.wave)
            const doneCount = tickets.filter(t => t.status === 'done').length
            return (
              <Card key={String(wg.wave)} variant="outlined">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: wg.color }}
                        />
                        {wg.label}
                      </div>
                    </CardTitle>
                    <span className="text-xs text-sand-600">{doneCount}/{tickets.length} done</span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full text-sm">
                    <tbody>
                      {tickets.map(ticket => {
                        const s = statusStyle[ticket.status] || statusStyle.todo
                        return (
                          <tr key={ticket.id} className="border-b border-sand/50 hover:bg-sand-200/30">
                            <td className="py-2 px-4 font-mono text-xs text-sand-600 w-16">{ticket.id}</td>
                            <td className="py-2 px-4 text-sm text-charcoal">{ticket.title}</td>
                            <td className="py-2 px-4 text-right">
                              <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{ background: s.bg, color: s.text }}
                              >
                                {s.label}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )
          })}

          {/* Summary stats */}
          <Card variant="filled">
            <CardContent className="py-4">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-light text-charcoal">31</div>
                  <div className="text-xs text-sand-600">Total tickets</div>
                </div>
                <div>
                  <div className="text-2xl font-light" style={{ color: '#698472' }}>
                    {sprint37Tickets.filter(t => t.status === 'done').length}
                  </div>
                  <div className="text-xs text-sand-600">Done</div>
                </div>
                <div>
                  <div className="text-2xl font-light" style={{ color: '#92400e' }}>
                    {sprint37Tickets.filter(t => t.status === 'in-progress').length}
                  </div>
                  <div className="text-xs text-sand-600">In Progress</div>
                </div>
                <div>
                  <div className="text-2xl font-light text-charcoal">3</div>
                  <div className="text-xs text-sand-600">Parallel waves</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default LspPage
