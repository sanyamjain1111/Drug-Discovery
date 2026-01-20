import { useEffect, useState } from 'react'

interface GaugeProps {
  value?: number // 0-100
  label?: string
  color?: 'green' | 'yellow' | 'red'
}

export default function Gauge({ value = 0, label = 'Score', color = 'yellow' }: GaugeProps) {
  const target = Math.max(0, Math.min(100, value))
  const [animated, setAnimated] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const initial = animated
    const delta = target - initial
    const duration = 600
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setAnimated(initial + delta * eased)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  const angle = animated * 1.8 // 0..180deg
  const colorMap: Record<string, string> = {
    green: '#22c55e',
    yellow: '#f59e0b',
    red: '#ef4444',
  }
  const col = colorMap[color]

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-28 w-56">
        <div
          className="absolute inset-0 rounded-b-[140px]"
          style={{
            background: `conic-gradient(${col} ${angle}deg, rgba(15,23,42,.8) ${angle}deg 180deg)`,
            mask: 'linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)',
            WebkitMask: 'linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)',
            padding: '8px',
            borderBottomLeftRadius: '140px',
            borderBottomRightRadius: '140px',
            clipPath: 'inset(0 0 50% 0)',
          }}
        />
        <div className="absolute inset-0 rounded-b-[140px] bg-slate-900" style={{ clipPath: 'inset(0 0 50% 0)' }} />
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          <div className="text-2xl font-semibold transition-colors">{Math.round(animated)}</div>
        </div>
      </div>
      <div className="mt-2 text-sm text-slate-300">{label}</div>
    </div>
  )
}
