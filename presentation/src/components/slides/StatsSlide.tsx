import { useRef, useEffect } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { SlideData } from '../../data/slides-en';

interface StatsSlideProps {
  data: SlideData;
}

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
}

function AnimatedCounter({ target, suffix = '' }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 50, damping: 15 });
  const rounded = useTransform(spring, (v) => Math.round(v));

  useEffect(() => {
    if (inView) spring.set(target);
  }, [inView, spring, target]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  );
}

function StaticCounter({ target, suffix = '' }: AnimatedCounterProps) {
  return (
    <span>
      {target}{suffix}
    </span>
  );
}

const stats = [
  { value: 81, label: 'Tests Passing', suffix: '' },
  { value: 60, label: 'Max Seconds to First Spec', suffix: 's' },
  { value: 3, label: 'Adaptive Depth Levels', suffix: '' },
];

export default function StatsSlide({ data }: StatsSlideProps) {
  const reduced = useReducedMotion();

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-5xl sm:text-6xl font-black gradient-lightning mb-4">
          {data.title as string}
        </h2>
        <p className="text-xl text-white/50">{data.subtitle as string}</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full max-w-3xl">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.1 }}
            className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 text-center"
          >
            <div className="text-5xl font-bold gradient-lightning mb-2">
              {reduced ? (
                <StaticCounter target={stat.value} suffix={stat.suffix} />
              ) : (
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              )}
            </div>
            <p className="text-white/60 text-sm leading-snug">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Testimonial */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 bg-white/5 border border-amber-500/30 rounded-2xl px-8 py-6 max-w-2xl mx-auto"
      >
        <p className="text-white/80 text-lg italic leading-relaxed">
          "LightSpec gave us specs we actually use. 15 seconds for a bug fix, 60 for a feature. Zero configuration."
        </p>
        <p className="text-amber-400/70 text-sm mt-3 font-medium">
          — Solo developer, 8-year Rails app
        </p>
      </motion.div>
    </div>
  );
}
