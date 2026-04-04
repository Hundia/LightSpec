# Sprint 38 Brief — Presentation Polish

**Model:** Sonnet 4.6
**Orchestrator:** Opus 4.6
**Date:** 2026-04-04
**Goal:** Complete Sprint 38 — add 4 new slides (liveDemo, useCases, architecture, stats), word-by-word tagline animation, wire into PresentationPage for 16-slide total, build verification.

## Location
`/opt/LightSpec/presentation/`

## Remaining Tickets

| ID | Ticket | Status |
|----|--------|--------|
| 38.5 | LiveDemoSlide.tsx — typing simulation of full `lsp init` session | 🔲 |
| 38.6 | UseCasesSlide.tsx — 3-column cards (Bug Fix/New Feature/Refactor) | 🔲 |
| 38.7 | ArchitectureSlide.tsx — interactive SVG pipeline with AnimatePresence | 🔲 |
| 38.8 | StatsSlide.tsx — 3 useSpring counters + testimonial | 🔲 |
| 38.9 | Word-by-word tagline on TitleSlide + HeroSection | 🔲 |
| 38.15 | Wire 4 new slides into PresentationPage (16 total) | 🔲 |
| 38.17 | Build verification + QA | 🔲 |

## Design System
- Background: slate-950
- Accent: amber (#f59e0b / amber-500)
- Secondary: sage (#698472)
- Font: Inter + JetBrains Mono
- Framer Motion for all animations
- useReducedMotion() hook at `src/hooks/useReducedMotion.ts`

## Slide Order (post-38.15)
1. title, 2. specOverkill, 3. contextRot, 4. adaptiveRigor, 5. threeDepths,
6. brownfield, 7. scannerDemo, 8. liveDemo (NEW), 9. useCases (NEW),
10. architecture (NEW), 11. stats (NEW), 12. pipeline, 13. speedComparison,
14. graduation, 15. family, 16. closing

## Critical Notes
- LiveDemoSlide must show a COMPLETE lsp init session (not just scan)
- StatsSlide counters: use `useSpring` + `useTransform(spring, Math.round)` — not plain JS
- Both slides-en.ts AND slides-he.ts must reach exactly 16 entries
- slides-he.ts: terminal lines stay English; only prose strings translated
