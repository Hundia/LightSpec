---
title: Presentation Site Overview
sprint: 37
updated: sprint-38
---

# LightSpec Presentation Site

## Overview

The LightSpec presentation site (`presentation/`) is a React 18 + Framer Motion SPA with a dark slate-950 + amber design system. It contains a marketing landing page and a 16-slide interactive presentation (Sprint 38 adds 4 new slides to Sprint 37's 12).

## Design System

| Token | Value | Purpose |
|-------|-------|---------|
| Background | `#0f172a` (slate-950) | Page/slide background |
| Accent | `#f59e0b` (amber-500) | Primary brand color, CTAs |
| Secondary | `#698472` (sage) | AutoSpec family link color |
| Font (sans) | Inter | All prose |
| Font (mono) | JetBrains Mono | Terminal simulations |

## Architecture

```
presentation/
├── src/
│   ├── App.tsx                    # HashRouter: / → Landing, /#/presentation → Slides
│   ├── pages/
│   │   ├── LandingPage.tsx        # 8 sections: Nav, Hero, Problem, AdaptiveDepth,
│   │   │                          #   Brownfield, Comparison, QuickStart, Footer
│   │   └── PresentationPage.tsx   # 16-slide carousel with keyboard nav + i18n
│   ├── components/
│   │   ├── landing/               # 8 section components
│   │   ├── slides/                # 16 slide components
│   │   └── backgrounds/           # 5 background effects
│   ├── data/
│   │   ├── landing-en.ts          # Landing page data (EN)
│   │   ├── landing-he.ts          # Landing page data (HE)
│   │   ├── slides-en.ts           # 16 slide entries (EN)
│   │   └── slides-he.ts           # 16 slide entries (HE)
│   └── hooks/
│       └── useReducedMotion.ts    # Accessibility hook
├── vite.config.ts                 # base: '/' (GitHub Pages root)
└── tailwind.config.js             # Custom: lightning, sage, terracotta palettes
```

## Slide Order (16 slides, post Sprint 38)

| # | Type | Description |
|---|------|-------------|
| 1 | title | LightSpec — Just enough spec, just fast enough |
| 2 | specOverkill | The #1 Complaint — Specification Overkill |
| 3 | contextRot | Context Rot — The Hidden Cost |
| 4 | adaptiveRigor | Adaptive Rigor — The Killer Feature |
| 5 | threeDepths | Three Depths: Micro, Standard, Full |
| 6 | brownfield | Brownfield Intelligence |
| 7 | scannerDemo | Scanner Demo |
| 8 | liveDemo | Live Demo — Full lsp init session *(Sprint 38)* |
| 9 | useCases | Use Cases — Bug Fix, Feature, Refactor *(Sprint 38)* |
| 10 | architecture | Architecture — Interactive SVG Pipeline *(Sprint 38)* |
| 11 | stats | By The Numbers *(Sprint 38)* |
| 12 | pipeline | Pipeline Deep Dive |
| 13 | speedComparison | Speed Comparison |
| 14 | graduation | Graduation Path |
| 15 | family | AutoSpec Family |
| 16 | closing | Closing CTA |

## Deployment

Deployed to GitHub Pages via `.github/workflows/pages.yml`. The viewer is nested inside the built output at `/viewer/`.
