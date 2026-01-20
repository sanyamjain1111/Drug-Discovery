import RadarChart from './RadarChart'
import type { Candidate } from './ResultsGallery'

function toRadar(candidate: Candidate) {
  // Mock transform; if real properties exist, map accordingly
  const seed = Math.abs(hash(candidate.smiles)) % 100
  return [
    { label: 'Toxicity (low)', value: 100 - (seed % 100) },
    { label: 'Solubility', value: (seed * 17) % 100 },
    { label: 'Bioavail.', value: (seed * 29) % 100 },
    { label: 'Drug-like', value: (seed * 7) % 100 },
    { label: 'Ro5', value: candidate.score },
  ]
}

export default function ComparePanel({ items, onClose }: { items: Candidate[]; onClose: () => void }) {
  const colors = ['#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444']
  return (
    <div className="fixed inset-0 z-50 bg-black/50 p-4">
      <div className="mx-auto max-w-5xl rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-200">Compare Candidates ({items.length}/4)</div>
          <button className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800" onClick={onClose}>Close</button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {items.map((c, idx) => (
            <div key={c.id} className="rounded border border-slate-800 bg-slate-950 p-3">
              <div className="mb-2 truncate text-xs text-slate-400">{c.smiles}</div>
              <RadarChart data={toRadar(c)} color={colors[idx % colors.length]} />
              <div className="mt-2 text-center text-xs text-slate-300">Score {c.score}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function hash(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i)
  return h
}
