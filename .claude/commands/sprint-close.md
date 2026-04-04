# Sprint Close

Close a completed sprint and generate summary documentation with docs cross-references.

## Usage

```
/sprint-close [sprint_number]
```

**Example:** `/sprint-close 38`

## Instructions

When this command is invoked:

1. **Verify sprint is ready to close**:
   - Read `specs/backlog.md`
   - Check all tickets are ✅ Done or ⏸️ Blocked (with justification)
   - If any tickets are still 🔄 or 🧪, warn the user

2. **Gather sprint data**:
   - Sprint name, goal, and metadata
   - All tickets with final status
   - Files changed (via `git diff` or `git log`)
   - Test results from latest test run
   - Documentation files created or updated

3. **Create sprint summary directory**:
   - Create `sprints/sprint-X/` if it doesn't exist

4. **Generate `sprints/sprint-X/summary.md`**:

```markdown
# Sprint X Summary

**Date:** YYYY-MM-DD
**Status:** ✅ COMPLETE
**Theme:** [Sprint theme]

## Overview
[2-3 sentence executive summary]

## Completed Tickets
| # | Ticket | Description | Status | Docs |
|---|--------|-------------|--------|------|
| X.1 | Title | What was done | ✅ | [docs/section/file.md] |

## Documentation Updated
| Doc File | Change | Related Tickets |
|----------|--------|-----------------|
| `docs/cli/03_scanner.md` | Added detect-stack details | X.3, X.4 |

## Key Files Modified
[Table of files changed]

## QA & Test Results
| Suite | Pass | Fail | Total | Notes |
|-------|------|------|-------|-------|
| Unit | X | 0 | X | |
| Integration | X | 0 | X | |
| E2E | X | 0 | X | |

## Retrospective
### What went well
- [Observation]

### What to improve
- [Observation]
```

5. **Update viewer data**:
   - Update `viewer/src/data/backlog.ts` — ensure all ticket statuses match final state
   - Update `viewer/src/data/sprints.ts` — add/update `SprintVisualization` with retrospective data
   - Build viewer: `cd viewer && npm run build` — verify exit 0

6. **Update backlog**:
   - Mark sprint as ✅ Done with completion date
   - Update sprint metadata

7. **Create git tag** (recommend to user):
   ```bash
   git tag -a sprint-X-complete -m "Sprint X Complete: [Name]"
   ```

## Important Rules

- Never close a sprint with failing tests
- ALWAYS include "Documentation Updated" section in summary
- ALWAYS cross-reference docs files in ticket table
- Use relative links from sprint summary to docs
- Generate actual test data, not placeholders
