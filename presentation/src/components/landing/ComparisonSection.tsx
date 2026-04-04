import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, ArrowRight, Check, X } from 'lucide-react';
import { COMPARISON_FEATURES } from '../../data/landing-en';

const features = COMPARISON_FEATURES;

export default function ComparisonSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black gradient-lightning mb-4">The AutoSpec Family</h2>
          <p className="text-xl text-white/50">Two tools for different scales of complexity</p>
        </motion.div>

        {/* Hero cards */}
        <div className="flex items-center gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 rounded-2xl border border-amber-500/40 p-8 text-center"
            style={{ backgroundColor: 'rgba(245,158,11,0.08)', boxShadow: '0 0 40px rgba(245,158,11,0.15)' }}
          >
            <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/40 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap size={32} className="text-amber-400" fill="rgba(245,158,11,0.3)" />
            </div>
            <h3 className="text-2xl font-black text-amber-300 mb-1">LightSpec</h3>
            <p className="text-sm text-white/60 mb-3">Lightweight Champion</p>
            <div className="text-3xl font-black text-amber-300">&lt;60 sec</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="flex flex-col items-center gap-1"
          >
            <ArrowRight size={28} className="text-white/20" />
            <span className="text-xs text-white/50 text-center">Graduate<br />when ready</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 rounded-2xl border border-white/15 bg-white/5 p-8 text-center"
          >
            <div className="w-16 h-16 border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(105,132,114,0.15)' }}>
              <Shield size={32} style={{ color: '#698472' }} />
            </div>
            <h3 className="text-2xl font-black mb-1" style={{ color: '#8fa896' }}>AutoSpec</h3>
            <p className="text-sm text-white/60 mb-3">Enterprise Champion</p>
            <div className="text-3xl font-black" style={{ color: '#8fa896' }}>30+ min</div>
          </motion.div>
        </div>

        {/* Feature comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
        >
          <div className="grid grid-cols-3 text-xs font-bold uppercase tracking-wider text-white/60 border-b border-white/10 px-6 py-3">
            <span>Feature</span>
            <span className="text-center text-amber-400">lsp</span>
            <span className="text-center" style={{ color: '#698472' }}>AutoSpec</span>
          </div>
          {features.map((row, i) => (
            <div key={i} className={`grid grid-cols-3 px-6 py-3 items-center ${i % 2 === 0 ? '' : 'bg-white/3'}`}>
              <span className="text-sm text-white/60">{row.feature}</span>
              <span className="text-center">
                {typeof row.lsp === 'boolean' ? (
                  row.lsp ? <Check size={16} className="text-amber-400 mx-auto" /> : <X size={16} className="text-white/20 mx-auto" />
                ) : (
                  <span className="text-xs text-amber-300">{row.lsp}</span>
                )}
              </span>
              <span className="text-center">
                {typeof row.autospec === 'boolean' ? (
                  row.autospec ? <Check size={16} className="mx-auto" style={{ color: '#698472' }} /> : <X size={16} className="text-white/20 mx-auto" />
                ) : (
                  <span className="text-xs" style={{ color: '#8fa896' }}>{row.autospec}</span>
                )}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
