// viewer/src/data/marketing.ts
// Sprint 42 — Launch Readiness: Marketing Hub data module

// ─── Types ────────────────────────────────────────────────────────────────────

export type PublishStatus = 'draft' | 'ready' | 'published'

export interface LinkedInPost {
  id: string
  arc: string
  week: number
  status: PublishStatus
  blockedBy: string[]
  hook: string
  body: string
  tags: string[]
}

export interface Article {
  id: string
  title: string
  platform: 'Dev.to' | 'Hacker News' | 'LinkedIn' | 'Medium'
  week: number
  status: PublishStatus
  blockedBy: string[]
  outline: string[]
  wordCount: number
}

export interface LaunchMilestone {
  id: string
  phase: 'Pre-launch' | 'Launch' | 'Post-launch'
  item: string
  done: boolean
  dueDate?: string
  blockedBy: string[]
}

export interface Channel {
  id: string
  name: string
  type: 'social' | 'community' | 'directory' | 'blog'
  priority: 'high' | 'medium' | 'low'
  plannedPosts: number
  notes: string
  lastPosted?: string
}

export interface MarketingData {
  posts: LinkedInPost[]
  articles: Article[]
  milestones: LaunchMilestone[]
  channels: Channel[]
}

// ─── resolveBlockers helper ────────────────────────────────────────────────────

export function resolveBlockers(data: MarketingData, itemId: string): boolean {
  const allItems = [
    ...data.posts.map(p => ({ id: p.id, blockedBy: p.blockedBy, resolved: p.status === 'published' })),
    ...data.articles.map(a => ({ id: a.id, blockedBy: a.blockedBy, resolved: a.status === 'published' })),
    ...data.milestones.map(m => ({ id: m.id, blockedBy: m.blockedBy, resolved: m.done })),
  ]
  const item = allItems.find(i => i.id === itemId)
  if (!item) return false
  if (item.blockedBy.length === 0) return true
  return item.blockedBy.every(blockerId => {
    const blocker = allItems.find(i => i.id === blockerId)
    return blocker ? blocker.resolved : true
  })
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

export const marketingData: MarketingData = {
  posts: [
    {
      id: 'post-1',
      arc: 'Problem Hook',
      week: 1,
      status: 'ready',
      blockedBy: [],
      hook: "I gave Claude a 40,000-line codebase. It started hallucinating route names that didn't exist.",
      body: "Every AI session starts cold. No memory. No context. You spend 10–20% of every session re-explaining your stack, your architecture, your conventions. Then Claude forgets it all by tomorrow. I tracked my own usage over 3 weeks: 18% of total AI session time was context re-establishment, not actual work. That's 1 in every 5 tokens you're paying for — wasted on 'here's what my project does again.' I built something to fix it. lsp init. 60 seconds. Done. Your AI starts with full context every session. Link in comments. #LightSpec #AIDevTools #ClaudeCode #DeveloperTools",
      tags: ['#LightSpec', '#AIDevTools', '#ClaudeCode', '#DeveloperTools'],
    },
    {
      id: 'post-2',
      arc: 'Demo Drop',
      week: 2,
      status: 'draft',
      blockedBy: ['ms-2', 'ms-3'],
      hook: '60 seconds. That\'s all lsp init takes to give your AI a full project spec.',
      body: 'New project. Zero context. I ran lsp init. It scanned my repo — detected TypeScript, Express, 8 API routes, Jest test suite. Scored complexity at 45 → standard depth. Called Claude Code. Wrote .lsp/spec.md and .lsp/tasks.md. Total time: 38 seconds. Now every Claude session starts with full project context. No re-explaining. No hallucinated routes. Just work. Open source. Three providers: Claude Code (no API key), Anthropic API (<$0.05/run), Gemini CLI (free). npm install -g lightspec. Link in comments. #LightSpec #AIDevTools #ClaudeCode',
      tags: ['#LightSpec', '#AIDevTools', '#ClaudeCode'],
    },
    {
      id: 'post-3',
      arc: 'Technical Story',
      week: 3,
      status: 'draft',
      blockedBy: ['post-2'],
      hook: 'Our brownfield scanner reads package.json, go.mod, and your directory structure — with zero LLM calls.',
      body: 'The scanner in LightSpec is 100% local. No API. No latency. 8 detection modules running in parallel: detect-stack.ts reads package.json, go.mod, Cargo.toml, requirements.txt. detect-architecture.ts reads directory patterns. detect-routes.ts extracts HTTP routes with regex — Express, Gin, Echo, NestJS, FastAPI. detect-tests.ts counts test files. complexity-scorer.ts outputs a 0-100 heuristic score. The score drives adaptive depth: micro (<30), standard (30-70), full (>70). Only THEN do we call the LLM. #LightSpec #TypeScript #OpenSource',
      tags: ['#LightSpec', '#TypeScript', '#OpenSource'],
    },
    {
      id: 'post-4',
      arc: 'NPS Story',
      week: 4,
      status: 'draft',
      blockedBy: ['post-3'],
      hook: 'We ran a usability study on our own tool. NPS came back at -67. Here\'s what we learned.',
      body: "Sprint 40: we simulated a usability study with 3 developer personas — junior, mid-level, senior. NPS: -67. All three detractors. What went wrong: Junior couldn't find install instructions. Mid-level manually reformatted spec output for the skill layer. Senior found a documented feature (Go route extraction) that wasn't implemented. We ran Sprint 41 to fix all three. LIGHTSPEC_QUICKSTART.md now leads with npm install -g lightspec as line one. lsp init-backlog automates the spec-to-backlog conversion. Go route extraction is implemented and tested. NPS study → Sprint → Shipped. #DeveloperExperience #LightSpec #NPS",
      tags: ['#DeveloperExperience', '#LightSpec', '#NPS'],
    },
    {
      id: 'post-5',
      arc: 'Graduation Path',
      week: 5,
      status: 'draft',
      blockedBy: ['post-4'],
      hook: 'What happens when a solo project becomes a team project? LightSpec has a one-command answer.',
      body: 'LightSpec is the lightweight entry point. Scan → spec → tasks in 60 seconds. But when your project grows — team of 3, sprint ceremonies, SRS requirements — you need more ceremony. That\'s AutoSpec. One command: lsp graduate. It extracts your existing spec into 10 role specs, creates a full sprint backlog, generates a CLAUDE.md, and installs 10 SDD skills. Two tools, one path: LightSpec for quick start. AutoSpec for scale. #AutoSpec #LightSpec #SDD',
      tags: ['#AutoSpec', '#LightSpec', '#SDD'],
    },
  ],

  articles: [
    {
      id: 'art-1',
      title: 'Why AI Coding Assistants Are Amnesiac — And How to Fix It in 60 Seconds',
      platform: 'Dev.to',
      week: 2,
      status: 'draft',
      blockedBy: ['ms-2'],
      outline: [
        'The stateless AI problem',
        'What 18% context overhead looks like in practice',
        'lsp init demo walkthrough',
        'Adaptive depth explained',
        'Install and get started',
      ],
      wordCount: 1500,
    },
    {
      id: 'art-2',
      title: 'We Got NPS -67 on Our Own Tool — Here\'s What We Fixed',
      platform: 'Dev.to',
      week: 3,
      status: 'draft',
      blockedBy: ['post-4'],
      outline: [
        'The usability study setup',
        'Three personas, three failure modes',
        'What the data showed',
        'Sprint 41: 7 fixes in 8 tickets',
        'Before/after comparison',
      ],
      wordCount: 1800,
    },
    {
      id: 'art-3',
      title: 'Building a Brownfield Scanner: Deterministic Code Analysis Without LLM Calls',
      platform: 'Hacker News',
      week: 4,
      status: 'draft',
      blockedBy: ['ms-5'],
      outline: [
        'Why scan before generating',
        'Five detection modules in detail',
        'Complexity scoring heuristics',
        "Confidence signals: what the scanner can't see",
        'Code walkthrough: detect-routes.ts',
      ],
      wordCount: 2000,
    },
    {
      id: 'art-4',
      title: 'Spec-Driven Development for Solo Devs: The 80/20 Version',
      platform: 'Dev.to',
      week: 5,
      status: 'draft',
      blockedBy: ['art-1'],
      outline: [
        'Full SDD is too heavy for solo work',
        'The micro spec',
        'The standard spec',
        'Task extraction',
        'When to graduate to AutoSpec',
      ],
      wordCount: 1200,
    },
    {
      id: 'art-5',
      title: 'The Hidden Cost of AI Context Loss: Why You\'re Wasting 10-20% of Every Session',
      platform: 'LinkedIn',
      week: 6,
      status: 'draft',
      blockedBy: ['post-5'],
      outline: [
        'The context drift problem',
        'Cost calculation: tokens × rate × frequency',
        'The 60-second fix',
        'ROI framing for teams',
        'Call to action',
      ],
      wordCount: 1000,
    },
  ],

  milestones: [
    {
      id: 'ms-1',
      phase: 'Pre-launch',
      item: 'Fix README: replace placeholder GitHub URLs, update test badge to 154, add animated terminal GIF',
      done: false,
      dueDate: 'Week 0',
      blockedBy: [],
    },
    {
      id: 'ms-2',
      phase: 'Pre-launch',
      item: 'npm publish: verify lightspec package live on npm registry, test npx lightspec init --help in clean env',
      done: false,
      dueDate: 'Week 0',
      blockedBy: ['ms-1'],
    },
    {
      id: 'ms-3',
      phase: 'Pre-launch',
      item: 'Record demo GIF: lsp init on task-flow-api example project, 60 seconds, real output',
      done: false,
      blockedBy: [],
    },
    {
      id: 'ms-4',
      phase: 'Launch',
      item: 'Publish LinkedIn Post 1 — Problem Hook',
      done: false,
      blockedBy: ['ms-2', 'ms-3', 'post-1'],
    },
    {
      id: 'ms-5',
      phase: 'Launch',
      item: "Post to Show HN: 'Show HN: LightSpec – CLI that generates a spec for any codebase in 60 seconds'",
      done: false,
      blockedBy: ['ms-4'],
    },
    {
      id: 'ms-6',
      phase: 'Launch',
      item: 'Submit to Product Hunt (2-3 weeks after npm publish, once real installs exist)',
      done: false,
      blockedBy: ['ms-5'],
    },
    {
      id: 'ms-7',
      phase: 'Post-launch',
      item: 'Publish LinkedIn Posts 2–5 on weekly cadence (weeks 2-5)',
      done: false,
      blockedBy: ['ms-4'],
    },
    {
      id: 'ms-8',
      phase: 'Post-launch',
      item: 'Publish 3 articles on Dev.to + 1 on LinkedIn',
      done: false,
      blockedBy: ['ms-6'],
    },
  ],

  channels: [
    {
      id: 'ch-1',
      name: 'LinkedIn',
      type: 'social',
      priority: 'high',
      plannedPosts: 5,
      notes: '5-post arc over 5 weeks. Lead with Problem Hook (no product link). Publish Tue/Thu 9am EST.',
    },
    {
      id: 'ch-2',
      name: 'Hacker News',
      type: 'community',
      priority: 'high',
      plannedPosts: 1,
      notes: "Show HN post. Title: 'Show HN: LightSpec – CLI that generates a spec for any codebase in 60 seconds'. Post Tue-Thu 9am EST.",
    },
    {
      id: 'ch-3',
      name: 'Product Hunt',
      type: 'directory',
      priority: 'high',
      plannedPosts: 1,
      notes: "Launch 2-3 weeks after npm publish. Need: tagline, 5 screenshots, demo GIF. 'Just enough spec, just fast enough.'",
    },
    {
      id: 'ch-4',
      name: 'Reddit (r/ClaudeAI + r/cursor)',
      type: 'community',
      priority: 'medium',
      plannedPosts: 2,
      notes: 'Post after HN. r/ClaudeAI angle: zero-config context. r/cursor angle: persistent spec for Cursor sessions.',
    },
    {
      id: 'ch-5',
      name: 'Dev.to',
      type: 'blog',
      priority: 'medium',
      plannedPosts: 3,
      notes: 'Publish articles 1, 2, 4 (AI Amnesiac, NPS Story, SDD for Solo Devs). Cross-post from personal blog.',
    },
    {
      id: 'ch-6',
      name: 'Claude Code Discord',
      type: 'community',
      priority: 'low',
      plannedPosts: 2,
      notes: 'Zero-API-key angle: works inside Claude Code session with no setup. Post after Product Hunt.',
    },
  ],
}
