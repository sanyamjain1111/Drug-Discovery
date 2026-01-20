export default function ProgressPanel({ total, current, etaSec, onCancel }: { total: number; current: number; etaSec: number; onCancel: () => void }) {
  const pct = Math.min(100, Math.round((current / Math.max(1, total)) * 100))
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-200">Generation Progress</div>
        <button className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-200 hover:bg-slate-800" onClick={onCancel}>Cancel</button>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded bg-slate-800">
        <div className="h-full bg-bluepro transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 text-xs text-slate-400">Generating molecule {current}/{total}… • ETA ~{Math.max(0, etaSec)}s</div>
    </div>
  )
}
