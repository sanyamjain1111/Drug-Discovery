import { useMemo, useRef, useState } from 'react'
import type { Drug } from './DrugSelector'

export type QuantityMap = Record<string, number> // id -> 0..100

export default function MixtureTube({ drugs, quantities, onChange }: { drugs: Drug[]; quantities: QuantityMap; onChange: (q: QuantityMap) => void }) {
  const tubeRef = useRef<SVGSVGElement>(null)
  const colors = useMemo(() => {
    const palette = ['#0ea5e9', '#14b8a6', '#f59e0b', '#ef4444', '#a855f7']
    const map: Record<string, string> = {}
    drugs.forEach((d, i) => (map[d.id] = palette[i % palette.length]))
    return map
  }, [drugs])

  const total = Math.max(1, drugs.reduce((acc, d) => acc + (quantities[d.id] ?? 20), 0))
  const segments = drugs.map((d) => ({ id: d.id, name: d.name, qty: quantities[d.id] ?? 20, color: colors[d.id] }))

  function handleDrag(id: string, delta: number) {
    // adjust a single quantity by delta, clamp 0..100
    const current = quantities[id] ?? 20
    const next = { ...quantities, [id]: Math.max(0, Math.min(100, current - delta)) }
    onChange(next)
  }

  return (
    <div className="flex items-stretch gap-3">
      <svg ref={tubeRef} viewBox="0 0 120 260" className="h-56 w-28 rounded-lg border border-slate-800 bg-slate-950">
        {/* test tube shape */}
        <defs>
          <clipPath id="tube">
            <path d="M30,10 h60 a10,10 0 0 1 10,10 v170 a30,30 0 0 1 -30,30 h-20 a30,30 0 0 1 -30,-30 v-170 a10,10 0 0 1 10,-10 z" />
          </clipPath>
        </defs>
        <rect x="0" y="0" width="120" height="260" fill="#0b1220" />
        <g clipPath="url(#tube)">
          {/* fluid segments stacked from bottom */}
          {(() => {
            let y = 210
            const hTotal = 200
            return segments.map((s, i) => {
              const h = (s.qty / total) * hTotal
              const rect = <rect key={s.id} x={35} y={y - h} width={50} height={h} fill={s.color} opacity="0.8" />
              y -= h
              return rect
            })
          })()}
        </g>
        {/* tube outline */}
        <path d="M30,10 h60 a10,10 0 0 1 10,10 v170 a30,30 0 0 1 -30,30 h-20 a30,30 0 0 1 -30,-30 v-170 a10,10 0 0 1 10,-10 z" fill="none" stroke="#1f2937" strokeWidth="3" />
      </svg>
      <div className="flex-1 space-y-2">
        {segments.map((s) => (
          <div key={s.id} className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-sm" style={{ background: s.color }} />
            <div className="flex-1 text-sm text-slate-200">{s.name}</div>
            <div className="w-40 select-none rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-slate-300">
              {Math.round(s.qty)}%
            </div>
            <div className="flex items-center gap-1">
              <button className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800" onClick={() => handleDrag(s.id, -10)}>▲</button>
              <button className="rounded border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800" onClick={() => handleDrag(s.id, 10)}>▼</button>
            </div>
          </div>
        ))}
        <div className="text-[10px] text-slate-500">Tip: Use ▲/▼ to adjust proportion per salt (drag handles coming later).</div>
      </div>
    </div>
  )
}
