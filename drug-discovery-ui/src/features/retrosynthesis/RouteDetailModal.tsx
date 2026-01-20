import Flowchart from './Flowchart'

export default function RouteDetailModal({ open, onClose, route, criticalSteps, alternatives }: { open: boolean; onClose: () => void; route: any, criticalSteps?: string[], alternatives?: string[] }) {
  if (!open || !route) return null

  function exportProtocol() {
    const steps = (route.steps || route.stepsList || [])
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Protocol ${route.id}</title>
      <style>body{font-family:Arial,Helvetica,sans-serif;color:#111;padding:24px} h1{font-size:20px;margin:0 0 12px} h2{font-size:16px;margin:16px 0 8px} table{border-collapse:collapse;width:100%} td,th{border:1px solid #ccc;padding:6px;font-size:12px}</style>
      </head><body>
      <h1>Lab Protocol – Route ${route.id}</h1>
      <h2>Steps</h2>
      <table><thead><tr><th>#</th><th>Step</th><th>Reagents</th><th>Conditions</th><th>Expected yield</th></tr></thead><tbody>
      ${steps.map((s:any,i:number)=>`<tr><td>${i+1}</td><td>${s.label||''}</td><td>${(route.reagents?.[i]||s.reagents||'')}</td><td>${(route.conditions?.[i]||s.conditions||'')}</td><td>${(s.yield ?? s.yieldPct ?? '')}%</td></tr>`).join('')}
      </tbody></table>
      ${route.warnings?`<h2>Safety</h2><p>${route.warnings}</p>`:''}
      ${route.references?.length?`<h2>References</h2><ul>${route.references.map((r:string)=>`<li>${r}</li>`).join('')}</ul>`:''}
      </body></html>`
    const w = window.open('', '_blank')
    if (w) { w.document.write(html); w.document.close(); w.focus(); w.print(); }
  }

  function exportShoppingCSV() {
    const steps = (route.steps || route.stepsList || [])
    const rows = [['step','label','reagents','conditions','expected_yield'] as string[]]
    steps.forEach((s:any,i:number)=>{
      rows.push([String(i+1), s.label||'', (route.reagents?.[i]||s.reagents||''), (route.conditions?.[i]||s.conditions||''), String(s.yield ?? s.yieldPct ?? '')])
    })
    const csv = rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], {type:'text/csv'})
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `shopping_${route.id}.csv`
    a.click()
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-auto rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-200">Route {route.id} – Detail</div>
          <button className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800" onClick={onClose}>Close</button>
        </div>
        <div className="mt-4 space-y-4">
          <Flowchart steps={route.steps || route.stepsList} />
          <div className="rounded border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300">
            <div className="text-slate-200">Step‑by‑step</div>
            <ol className="mt-2 list-decimal pl-5">
              {(route.steps || route.stepsList || []).map((s: any, idx: number) => (
                <li key={s.id} className="mt-1"><span className="font-medium">{s.label}</span> — Reagents: {route.reagents?.[idx] || '—'}; Conditions: {route.conditions?.[idx] || '—'}; Expected yield: {s.yield ?? '—'}%</li>
              ))}
            </ol>
          </div>
          {(criticalSteps?.length || alternatives?.length) && (
            <div className="rounded border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300">
              <div className="text-slate-200">Analysis</div>
              {criticalSteps?.length ? (<div className="mt-1"><span className="text-slate-400">Critical steps:</span> {criticalSteps.join(', ')}</div>) : null}
              {alternatives?.length ? (<div className="mt-1"><span className="text-slate-400">Alternatives:</span> {alternatives.join('; ')}</div>) : null}
            </div>
          )}
          <div className="rounded border border-slate-800 bg-slate-950 p-3 text-sm text-slate-300">
            <div className="text-slate-200">Safety & References</div>
            <div className="mt-1">Warnings: {route.warnings || '—'}</div>
            <div className="mt-1">Literature: {route.references?.join('; ') || '—'}</div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-md bg-tealpro px-3 py-1.5 text-slate-950" onClick={exportProtocol}>Export Lab Protocol (PDF)</button>
            <button className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-200 hover:bg-slate-800" onClick={exportShoppingCSV}>Export Shopping List (CSV)</button>
            <button className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-200 hover:bg-slate-800">Safety Data Sheets</button>
          </div>
        </div>
      </div>
    </div>
  )
}
