import React from 'react';
import { ShieldCheck, Sparkles, Terminal, FileCode2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/80 backdrop-blur-md mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          <span>AI Mystery Room • Powered by Google Gemini & MongoDB</span>
        </div>

        <div className="flex items-center space-x-4 font-mono-detective">
          <span className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 transition-colors">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>MERN + Vite</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center space-x-1 text-amber-400/90">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Zero-Leak Backend Security</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
