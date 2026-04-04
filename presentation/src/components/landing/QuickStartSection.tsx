import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Zap, Rocket, type LucideIcon } from 'lucide-react';
import { QUICKSTART_TERMINAL_LINES, QUICKSTART_STEPS, LINE_COLORS } from '../../data/landing-en';

const ICON_MAP: Record<string, LucideIcon> = {
  Search,
  Zap,
  Rocket,
};

export default function QuickStartSection() {
  const [visible, setVisible] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!inView) return;
    setVisible(0);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setVisible(i);
      if (i >= QUICKSTART_TERMINAL_LINES.length) clearInterval(timer);
    }, 200);
    return () => clearInterval(timer);
  }, [inView]);

  return (
    <section id="quickstart" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black gradient-lightning mb-4">Get Started in 30 Seconds</h2>
          <p className="text-xl text-white/50">One command. Zero configuration. Immediate value.</p>
        </motion.div>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          onViewportEnter={() => setInView(true)}
          className="terminal-window max-w-2xl mx-auto mb-16 shadow-2xl"
          style={{ boxShadow: '0 0 60px rgba(245,158,11,0.12)' }}
        >
          <div className="terminal-header">
            <div className="terminal-dot bg-red-400" />
            <div className="terminal-dot bg-yellow-400" />
            <div className="terminal-dot bg-green-400" />
            <span className="text-xs text-white/60 ml-3 font-mono">lsp — terminal</span>
          </div>
          <div className="p-6 font-mono text-[11px] sm:text-sm space-y-1 overflow-x-auto max-w-full">
            {QUICKSTART_TERMINAL_LINES.slice(0, visible).map((line, i) => (
              <div key={i} className={LINE_COLORS[line.type] || 'text-white/60'}>
                {line.text || '\u00A0'}
              </div>
            ))}
            {visible < QUICKSTART_TERMINAL_LINES.length && (
              <span className="inline-block w-2 h-4 bg-amber-400 animate-pulse" />
            )}
          </div>
        </motion.div>

        {/* Three steps */}
        <div className="grid md:grid-cols-3 gap-6">
          {QUICKSTART_STEPS.map((step, i) => {
            const Icon = ICON_MAP[step.icon];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 hover:border-amber-500/30 rounded-2xl p-6 text-center transition-colors"
              >
                <div className="w-12 h-12 bg-amber-500/15 border border-amber-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {Icon && <Icon size={22} className="text-amber-400" />}
                </div>
                <div className="text-xs text-amber-500/60 font-mono mb-1">Step {step.n}</div>
                <h3 className="text-xl font-bold text-white mb-2">{step.label}</h3>
                <p className="text-sm text-white/50">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
