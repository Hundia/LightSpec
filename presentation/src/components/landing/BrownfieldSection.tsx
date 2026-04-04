import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TERMINAL_LINES = [
  { text: '$ lsp scan', type: 'command', delay: 200 },
  { text: '', type: 'blank', delay: 400 },
  { text: 'Scanning project...', type: 'info', delay: 600 },
  { text: '', type: 'blank', delay: 800 },
  { text: 'Tech Stack:   TypeScript, React, Express, Prisma', type: 'result', delay: 1200 },
  { text: 'Architecture: Modular (src/modules/)', type: 'result', delay: 1500 },
  { text: 'API Routes:   23 endpoints detected', type: 'result', delay: 1800 },
  { text: 'Tests:        47 test files (Vitest)', type: 'result', delay: 2100 },
  { text: 'Docs:         README.md + 6 doc files', type: 'result', delay: 2400 },
  { text: '', type: 'blank', delay: 2700 },
  { text: 'Complexity:   72/100 → Full depth recommended', type: 'highlight', delay: 3000 },
  { text: '', type: 'blank', delay: 3200 },
  { text: 'Run `lsp init` to generate specs', type: 'success', delay: 3400 },
];

const lineColors: Record<string, string> = {
  command: 'text-white font-bold',
  blank: '',
  info: 'text-white/60',
  result: 'text-cyan-300/80',
  highlight: 'text-amber-300 font-semibold',
  success: 'text-green-400',
};

export default function BrownfieldSection() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!inView) return;
    setVisibleCount(0);
    const timers = TERMINAL_LINES.map((line, i) =>
      setTimeout(() => setVisibleCount(i + 1), line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  return (
    <section className="py-24 px-6 bg-white/2">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onViewportEnter={() => setInView(true)}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Brownfield Intelligence</h2>
          <p className="text-xl text-amber-300/80 mb-2">
            LightSpec understands your existing codebase before generating a single line
          </p>
          <p className="text-white/50">
            Five detection modules. One complexity score. Zero configuration.
          </p>
        </motion.div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="terminal-window max-w-2xl mx-auto shadow-2xl"
          style={{ boxShadow: '0 0 60px rgba(245,158,11,0.12), 0 25px 50px rgba(0,0,0,0.5)' }}
        >
          <div className="terminal-header">
            <div className="terminal-dot bg-red-400" />
            <div className="terminal-dot bg-yellow-400" />
            <div className="terminal-dot bg-green-400" />
            <span className="text-xs text-white/60 ml-3 font-mono">lsp — terminal</span>
          </div>
          <div className="p-6 font-mono text-sm space-y-1 min-h-64">
            {TERMINAL_LINES.slice(0, visibleCount).map((line, i) => (
              <div key={i} className={lineColors[line.type] || 'text-white/60'}>
                {line.text || '\u00A0'}
              </div>
            ))}
            {visibleCount < TERMINAL_LINES.length && (
              <span className="inline-block w-2 h-4 bg-amber-400 animate-pulse" />
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
