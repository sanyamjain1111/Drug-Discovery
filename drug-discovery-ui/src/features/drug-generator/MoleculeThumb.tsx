export default function MoleculeThumb({ smiles, score }: { smiles: string; score: number }) {
  // Simple placeholder: colored glyph based on hash
  const hue = Math.abs(hash(smiles)) % 360
  return (
    <div className="relative rounded-lg border border-slate-800 bg-slate-950 p-3">
      <div className="mx-auto h-24 w-24 rounded-full" style={{ background: `conic-gradient(hsl(${hue} 70% 50%), hsl(${(hue+60)%360} 70% 50%))` }} />
      <div className="absolute right-2 top-2 rounded bg-slate-900/70 px-1.5 py-0.5 text-[10px] text-slate-200">Score {score}</div>
      <div className="mt-2 truncate text-center text-xs text-slate-400">{smiles}</div>
    </div>
  )
}

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i)
  return h
}
