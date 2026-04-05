---
title: GitHub Pages Deployment
sprint: 37
updated: 2026-04-05
---

# GitHub Pages Deployment

## Overview

LightSpec deploys three sites to GitHub Pages as a single combined artifact:

- **Presentation site** — served at the repository root (`/`)
- **Viewer app** — served at `/viewer/` as a subdirectory of the presentation build
- **Developer's Guide** — served at `/guide/` as a subdirectory of the presentation build

All three are static Vite SPAs built independently and merged at deploy time.

---

## Three-Site Architecture

```
GitHub Pages root (/)
├── index.html                  ← Presentation landing page
├── assets/                     ← Presentation JS/CSS/fonts
├── ...                         ← All presentation assets
├── viewer/
│   ├── index.html              ← Viewer SPA entry point
│   └── assets/                 ← Viewer JS/CSS
└── guide/
    ├── index.html              ← Guide SPA entry point
    └── assets/                 ← Guide JS/CSS
```

The viewer and guide are physically nested inside the presentation's `dist/` directory before the GitHub Pages artifact is uploaded. This single-artifact approach avoids GitHub Pages' limitation of one build per repository.

---

## Vite Config Alignment

All apps must have matching `base` settings or their asset references will break in production:

| App | `base` value | Deployed URL |
|-----|-------------|--------------|
| `presentation/` | `'/'` | `https://org.github.io/LightSpec/` |
| `viewer/` | `'/LightSpec/viewer/'` | `https://org.github.io/LightSpec/viewer/` |
| `guide/` | `'/LightSpec/guide/'` | `https://org.github.io/LightSpec/guide/` |

```typescript
// presentation/vite.config.ts
export default defineConfig({
  base: '/',
  ...
})

// viewer/vite.config.ts
export default defineConfig({
  base: '/LightSpec/viewer/',
  ...
})

// guide/vite.config.ts
export default defineConfig({
  base: '/LightSpec/guide/',
  ...
})
```

Both apps use `HashRouter` for client-side routing, so deep links work without server-side URL rewriting.

---

## Guide Site (`/LightSpec/guide/`)

- **Source:** `guide/`
- **Build:** `npm ci && npm run build` in `guide/` directory
- **Base path:** `/LightSpec/guide/`
- **Artifact:** `guide/dist/` → nested into `presentation/dist/guide/`

---

## Pages Workflow

The deployment is handled by `.github/workflows/pages.yml`. All three sites are built sequentially in a single job, then merged before artifact upload:

```yaml
# Build presentation, viewer, and guide in one job
# Merge outputs: viewer/dist → presentation/dist/viewer/
#                guide/dist  → presentation/dist/guide/
# Upload presentation/dist as the single Pages artifact
```

The key step is the `Combine build outputs` step that nests viewer and guide inside the presentation dist before upload. Updated in Sprint 39 (ticket 39.15) to add the guide build.

---

## CI Workflow

The CI workflow (`.github/workflows/ci.yml`) runs parallel jobs on every push and pull request:

| Job | Command | Purpose |
|-----|---------|---------|
| `test-cli` | `cd cli && npm ci && npm test` | Run CLI unit + integration tests |
| `build-presentation` | `cd presentation && npm ci && npm run build` | Verify presentation builds cleanly |
| `build-viewer` | `cd viewer && npm ci && npm run build` | Verify viewer builds cleanly |
| `build-guide` | `cd guide && npm ci && npm run build` | Verify guide builds cleanly |

All jobs must pass for a PR to be mergeable. The CI and pages workflows are independent — CI validates every branch, pages deploys only from `main`.

---

## Local Development

To preview the combined deployment locally:

```bash
# Build all three
cd presentation && npm run build
cd viewer && npm run build
cd guide && npm run build

# Nest viewer and guide into presentation dist
cp -r viewer/dist/. presentation/dist/viewer/
mkdir -p presentation/dist/guide
cp -r guide/dist/. presentation/dist/guide/

# Serve combined output
npx serve presentation/dist
# → http://localhost:3000/              (presentation)
# → http://localhost:3000/viewer/       (viewer)
# → http://localhost:3000/guide/        (guide)
```

For active development, run each app's dev server independently:

```bash
cd presentation && npm run dev   # http://localhost:5173
cd viewer && npm run dev         # http://localhost:5174
cd guide && npm run dev          # http://localhost:5175
```

Dev servers use their own hot-reload and do not need the combined merge step.
