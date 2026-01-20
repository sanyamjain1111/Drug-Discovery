import React, { useState } from 'react'
import RetroInputForm, { type RetroConstraints } from './RetroInputForm'
import Flowchart from './Flowchart'
import ComparisonTable from './ComparisonTable'
import RouteDetailModal from './RouteDetailModal'
import { planRetrosynthesis, type RetroRoute } from '../../services/retro'

function mockRoutes(target: string) {
  const routes = [1,2,3].map((i) => ({
    id: `R${i}`,
    steps: 3 + i,
    yield: 55 + i * 10,
    cost: i === 1 ? 'low' : i === 2 ? 'medium' : 'high',
    time: i === 1 ? 'fast' : i === 2 ? 'standard' : 'extended',
    safety: i === 3 ? 'stringent' : 'standard',
    difficulty: (['green','yellow','red'] as const)[i-1],
    stepsList: [
      { id: 'S1', label: 'Functionalize ring', yield: 70 },
      { id: 'S2', label: 'Coupling', yield: 65 },
      { id: 'S3', label: 'Protection/De‑protection', yield: 80 },
      { id: 'S4', label: 'Final esterification', yield: 75 },
    ].slice(0, 3 + (i-1)),
    reagents: ['Br2, FeBr3', 'Pd(PPh3)4, base', 'Boc2O; TFA', 'H2SO4, ROH'],
    conditions: ['RT', '80°C, 4h', 'RT/ice bath', 'Reflux 2h'],
    warnings: i === 2 ? 'Handle Pd catalysts with care.' : undefined,
    references: ['Smith et al., J. Org. Chem. 2018']
  }))
  return routes
}

export default function RetroPlannerPage() {
  const [routes, setRoutes] = useState<RetroRoute[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  const [meta, setMeta] = useState<any | null>(null)
  const [rankKey, setRankKey] = useState<'shortest'|'cheapest'|'safest'|'none'>('none')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function run(target: string, constraints: RetroConstraints, starting?: string[]) {
    setError(null)
    setLoading(true)
    try {
      const res = await planRetrosynthesis({ target, constraints, starting, routes: 3 })
      if (!res.ok || !res.routes?.length) {
        // fallback to mock if AI fails
        setRoutes(mockRoutes(target))
        setMeta(null)
      } else {
        setRoutes(res.routes as any)
        setMeta(res.meta || null)
        try {
          const payload = { routes: res.routes, meta: res.meta }
          localStorage.setItem('retro_plan', JSON.stringify(payload))
          const q = new URLSearchParams(location.search)
          q.set('plan', btoa(unescape(encodeURIComponent(JSON.stringify(payload)))))
          history.replaceState(null, '', `${location.pathname}?${q.toString()}`)
        } catch {}
      }
    } catch (e: any) {
      setError(e?.message || 'Planning failed');
      setRoutes(mockRoutes(target))
    }
    setLoading(false)
  }

  React.useEffect(() => {
    const q = new URLSearchParams(location.search)
    const plan = q.get('plan')
    if (plan) {
      try {
        const obj = JSON.parse(decodeURIComponent(escape(atob(plan))))
        if (obj.routes) setRoutes(obj.routes)
        if (obj.meta) setMeta(obj.meta)
      } catch {}
    } else {
      const raw = localStorage.getItem('retro_plan')
      if (raw) {
        try { const obj = JSON.parse(raw); setRoutes(obj.routes||[]); setMeta(obj.meta||null) } catch {}
      }
    }
  }, [])

  function rankedRoutes() {
    if (!meta || rankKey==='none') return routes
    const list = meta.rankings?.[rankKey]
    if (!Array.isArray(list) || !list.length) return routes
    const map = new Map(routes.map(r=>[r.id, r]))
    const ordered = list.map((id:string)=>map.get(id)).filter(Boolean) as any[]
    const rest = routes.filter(r=>!list.includes(r.id))
    return [...ordered, ...rest]
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-bluepro/10 via-slate-900 to-tealpro/10 p-6">
        <h1 className="text-xl font-semibold">Retrosynthesis Planner</h1>
        <p className="mt-2 max-w-2xl text-slate-300">Plan multiple synthesis routes with constraints and compare trade‑offs. This is a UI workflow; AI planner will be integrated next.</p>
      </div>

      <RetroInputForm onRun={run} />
      {loading && <div className="text-xs text-slate-400">Planning routes…</div>}
      {error && <div className="text-xs text-rose-400">{error}</div>}

      {routes.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            {rankedRoutes().map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <div className="mb-2 text-sm font-medium text-slate-200">Route {r.id}</div>
                <Flowchart steps={(r as any).steps || (r as any).stepsList} />
                <div className="mt-2 text-right">
                  <button className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800" onClick={() => setSelected(r)}>Open detail</button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <div className="text-sm font-medium text-slate-200">Comparison</div>
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span>Rank by:</span>
                <button className={`rounded border px-2 py-1 ${rankKey==='shortest'?'border-bluepro text-blue-300':'border-slate-700 text-slate-300'}`} onClick={()=>setRankKey('shortest')}>Shortest</button>
                <button className={`rounded border px-2 py-1 ${rankKey==='cheapest'?'border-bluepro text-blue-300':'border-slate-700 text-slate-300'}`} onClick={()=>setRankKey('cheapest')}>Cheapest</button>
                <button className={`rounded border px-2 py-1 ${rankKey==='safest'?'border-bluepro text-blue-300':'border-slate-700 text-slate-300'}`} onClick={()=>setRankKey('safest')}>Safest</button>
                <button className={`rounded border px-2 py-1 ${rankKey==='none'?'border-bluepro text-blue-300':'border-slate-700 text-slate-300'}`} onClick={()=>setRankKey('none')}>Default</button>
              </div>
              <div className="mt-2">
                <ComparisonTable routes={rankedRoutes().map((r:any) => ({ id: r.id, steps: r.steps?.length || 0, yield: Math.round(r.overallYield || 0), cost: r.cost || '-', time: r.time || '-', safety: r.safety || '-', difficulty: (r.difficulty as any) || 'yellow' }))} onOpen={(id) => setSelected(rankedRoutes().find((x:any) => x.id === id))} />
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <div className="text-sm font-medium text-slate-200">Exports</div>
              <div className="mt-2 flex gap-2">
                <button className="rounded-md bg-tealpro px-3 py-1.5 text-slate-950" onClick={()=>{ if(!routes.length) return; const a=document.createElement('a'); const blob=new Blob([JSON.stringify({routes,meta},null,2)],{type:'application/json'}); a.href=URL.createObjectURL(blob); a.download=`retro_plan_${Date.now()}.json`; a.click(); }}>Save Plan</button>
                <button className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-200 hover:bg-slate-800" onClick={()=>{ try{ const q=new URLSearchParams(location.search); const payload={routes,meta}; q.set('plan', btoa(unescape(encodeURIComponent(JSON.stringify(payload))))); navigator.clipboard.writeText(`${location.origin}${location.pathname}?${q.toString()}`); alert('Shareable link copied!')}catch{alert('Unable to copy link')} }}>Share Link</button>
                <button className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-200 hover:bg-slate-800">SDS Pack</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <RouteDetailModal open={!!selected} route={selected} criticalSteps={meta?.criticalSteps?.[selected?.id]} alternatives={meta?.alternatives?.[selected?.id]} onClose={() => setSelected(null)} />
    </div>
  )
}
