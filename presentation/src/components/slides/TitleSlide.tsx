import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { SlideData } from '../../data/slides-en';

interface Props { data: SlideData; lang: 'en' | 'he'; }

const ambientDots = [
  { x: '8%', y: '15%', size: 8, xRange: 18, yRange: 22, duration: 9 },
  { x: '85%', y: '20%', size: 5, xRange: -14, yRange: 16, duration: 12 },
  { x: '15%', y: '75%', size: 10, xRange: 20, yRange: -18, duration: 11 },
  { x: '78%', y: '65%', size: 6, xRange: -16, yRange: 20, duration: 14 },
  { x: '50%', y: '88%', size: 7, xRange: 12, yRange: -12, duration: 8 },
];

export default function TitleSlide({ data }: Props) {
  const reducedMotion = useReducedMotion();
  return (
    <div className="relative w-full flex items-center justify-center overflow-hidden min-h-screen">
      {/* Animated gradient */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            'radial-gradient(ellipse at 30% 40%, rgba(245,158,11,0.18) 0%, rgba(251,191,36,0.1) 40%, transparent 80%)',
            'radial-gradient(ellipse at 65% 55%, rgba(245,158,11,0.15) 0%, rgba(217,119,6,0.1) 40%, transparent 80%)',
            'radial-gradient(ellipse at 40% 30%, rgba(251,191,36,0.18) 0%, rgba(245,158,11,0.1) 40%, transparent 80%)',
            'radial-gradient(ellipse at 30% 40%, rgba(245,158,11,0.18) 0%, rgba(251,191,36,0.1) 40%, transparent 80%)',
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      {/* Ambient dots */}
      {ambientDots.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-amber-400/20 pointer-events-none"
          style={{ left: dot.x, top: dot.y, width: dot.size, height: dot.size }}
          animate={{ x: [0, dot.xRange, 0], y: [0, dot.yRange, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: dot.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Lightning bolt icon */}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: 'backOut' }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 bg-amber-500/30 rounded-full blur-2xl"
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative w-20 h-20 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center">
              <Zap size={40} className="text-amber-400" fill="rgba(245,158,11,0.3)" />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.85, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          className="text-7xl sm:text-9xl font-black mb-4 tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 40%, #fbbf24 70%, #fde68a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px rgba(245,158,11,0.5))',
          }}
        >
          {data.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-2xl sm:text-3xl text-amber-300/90 font-light mb-6 italic"
        >
          "{data.subtitle}"
        </motion.p>

        {/* Tagline */}
        <motion.p
          className="text-lg sm:text-xl text-white/60 mb-10 max-w-2xl mx-auto"
          initial={reducedMotion ? {} : undefined}
        >
          {reducedMotion
            ? (data.tagline as string)
            : (data.tagline as string).split(' ').map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.08, duration: 0.4, ease: 'easeOut' }}
                  style={{ display: 'inline-block', marginRight: '0.25em' }}
                >
                  {word}
                </motion.span>
              ))
          }
        </motion.p>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="inline-flex items-center gap-3 px-5 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-full"
        >
          <motion.div
            className="w-2.5 h-2.5 rounded-full bg-amber-400"
            animate={{ opacity: [1, 0.3, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="text-sm text-amber-300/80 font-medium tracking-wide">
            {data.badge as string}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
