import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Zap } from 'lucide-react';
import type { SlideData } from '../../data/slides-en';

interface Props { data: SlideData; lang: 'en' | 'he'; }

export default function SpeedComparisonSlide({ data }: Props) {
  const comparison = data.comparison as {
    autospec: { name: string; time: string; seconds: number; color: string; best: string };
    lsp: { name: string; time: string; seconds: number; color: string; best: string };
  };

  // lsp bar is 60/1800 = 3.3% of AutoSpec
  const lspBarPct = (comparison.lsp.seconds / comparison.autospec.seconds) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h2 className="text-5xl sm:text-6xl font-black gradient-lightning mb-4">{data.title as string}</h2>
        <p className="text-xl text-white/50">{data.subtitle as string}</p>
      </motion.div>

      {/* Comparison bars */}
      <div className="w-full space-y-6 mb-10">
        {/* AutoSpec */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-sage" style={{ color: '#698472' }} />
              <span className="text-white font-semibold">{comparison.autospec.name}</span>
              <span className="text-xs text-white/60 px-2 py-0.5 rounded bg-white/5">{comparison.autospec.best}</span>
            </div>
            <span className="text-white/70 font-mono">{comparison.autospec.time}</span>
          </div>
          <div className="h-12 bg-white/5 rounded-xl overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-xl flex items-center px-4"
              style={{ background: 'linear-gradient(90deg, rgba(105,132,114,0.5), rgba(105,132,114,0.3))' }}
            >
              <span className="text-sm font-mono text-sage-light" style={{ color: '#8fa896' }}>30 minutes</span>
            </motion.div>
          </div>
        </motion.div>

        {/* lsp */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-amber-400" />
              <span className="text-white font-semibold">{comparison.lsp.name}</span>
              <span className="text-xs text-white/60 px-2 py-0.5 rounded bg-white/5">{comparison.lsp.best}</span>
            </div>
            <span className="text-amber-300 font-mono font-bold">{comparison.lsp.time}</span>
          </div>
          <div className="h-12 bg-white/5 rounded-xl overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(lspBarPct, 8)}%` }}
              transition={{ delay: 0.7, duration: 0.6, ease: 'easeOut' }}
              className="h-full rounded-xl flex items-center px-4"
              style={{ background: 'linear-gradient(90deg, rgba(245,158,11,0.7), rgba(251,191,36,0.5))' }}
            >
              <span className="text-xs font-mono text-amber-900 font-bold whitespace-nowrap">&lt;60 sec</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Speedup badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        className="flex items-center gap-3 px-8 py-4 bg-amber-500/15 border border-amber-500/40 rounded-2xl mb-8"
      >
        <Zap size={24} className="text-amber-400" fill="rgba(245,158,11,0.3)" />
        <span className="text-3xl font-black text-amber-300">30x faster</span>
      </motion.div>

      {/* Insight */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center text-white/50 max-w-2xl"
      >
        {data.insight as string}
      </motion.p>
    </div>
  );
}
