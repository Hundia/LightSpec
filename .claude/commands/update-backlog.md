# Update Backlog

Modify ticket statuses, add tickets, report bugs, or link documentation.

## Usage

```
/update-backlog [action] [details]
```

### Actions

| Action | Syntax | Example |
|--------|--------|---------|
| `status` | `status [ticket] [new_status]` | `/update-backlog status 38.5 done` |
| `add` | `add [sprint] [description] [owner] [pts]` | `/update-backlog add 38 "Add lsp init --dry-run flag" Backend 2` |
| `bug` | `bug [description]` | `/update-backlog bug "lsp init fails on monorepo with no root package.json"` |
| `note` | `note [ticket] [text]` | `/update-backlog note 38.5 "Needs macOS terminal screenshot for reference"` |
| `docs` | `docs [ticket] [doc_paths]` | `/update-backlog docs 38.5 docs/presentation/slides.md` |

### Status Shortcuts

| Input | Status |
|-------|--------|
| `todo`, `t` | 🔲 Todo |
| `progress`, `wip`, `p` | 🔄 In Progress |
| `qa`, `review`, `r` | 🧪 QA Review |
| `done`, `d` | ✅ Done |
| `blocked`, `b` | ⏸️ Blocked |

## Instructions

When this command is invoked:

1. **Parse the action and details**

2. **Read current backlog**:
   - Read `specs/backlog.md`
   - Find the relevant sprint/ticket

3. **Execute the action**:

   ### Status Update
   - Find the ticket in the backlog
   - Change the status emoji in the table row

   ### Add Ticket
   - Find the target sprint
   - Add new row to ticket table with next available ticket ID
   - Use format: `| 38.X | [Title] | [Owner] | [Pts] | 🔲 | [Deps] | — |`

   ### Bug Report
   - Add to a `## Bug Backlog` section (create if it doesn't exist)
   - Format: `B.XX` for bug tickets
   - Include severity (Critical/High/Medium/Low)

   ### Add Note
   - Find the ticket
   - Add note as blockquote below the ticket table

   ### Link Documentation
   - Find the ticket in the backlog
   - Update the `Docs` column in the table row

4. **Save the backlog**:
   - Write updated content to `specs/backlog.md`

5. **Confirm the change**:
   - Show what was changed
   - Show new ticket state

## Output Format

### Status Update
```
## Backlog Updated

### Change
Ticket 38.5: 🔲 Todo → ✅ Done

### Current Sprint Status
Sprint 38: 11/17 complete (65%)
```

### Bug Report
```
## Bug Ticket Created

### Bug
| B.1 | lsp init fails on monorepo | High | Backend | 🔲 | `docs/cli/02_architecture.md` |

### Added to Bug Backlog
```

## Important Rules

- Always validate ticket numbers exist before updating
- Preserve backlog table formatting exactly
- Bug tickets get `B.XX` prefix with incrementing number
- Notes use blockquote format below the table
- Confirm changes after making them
