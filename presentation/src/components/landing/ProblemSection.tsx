import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Code2, ArrowDown } from 'lucide-react';

export default function ProblemSection() {
  return (
    <section id="problem" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">The Specification Paradox</h2>
          <p className="text-xl text-white/50">Every developer is caught between two bad options</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Too Much */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-red-500/8 border border-red-500/25 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500/15 border border-red-500/30 rounded-xl flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-red-300">Too Much</h3>
            </div>
            <p className="text-white/60 leading-relaxed">
              Enterprise frameworks generate{' '}
              <span className="text-red-300 font-semibold">10 spec files and 2000+ lines</span>{' '}
              for a simple API endpoint. Hours of ceremony before a single line of code.
            </p>
            <div className="mt-4 p-3 bg-red-500/10 rounded-lg font-mono text-xs text-red-300/70">
              $ autospec generate<br />
              ✓ 01_product_manager.md (243 lines)<br />
              ✓ 02_backend_lead.md (387 lines)<br />
              ✓ 03_frontend_lead.md (291 lines)<br />
              <span className="text-red-400">... 7 more files</span>
            </div>
          </motion.div>

          {/* Too Little */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-orange-500/8 border border-orange-500/25 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500/15 border border-orange-500/30 rounded-xl flex items-center justify-center">
                <Code2 size={20} className="text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-orange-300">Too Little</h3>
            </div>
            <p className="text-white/60 leading-relaxed">
              Vibe coding produces{' '}
              <span className="text-orange-300 font-semibold">no documentation</span>,
              causing context drift and AI hallucinations. Full rewrite every sprint.
            </p>
            <div className="mt-4 p-3 bg-orange-500/10 rounded-lg font-mono text-xs text-orange-300/70">
              # No spec, no docs<br />
              AI: "Based on context..."<br />
              <span className="text-orange-400">// Hallucinated past decisions</span><br />
              <span className="text-red-400">ERROR: Architecture mismatch</span>
            </div>
          </motion.div>
        </div>

        {/* Resolution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className="flex justify-center mb-4">
            <ArrowDown size={24} className="text-amber-400/60" />
          </div>
          <div className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500/15 border border-amber-500/35 rounded-2xl">
            <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <span className="text-amber-400 text-lg">⚡</span>
            </div>
            <span className="text-xl font-bold text-amber-300">LightSpec adapts to your project</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
