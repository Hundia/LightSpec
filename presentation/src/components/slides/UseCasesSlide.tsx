import React from 'react';
import { motion } from 'framer-motion';
import { Bug, Layers, Building2 } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { SlideData } from '../../data/slides-en';

interface Props { data: SlideData; lang: 'en' | 'he'; }

interface UseCase {
  icon: React.ReactNode;
  color: string;
  scenario: string;
  depthLabel: string;
  depthScore: number;
  output: string[];
  time: string;
  pillClass: string;
  glowColor: string;
}

const USE_CASES: UseCase[] = [
  {
    icon: <Bug size={28} />,
    color: 'text-amber-400',
    scenario: 'Fix failing test in payment module',
    depthLabel: 'micro',
    depthScore: 18,
    output: ['.lsp/spec.md (142 lines)', '.lsp/tasks.md (3 tasks)'],
    time: '~15 seconds',
    pillClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    glowColor: 'rgba(245,158,11,0.25)',
  },
  {
    icon: <Layers size={28} />,
    color: 'text-cyan-400',
    scenario: 'Add OAuth2 login to existing Express app',
    depthLabel: 'standard',
    depthScore: 52,
    output: ['.lsp/spec.md (387 lines)', '.lsp/tasks.md (8 tasks)'],
    time: '~45 seconds',
    pillClass: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
    glowColor: 'rgba(6,182,212,0.25)',
  },
  {
    icon: <Building2 size={28} />,
    color: 'text-violet-400',
    scenario: 'Migrate REST API to GraphQL',
    depthLabel: 'full',
    depthScore: 78,
    output: ['.lsp/product-spec.md', '.lsp/tech-spec.md', '.lsp/quality-spec.md', '.lsp/tasks.md'],
    time: '~90 seconds',
    pillClass: 'bg-violet-500/20 text-violet-300 border border-violet-500/30',
    glowColor: 'rgba(139,92,246,0.25)',
  },
];

export default function UseCasesSlide({ data }: Props) {
  const reducedMotion = useReducedMotion();

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl sm:text-5xl font-black gradient-lightning mb-3">
          {data.title as string}
        </h2>
        <p className="text-xl text-white/50">{data.subtitle as string}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {USE_CASES.map((uc, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.45, ease: 'easeOut' }}
            whileHover={
              reducedMotion
                ? {}
                : {
                    scale: 1.03,
                    boxShadow: `0 0 40px ${uc.glowColor}, 0 20px 40px rgba(0,0,0,0.4)`,
                  }
            }
            className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col gap-4 cursor-default transition-colors"
          >
            {/* Icon + depth pill */}
            <div className="flex items-start justify-between">
              <div className={`${uc.color}`}>{uc.icon}</div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${uc.pillClass}`}>
                {uc.depthLabel}
              </span>
            </div>

            {/* Scenario */}
            <div>
              <p className="text-white font-semibold text-sm leading-snug">{uc.scenario}</p>
              <p className="text-white/40 text-xs mt-1">score: {uc.depthScore}/100</p>
            </div>

            {/* Output files */}
            <div className="flex flex-col gap-1">
              <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">Output</p>
              {uc.output.map((file, j) => (
                <div key={j} className="text-green-400 text-xs font-mono truncate">
                  {file}
                </div>
              ))}
            </div>

            {/* Time */}
            <div className="mt-auto pt-3 border-t border-slate-700/60 flex items-center justify-between">
              <span className="text-white/40 text-xs">Generation time</span>
              <span className="text-amber-300 text-xs font-semibold">{uc.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
