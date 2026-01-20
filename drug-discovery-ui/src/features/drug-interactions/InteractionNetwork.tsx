import { useEffect, useMemo, useRef } from 'react'
import type { Drug } from './DrugSelector'

export default function InteractionNetwork({ drugs, severity = 'moderate' }: { drugs: Drug[]; severity?: 'mild' | 'moderate' | 'severe' | 'contraindicated' }) {
  const ref = useRef<SVGSVGElement>(null)
  const color = {
    mild: '#22c55e',
    moderate: '#f59e0b',
    severe: '#ef4444',
    contraindicated: '#ef4444',
  }[severity]

  const nodes = useMemo(() => {
    const R = 90
    const cx = 120
    const cy = 120
    const n = Math.max(1, drugs.length)
    return drugs.map((d, i) => {
      const angle = (i / n) * Math.PI * 2
      const x = cx + R * Math.cos(angle)
      const y = cy + R * Math.sin(angle)
      return { id: d.id, name: d.name, x, y }
    })
  }, [drugs])

  return (
    <svg ref={ref} viewBox="0 0 240 240" className="w-full rounded-lg border border-slate-800 bg-slate-950">
      {/* edges */}
      {nodes.length >= 2 && (
        <g>
          {nodes.map((a, i) =>
            nodes.slice(i + 1).map((b) => (
              <line key={`${a.id}-${b.id}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={1.5} opacity={0.6} />
            )),
          )}
        </g>
      )}
      {/* nodes */}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={10} fill="url(#grad)" stroke="#1f2937" />
          <text x={n.x} y={n.y + 20} textAnchor="middle" fontSize="10" fill="#cbd5e1">
            {n.name}
          </text>
        </g>
      ))}
      <defs>
        <radialGradient id="grad">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#14b8a6" />
        </radialGradient>
      </defs>
    </svg>
  )
}
