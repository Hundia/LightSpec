import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Menu, X, Zap } from 'lucide-react';
import BackgroundEffect from '../../engine/BackgroundEffects';
import StepPanel from './StepPanel';
import { steps } from '../../data/steps-en';

export default function GuidePage() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const step = steps[current];
  const total = steps.length;

  const go = (to: number) => {
    if (to >= 0 && to < total) {
      setDirection(to > current ? 1 : -1);
      setCurrent(to);
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(current + 1);
      else if (e.key === 'ArrowLeft') go(current - 1);
      else if (e.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [current]);

  const progress = ((current + 1) / total) * 100;

  return (
    <div className="relative bg-slate-950 text-white min-h-screen overflow-hidden flex flex-col">
      <style>{`@keyframes floatingGrid { 0%{background-position:0 0} 100%{background-position:40px 40px} }`}</style>

      {/* Background */}
      <BackgroundEffect activeId={step.bgId} />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-3 border-b border-white/10 bg-slate-950/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-amber-400" />
          <span className="font-semibold text-white">LightSpec Guide</span>
          {step.skill && (
            <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400 font-mono border border-amber-500/30">
              {step.skill}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/50">Step {current + 1} of {total}</span>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded hover:bg-white/10 transition-colors">
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative z-10 h-0.5 bg-white/10">
        <motion.div className="h-full bg-amber-400" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
      </div>

      {/* Chapter sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute right-0 top-0 h-full w-72 z-20 bg-slate-900 border-l border-white/10 pt-14 px-4 overflow-y-auto"
          >
            <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Chapters</div>
            {steps.map((s, i) => (
              <button key={s.id} onClick={() => { go(i); setSidebarOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded mb-1 text-sm transition-colors ${i === current ? 'bg-amber-500/20 text-amber-400' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}>
                <span className="text-xs text-white/30 mr-2">{s.id}.</span>{s.chapterLabel.split('. ')[1] || s.chapterLabel}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step content */}
      <div className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div key={step.id} custom={direction}
            variants={{ enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }), center: { x: 0, opacity: 1 }, exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }) }}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="h-full"
          >
            {/* Step header */}
            <div className="px-6 py-4 border-b border-white/10">
              <div className="text-xs text-amber-400/70 font-mono mb-1">{step.chapterLabel}</div>
              <h1 className="text-xl font-bold">{step.title}</h1>
              <p className="text-sm text-white/50 mt-0.5">{step.subtitle}</p>
            </div>
            <StepPanel left={step.left} right={step.right} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="relative z-10 flex items-center justify-between px-6 py-3 border-t border-white/10 bg-slate-950/80 backdrop-blur-sm">
        <button onClick={() => go(current - 1)} disabled={current === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm disabled:opacity-30 hover:bg-white/5 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          {current > 0 ? steps[current - 1].title : 'Start'}
        </button>
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <button key={i} onClick={() => go(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-amber-400 w-4' : 'bg-white/20 hover:bg-white/40'}`} />
          ))}
        </div>
        <button onClick={() => go(current + 1)} disabled={current === total - 1}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-sm disabled:opacity-30 hover:bg-white/5 transition-colors">
          {current < total - 1 ? steps[current + 1].title : 'Done'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
