import { File } from 'lucide-react';

interface Props { filename: string; language: string; content: string }

export default function FileViewer({ filename, content }: Props) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 border-b border-white/10">
        <File className="w-3.5 h-3.5 text-amber-400/70" />
        <span className="text-xs font-mono text-white/60">{filename}</span>
      </div>
      <pre className="px-4 py-3 text-xs font-mono text-white/70 overflow-x-auto bg-slate-950/60 max-h-80 overflow-y-auto leading-relaxed whitespace-pre-wrap">{content}</pre>
    </div>
  );
}
