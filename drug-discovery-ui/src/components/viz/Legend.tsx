export default function Legend({ items }: { items: Array<{ label: string; color: string }> }) {
  if (!items || items.length === 0) return null
  return (
    <div className="pointer-events-auto rounded-md border border-slate-800 bg-slate-900/80 p-2 text-xs text-slate-300 shadow">
      <div className="mb-1 font-medium text-slate-200">Legend</div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: it.color }} />
            <span>{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}