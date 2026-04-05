import { useState } from 'react';
import { Folder, FolderOpen, File, ChevronRight, ChevronDown } from 'lucide-react';
import type { FileEntry } from '../../data/steps-en';

function TreeNode({ entry, depth = 0 }: { entry: FileEntry; depth?: number }) {
  const [open, setOpen] = useState(depth < 2);
  const isDir = entry.type === 'dir';

  return (
    <div>
      <div
        className={`flex items-center gap-1.5 py-0.5 px-2 rounded cursor-pointer text-xs transition-colors ${entry.highlight ? 'text-amber-400 bg-amber-500/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
        onClick={() => isDir && setOpen(!open)}
      >
        {isDir ? (
          <><span className="text-white/30">{open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}</span>
          {open ? <FolderOpen className="w-3.5 h-3.5 text-amber-400/70" /> : <Folder className="w-3.5 h-3.5 text-amber-400/50" />}</>
        ) : <File className="w-3 h-3 text-white/30 ml-3" />}
        <span>{entry.name}</span>
      </div>
      {isDir && open && entry.children?.map((child, i) => <TreeNode key={i} entry={child} depth={depth + 1} />)}
    </div>
  );
}

interface Props { root: string; entries: FileEntry[] }

export default function FileTree({ root, entries }: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/10 bg-slate-800/50 text-xs text-white/40 font-mono">{root}</div>
      <div className="py-2">{entries.map((e, i) => <TreeNode key={i} entry={e} />)}</div>
    </div>
  );
}
