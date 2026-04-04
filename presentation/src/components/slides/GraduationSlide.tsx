import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield } from 'lucide-react';
import type { SlideData } from '../../data/slides-en';

interface Props { data: SlideData; lang: 'en' | 'he'; }

export default function GraduationSlide({ data }: Props) {
  const steps = data.steps as Array<{ step: string; label: string; desc: string }>;
  const what = data.what as string[];

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h2 className="text-5xl sm:text-6xl font-black gradient-lightning mb-4">{data.title as string}</h2>
        <p className="text-xl text-amber-300/80 mb-3">{data.subtitle as string}</p>
        <p className="text-white/50">{data.description as string}</p>
      </motion.div>

      {/* Step flow */}
      <div className="flex items-center gap-3 mb-10 flex-wrap justify-center">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="flex flex-col items-center"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black border mb-3 hover:ring-2 hover:ring-amber-500/30 transition-all ${
                i === 2
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : 'bg-white/10 border-white/20 text-white'
              }`}>
                {step.step}
              </div>
              <div className={`font-mono text-sm font-bold mb-1 ${i === 2 ? 'text-amber-300' : 'text-white'}`}>
                {step.label}
              </div>
              <div className="text-xs text-white/60 text-center max-w-28">{step.desc}</div>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.15 }}
              >
                <ArrowRight size={20} className="text-white/50 mb-8" />
              </motion.div>
            )}
          </React.Fragment>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <ArrowRight size={20} className="text-amber-500/50 mb-8" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
          className="flex flex-col items-center"
        >
          <div className="w-12 h-12 rounded-full bg-sage/20 border-2 border-sage/50 flex items-center justify-center mb-3" style={{ borderColor: 'rgba(105,132,114,0.5)', backgroundColor: 'rgba(105,132,114,0.2)' }}>
            <Shield size={20} style={{ color: '#698472' }} />
          </div>
          <div className="font-mono text-sm font-bold mb-1" style={{ color: '#8fa896' }}>AutoSpec</div>
          <div className="text-xs text-white/60 text-center max-w-28">Full enterprise spec</div>
        </motion.div>
      </div>

      {/* What it does */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full max-w-2xl"
      >
        <h3 className="text-white/70 text-sm font-semibold mb-3">lsp graduate creates:</h3>
        <ul className="space-y-2">
          {what.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-white/60">
              <span className="text-amber-400 mt-0.5">→</span>
              {item}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
