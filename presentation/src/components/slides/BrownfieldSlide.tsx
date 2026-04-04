import React from 'react';
import { motion } from 'framer-motion';
import { Package, Layout, GitBranch, CheckCircle, FileText, ArrowRight } from 'lucide-react';
import type { SlideData } from '../../data/slides-en';

interface Props { data: SlideData; lang: 'en' | 'he'; }

const moduleIcons: Record<string, React.ElementType> = {
  package: Package,
  layout: Layout,
  route: GitBranch,
  'check-circle': CheckCircle,
  'file-text': FileText,
};

export default function BrownfieldSlide({ data }: Props) {
  const modules = data.modules as Array<{ name: string; icon: string; desc: string }>;

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h2 className="text-5xl sm:text-6xl font-black gradient-lightning mb-4">{data.title as string}</h2>
        <p className="text-xl text-amber-300/80 mb-3">{data.subtitle as string}</p>
        <p className="text-white/50">{data.description as string}</p>
      </motion.div>

      {/* Pipeline flow */}
      <div className="flex items-center gap-2 w-full mb-10 flex-wrap justify-center">
        {modules.map((mod, i) => {
          const Icon = moduleIcons[mod.icon] || Package;
          return (
            <React.Fragment key={i}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.4, ease: 'backOut' }}
                className="flex flex-col items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-4 hover:border-amber-500/30 hover:scale-[1.03] transition-transform duration-200"
                style={{ minWidth: '120px' }}
              >
                <div className="w-10 h-10 bg-amber-500/15 border border-amber-500/30 rounded-lg flex items-center justify-center">
                  <Icon size={18} className="text-amber-400" />
                </div>
                <span className="text-xs font-semibold text-white/80 text-center">{mod.name}</span>
                <span className="text-xs text-white/60 text-center">{mod.desc}</span>
              </motion.div>
              {i < modules.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.12 }}
                >
                  <ArrowRight size={16} className="text-white/50" />
                </motion.div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Output */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-amber-500/10 border border-amber-500/30 rounded-2xl px-8 py-5 text-center"
      >
        <p className="text-amber-300 font-mono text-sm">{data.output as string}</p>
      </motion.div>
    </div>
  );
}
