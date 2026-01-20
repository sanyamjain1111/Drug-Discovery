export default function EnergyDiagram({ mode = 'neutral' as 'exothermic' | 'endothermic' | 'neutral' }) {
  // Simple reaction coordinate diagram
  const stroke = '#94a3b8'
  const exo = mode === 'exothermic'
  const endo = mode === 'endothermic'
  return (
    <svg viewBox="0 0 300 160" className="w-full rounded-lg border border-slate-800 bg-slate-950 p-2">
      <defs>
        <linearGradient id="edg" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      {/* axes */}
      <line x1="20" y1="140" x2="280" y2="140" stroke={stroke} strokeWidth="1" />
      <line x1="20" y1="20" x2="20" y2="140" stroke={stroke} strokeWidth="1" />
      {/* curve */}
      {exo && (
        <path d="M20,120 C100,10 200,30 280,90" fill="none" stroke="url(#edg)" strokeWidth="3" />
      )}
      {endo && (
        <path d="M20,80 C100,150 200,130 280,60" fill="none" stroke="url(#edg)" strokeWidth="3" />
      )}
      {!exo && !endo && (
        <path d="M20,100 C100,80 200,100 280,100" fill="none" stroke="url(#edg)" strokeWidth="3" />
      )}
      <text x="10" y="15" fill="#94a3b8" fontSize="10">Energy</text>
      <text x="250" y="155" fill="#94a3b8" fontSize="10">Reaction Coordinate</text>
      <text x="24" y="60" fill="#cbd5e1" fontSize="10">Reactants</text>
      <text x="240" y="115" fill="#cbd5e1" fontSize="10">Products</text>
    </svg>
  )
}
