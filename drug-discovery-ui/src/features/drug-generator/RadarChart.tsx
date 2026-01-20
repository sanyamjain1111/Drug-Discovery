type RadarDatum = { label: string; value: number }

export default function RadarChart({ data, color = '#0ea5e9' }: { data: RadarDatum[]; color?: string }) {
  const R = 60
  const cx = 75, cy = 75
  const points = data.map((d, i) => {
    const angle = (i / data.length) * Math.PI * 2 - Math.PI / 2
    const r = (Math.max(0, Math.min(100, d.value)) / 100) * R
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)]
  })
  const path = points.map((p, i) => (i === 0 ? 'M' : 'L') + p[0] + ' ' + p[1]).join(' ') + ' Z'

  return (
    <svg viewBox="0 0 150 150" className="w-full">
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#334155" />
      <circle cx={cx} cy={cy} r={R * 0.5} fill="none" stroke="#334155" />
      <circle cx={cx} cy={cy} r={R * 0.25} fill="none" stroke="#334155" />
      {data.map((d, i) => {
        const angle = (i / data.length) * Math.PI * 2 - Math.PI / 2
        const x = cx + R * Math.cos(angle)
        const y = cy + R * Math.sin(angle)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#334155" />
      })}
      <path d={path} fill={color + '33'} stroke={color} />
      {data.map((d, i) => {
        const angle = (i / data.length) * Math.PI * 2 - Math.PI / 2
        const x = cx + (R + 10) * Math.cos(angle)
        const y = cy + (R + 10) * Math.sin(angle)
        return <text key={i} x={x} y={y} fontSize="9" fill="#cbd5e1" textAnchor="middle" dominantBaseline="middle">{d.label}</text>
      })}
    </svg>
  )
}
