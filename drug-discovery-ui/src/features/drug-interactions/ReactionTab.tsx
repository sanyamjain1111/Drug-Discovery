import { useState } from 'react'
import ReactionForm, { type ReactionFormState } from './ReactionForm'
import { predictReaction, type ReactionResponse } from '../../services/reactions'
import BadgeIndicator from '../../components/viz/BadgeIndicator'
import MechanismVisualizer from '../../components/viz/MechanismVisualizer'
import EnergyDiagram from '../../components/viz/EnergyDiagram'
import ReactionAnimation from '../../components/three/ReactionAnimation'
import BindingAnimation from '../../components/three/BindingAnimation'

export default function ReactionTab() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [res, setRes] = useState<ReactionResponse | null>(null)

  async function onSubmit(s: ReactionFormState) {
    setLoading(true)
    setError(null)
    setRes(null)
    try {
      const data = await predictReaction({
        reactantA: s.reactantA,
        reactantB: s.reactantB,
        conditions: { temperature: s.temperature, pressure: s.pressure, catalyst: s.catalyst, solvent: s.solvent },
      })
      setRes(data)
    } catch (e: any) {
      setError(e?.message || 'Network error')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <ReactionForm onSubmit={onSubmit} />

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-200">Reaction Prediction</div>
          {loading && <div className="animate-pulse text-xs text-slate-400">Predicting…</div>}
        </div>
        {error && <div className="mt-2 text-sm text-rose-400">{error}</div>}
        {res && (
          <div className="mt-3 space-y-3">
            <div className="text-slate-200">Equation: {res.equation}</div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                <div className="text-sm font-medium text-slate-200">Products</div>
                <ul className="mt-2 space-y-1">
                  {res.products.map((p, i) => (
                    <li key={i} className="flex items-center justify-between text-sm text-slate-300">
                      <span>{p.name}{p.byproduct ? ' (byproduct)' : ''}</span>
                      <span className="text-xs text-slate-400">{p.confidence}%</span>
                    </li>
                  ))}
                </ul>
                {res.heuristic && <div className="mt-2 text-[10px] rounded bg-yellow-500/20 px-2 py-0.5 text-yellow-300 inline-block">Heuristic</div>}
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                <div className="text-sm font-medium text-slate-200">Yield & Energy</div>
                <div className="mt-2 text-sm text-slate-300">Estimated yield: {res.yieldPercent}%</div>
                <EnergyDiagram mode={res.energyChange} />
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between">
                  <span className="text-sm font-medium text-slate-200">Mechanism (step-by-step)</span>
                  <span className="text-xs text-slate-500 group-open:hidden">expand</span>
                  <span className="hidden text-xs text-slate-500 group-open:block">collapse</span>
                </summary>
                <div className="mt-2">
                  <MechanismVisualizer steps={res.mechanismSteps} />
                </div>
              </details>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <div className="text-sm font-medium text-slate-200">Reaction Animation</div>
              <div className="mt-2">
                <ReactionAnimation a="aspirin" b="caffeine" />
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3">
              <div className="text-sm font-medium text-slate-200">Drug–Protein Binding</div>
              <div className="mt-2">
                <BindingAnimation drug="aspirin" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
