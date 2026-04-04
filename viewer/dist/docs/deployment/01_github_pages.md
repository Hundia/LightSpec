---
title: GitHub Pages Deployment
sprint: 37
created: 2026-03-27
---

# GitHub Pages Deployment

## Overview

LightSpec deploys two sites to GitHub Pages as a single combined artifact:

- **Presentation site** — served at the repository root (`/`)
- **Viewer app** — served at `/viewer/` as a subdirectory of the presentation build

Both are static Vite SPAs built independently and merged at deploy time.

---

## Two-Site Architecture

```
GitHub Pages root (/)
├── index.html                  ← Presentation landing page
├── assets/                     ← Presentation JS/CSS/fonts
├── ...                         ← All presentation assets
└── viewer/
    ├── index.html              ← Viewer SPA entry point
    └── assets/                 ← Viewer JS/CSS
```

The viewer is physically nested inside the presentation's `dist/` directory before the GitHub Pages artifact is uploaded. This single-artifact approach avoids GitHub Pages' limitation of one build per repository.

---

## Vite Config Alignment

The two apps must have matching `base` settings or their asset references will break in production:

| App | `base` value | Deployed URL |
|-----|-------------|--------------|
| `presentation/` | `'/'` | `https://org.github.io/lightspec/` |
| `viewer/` | `'/viewer/'` | `https://org.github.io/lightspec/viewer/` |

```typescript
// presentation/vite.config.ts
export default defineConfig({
  base: '/',
  ...
})

// viewer/vite.config.ts
export default defineConfig({
  base: '/viewer/',
  ...
})
```

Both apps use `HashRouter` for client-side routing, so deep links work without server-side URL rewriting.

---

## Pages Workflow

The deployment is handled by `.github/workflows/pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-presentation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd presentation && npm ci && npm run build

  build-viewer:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: cd viewer && npm ci && npm run build

  deploy:
    needs: [build-presentation, build-viewer]
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Download presentation build
        uses: actions/download-artifact@v4
        with: { name: presentation-dist, path: dist/ }

      - name: Download viewer build
        uses: actions/download-artifact@v4
        with: { name: viewer-dist, path: dist/viewer/ }

      - name: Upload combined artifact
        uses: actions/upload-pages-artifact@v3
        with: { path: dist/ }

      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```

The key step is `path: dist/viewer/` in the viewer download — this places viewer assets directly into the `viewer/` subdirectory of the combined output.

---

## CI Workflow

The CI workflow (`.github/workflows/ci.yml`) runs 3 parallel jobs on every push and pull request:

| Job | Command | Purpose |
|-----|---------|---------|
| `test-cli` | `cd cli && npm ci && npm test` | Run CLI unit + integration tests |
| `build-presentation` | `cd presentation && npm ci && npm run build` | Verify presentation builds cleanly |
| `build-viewer` | `cd viewer && npm ci && npm run build` | Verify viewer builds cleanly |

All three jobs must pass for a PR to be mergeable. The CI and pages workflows are independent — CI validates every branch, pages deploys only from `main`.

---

## Local Development

To preview the combined deployment locally:

```bash
# Build both
cd presentation && npm run build
cd viewer && npm run build

# Copy viewer into presentation dist
cp -r viewer/dist/* presentation/dist/viewer/

# Serve combined output
npx serve presentation/dist
# → http://localhost:3000/          (presentation)
# → http://localhost:3000/viewer/   (viewer)
```

For active development, run each app's dev server independently:

```bash
cd presentation && npm run dev   # http://localhost:5173
cd viewer && npm run dev         # http://localhost:5174
```

Dev servers use their own hot-reload and do not need the combined merge step.
