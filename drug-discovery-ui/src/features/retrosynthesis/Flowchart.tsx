type Step = { id: string; label: string; yield?: number; yieldPct?: number; safety?: 'low'|'moderate'|'high' }

export default function Flowchart({ steps }: { steps?: Step[] }) {
  const list = Array.isArray(steps) ? steps : []
  return (
    <svg viewBox="0 0 600 160" className="w-full rounded-lg border border-slate-800 bg-slate-950">
      {list.map((s, i) => {
        const x = 60 + i * 110
        const y = 60
        return (
          <g key={s.id}>
            <rect x={x} y={y} rx={8} ry={8} width={100} height={48} fill="#0f172a" stroke="#334155" />
            <text x={x + 50} y={y + 20} textAnchor="middle" fontSize="11" fill="#e2e8f0">{s.label}</text>
            <text x={x + 50} y={y + 36} textAnchor="middle" fontSize="9" fill="#94a3b8">{(s.yield ?? s.yieldPct) != null ? `Yield ${(s.yield ?? s.yieldPct)}%` : ''}</text>
            {i < list.length - 1 && (
              <g>
                <line x1={x + 100} y1={y + 24} x2={x + 110} y2={y + 24} stroke="#334155" />
                <polygon points={`${x + 110},${y + 24} ${x + 106},${y + 22} ${x + 106},${y + 26}`} fill="#334155" />
              </g>
            )}
          </g>
        )
      })}
    </svg>
  )
}
