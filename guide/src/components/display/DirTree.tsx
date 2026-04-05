import { File, Folder } from 'lucide-react';

interface Props { title: string; files: string[] }

export default function DirTree({ title, files }: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/10 bg-slate-800/50 text-xs text-amber-400 font-mono">{title}</div>
      <div className="py-2 px-4 space-y-1">
        {files.map((f, i) => {
          const isDir = f.endsWith('/');
          const depth = (f.match(/\//g) || []).length - 1;
          const name = f.split('/').filter(Boolean).pop() || f;
          return (
            <div key={i} className="flex items-center gap-2 text-xs font-mono text-white/60" style={{ paddingLeft: `${depth * 16}px` }}>
              {isDir ? <Folder className="w-3.5 h-3.5 text-amber-400/60" /> : <File className="w-3 h-3 text-white/30" />}
              <span>{name}{isDir ? '/' : ''}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
