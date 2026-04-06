# Sprint 42 Agent Brief: Marketing Hub Page

**Date:** 2026-04-06
**Sprint:** 42
**Theme:** Launch Readiness — Marketing Page + Content Pipeline
**Orchestrator:** Opus 4.6 (plan) → Sonnet 4.6 (execute)

## What We're Building

A single new page in the LightSpec viewer (`viewer/`) at route `/#/marketing`:
- **`viewer/src/data/marketing.ts`** — typed data module: 5 LinkedIn posts, 5 articles, 8 launch milestones, 6 channels, all with `blockedBy` dependency chains
- **`viewer/src/pages/MarketingPage.tsx`** — tab-based launch dashboard with Next Action card, KPI row, and 4 tabs (Posts / Articles / Milestones / Channels)
- **4 card components** in `viewer/src/components/marketing/`
- Route wired in `App.tsx`, sidebar entry in `Sidebar.tsx`
- Docs update in `docs/viewer/01_overview.md`

## Critical Files to Read FIRST

Before writing any code, read these files in full:

```
/opt/LightSpec/viewer/src/pages/LspPage.tsx          — tab pattern to replicate EXACTLY
/opt/LightSpec/viewer/src/components/primitives/Card.tsx   — Card, CardHeader, CardTitle, CardContent
/opt/LightSpec/viewer/src/components/primitives/Badge.tsx  — BadgeVariant types
/opt/LightSpec/viewer/src/components/primitives/Button.tsx — Button variant/size props
/opt/LightSpec/viewer/src/components/layout/Sidebar.tsx    — bottomNavItems pattern
/opt/LightSpec/viewer/src/App.tsx                     — route registration pattern
/opt/LightSpec/viewer/src/data/backlog.ts             — data file export pattern
/opt/LightSpec/docs/viewer/01_overview.md             — docs to update in 42.19
```

## Design System (CRITICAL — no exceptions)

```
Background:  #f5f3ed  (cream)
Primary:     #698472  (sage)    → active nav, done badges, primary accents
Accent:      #8e6a59  (terracotta) → secondary accents, phase labels
Border:      #d8d0ba  (sand)
Text:        #1a1a1a  (charcoal)

FORBIDDEN: shadcn/ui, @radix-ui, RTL classes, #0f172a/slate-950
```

## Status → Badge Variant Mapping

```typescript
'draft'     → 'todo'        // muted sand
'ready'     → 'in-progress' // amber
'published' → 'done'        // sage green
'blocked'   → 'blocked'     // red
```

## Data Schema (implement exactly)

```typescript
// viewer/src/data/marketing.ts

export type PublishStatus = 'draft' | 'ready' | 'published'

export interface LinkedInPost {
  id: string
  arc: string          // e.g. "Problem Hook"
  week: number
  status: PublishStatus
  blockedBy: string[]  // array of item ids from any collection
  hook: string         // opening line (shown large, always visible)
  body: string         // full post text (collapsed, expandable)
  tags: string[]
}

export interface Article {
  id: string
  title: string
  platform: 'Dev.to' | 'Hacker News' | 'LinkedIn' | 'Medium'
  week: number
  status: PublishStatus
  blockedBy: string[]
  outline: string[]    // array of section headings
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

// Export this helper — used by MarketingPage AND NextActionCard
export function resolveBlockers(data: MarketingData, itemId: string): boolean {
  // Returns true if ALL blockedBy ids for the given item are "resolved"
  // Resolved = post/article status === 'published', OR milestone done === true
  // ...implementation
}

export const marketingData: MarketingData = { ... }
```

## Full Seed Content (42.2 — populate verbatim)

### LinkedIn Posts (5)

```
post-1: arc="Problem Hook", week=1, status='ready', blockedBy=[],
  hook="I gave Claude a 40,000-line codebase. It started hallucinating route names that didn't exist.",
  body="Every AI session starts cold. No memory. No context. You spend 10–20% of every session re-explaining your stack, your architecture, your conventions. Then Claude forgets it all by tomorrow. I tracked my own usage over 3 weeks: 18% of total AI session time was context re-establishment, not actual work. That's 1 in every 5 tokens you're paying for — wasted on 'here's what my project does again.' I built something to fix it. lsp init. 60 seconds. Done. Your AI starts with full context every session. Link in comments. #LightSpec #AIDevTools #ClaudeCode #DeveloperTools",
  tags=['#LightSpec','#AIDevTools','#ClaudeCode','#DeveloperTools']

post-2: arc="Demo Drop", week=2, status='draft', blockedBy=['ms-2','ms-3'],
  hook="60 seconds. That's all lsp init takes to give your AI a full project spec.",
  body="New project. Zero context. I ran lsp init. It scanned my repo — detected TypeScript, Express, 8 API routes, Jest test suite. Scored complexity at 45 → standard depth. Called Claude Code. Wrote .lsp/spec.md and .lsp/tasks.md. Total time: 38 seconds. Now every Claude session starts with full project context. No re-explaining. No hallucinated routes. Just work. Open source. Three providers: Claude Code (no API key), Anthropic API (<$0.05/run), Gemini CLI (free). npm install -g lightspec. Link in comments. #LightSpec #AIDevTools #ClaudeCode",
  tags=['#LightSpec','#AIDevTools','#ClaudeCode']

post-3: arc="Technical Story", week=3, status='draft', blockedBy=['post-2'],
  hook="Our brownfield scanner reads package.json, go.mod, and your directory structure — with zero LLM calls.",
  body="The scanner in LightSpec is 100% local. No API. No latency. 8 detection modules running in parallel: detect-stack.ts reads package.json, go.mod, Cargo.toml, requirements.txt. detect-architecture.ts reads directory patterns. detect-routes.ts extracts HTTP routes with regex — Express, Gin, Echo, NestJS, FastAPI. detect-tests.ts counts test files. complexity-scorer.ts outputs a 0-100 heuristic score. The score drives adaptive depth: micro (<30), standard (30-70), full (>70). Only THEN do we call the LLM. #LightSpec #TypeScript #OpenSource",
  tags=['#LightSpec','#TypeScript','#OpenSource']

post-4: arc="NPS Story", week=4, status='draft', blockedBy=['post-3'],
  hook="We ran a usability study on our own tool. NPS came back at -67. Here's what we learned.",
  body="Sprint 40: we simulated a usability study with 3 developer personas — junior, mid-level, senior. NPS: -67. All three detractors. What went wrong: Junior couldn't find install instructions. Mid-level manually reformatted spec output for the skill layer. Senior found a documented feature (Go route extraction) that wasn't implemented. We ran Sprint 41 to fix all three. LIGHTSPEC_QUICKSTART.md now leads with npm install -g lightspec as line one. lsp init-backlog automates the spec-to-backlog conversion. Go route extraction is implemented and tested. NPS study → Sprint → Shipped. #DeveloperExperience #LightSpec #NPS",
  tags=['#DeveloperExperience','#LightSpec','#NPS']

post-5: arc="Graduation Path", week=5, status='draft', blockedBy=['post-4'],
  hook="What happens when a solo project becomes a team project? LightSpec has a one-command answer.",
  body="LightSpec is the lightweight entry point. Scan → spec → tasks in 60 seconds. But when your project grows — team of 3, sprint ceremonies, SRS requirements — you need more ceremony. That's AutoSpec. One command: lsp graduate. It extracts your existing spec into 10 role specs, creates a full sprint backlog, generates a CLAUDE.md, and installs 10 SDD skills. Two tools, one path: LightSpec for quick start. AutoSpec for scale. #AutoSpec #LightSpec #SDD",
  tags=['#AutoSpec','#LightSpec','#SDD']
```

### Articles (5)

```
art-1: title="Why AI Coding Assistants Are Amnesiac — And How to Fix It in 60 Seconds",
  platform='Dev.to', week=2, status='draft', blockedBy=['ms-2'],
  outline=["The stateless AI problem","What 18% context overhead looks like in practice","lsp init demo walkthrough","Adaptive depth explained","Install and get started"],
  wordCount=1500

art-2: title="We Got NPS -67 on Our Own Tool — Here's What We Fixed",
  platform='Dev.to', week=3, status='draft', blockedBy=['post-4'],
  outline=["The usability study setup","Three personas, three failure modes","What the data showed","Sprint 41: 7 fixes in 8 tickets","Before/after comparison"],
  wordCount=1800

art-3: title="Building a Brownfield Scanner: Deterministic Code Analysis Without LLM Calls",
  platform='Hacker News', week=4, status='draft', blockedBy=['ms-5'],
  outline=["Why scan before generating","Five detection modules in detail","Complexity scoring heuristics","Confidence signals: what the scanner can't see","Code walkthrough: detect-routes.ts"],
  wordCount=2000

art-4: title="Spec-Driven Development for Solo Devs: The 80/20 Version",
  platform='Dev.to', week=5, status='draft', blockedBy=['art-1'],
  outline=["Full SDD is too heavy for solo work","The micro spec","The standard spec","Task extraction","When to graduate to AutoSpec"],
  wordCount=1200

art-5: title="The Hidden Cost of AI Context Loss: Why You're Wasting 10-20% of Every Session",
  platform='LinkedIn', week=6, status='draft', blockedBy=['post-5'],
  outline=["The context drift problem","Cost calculation: tokens × rate × frequency","The 60-second fix","ROI framing for teams","Call to action"],
  wordCount=1000
```

### Launch Milestones (8)

```
ms-1: phase='Pre-launch', item="Fix README: replace placeholder GitHub URLs, update test badge to 154, add animated terminal GIF", done=false, dueDate="Week 0", blockedBy=[]
ms-2: phase='Pre-launch', item="npm publish: verify lightspec package live on npm registry, test npx lightspec init --help in clean env", done=false, dueDate="Week 0", blockedBy=['ms-1']
ms-3: phase='Pre-launch', item="Record demo GIF: lsp init on task-flow-api example project, 60 seconds, real output", done=false, blockedBy=[]
ms-4: phase='Launch', item="Publish LinkedIn Post 1 — Problem Hook", done=false, blockedBy=['ms-2','ms-3','post-1']
ms-5: phase='Launch', item="Post to Show HN: 'Show HN: LightSpec – CLI that generates a spec for any codebase in 60 seconds'", done=false, blockedBy=['ms-4']
ms-6: phase='Launch', item="Submit to Product Hunt (2-3 weeks after npm publish, once real installs exist)", done=false, blockedBy=['ms-5']
ms-7: phase='Post-launch', item="Publish LinkedIn Posts 2–5 on weekly cadence (weeks 2-5)", done=false, blockedBy=['ms-4']
ms-8: phase='Post-launch', item="Publish 3 articles on Dev.to + 1 on LinkedIn", done=false, blockedBy=['ms-6']
```

### Channels (6)

```
ch-1: name="LinkedIn", type='social', priority='high', plannedPosts=5,
  notes="5-post arc over 5 weeks. Lead with Problem Hook (no product link). Publish Tue/Thu 9am EST."

ch-2: name="Hacker News", type='community', priority='high', plannedPosts=1,
  notes="Show HN post. Title: 'Show HN: LightSpec – CLI that generates a spec for any codebase in 60 seconds'. Post Tue-Thu 9am EST."

ch-3: name="Product Hunt", type='directory', priority='high', plannedPosts=1,
  notes="Launch 2-3 weeks after npm publish. Need: tagline, 5 screenshots, demo GIF. 'Just enough spec, just fast enough.'"

ch-4: name="Reddit (r/ClaudeAI + r/cursor)", type='community', priority='medium', plannedPosts=2,
  notes="Post after HN. r/ClaudeAI angle: zero-config context. r/cursor angle: persistent spec for Cursor sessions."

ch-5: name="Dev.to", type='blog', priority='medium', plannedPosts=3,
  notes="Publish articles 1, 2, 4 (AI Amnesiac, NPS Story, SDD for Solo Devs). Cross-post from personal blog."

ch-6: name="Claude Code Discord", type='community', priority='low', plannedPosts=2,
  notes="Zero-API-key angle: works inside Claude Code session with no setup. Post after Product Hunt."
```

## resolveBlockers() Logic

```typescript
export function resolveBlockers(data: MarketingData, itemId: string): boolean {
  // Find the item's blockedBy list
  const allItems = [
    ...data.posts.map(p => ({ id: p.id, blockedBy: p.blockedBy, resolved: p.status === 'published' })),
    ...data.articles.map(a => ({ id: a.id, blockedBy: a.blockedBy, resolved: a.status === 'published' })),
    ...data.milestones.map(m => ({ id: m.id, blockedBy: m.blockedBy, resolved: m.done })),
  ]
  const item = allItems.find(i => i.id === itemId)
  if (!item) return false
  if (item.blockedBy.length === 0) return true  // nothing blocking
  return item.blockedBy.every(blockerId => {
    const blocker = allItems.find(i => i.id === blockerId)
    return blocker ? blocker.resolved : true
  })
}
```

## MarketingPage Architecture

```
MarketingPage.tsx
├── Header: "Launch Dashboard" + TrendingUp icon + "Set Live (this session)" toggle
│   └── Toggle sub-label: "Resets on page refresh. No data is saved."
├── KpiRow (useMemo): Posts Ready | Posts Drafted | Milestones Done | Articles In Progress
├── NextActionCard: resolves first unblocked non-done item by week; copy button; session-only
├── Tab bar: role="tablist", 4 tabs, ArrowLeft/Right keyboard nav
│   ├── Posts tab: filter pills (All/Ready/Draft/Blocked) + PostCard grid
│   ├── Articles tab: filter pills + ArticleCard list
│   ├── Milestones tab: MilestoneCard grouped by phase (Pre-launch → Launch → Post-launch)
│   └── Channels tab: <table> of ChannelRow, sorted by priority desc
└── launchLive: boolean state — when true, treat ms-2 as resolved in dependency graph
```

## Tab Pattern (copy from LspPage.tsx)

```tsx
// Tab bar — EXACT pattern from LspPage.tsx
const [activeTab, setActiveTab] = useState<TabId>('posts')

<div className="flex gap-1 bg-sand-200 rounded-xl p-1 mb-6" role="tablist">
  {tabs.map(tab => (
    <button
      key={tab.id}
      role="tab"
      aria-selected={activeTab === tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
        activeTab === tab.id
          ? 'bg-cream shadow-sm text-charcoal font-medium'
          : 'text-sand-600 hover:text-charcoal hover:bg-cream/50'
      }`}
    >
      {tab.label}
    </button>
  ))}
</div>
```

## "Set Live" Button (CRITICAL — session only, no persistence)

```tsx
// In MarketingPage.tsx header
const [launchLive, setLaunchLive] = useState(false)  // NEVER persist to localStorage

<div className="flex flex-col items-end">
  <button
    onClick={() => setLaunchLive(true)}
    disabled={launchLive}
    className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
      launchLive
        ? 'bg-sage text-cream cursor-default'
        : 'bg-sand-200 text-charcoal hover:bg-sand-300'
    }`}
  >
    {launchLive ? 'Live Mode Active (session only)' : 'Set Live (this session)'}
  </button>
  <span className="text-xs text-sand-500 mt-0.5">Resets on page refresh. No data is saved.</span>
</div>
```

## Sidebar Nav Entry

```tsx
// In Sidebar.tsx — add to bottomNavItems array (after '/lsp' entry)
import { TrendingUp } from 'lucide-react'  // add to existing lucide import

{ to: '/marketing', label: 'Marketing', icon: TrendingUp },
```

## App.tsx Route

```tsx
import { MarketingPage } from './pages/MarketingPage'
// Add in Routes:
<Route path="/marketing" element={<MarketingPage />} />
```

## Execution Order for Agent

**You must implement tickets in this order (respects dependencies):**

1. **42.1** — `viewer/src/data/marketing.ts` (interfaces + stub seed with 2 items each collection)
2. **42.2** — populate full seed (replace stub with all 26 items verbatim from this brief)
3. **42.3** — `viewer/src/components/marketing/PostCard.tsx`
4. **42.4** — `viewer/src/components/marketing/ArticleCard.tsx`
5. **42.5** — `viewer/src/components/marketing/MilestoneCard.tsx`
6. **42.6** — `viewer/src/components/marketing/ChannelRow.tsx`
7. **42.7** — `viewer/src/components/marketing/KpiRow.tsx` + visual review of 42.3–42.6
8. **42.8** — `viewer/src/pages/MarketingPage.tsx` (shell: header, KpiRow, NextActionCard stub, tab bar, placeholder panels) + register route in App.tsx
9. **42.9** — `viewer/src/components/marketing/NextActionCard.tsx` (full algorithm)
10. **42.10** — Wire Posts tab (PostCard grid + filter pills)
11. **42.11** — Wire Articles + Milestones tabs
12. **42.12** — Wire Channels tab + KpiRow reactivity (useMemo)
13. **42.13** — Export `resolveBlockers()` from marketing.ts; verify all 26 blockedBy ids resolve
14. **42.14** — `viewer/src/data/backlog.ts` Sprint 42 entry (19 tickets, 45 pts)
15. **42.15** — Sidebar nav entry (`TrendingUp` icon, `bottomNavItems`)
16. **42.16** — Integration QA: all 7 deliverables checklist (see backlog for full list)
17. **42.17** — `cd viewer && npm run build` — must exit 0 with zero TS errors
18. **42.19** — Update `docs/viewer/01_overview.md` (pages table → 11 total, routing block, data layer)
19. **42.18** — Sprint close: update backlog.md statuses ✅, create sprints/sprint-42/summary.md

## After Each Ticket

- Update `specs/backlog.md`: change 🔲 → 🔄 when starting, 🔄 → ✅ when done
- Do NOT mark ✅ until the ticket's verification criterion passes

## Forbidden Patterns

- `localStorage` or `sessionStorage` — the "Set Live" toggle must be React state ONLY
- `any` TypeScript type — all interfaces must be strict
- shadcn/ui or @radix-ui imports
- RTL CSS classes
- New npm packages — use only what's already in `viewer/package.json`
- Inline `style={{}}` for colors — use Tailwind classes only

## Verification Checklist (Definition of Done)

- [ ] `marketingData.posts.length === 5`, `.articles.length === 5`, `.milestones.length === 8`, `.channels.length === 6`
- [ ] `resolveBlockers(marketingData, 'post-1')` returns `true` (no blockers)
- [ ] `resolveBlockers(marketingData, 'post-2')` returns `false` (ms-2 and ms-3 not done)
- [ ] `/#/marketing` loads without console errors
- [ ] "Set Live" button sub-label reads "Resets on page refresh. No data is saved."
- [ ] Page refresh resets `launchLive` to `false`
- [ ] All 4 tabs render without errors
- [ ] `cd viewer && npm run build` exits 0
- [ ] `docs/viewer/01_overview.md` pages table shows "Pages (11 total)"
- [ ] `sprints/sprint-42/summary.md` exists
