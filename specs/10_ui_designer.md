# UI Designer Spec — LightSpec

## Two Design Systems

LightSpec owns two distinct visual languages — one dark (presentation), one warm (viewer). They share typography roots but diverge in palette and purpose.

---

## 1. Presentation Design System (Dark Slate + Amber)

### Palette

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| Background | `#0f172a` | `slate-950` | Page background |
| Surface | `#1e293b` | `slate-800` | Cards, slide backgrounds |
| Surface Elevated | `#334155` | `slate-700` | Hover states, tooltips |
| Accent | `#f59e0b` | `amber-400` | CTAs, highlights, active dots |
| Accent Glow | `#fbbf24` | `amber-300` | Hover glow, focus rings |
| Secondary | `#698472` | — | Supporting accent (sage from AutoSpec family) |
| Text Primary | `#f8fafc` | `slate-50` | Headings, important text |
| Text Secondary | `#94a3b8` | `slate-400` | Body, subheadings |
| Text Muted | `#64748b` | `slate-500` | Captions, metadata |
| Border | `#334155` | `slate-700` | Card borders, dividers |
| Success | `#10b981` | `emerald-500` | Checkmarks, passing states |
| Error | `#ef4444` | `red-500` | Error states |

### Typography
- **Display / Headings:** Inter (700, 800 weight)
- **Body:** Inter (400, 500 weight)
- **Code / Terminal:** JetBrains Mono (400, 700 weight)

### No shadcn/ui. No @radix-ui. No RTL classes.

### Key Presentation Components

| Component | Description | Key Props |
|-----------|-------------|-----------|
| `SlideCard` | Slide wrapper with dark surface, rounded-2xl | `title`, `subtitle`, `children` |
| `TerminalWindow` | macOS chrome (red/yellow/green dots) + dark code area | `commands`, `output`, `typing` |
| `DepthPill` | Colored badge: micro=green, standard=amber, full=red | `depth: 'micro' \| 'standard' \| 'full'` |
| `ProgressDots` | Slide navigation dots | `total`, `current`, `onSelect` |
| `GradientText` | `bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text` | `children` |
| `BackgroundEffect` | Animated particles/circuits/lightning | `type`, `intensity` |

### Slide Layout System
- Slide container: `w-full h-full flex flex-col items-center justify-center px-12 py-8`
- Title: `text-4xl md:text-6xl font-bold text-white`
- Subtitle: `text-xl md:text-2xl text-slate-400`
- Body text: `text-lg text-slate-300`

---

## 2. Viewer Design System (Warm Parchment)

Identical to AutoSpec viewer — same warm palette, same primitives. This creates visual consistency across the AutoSpec family of tools.

### Palette

| Token | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| Background | `#f5f3ed` | `--color-bg` | Page background |
| Surface | `#ffffff` | `--color-surface` | Cards, modals |
| Primary | `#698472` | `--color-primary` | Sage — buttons, active nav |
| Primary Hover | `#5a7363` | `--color-primary-hover` | Hover states |
| Accent | `#8e6a59` | `--color-accent` | Terracotta — secondary actions |
| Border | `#d8d0ba` | `--color-border` | Sand — card borders |
| Text | `#1a1a1a` | `--color-text` | Charcoal — all body text |
| Text Muted | `#6b7280` | `--color-text-muted` | Labels, metadata |
| Success | `#698472` | — | Done states (sage) |
| Warning | `#8e6a59` | — | In-progress states (terracotta) |

### Typography
- **All text:** Inter (system fallback: `ui-sans-serif`)
- **Code:** JetBrains Mono

### Forbidden
- `#0f172a` / `slate-950` — dark background not allowed in viewer
- `@radix-ui/*` — not installed
- `shadcn/ui` — not installed
- RTL (`dir="rtl"`, `rtl:` prefix classes) — viewer is LTR only

### Primitive Components (ported from FitnessAiManager)

| Component | File | Props |
|-----------|------|-------|
| `Button` | `components/primitives/Button.tsx` | `variant: primary\|secondary\|ghost`, `size: sm\|md\|lg` |
| `Card` | `components/primitives/Card.tsx` | `padding`, `clickable`, `onClick` |
| `Badge` | `components/primitives/Badge.tsx` | `variant: success\|warning\|info\|error` |
| `Input` | `components/primitives/Input.tsx` | `label`, `error`, `helperText` |

---

## Accessibility Requirements

Both apps must meet:
- **Color contrast:** WCAG AA (4.5:1 for normal text, 3:1 for large text)
- **Keyboard navigation:** All interactive elements reachable via Tab, activated via Enter/Space
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables animations
- **Focus indicators:** Visible focus rings on all interactive elements
- **ARIA labels:** All icon-only buttons have `aria-label`

## Mobile Breakpoints

- `sm`: 640px (hamburger menu replaces nav links)
- `md`: 768px (2-column layouts)
- `lg`: 1024px (full desktop layouts)
- `xl`: 1280px (presentation slide optimal size)
