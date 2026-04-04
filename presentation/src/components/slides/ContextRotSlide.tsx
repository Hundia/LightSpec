import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import type { SlideData } from '../../data/slides-en';

interface Props { data: SlideData; lang: 'en' | 'he'; }

export default function ContextRotSlide({ data }: Props) {
  const stages = data.stages as Array<{ label: string; quality: number; note: string }>;

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/15 border border-orange-500/30 rounded-full text-orange-400 text-sm font-medium mb-6">
          <AlertTriangle size={14} />
          <span>Problem</span>
        </div>
        <h2 className="text-5xl sm:text-6xl font-black gradient-lightning mb-4">{data.title as string}</h2>
        <p className="text-xl text-white/60">{data.subtitle as string}</p>
      </motion.div>

      {/* Quality degradation chart */}
      <div className="w-full max-w-3xl mb-8">
        <div className="flex items-end gap-4 justify-center h-48 mb-4">
          {stages.map((stage, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-2 flex-1"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6, ease: 'easeOut' }}
              style={{ transformOrigin: 'bottom' }}
            >
              <span className="text-xs text-white/50">{stage.note}</span>
              <div
                className="w-full rounded-t-lg relative overflow-hidden"
                style={{
                  height: `${stage.quality * 1.5}px`,
                  background: `linear-gradient(to top,
                    ${stage.quality > 60 ? 'rgba(34,197,94,0.6)' : stage.quality > 35 ? 'rgba(245,158,11,0.6)' : 'rgba(239,68,68,0.6)'},
                    ${stage.quality > 60 ? 'rgba(34,197,94,0.3)' : stage.quality > 35 ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'})`,
                }}
              >
                <div className="absolute bottom-2 left-0 right-0 text-center text-white font-bold text-sm">
                  {stage.quality}%
                </div>
              </div>
              <span className="text-sm text-white/70 font-medium">{stage.label}</span>
            </motion.div>
          ))}
        </div>
        <div className="h-px bg-white/10 w-full" />
        <p className="text-center text-sm text-white/60 mt-2">Context Quality Over Time</p>
      </div>

      {/* Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="bg-red-500/10 border border-red-500/20 rounded-2xl px-8 py-5 max-w-3xl text-center"
      >
        <p className="text-lg text-red-300/80 font-mono text-sm">{data.insight as string}</p>
      </motion.div>
    </div>
  );
}
