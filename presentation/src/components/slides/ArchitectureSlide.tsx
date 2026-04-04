import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, GitBranch, Wand2, FolderOpen } from 'lucide-react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { SlideData } from '../../data/slides-en';

interface ArchitectureSlideProps {
  data: SlideData;
}

const nodes = [
  {
    icon: Scan,
    label: 'Scanner',
    description: '5 detection modules — stack, architecture, routes, tests, docs',
  },
  {
    icon: GitBranch,
    label: 'Depth Router',
    description: '0–100 score → micro | standard | full depth',
  },
  {
    icon: Wand2,
    label: 'Generator',
    description: 'Handlebars template → LLM provider → Markdown spec',
  },
  {
    icon: FolderOpen,
    label: 'Output',
    description: '.lsp/spec.md + tasks.md + .meta.json',
  },
];

export default function ArchitectureSlide({ data }: ArchitectureSlideProps) {
  const [activeNode, setActiveNode] = useState<number | null>(0);
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

      {/* Pipeline diagram */}
      <div className="w-full flex items-center justify-center gap-0">
        {nodes.map((node, i) => {
          const Icon = node.icon;
          const isActive = activeNode === i;

          return (
            <React.Fragment key={i}>
              {/* Node card */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.15 }}
                onClick={() => setActiveNode(isActive ? null : i)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all cursor-pointer flex-shrink-0 w-36 sm:w-40 ${
                  isActive
                    ? 'bg-slate-800/80 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-800/60 border-slate-600 hover:border-amber-500/40 hover:shadow-[0_0_12px_rgba(245,158,11,0.1)]'
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-slate-700/60 text-white/60'
                  }`}
                >
                  <Icon size={22} />
                </div>
                <span
                  className={`text-xs font-bold text-center ${
                    isActive ? 'text-amber-300' : 'text-white/80'
                  }`}
                >
                  {node.label}
                </span>
              </motion.button>

              {/* Connector arrow between nodes */}
              {i < nodes.length - 1 && (
                <div className="flex items-center mx-1 sm:mx-2 flex-shrink-0">
                  <div className="relative w-12 sm:w-16 h-4">
                    <svg
                      viewBox="0 0 64 8"
                      className="w-full h-full overflow-visible"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <motion.path
                        d="M 0 4 L 56 4"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        fill="none"
                        strokeOpacity="0.6"
                        initial={{ pathLength: reduced ? 1 : 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 1.5,
                          ease: 'easeInOut',
                          delay: 0.3 + i * 0.2,
                        }}
                      />
                      {/* Arrowhead */}
                      <motion.path
                        d="M 52 1 L 58 4 L 52 7"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        fill="none"
                        strokeOpacity="0.6"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        initial={{ opacity: reduced ? 1 : 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 1.5 + i * 0.2,
                        }}
                      />
                    </svg>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Detail panel */}
      {reduced ? (
        activeNode !== null && (
          <div className="mt-4 bg-slate-800/40 border border-slate-700 rounded-xl p-4 text-center max-w-xl w-full">
            <p className="text-white/70 text-sm">{nodes[activeNode].description}</p>
          </div>
        )
      ) : (
        <AnimatePresence mode="wait">
          {activeNode !== null && (
            <motion.div
              key={activeNode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-4 bg-slate-800/40 border border-slate-700 rounded-xl p-4 text-center max-w-xl w-full"
            >
              <p className="text-white/70 text-sm">{nodes[activeNode].description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-6 text-xs text-white/30 text-center"
      >
        Click a node to explore
      </motion.p>
    </div>
  );
}
