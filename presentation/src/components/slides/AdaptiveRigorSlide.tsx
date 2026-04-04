import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Layers, Building } from 'lucide-react';
import type { SlideData } from '../../data/slides-en';

interface Props { data: SlideData; lang: 'en' | 'he'; }

const icons = { zap: Zap, layers: Layers, building: Building };
const colors = {
  amber: { border: 'border-amber-500/40', bg: 'bg-amber-500/10', text: 'text-amber-400', glow: 'rgba(245,158,11,0.3)' },
  blue: { border: 'border-blue-500/40', bg: 'bg-blue-500/10', text: 'text-blue-400', glow: 'rgba(59,130,246,0.3)' },
  purple: { border: 'border-purple-500/40', bg: 'bg-purple-500/10', text: 'text-purple-400', glow: 'rgba(139,92,246,0.3)' },
};

export default function AdaptiveRigorSlide({ data }: Props) {
  const [activeLevel, setActiveLevel] = useState(0);
  const levels = data.levels as Array<{ name: string; icon: string; color: string; useCase: string; lines: string; time: string; files: string }>;

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium mb-6">
          <Zap size={14} />
          <span>The Killer Feature</span>
        </div>
        <h2 className="text-5xl sm:text-6xl font-black gradient-lightning mb-4">{data.title as string}</h2>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">{data.description as string}</p>
      </motion.div>

      {/* Level cards */}
      <div
        className="grid grid-cols-3 gap-4 w-full mb-8"
        role="tablist"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); setActiveLevel((activeLevel + 1) % levels.length); }
          else if (e.key === 'ArrowLeft') { e.preventDefault(); setActiveLevel((activeLevel - 1 + levels.length) % levels.length); }
          else if (e.key === 'Home') { e.preventDefault(); setActiveLevel(0); }
          else if (e.key === 'End') { e.preventDefault(); setActiveLevel(levels.length - 1); }
        }}
      >
        {levels.map((level, i) => {
          const IconComp = icons[level.icon as keyof typeof icons] || Zap;
          const c = colors[level.color as keyof typeof colors];
          const isActive = activeLevel === i;

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              onClick={() => setActiveLevel(i)}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              className={`relative rounded-2xl border p-6 text-left transition-all cursor-pointer ${c.border} ${isActive ? c.bg : 'bg-white/3 hover:bg-white/5'}`}
              style={isActive ? { boxShadow: `0 0 30px ${c.glow}` } : {}}
            >
              <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center mb-4`}>
                <IconComp size={20} className={c.text} />
              </div>
              <h3 className={`text-xl font-bold mb-1 ${isActive ? c.text : 'text-white'}`}>{level.name}</h3>
              <p className="text-sm text-white/50 mb-4">{level.useCase}</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/60">Lines:</span>
                  <span className={c.text}>{level.lines}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Time:</span>
                  <span className={c.text}>{level.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Output:</span>
                  <span className={c.text}>{level.files}</span>
                </div>
              </div>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full ${c.text.replace('text-', 'bg-')}`}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-amber-300/70 text-lg italic"
      >
        {data.tagline as string}
      </motion.p>
    </div>
  );
}
