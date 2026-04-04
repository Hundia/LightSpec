import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { SlideData } from '../../data/slides-en';

interface Props { data: SlideData; lang: 'en' | 'he'; isActive?: boolean; }

const COMMAND = '$ lsp init';

const SESSION_LINES = [
  { text: '', type: 'blank', delay: 400 },
  { text: 'Scanning project...', type: 'info', delay: 600 },
  { text: '  ✓ Stack: TypeScript + React + Vite', type: 'success', delay: 300 },
  { text: '  ✓ Architecture: monorepo (3 packages)', type: 'success', delay: 200 },
  { text: '  ✓ Tests: 81 passing (vitest)', type: 'success', delay: 200 },
  { text: '  ✓ Routes: 4 API endpoints', type: 'success', delay: 200 },
  { text: '  ✓ Docs: README.md, QUICKSTART.md', type: 'success', delay: 200 },
  { text: '', type: 'blank', delay: 300 },
  { text: 'Complexity score: 58/100', type: 'score', delay: 400 },
  { text: 'Depth: standard (45s · 1 spec file)', type: 'depth', delay: 300 },
  { text: '', type: 'blank', delay: 300 },
  { text: 'Generating spec...', type: 'generating', delay: 2000 },
  { text: '', type: 'blank', delay: 200 },
  { text: '✓ Done in 41s', type: 'done', delay: 400 },
  { text: '', type: 'blank', delay: 200 },
  { text: 'Created:', type: 'created', delay: 300 },
  { text: '  .lsp/spec.md      (612 lines)', type: 'file', delay: 150 },
  { text: '  .lsp/tasks.md     (9 tasks)', type: 'file', delay: 150 },
  { text: '  .lsp/.meta.json', type: 'file', delay: 150 },
  { text: '', type: 'blank', delay: 300 },
  { text: 'Next: lsp status | lsp graduate', type: 'highlight', delay: 400 },
];

const LINE_COLORS: Record<string, string> = {
  blank: '',
  info: 'text-white/60',
  success: 'text-green-400',
  score: 'text-amber-400 font-semibold',
  depth: 'text-cyan-300',
  generating: 'text-white/60',
  done: 'text-green-400 font-semibold',
  created: 'text-white',
  file: 'text-green-400',
  highlight: 'text-amber-300 font-semibold',
};

export default function LiveDemoSlide({ data, isActive }: Props) {
  const reducedMotion = useReducedMotion();
  const [typedCommand, setTypedCommand] = useState('');
  const [visibleLines, setVisibleLines] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'typing' | 'lines' | 'done'>('idle');
  const [dots, setDots] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAll = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  // Reset + start when slide becomes active
  useEffect(() => {
    if (!isActive) return;
    clearAll();
    setTypedCommand('');
    setVisibleLines(0);
    setDots('');

    if (reducedMotion) {
      setTypedCommand(COMMAND);
      setVisibleLines(SESSION_LINES.length);
      setPhase('done');
      return;
    }

    setPhase('typing');
  }, [isActive, reducedMotion]);

  // Typing phase: one char every 80ms
  useEffect(() => {
    if (phase !== 'typing') return;
    if (typedCommand.length >= COMMAND.length) {
      // Pause 300ms then start lines
      timerRef.current = setTimeout(() => setPhase('lines'), 300);
      return;
    }
    timerRef.current = setTimeout(() => {
      setTypedCommand(COMMAND.slice(0, typedCommand.length + 1));
    }, 80);
    return clearAll;
  }, [phase, typedCommand]);

  // Lines phase: reveal one line at a time, using each line's delay
  useEffect(() => {
    if (phase !== 'lines') return;
    if (visibleLines >= SESSION_LINES.length) {
      setPhase('done');
      return;
    }
    const line = SESSION_LINES[visibleLines];
    timerRef.current = setTimeout(() => {
      setVisibleLines((v) => v + 1);
    }, line.delay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, visibleLines]);

  // Animate dots for "Generating spec..." line
  useEffect(() => {
    // Find the generating line index (0-based)
    const genIdx = SESSION_LINES.findIndex((l) => l.type === 'generating');
    // Show dots animation while that line is visible but next hasn't appeared
    if (visibleLines > genIdx && visibleLines <= genIdx + 1 && phase === 'lines') {
      intervalRef.current = setInterval(() => {
        setDots((d) => (d.length >= 3 ? '' : d + '.'));
      }, 300);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }
    setDots('');
    return undefined;
  }, [visibleLines, phase]);

  const isGeneratingVisible = visibleLines > SESSION_LINES.findIndex((l) => l.type === 'generating');

  const renderLine = (line: typeof SESSION_LINES[0], idx: number) => {
    if (!line.text) return <div key={idx}>&nbsp;</div>;
    const colorClass = LINE_COLORS[line.type] || 'text-white/70';
    // For the generating line, append animated dots
    if (line.type === 'generating' && isGeneratingVisible && phase !== 'done') {
      return (
        <div key={idx} className={colorClass}>
          {line.text}<span className="text-white/40">{dots}</span>
        </div>
      );
    }
    return <div key={idx} className={colorClass}>{line.text}</div>;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h2 className="text-4xl sm:text-5xl font-black gradient-lightning mb-3">
          {data.title as string}
        </h2>
        <p className="text-xl text-white/50">{data.subtitle as string}</p>
      </motion.div>

      {/* Terminal window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="terminal-window w-full shadow-2xl"
        style={{ boxShadow: '0 0 60px rgba(245,158,11,0.15), 0 25px 50px rgba(0,0,0,0.5)' }}
      >
        {/* Title bar */}
        <div className="terminal-header">
          <div
            className="terminal-dot"
            style={{ backgroundColor: '#ff5f57' }}
          />
          <div
            className="terminal-dot"
            style={{ backgroundColor: '#ffbd2e' }}
          />
          <div
            className="terminal-dot"
            style={{ backgroundColor: '#28c840' }}
          />
          <span className="text-xs text-white/60 ml-3 font-mono">lsp — terminal</span>
          <div className="ml-auto text-xs text-amber-400/60 font-mono">lsp v0.1.0</div>
        </div>

        {/* Content */}
        <div className="p-6 font-mono text-[11px] sm:text-sm space-y-1 min-h-64 overflow-x-auto max-w-full">
          {/* Command line — always shown once typing starts */}
          {(typedCommand.length > 0 || reducedMotion) && (
            <div className="text-white font-bold">
              {typedCommand}
              {phase === 'typing' && (
                <span className="inline-block w-2 h-4 bg-amber-400 animate-pulse align-middle ml-0.5" />
              )}
            </div>
          )}

          {/* Session lines */}
          {SESSION_LINES.slice(0, visibleLines).map((line, i) => renderLine(line, i))}

          {/* Blinking cursor at end when lines are being revealed */}
          {phase === 'lines' && (
            <span className="inline-block w-2 h-4 bg-amber-400 animate-pulse" />
          )}
        </div>
      </motion.div>
    </div>
  );
}
