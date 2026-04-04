import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Github, ExternalLink, BookOpen, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { SlideData } from '../../data/slides-en';

interface Props { data: SlideData; lang: 'en' | 'he'; }

const linkIcons: Record<string, React.ElementType> = {
  github: Github,
  'external-link': ExternalLink,
  'book-open': BookOpen,
};

export default function ClosingSlide({ data }: Props) {
  const links = data.links as Array<{ label: string; url: string; icon: string }>;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen">
      {/* Glow orb */}
      <div className="relative mb-8">
        <motion.div
          className="absolute inset-0 bg-amber-500/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '200px', height: '200px', top: '-30px', left: '-30px' }}
        />
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: 'backOut' }}
          className="relative w-32 h-32 bg-amber-500/20 border-2 border-amber-500/50 rounded-3xl flex items-center justify-center"
        >
          <Zap size={60} className="text-amber-400" fill="rgba(245,158,11,0.4)" />
        </motion.div>
      </div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-5xl sm:text-6xl font-black gradient-lightning mb-4 text-center"
      >
        {data.title as string}
      </motion.h2>

      {/* Command */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="terminal-window mb-8 w-full max-w-lg"
      >
        <div className="terminal-header">
          <div className="terminal-dot bg-red-400" />
          <div className="terminal-dot bg-yellow-400" />
          <div className="terminal-dot bg-green-400" />
          <button
            onClick={() => copyToClipboard(data.command as string)}
            className="ml-auto text-white/50 hover:text-white/70 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          </button>
        </div>
        <div className="px-6 py-4 font-mono text-[11px] sm:text-lg overflow-x-auto max-w-full">
          <span className="text-white/60">$ </span>
          <span className="text-amber-300 font-bold">{data.command as string}</span>
          <motion.span
            className="inline-block w-2 h-5 bg-amber-400 ml-1 -mb-0.5"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-xl text-amber-300/80 italic mb-10"
      >
        {data.subtitle as string}
      </motion.p>

      {/* Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex flex-wrap gap-3 justify-center mb-8"
      >
        {links.map((link, i) => {
          const Icon = linkIcons[link.icon] || ExternalLink;
          return (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-amber-500/40 rounded-xl text-sm text-white/80 hover:text-white transition-all"
            >
              <Icon size={16} />
              {link.label}
            </a>
          );
        })}
        <Link
          to="/"
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 rounded-xl text-sm text-amber-300 hover:text-amber-200 transition-all"
        >
          ← Back to Home
        </Link>
      </motion.div>

      {/* Tagline bottom */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="text-white/60 text-sm"
      >
        {data.tagline as string}
      </motion.p>
    </div>
  );
}
