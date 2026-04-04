---
title: Viewer App Overview
sprint: 37
created: 2026-03-27
---

# LightSpec Viewer

## Overview

The LightSpec viewer (`viewer/`) is a warm-palette React 18 + Vite SPA that provides a browsable interface for the LightSpec project's backlog, specs, documentation, skills, and design system. It is deployed at `/viewer/` within the GitHub Pages output, nested inside the presentation site build.

## Design System

The viewer uses the same warm palette as the AutoSpec viewer, sourced from the FitnessAiManager design system primitives.

| Token | Value | Purpose |
|-------|-------|---------|
| Background | `#f5f3ed` | Parchment — page and card backgrounds |
| Primary | `#698472` | Sage — nav highlights, badges, primary actions |
| Accent | `#8e6a59` | Terracotta — secondary actions, hover states |
| Border | `#d8d0ba` | Sand — dividers, card borders |
| Text | `#1a1a1a` | Charcoal — all body text |

No shadcn/ui, no @radix-ui. All primitives (Button, Card, Badge, Input) are custom components ported from `/opt/FitnessAiManager/apps/web/src/design-system/components/primitives/`.

## Pages (10 total)

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/#/` | Sprint summary, active tickets, quick stats |
| Docs | `/#/docs` | Documentation section browser |
| Specs | `/#/specs` | 10 SDD role spec entries with status |
| Backlog | `/#/backlog` | Sprint/ticket list with status badges |
| SprintsList | `/#/sprints` | All sprints overview |
| Sprint | `/#/sprints/:id` | Single sprint detail with ticket table |
| Skills | `/#/skills` | Claude Code slash-command skill reference |
| QuickStart | `/#/quickstart` | Rendered QUICKSTART.md guide |
| DesignSystem | `/#/design-system` | Palette swatches, primitive showcase |
| LspPage | `/#/lsp` | LightSpec CLI dashboard — scan results, depth levels, graduation path |

## Data Layer

All data is static TypeScript modules in `viewer/src/data/`:

| File | Exports | Description |
|------|---------|-------------|
| `backlog.ts` | `Sprint[]`, `Ticket[]` | All sprint and ticket records with status, points, wave |
| `specs.ts` | `SpecEntry[]` | 10 SDD role entries (name, description, file reference) |
| `docs.ts` | `DocSection[]` | Documentation section manifest with file counts |
| `environments.ts` | `EnvEntry[]` | IDE and terminal environment setup entries |

### Key Interfaces

```typescript
interface Sprint {
  id: number;
  title: string;
  theme: string;
  status: 'complete' | 'active' | 'planned';
  tickets: Ticket[];
  points: number;
}

interface Ticket {
  id: string;          // e.g. "37.1"
  title: string;
  status: 'done' | 'in-progress' | 'planned';
  points: number;
  wave?: string;
  docs?: string[];
}
```

## Routing

The viewer uses `HashRouter` from `react-router-dom`. All routes are prefixed with `#` to work cleanly as a static deployment under a subdirectory path.

```tsx
// App.tsx
<HashRouter>
  <Layout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/specs" element={<Specs />} />
      <Route path="/backlog" element={<Backlog />} />
      <Route path="/sprints" element={<SprintsList />} />
      <Route path="/sprints/:id" element={<Sprint />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/quickstart" element={<QuickStart />} />
      <Route path="/design-system" element={<DesignSystem />} />
      <Route path="/lsp" element={<LspPage />} />
    </Routes>
  </Layout>
</HashRouter>
```

## Vite Config

```typescript
// vite.config.ts
export default defineConfig({
  base: '/viewer/',   // Deployed at /viewer/ under GitHub Pages root
  ...
})
```

This `base` setting ensures all asset paths resolve correctly when the viewer is served from `/viewer/` within the combined GitHub Pages deployment.

## Build

```bash
cd viewer && npm run build   # Outputs to viewer/dist/
```

The GitHub Pages workflow copies `viewer/dist/*` into `presentation/dist/viewer/` before uploading the combined artifact.
