import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export default function HeroSection() {
  const reducedMotion = useReducedMotion();
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(245,158,11,0.15) 0%, transparent 65%)',
        }}
      />

      {/* Animated lightning streaks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px"
            style={{
              top: `${15 + i * 17}%`,
              left: 0,
              right: 0,
              background: `linear-gradient(90deg, transparent, rgba(245,158,11,${0.1 + i * 0.04}), transparent)`,
              animation: `streakMove ${4 + i * 1.5}s linear infinite`,
              animationDelay: `${-i * 2}s`,
              width: `${80 + i * 20}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          Part of the AutoSpec Family
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex justify-center mb-4">
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-amber-500/25 rounded-2xl blur-2xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="relative w-20 h-20 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center">
                <Zap size={40} className="text-amber-400" fill="rgba(245,158,11,0.3)" />
              </div>
            </div>
          </div>

          <h1
            className="text-7xl sm:text-8xl lg:text-9xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 35%, #fbbf24 65%, #fde68a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 40px rgba(245,158,11,0.4))',
            }}
          >
            LightSpeed
            <br />
            Spec
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-2xl sm:text-3xl text-amber-300/80 italic font-light mb-4"
        >
          "Just enough spec, just fast enough"
        </motion.p>

        {/* Tagline */}
        <motion.p
          className="text-lg sm:text-xl text-white/55 mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={reducedMotion ? {} : undefined}
        >
          {reducedMotion
            ? "The lightweight SDD framework that adapts to your project's complexity. Stop over-speccing simple tasks."
            : "The lightweight SDD framework that adapts to your project's complexity. Stop over-speccing simple tasks."
                .split(' ')
                .map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.08, duration: 0.4, ease: 'easeOut' }}
                    style={{ display: 'inline-block', marginRight: '0.25em' }}
                  >
                    {word}
                  </motion.span>
                ))
          }
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <a
            href="#quickstart"
            onClick={(e) => { e.preventDefault(); document.querySelector('#quickstart')?.scrollIntoView({ behavior: 'smooth' }); }}
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold transition-all hover:scale-105 text-white"
            style={{ background: 'linear-gradient(135deg, #d97706, #f59e0b)', boxShadow: '0 0 30px rgba(245,158,11,0.35)' }}
          >
            Get Started
            <ArrowRight size={18} />
          </a>
          <Link
            to="/presentation"
            className="flex items-center gap-2 px-7 py-3.5 bg-white/8 hover:bg-white/15 border border-white/20 hover:border-amber-500/40 rounded-xl font-semibold text-white/80 hover:text-white transition-all"
          >
            <Play size={16} />
            View Presentation
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
