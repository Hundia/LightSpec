# Sprint Status

Display current sprint progress with health indicators and model cost tracking.

## Usage

```
/sprint-status [sprint_number or "all"]
```

**Examples:**
- `/sprint-status` - Show current active sprint
- `/sprint-status 38` - Show Sprint 38 status
- `/sprint-status all` - Show all sprints overview

## Instructions

When this command is invoked:

1. **Read the backlog**:
   - Read `specs/backlog.md`
   - Identify all sprints and their states

2. **Find target sprint**:
   - If no number: Find sprint marked as 🔄 In Progress
   - If number provided: Find that specific sprint
   - If "all": Gather all sprints

3. **Calculate metrics**:
   - Count tickets by status
   - Calculate completion percentage
   - Identify blockers
   - Calculate model distribution (FinOps)

4. **Determine health**:
   - 🟢 On Track: ≥ 80% of expected progress
   - 🟡 At Risk: 60-79%
   - 🔴 Behind: < 60%

5. **Display progress**:
   - Show visual progress bar
   - List all tickets with current status
   - Show model distribution
   - Highlight next actionable tickets

## Output Format

### Single Sprint

```
## Sprint 38: Presentation Polish — 🟡 At Risk

### Progress
████████████░░░░░░░░ 59% (10/17 complete)

### Status Breakdown
| Status | Count |
|--------|-------|
| ✅ Done | 10 |
| 🔲 Todo | 7 |

### Tickets
| # | Ticket | Status | Owner | Deps |
|---|--------|--------|-------|------|
| 38.1 | prefers-reduced-motion hook | ✅ | Frontend | — |
| 38.5 | LiveDemoSlide.tsx | 🔲 | Frontend | 38.3 |
| 38.6 | UseCasesSlide.tsx | 🔲 | Frontend | 38.3 |

### Blockers
None

### Next Actions
1. Implement 38.5 LiveDemoSlide.tsx (depends on 38.3 ✅)
2. Implement 38.6 UseCasesSlide.tsx (depends on 38.3 ✅)
3. Implement 38.7 ArchitectureSlide.tsx (depends on 38.1 ✅)
```

### All Sprints Overview

```
## LightSpec Sprint Overview

### Health: 🟡 At Risk (1 sprint in progress)

| Sprint | Name | Status | Progress | Tickets |
|--------|------|--------|----------|---------|
| 37 | Foundation | ✅ Complete | 100% | 31/31 |
| 38 | Presentation Polish | 🔄 Active | 59% | 10/17 |

### Velocity
- Sprint 37: 31 tickets, 134 pts
- Sprint 38 so far: 10/17 tickets

### FinOps Summary
| Owner | Total Tickets | % |
|-------|--------------|---|
| Frontend | 27 (87%) | — |
| QA | 2 (6%) | — |
| PM | 1 (3%) | — |
| Docs | 1 (3%) | — |
```

## Important Rules

- Always read from backlog.md for latest status
- Show clear progress visualization
- Include health indicator (🟢🟡🔴)
- Highlight blockers prominently
- Suggest next actionable items
