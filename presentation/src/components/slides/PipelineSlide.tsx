import React from 'react';
import { motion } from 'framer-motion';
import { Search, BarChart2, GitBranch, CheckSquare, Cpu, Scissors, FilePlus, Clipboard, ChevronRight } from 'lucide-react';
import type { SlideData } from '../../data/slides-en';

interface Props { data: SlideData; lang: 'en' | 'he'; }

const stepIcons: Record<string, React.ElementType> = {
  search: Search,
  'bar-chart': BarChart2,
  'git-branch': GitBranch,
  'check-square': CheckSquare,
  cpu: Cpu,
  scissors: Scissors,
  'file-plus': FilePlus,
  clipboard: Clipboard,
};

const stepColors = [
  'text-amber-400 bg-amber-500/15 border-amber-500/30',
  'text-yellow-400 bg-yellow-500/15 border-yellow-500/30',
  'text-orange-400 bg-orange-500/15 border-orange-500/30',
  'text-blue-400 bg-blue-500/15 border-blue-500/30',
  'text-purple-400 bg-purple-500/15 border-purple-500/30',
  'text-pink-400 bg-pink-500/15 border-pink-500/30',
  'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
  'text-green-400 bg-green-500/15 border-green-500/30',
];

export default function PipelineSlide({ data }: Props) {
  const steps = data.steps as Array<{ n: number; name: string; desc: string; icon: string }>;

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h2 className="text-5xl sm:text-6xl font-black gradient-lightning mb-4">{data.title as string}</h2>
        <p className="text-xl text-white/50">{data.subtitle as string}</p>
      </motion.div>

      {/* Pipeline steps — two rows of 4 */}
      <div className="w-full grid grid-cols-4 gap-3 mb-4">
        {steps.slice(0, 4).map((step, i) => {
          const Icon = stepIcons[step.icon] || Search;
          const colorClasses = stepColors[i];
          return (
            <React.Fragment key={step.n}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className={`rounded-xl border p-4 text-center hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all ${colorClasses}`}
              >
                <div className="flex justify-center mb-2">
                  <Icon size={24} />
                </div>
                <div className="text-xs font-bold mb-0.5 text-white/80">{step.name}</div>
                <div className="text-xs text-white/60">{step.desc}</div>
              </motion.div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Arrow down */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center my-2"
      >
        <div className="flex flex-col items-center gap-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-px h-3 bg-amber-500/40" />
          ))}
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-amber-500/40" />
        </div>
      </motion.div>

      <div className="w-full grid grid-cols-4 gap-3">
        {steps.slice(4).map((step, i) => {
          const Icon = stepIcons[step.icon] || Search;
          const colorClasses = stepColors[4 + i];
          return (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className={`rounded-xl border p-4 text-center hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] transition-all ${colorClasses}`}
            >
              <div className="flex justify-center mb-2">
                <Icon size={24} />
              </div>
              <div className="text-xs font-bold mb-0.5 text-white/80">{step.name}</div>
              <div className="text-xs text-white/60">{step.desc}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Timing badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 px-6 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-full"
      >
        <span className="text-amber-300 text-sm font-mono">Total: &lt;90 seconds end-to-end</span>
      </motion.div>
    </div>
  );
}
