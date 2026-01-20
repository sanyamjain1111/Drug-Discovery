import { useEffect, useMemo, useState } from 'react'
import DrugSelector, { type Drug } from './DrugSelector'
import InteractionNetwork from './InteractionNetwork'
import ReactionTab from './ReactionTab'
import BadgeIndicator from '../../components/viz/BadgeIndicator'
import { analyzeInteractions, type InteractionResponse } from '../../services/interactions'
import MixtureTube, { type QuantityMap } from './MixtureTube'

const mockAnalyze = (drugs: Drug[]) => {
  const types = ['synergistic', 'antagonistic', 'additive', 'none'] as const
  const severities = ['mild', 'moderate', 'severe', 'contraindicated'] as const
  const systems = ['Cardiovascular', 'CNS', 'GI', 'Hepatic', 'Renal']
  const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)]
  const interactionType = pick(types)
  const severity = pick(severities)
  return {
    safety: severity === 'mild' || interactionType === 'none' ? 'Safe' : 'Caution',
    interactionType,
    severity,
    mechanism: `Mock explanation about ${drugs.map((d) => d.name).join(' + ')} mechanism and potential pathways involved.`,
    systems: systems.sort(() => 0.5 - Math.random()).slice(0, 2),
    recommendations: [
      'Monitor patient response closely.',
      'Adjust dosing if adverse effects occur.',
      'Consider spacing administration times.',
    ],
    alternatives: ['AltDrug A', 'AltDrug B', 'AltDrug C'],
  }
}

export default function DrugInteractionPage() {
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [result, setResult] = useState<InteractionResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<QuantityMap>({})
  const [history, setHistory] = useState<Array<{ ts: number; drugs: string[]; result: InteractionResponse }>>(() => {
    try {
      const raw = localStorage.getItem('interaction_history')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const canAnalyze = drugs.length >= 2 && drugs.length <= 5

  async function analyze() {
    if (!canAnalyze) return
    setLoading(true)
    setError(null)
    try {
      const res = await analyzeInteractions(drugs.map((d) => d.name))
      setResult(res)
      const entry = { ts: Date.now(), drugs: drugs.map((d) => d.name), result: res }
      const next = [entry, ...history].slice(0, 20)
      setHistory(next)
      try { localStorage.setItem('interaction_history', JSON.stringify(next)) } catch {}
    } catch (e: any) {
      setError(e?.message || 'Network error')
    }
    setLoading(false)
  }

  // Real-time analysis as users change selection (debounced)
  useEffect(() => {
    if (!canAnalyze) return
    const t = setTimeout(() => {
      analyze()
    }, 500)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(drugs)])

  const severityStatus: 'good' | 'caution' | 'poor' = useMemo(() => {
    if (!result) return 'unknown' as any
    // derive from worst interaction
    const worst = result.interactions.reduce<'mild' | 'moderate' | 'severe' | 'contraindicated'>((acc, cur) => {
      const order = { mild: 0, moderate: 1, severe: 2, contraindicated: 3 }
      return order[cur.severity] > order[acc] ? cur.severity : acc
    }, 'mild')
    if (worst === 'mild') return 'good'
    if (worst === 'moderate') return 'caution'
    return 'poor'
  }, [result])

  const [tab, setTab] = useState<'interactions' | 'reactions'>('interactions')

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-bluepro/10 via-slate-900 to-tealpro/10 p-6">
        <h1 className="text-xl font-semibold">Drug Interaction Analyzer</h1>
        <p className="mt-2 max-w-2xl text-slate-300">Evaluate potential interactions and predict reactions under specific conditions.</p>
        <div className="mt-4 inline-flex rounded-lg border border-slate-800 bg-slate-900 p-1">
          <button className={`px-3 py-1 text-sm rounded-md ${tab === 'interactions' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white'}`} onClick={() => setTab('interactions')}>Interactions</button>
          <button className={`px-3 py-1 text-sm rounded-md ${tab === 'reactions' ? 'bg-slate-800 text-white' : 'text-slate-300 hover:text-white'}`} onClick={() => setTab('reactions')}>Reactions</button>
        </div>
      </div>

      {tab === 'interactions' && (
      <div className="grid gap-6 md:grid-cols-2">
        <DrugSelector onChange={(list) => {
          setDrugs(list)
          // initialize missing quantities to equal portions
          setQuantities((q) => {
            const next = { ...q }
            const base = list.length ? Math.floor(100 / list.length) : 0
            list.forEach((d) => { if (next[d.id] == null) next[d.id] = base })
            // remove stale
            Object.keys(next).forEach((id) => { if (!list.find((d) => d.id === id)) delete next[id] })
            return next
          })
        }} />
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-slate-200">Visualization</div>
            {loading && <div className="animate-pulse text-xs text-slate-400">Analyzing…</div>}
          </div>
          <div className="mt-3">
            <MixtureTube drugs={drugs} quantities={quantities} onChange={(q) => setQuantities(q)} />
          </div>
          <div className="mt-4">
            <button
              className="rounded-md bg-tealpro px-4 py-2 text-slate-950 shadow hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!canAnalyze || loading}
              onClick={analyze}
            >
              {loading ? 'Analyzing…' : 'Analyze Interaction'}
            </button>
          </div>
          {error && <div className="mt-3 text-sm text-rose-400">{error}</div>}
        </div>
      </div>
      )}

      {tab === 'interactions' && (
      <>
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Results</h2>
          {!result && <span className="text-xs text-slate-400">No results yet</span>}
        </div>

        {result && (
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
              <div className="text-sm font-medium text-slate-200">Safety</div>
              <div className="mt-3">
                <BadgeIndicator label={result.overallSafety} status={severityStatus} />
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
              <div className="text-sm font-medium text-slate-200">Pairwise Interactions</div>
              <div className="mt-3 max-h-40 space-y-2 overflow-auto pr-2">
                {result.interactions.map((ix, i) => (
                  <div key={i} className="rounded border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-slate-300">
                    <div className="font-medium text-slate-200">{ix.drugs.join(' + ')}</div>
                    <div>Type: {ix.type} • Severity: {ix.severity}</div>
                    <div className="opacity-80">{ix.clinicalSignificance}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
              <div className="text-sm font-medium text-slate-200">Severity</div>
              <div className="mt-3 text-slate-300">Worst: {result.interactions.reduce((acc, cur) => {
                const order: any = { mild: 0, moderate: 1, severe: 2, contraindicated: 3 }
                return order[cur.severity] > (order as any)[acc] ? cur.severity : acc
              }, 'mild')}</div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 md:col-span-2">
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between">
                  <span className="text-sm font-medium text-slate-200">Mechanism Explanation</span>
                  <span className="text-xs text-slate-500 group-open:hidden">expand</span>
                  <span className="hidden text-xs text-slate-500 group-open:block">collapse</span>
                </summary>
                <div className="mt-2 space-y-2 text-sm text-slate-300">
                  {result.interactions.map((ix, i) => (
                    <div key={i} className="rounded border border-slate-800 bg-slate-900 p-2">
                      <div className="text-xs text-slate-400">{ix.drugs.join(' + ')}</div>
                      <div>{ix.mechanism}</div>
                    </div>
                  ))}
                </div>
              </details>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
              <div className="text-sm font-medium text-slate-200">Affected Body Systems</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {Array.from(new Set(result.interactions.flatMap((ix) => (ix.mechanism ? ['CNS'] : [])))).map((s) => (
                  <span key={s} className="rounded-md border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
              <div className="text-sm font-medium text-slate-200">Clinical Recommendations</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
                {result.interactions.map((ix, i) => (
                  <li key={i}>{ix.recommendations}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 md:col-span-2">
              <div className="text-sm font-medium text-slate-200">Suggest Safer Alternatives</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.saferAlternatives.map((a) => (
                  <span key={a} className="card-hover rounded-md border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs text-slate-200">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* History */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-200">Interaction History</div>
          <button className="text-xs text-red-300 hover:underline" onClick={() => { setHistory([]); localStorage.removeItem('interaction_history') }}>Clear</button>
        </div>
        <div className="mt-2 divide-y divide-slate-800">
          {history.length === 0 && <div className="py-2 text-xs text-slate-500">No history yet</div>}
          {history.map((h, idx) => (
            <div key={idx} className="flex items-center justify-between py-2">
              <div className="text-xs text-slate-300">{new Date(h.ts).toLocaleString()} – {h.drugs.join(' + ')}</div>
              <button className="text-xs text-blue-300 hover:underline" onClick={() => { setResult(h.result) }}>Load</button>
            </div>
          ))}
        </div>
      </div>
      </>
      )}

      {tab === 'reactions' && (
        <ReactionTab />
      )}
    </div>
  )
}
