import { useEffect, useRef } from 'react'

export default function MechanismVisualizer({ steps = [] as string[] }: { steps: string[] }) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // simple staggered reveal animation
    const nodes = Array.from(container.current?.querySelectorAll('[data-step]') || []) as HTMLElement[]
    nodes.forEach((el, i) => {
      el.style.opacity = '0'
      el.style.transform = 'translateX(-8px)'
      setTimeout(() => {
        el.style.transition = 'opacity 400ms ease, transform 400ms ease'
        el.style.opacity = '1'
        el.style.transform = 'translateX(0)'
      }, i * 200)
    })
  }, [steps])

  return (
    <div ref={container} className="space-y-2">
      {steps.map((s, i) => (
        <div key={i} data-step className="rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-200">
          <span className="mr-2 rounded bg-bluepro/20 px-1.5 py-0.5 text-xs text-blue-200">Step {i + 1}</span>
          {s}
        </div>
      ))}
    </div>
  )
}
