import React from 'react';
import { Zap, Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500/20 border border-amber-500/40 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-amber-400" />
            </div>
            <span className="font-black text-white">LightSpec</span>
            <span className="text-white/50 text-sm">— Part of the AutoSpec Family</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/autospec/lightspec"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
            >
              <Github size={15} />
              GitHub
            </a>
            <a
              href="https://autospec.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
            >
              <ExternalLink size={15} />
              AutoSpec
            </a>
            <Link
              to="/presentation"
              className="flex items-center gap-1.5 text-sm text-amber-400/70 hover:text-amber-400 transition-colors"
            >
              View Presentation →
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <span>MIT License — Free to use, modify, and distribute</span>
          <span>© 2026 AutoSpec Family</span>
        </div>
      </div>
    </footer>
  );
}
