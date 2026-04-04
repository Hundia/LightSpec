import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import type { SlideData } from '../../data/slides-en';

interface Props { data: SlideData; lang: 'en' | 'he'; }

type TerminalLine = { text: string; type: string };

const lineColors: Record<string, string> = {
  command: 'text-white font-bold',
  blank: '',
  info: 'text-white/50',
  result: 'text-cyan-300/90',
  highlight: 'text-amber-300 font-semibold',
  success: 'text-green-400',
};

export default function ScannerDemoSlide({ data }: Props) {
  const lines = data.terminalLines as TerminalLine[];
  const [visibleLines, setVisibleLines] = useState(0);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = lines.map((l) => l.text).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setVisibleLines(0);
    const timer = setInterval(() => {
      setVisibleLines((v) => {
        if (v >= lines.length) {
          clearInterval(timer);
          return v;
        }
        return v + 1;
      });
    }, 120);
    return () => clearInterval(timer);
  }, [lines.length]);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <h2 className="text-4xl sm:text-5xl font-black gradient-lightning mb-3">{data.title as string}</h2>
        <p className="text-xl text-white/50">{data.subtitle as string}</p>
      </motion.div>

      {/* Terminal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="terminal-window w-full shadow-2xl"
        style={{ boxShadow: '0 0 60px rgba(245,158,11,0.15), 0 25px 50px rgba(0,0,0,0.5)' }}
      >
        {/* Title bar */}
        <div className="terminal-header">
          <div className="terminal-dot bg-red-400" />
          <div className="terminal-dot bg-yellow-400" />
          <div className="terminal-dot bg-green-400" />
          <span className="text-xs text-white/60 ml-3 font-mono">lsp — terminal</span>
          <div className="ml-auto text-xs text-amber-400/60 font-mono">lsp v0.1.0</div>
          <button
            onClick={copyToClipboard}
            className="ml-3 text-white/50 hover:text-white/70 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 font-mono text-[11px] sm:text-sm space-y-1 min-h-64 overflow-x-auto max-w-full">
          {lines.slice(0, visibleLines).map((line, i) => (
            <div key={i} className={lineColors[line.type] || 'text-white/70'}>
              {line.text || '\u00A0'}
            </div>
          ))}
          {/* Blinking cursor */}
          {visibleLines <= lines.length && (
            <span className="inline-block w-2 h-4 bg-amber-400 animate-pulse" />
          )}
        </div>
      </motion.div>
    </div>
  );
}
