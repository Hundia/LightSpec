import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Layers, Building } from 'lucide-react';

const depths = [
  {
    id: 'micro',
    icon: Zap,
    color: 'amber',
    label: 'Micro',
    useCase: 'Bug fix, config change, small feature',
    time: '~15 seconds',
    lines: '<200 lines',
    trigger: 'Score 0–25',
    example: `# Bug Fix — Spec

## Problem
Date formatting breaks in Safari.
Users see "Invalid Date" in schedule view.

## Approach
Replace moment.js with date-fns/format.

## Acceptance Criteria
- [ ] Dates render correctly in Safari
- [ ] No regression in Chrome/Firefox
- [ ] Existing tests pass`,
    colorClasses: {
      border: 'border-amber-500/40',
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      badge: 'bg-amber-500/20 text-amber-300',
      glow: 'rgba(245,158,11,0.3)',
    },
  },
  {
    id: 'standard',
    icon: Layers,
    color: 'blue',
    label: 'Standard',
    useCase: 'New feature, module, endpoint',
    time: '~45 seconds',
    lines: '500–1K lines',
    trigger: 'Score 26–65',
    example: `# User Authentication — Specification

## Overview
JWT-based auth with refresh tokens.

## Technical Design
### API Endpoints
POST /auth/login
POST /auth/refresh
DELETE /auth/logout

### Data Model
User: { id, email, passwordHash, role }
RefreshToken: { id, userId, token, expiresAt }

## Task List
| # | Task | Est |
|---|------|-----|
| 1 | JWT service | 2h |
| 2 | Login endpoint | 1h |`,
    colorClasses: {
      border: 'border-blue-500/40',
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      badge: 'bg-blue-500/20 text-blue-300',
      glow: 'rgba(59,130,246,0.3)',
    },
  },
  {
    id: 'full',
    icon: Building,
    color: 'purple',
    label: 'Full',
    useCase: 'Major module, migration, refactor',
    time: '~90 seconds',
    lines: '1K–2K lines',
    trigger: 'Score 66–100',
    example: `# Platform Migration — Specs

## product.md
- User personas & journeys
- Success metrics & KPIs
- Feature acceptance criteria

## technical.md
- Architecture decisions
- API contracts
- Database schema changes
- Deployment strategy

## quality.md
- Test plan & coverage targets
- Performance benchmarks
- Rollback procedure`,
    colorClasses: {
      border: 'border-purple-500/40',
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      badge: 'bg-purple-500/20 text-purple-300',
      glow: 'rgba(139,92,246,0.3)',
    },
  },
];

export default function AdaptiveDepthSection() {
  const [active, setActive] = useState(0);
  const activeDepth = depths[active];
  const c = activeDepth.colorClasses;

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Adaptive Depth — The Right Amount of Spec
          </h2>
          <p className="text-xl text-white/50">
            LightSpec automatically detects your project complexity and generates the right level of spec.
          </p>
        </motion.div>

        {/* Tab selector */}
        <div
          className="flex gap-2 mb-8 bg-white/5 rounded-xl p-1.5 max-w-md mx-auto"
          role="tablist"
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') { e.preventDefault(); setActive((active + 1) % depths.length); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); setActive((active - 1 + depths.length) % depths.length); }
            else if (e.key === 'Home') { e.preventDefault(); setActive(0); }
            else if (e.key === 'End') { e.preventDefault(); setActive(depths.length - 1); }
          }}
        >
          {depths.map((d, i) => {
            const Icon = d.icon;
            return (
              <button
                key={d.id}
                onClick={() => setActive(i)}
                role="tab"
                aria-selected={active === i}
                tabIndex={active === i ? 0 : -1}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  active === i
                    ? `bg-${d.color}-500 text-white shadow-lg`
                    : 'text-white/50 hover:text-white/70'
                }`}
                style={active === i ? { backgroundColor: d.colorClasses.glow.replace('0.3', '0.6').replace('rgba', 'rgb').split(',').slice(0, 3).join(',') + ')' } : {}}
              >
                <Icon size={14} />
                {d.label}
              </button>
            );
          })}
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className={`rounded-2xl border ${c.border} p-8`}
            style={{ backgroundColor: `rgba(${activeDepth.color === 'amber' ? '245,158,11' : activeDepth.color === 'blue' ? '59,130,246' : '139,92,246'},0.06)`, boxShadow: `0 0 40px ${c.glow}` }}
          >
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: details */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 ${c.bg} border ${c.border} rounded-xl flex items-center justify-center`}>
                    {React.createElement(activeDepth.icon, { size: 24, className: c.text })}
                  </div>
                  <div>
                    <h3 className={`text-2xl font-black ${c.text}`}>{activeDepth.label}</h3>
                    <p className="text-sm text-white/50">{activeDepth.useCase}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Trigger', value: activeDepth.trigger },
                    { label: 'Generation time', value: activeDepth.time },
                    { label: 'Output size', value: activeDepth.lines },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b border-white/8">
                      <span className="text-sm text-white/60">{label}</span>
                      <span className={`text-sm font-semibold ${c.text}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: code preview */}
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-dot bg-red-400" />
                  <div className="terminal-dot bg-yellow-400" />
                  <div className="terminal-dot bg-green-400" />
                  <span className="text-xs text-white/60 ml-2">spec.md</span>
                </div>
                <pre className="p-4 text-xs font-mono text-green-300/80 leading-relaxed overflow-auto max-h-48 whitespace-pre-wrap">
                  {activeDepth.example}
                </pre>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
