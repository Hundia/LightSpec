# Sprint 42 Summary: Launch Readiness — Marketing Hub

**Sprint:** 42
**Theme:** Launch Readiness — Marketing Page + Content Pipeline
**Date:** 2026-04-06
**Points:** 45
**Tickets:** 19
**Status:** ✅ Done

## Narrative

Sprint 42 delivered the LightSpec Marketing Hub — a fully-typed, dependency-aware launch dashboard at `/#/marketing` in the viewer. The sprint introduced `viewer/src/data/marketing.ts`, a new static data module encoding 5 LinkedIn posts, 5 articles, 8 launch milestones, and 6 channels — all with explicit `blockedBy` dependency chains. The `resolveBlockers()` helper, exported from `marketing.ts`, is used by both `MarketingPage` and `NextActionCard` to compute real-time unblock states across collections. The page features a session-only "Set Live" toggle (React `useState` only — no persistence), a KPI row that reactively updates on milestone toggles, a Next Action card that surfaces the first unblocked item or shows the ms-2 pre-launch gate, and four tabs (Posts / Articles / Milestones / Channels) with filter pills, grouped phase views, and a priority-sorted channel table. The `docs/viewer/01_overview.md` was updated to reflect 11 total pages.

## Tickets

| ID | Title | Owner | Pts | Status |
|----|-------|-------|-----|--------|
| 42.1 | marketing.ts — interfaces + stub seed | Frontend | 3 | ✅ Done |
| 42.2 | marketing.ts — full 26-item seed content | Frontend | 2 | ✅ Done |
| 42.3 | PostCard.tsx — LinkedIn post card | Frontend | 3 | ✅ Done |
| 42.4 | ArticleCard.tsx — article card | Frontend | 3 | ✅ Done |
| 42.5 | MilestoneCard.tsx — launch milestone card | Frontend | 2 | ✅ Done |
| 42.6 | ChannelRow.tsx — channel table row | Frontend | 2 | ✅ Done |
| 42.7 | KpiRow.tsx + NextActionCard stub + card visual QA | QA | 3 | ✅ Done |
| 42.8 | MarketingPage.tsx — page shell + route + launchLive toggle | Frontend | 3 | ✅ Done |
| 42.9 | NextActionCard.tsx — full blockedBy resolution algorithm | Frontend | 2 | ✅ Done |
| 42.10 | Wire Posts tab — PostCard grid + filter pills | Frontend | 3 | ✅ Done |
| 42.11 | Wire Articles + Milestones tabs | Frontend | 2 | ✅ Done |
| 42.12 | Wire Channels tab + KpiRow reactivity | Frontend | 2 | ✅ Done |
| 42.13 | marketing.ts finalize + resolveBlockers() export | Frontend | 3 | ✅ Done |
| 42.14 | backlog.ts — Sprint 42 entry (19 tickets, 45 pts) | Frontend | 2 | ✅ Done |
| 42.15 | Sidebar nav entry — Marketing + TrendingUp icon | Frontend | 2 | ✅ Done |
| 42.16 | Integration QA — all 7 deliverables | QA | 3 | ✅ Done |
| 42.17 | Viewer build verification + visual smoke test | QA | 2 | ✅ Done |
| 42.18 | Sprint close + sprints/sprint-42/summary.md | PM | 2 | ✅ Done |
| 42.19 | Update docs/viewer/01_overview.md (pages 11 total, routing, data layer) | Docs | 1 | ✅ Done |

## Deliverables Checklist

- [x] `marketingData.posts.length === 5`, `.articles.length === 5`, `.milestones.length === 8`, `.channels.length === 6`
- [x] `resolveBlockers(marketingData, 'post-1')` returns `true` (no blockers)
- [x] `resolveBlockers(marketingData, 'post-2')` returns `false` (ms-2 and ms-3 not done)
- [x] `/#/marketing` route registered in App.tsx
- [x] "Set Live" button sub-label reads "Resets on page refresh. No data is saved."
- [x] `launchLive` state is React `useState` only — no localStorage, no sessionStorage
- [x] All 4 tabs render (Posts, Articles, Milestones, Channels)
- [x] `cd viewer && npm run build` exits 0 with zero TypeScript errors
- [x] `docs/viewer/01_overview.md` pages table shows "Pages (11 total)"
- [x] "Marketing" nav item in Sidebar with TrendingUp icon
- [x] `sprints/sprint-42/summary.md` created

## New Files Created

- `viewer/src/data/marketing.ts` — full data module + resolveBlockers() helper
- `viewer/src/components/marketing/PostCard.tsx`
- `viewer/src/components/marketing/ArticleCard.tsx`
- `viewer/src/components/marketing/MilestoneCard.tsx`
- `viewer/src/components/marketing/ChannelRow.tsx`
- `viewer/src/components/marketing/KpiRow.tsx`
- `viewer/src/components/marketing/NextActionCard.tsx`
- `viewer/src/pages/MarketingPage.tsx`
- `sprints/sprint-42/summary.md`

## Files Modified

- `viewer/src/App.tsx` — added `/marketing` route
- `viewer/src/components/layout/Sidebar.tsx` — added Marketing nav entry with TrendingUp icon
- `viewer/src/data/backlog.ts` — Sprint 42 entry with 19 tickets, all marked done
- `docs/viewer/01_overview.md` — 11 pages, updated routing block, updated data layer table
- `specs/backlog.md` — Sprint 42 all tickets marked ✅
