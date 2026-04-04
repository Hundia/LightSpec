import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import type { SlideData } from '../../data/slides-en';

interface Props { data: SlideData; lang: 'en' | 'he'; }

export default function SpecOverkillSlide({ data }: Props) {
  const stats = data.stats as Array<{ value: string; label: string }>;

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/15 border border-red-500/30 rounded-full text-red-400 text-sm font-medium mb-6">
          <TrendingUp size={14} />
          <span>{data.title as string}</span>
        </div>
        <h2 className="text-5xl sm:text-6xl font-black gradient-lightning mb-4">{data.subtitle as string}</h2>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">{data.description as string}</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: 'backOut' }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-amber-500/30 hover:scale-[1.03] transition-transform duration-200"
          >
            <div
              className="text-4xl sm:text-5xl font-black mb-2"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {stat.value}
            </div>
            <div className="text-sm text-white/50">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="bg-amber-500/10 border border-amber-500/20 rounded-2xl px-8 py-5 max-w-3xl text-center"
      >
        <p className="text-lg text-amber-300/80 italic">{data.quote as string}</p>
      </motion.div>
    </div>
  );
}
