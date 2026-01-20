interface BadgeIndicatorProps {
  label: string
  status?: 'good' | 'caution' | 'poor' | 'unknown'
}

export default function BadgeIndicator({ label, status = 'unknown' }: BadgeIndicatorProps) {
  const map: Record<string, string> = {
    good: 'bg-green-500/20 text-green-300 border-green-600/30',
    caution: 'bg-yellow-500/20 text-yellow-300 border-yellow-600/30',
    poor: 'bg-red-500/20 text-red-300 border-red-600/30',
    unknown: 'bg-slate-700/40 text-slate-300 border-slate-600/40',
  }
  const textMap: Record<string, string> = {
    good: 'Good',
    caution: 'Moderate',
    poor: 'Poor',
    unknown: 'Unknown',
  }
  return (
    <div className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-sm ${map[status]}`}>
      <span className="h-2 w-2 rounded-full bg-current" />
      <span>{label}</span>
      <span className="ml-1 text-xs opacity-75">{textMap[status]}</span>
    </div>
  )
}
