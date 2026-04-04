import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, ArrowRight } from 'lucide-react';
import type { SlideData } from '../../data/slides-en';

interface Props { data: SlideData; lang: 'en' | 'he'; }

export default function FamilySlide({ data }: Props) {
  const members = data.members as Array<{
    name: string; abbr: string; color: string; role: string;
    specs: string; depth: string; time: string; best: string; icon: string;
  }>;

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h2 className="text-5xl sm:text-6xl font-black gradient-lightning mb-4">{data.title as string}</h2>
        <p className="text-xl text-white/50">{data.subtitle as string}</p>
      </motion.div>

      {/* Two-column member cards */}
      <div className="flex items-center gap-6 w-full">
        {/* lsp */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex-1 rounded-2xl border border-amber-500/40 bg-amber-500/8 p-8"
          style={{ backgroundColor: 'rgba(245,158,11,0.08)' }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center">
              <Zap size={28} className="text-amber-400" fill="rgba(245,158,11,0.3)" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-amber-300">{members[0].name}</h3>
              <p className="text-sm text-white/50">{members[0].role}</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Spec files', value: members[0].specs },
              { label: 'Depth', value: members[0].depth },
              { label: 'Generation', value: members[0].time },
              { label: 'Best for', value: members[0].best },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center border-b border-white/5 pb-2 hover:bg-white/5 transition-colors px-1 rounded">
                <span className="text-sm text-white/60">{label}</span>
                <span className="text-sm text-amber-300 font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Arrow */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring' }}
          className="flex flex-col items-center gap-2"
        >
          <ArrowRight size={32} className="text-white/50" />
          <span className="text-xs text-white/50 text-center max-w-20">{data.arrow as string}</span>
        </motion.div>

        {/* AutoSpec */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex-1 rounded-2xl border border-white/15 bg-white/5 p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 border border-white/20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(105,132,114,0.15)' }}>
              <Shield size={28} style={{ color: '#698472' }} />
            </div>
            <div>
              <h3 className="text-2xl font-black" style={{ color: '#8fa896' }}>{members[1].name}</h3>
              <p className="text-sm text-white/50">{members[1].role}</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Spec files', value: members[1].specs },
              { label: 'Depth', value: members[1].depth },
              { label: 'Generation', value: members[1].time },
              { label: 'Best for', value: members[1].best },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-sm text-white/60">{label}</span>
                <span className="text-sm font-semibold" style={{ color: '#8fa896' }}>{value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
