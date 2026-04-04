# Frontend Lead Spec — LightSpec

## Two Front-Ends

LightSpec owns two separate React applications:

| App | Directory | Purpose | Deploy Target |
|-----|-----------|---------|---------------|
| Presentation | `presentation/` | Marketing site + slide deck | GitHub Pages root (`/`) |
| Viewer | `viewer/` | SDD project viewer (backlog, docs, sprints) | GitHub Pages `/viewer/` |

---

## 1. Presentation App

### Stack
- React 18 + TypeScript
- Vite (`base: '/'` — deployed at GitHub Pages root)
- Tailwind CSS (dark palette)
- Framer Motion (slide transitions + animation)
- HashRouter: `/` → LandingPage, `/#/presentation` → PresentationPage

### Design System — Dark Slate + Amber
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0f172a` (slate-950) | Page background |
| Surface | `#1e293b` (slate-800) | Cards, panels |
| Accent | `#f59e0b` (amber-400) | CTAs, highlights |
| Secondary | `#698472` (sage) | Supporting accent |
| Text | `#f8fafc` (slate-50) | Body text |
| Muted | `#94a3b8` (slate-400) | Subdued text |
| Font (display) | Inter | Headings, UI |
| Font (mono) | JetBrains Mono | Code blocks, terminal |

**No shadcn/ui. No @radix-ui. Custom Tailwind components only.**

### Landing Page Sections
1. `Navigation` — logo + links + language toggle (EN/HE) + hamburger on mobile
2. `HeroSection` — headline + tagline + `lsp init` CTA + terminal demo animation
3. `ProblemSection` — the "too heavy / too light" problem statement
4. `AdaptiveDepthSection` — 3 depth levels side by side
5. `BrownfieldSection` — brownfield scanner value prop
6. `ComparisonSection` — LightSpec vs AutoSpec vs No Spec table
7. `QuickStartSection` — 3-step install + run guide with copy-to-clipboard
8. `Footer` — links, license, AutoSpec family badge

### Slide Deck (16 slides target)
| Slide | Component | Content |
|-------|-----------|---------|
| 1 | `TitleSlide` | Product name + tagline |
| 2 | `ProblemSlide` | Pain: too heavy vs too light |
| 3 | `SolutionSlide` | LightSpec as the middle path |
| 4 | `ThreeDepthsSlide` | Micro / Standard / Full |
| 5 | `BrownfieldSlide` | Scanner demo, 5 detection modules |
| 6 | `AdaptiveRigorSlide` | Complexity score → depth routing |
| 7 | `ScannerDemoSlide` | `lsp scan` live output |
| 8 | `SpeedComparisonSlide` | 60s vs 30min comparison |
| 9 | `PipelineSlide` | Scanner → Router → Generator flow |
| 10 | `GraduationSlide` | `lsp graduate` → AutoSpec |
| 11 | `SpecOverkillSlide` | When NOT to use full spec |
| 12 | `ContextRotSlide` | AI context drift without spec |
| 13 | `FamilySlide` | AutoSpec family positioning |
| 14 | `LiveDemoSlide` | `lsp init` typing simulation |
| 15 | `UseCasesSlide` | Bug fix / New feature / Refactor |
| 16 | `ArchitectureSlide` | SVG pipeline diagram |
| 17 | `StatsSlide` | Counters + testimonial |
| 18 | `ClosingSlide` | Call to action |

### i18n
- Slide data: `src/data/slides-en.ts`, `src/data/slides-he.ts`
- Landing data: `src/data/landing-en.ts`, `src/data/landing-he.ts`
- Language toggle in Navigation switches all text simultaneously

---

## 2. Viewer App

### Stack
- React 18 + TypeScript
- Vite (`base: '/viewer/'`)
- Tailwind CSS (warm palette — matches AutoSpec viewer)
- HashRouter

### Design System — Warm Parchment
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#f5f3ed` | Page background |
| Primary | `#698472` | Sage — primary actions, active states |
| Accent | `#8e6a59` | Terracotta — secondary actions |
| Border | `#d8d0ba` | Sand — card borders, dividers |
| Text | `#1a1a1a` | Charcoal — body text |

**No shadcn/ui. No @radix-ui. No RTL classes. No #0f172a/slate-950.**  
Primitives ported from `/opt/FitnessAiManager/apps/web/src/design-system/components/primitives/`.

### Pages (10 total)
| Route | Component | Purpose |
|-------|-----------|---------|
| `#/` | Dashboard | Project health, sprint progress |
| `#/docs` | Docs | Browse living documentation |
| `#/specs` | Specs | View 10 role spec files |
| `#/backlog` | Backlog | All sprints + tickets |
| `#/sprints` | Sprints | Sprint list with status |
| `#/sprints/:id` | SprintDetail | Sprint detail with planning + retro tabs |
| `#/skills` | Skills | Claude Code command reference |
| `#/quickstart` | QuickStart | QUICKSTART.md rendered |
| `#/design-system` | DesignSystem | Design tokens + components |
| `#/lsp` | LspPage | LightSpec project page |

### Data Layer
- `viewer/src/data/backlog.ts` — all sprints + tickets (mirrors `specs/backlog.md`)
- `viewer/src/data/docs.ts` — doc file manifest
- `viewer/src/data/specs.ts` — role spec summaries
- `viewer/src/data/sprints.ts` — sprint visualizations (planning + retro)
