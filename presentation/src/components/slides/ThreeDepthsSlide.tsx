import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { SlideData } from '../../data/slides-en';

interface Props { data: SlideData; lang: 'en' | 'he'; }

const colorMap = {
  amber: { border: 'border-amber-500/40', bg: 'bg-amber-500/10', text: 'text-amber-400', tab: 'bg-amber-500' },
  blue: { border: 'border-blue-500/40', bg: 'bg-blue-500/10', text: 'text-blue-400', tab: 'bg-blue-500' },
  purple: { border: 'border-purple-500/40', bg: 'bg-purple-500/10', text: 'text-purple-400', tab: 'bg-purple-500' },
};

export default function ThreeDepthsSlide({ data }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const depths = data.depths as Array<{ level: string; color: string; trigger: string; output: string; sections: string[]; example: string }>;

  const activeDepth = depths[activeTab];
  const c = colorMap[activeDepth.color as keyof typeof colorMap];

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h2 className="text-5xl sm:text-6xl font-black gradient-lightning mb-3">{data.title as string}</h2>
        <p className="text-xl text-white/50">{data.subtitle as string}</p>
      </motion.div>

      {/* Tab selector */}
      <div
        className="flex gap-2 mb-8 bg-white/5 rounded-xl p-1"
        role="tablist"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); setActiveTab((activeTab + 1) % depths.length); }
          else if (e.key === 'ArrowLeft') { e.preventDefault(); setActiveTab((activeTab - 1 + depths.length) % depths.length); }
          else if (e.key === 'Home') { e.preventDefault(); setActiveTab(0); }
          else if (e.key === 'End') { e.preventDefault(); setActiveTab(depths.length - 1); }
        }}
      >
        {depths.map((depth, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            role="tab"
            aria-selected={activeTab === i}
            tabIndex={activeTab === i ? 0 : -1}
            className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === i ? `${colorMap[depth.color as keyof typeof colorMap].tab} text-white shadow-lg` : 'text-white/50 hover:text-white/70'
            }`}
          >
            {depth.level.charAt(0).toUpperCase() + depth.level.slice(1)}
          </button>
        ))}
      </div>

      {/* Active depth card */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        role="tabpanel"
        className={`w-full rounded-2xl border ${c.border} ${c.bg} p-6`}
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.bg} ${c.text} border ${c.border}`}>
                {activeDepth.trigger}
              </span>
            </div>
            <div className="mb-4">
              <p className="text-sm text-white/60 mb-1">Output files:</p>
              <p className={`font-mono text-sm ${c.text}`}>{activeDepth.output}</p>
            </div>
            <div>
              <p className="text-sm text-white/60 mb-2">Sections:</p>
              <ul className="space-y-1">
                {activeDepth.sections.map((s, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                    <span className={`w-1.5 h-1.5 rounded-full ${c.text.replace('text-', 'bg-')}`} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: code preview */}
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-dot bg-red-400" />
              <div className="terminal-dot bg-yellow-400" />
              <div className="terminal-dot bg-green-400" />
              <span className="text-xs text-white/60 ml-2 font-mono">
                {activeDepth.output.split(' + ')[0]}
              </span>
            </div>
            <pre className="p-4 text-[11px] sm:text-xs text-green-300/80 font-mono overflow-x-auto max-w-full leading-relaxed whitespace-pre-wrap">
              {activeDepth.example}
            </pre>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
