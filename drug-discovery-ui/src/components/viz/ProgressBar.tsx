interface ProgressBarProps {
  value?: number // 0-100
  color?: 'green' | 'yellow' | 'red'
  label?: string
}

export default function ProgressBar({ value = 0, color = 'yellow', label }: ProgressBarProps) {
  const colorMap: Record<string, string> = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  }
  return (
    <div>
      {label && <div className="mb-1 text-xs text-slate-400">{label}</div>}
      <div className="h-2 w-full overflow-hidden rounded bg-slate-800">
        <div className={`h-full ${colorMap[color]} transition-all duration-500`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  )
}
