import { useRef, useState } from 'react'
import MoleculeInput from '../../components/molecules/MoleculeInput'
import { analyzeDocking } from '../../services/docking'
import DockingViewer from '../../components/three/DockingViewer'

export default function DockingPage() {
  const [proteinSource, setProteinSource] = useState<'pdb_id' | 'url' | 'pdb_text'>('pdb_id')
  const [proteinData, setProteinData] = useState('1CRN')
  const ligandRef = useRef<{ mode: string; value: string }>({ mode: 'name', value: '' })
  const [params, setParams] = useState({ exhaustiveness: 8, numPoses: 10 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any | null>(null)

  async function start() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const body = { proteinSource, proteinData, ligand: ligandRef.current.value || 'Aspirin', params }
      const res = await analyzeDocking(body)
      setResult(res.analysis || null)
    } catch (e: any) {
      setError(e?.message || 'Docking analysis failed')
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-bluepro/10 via-slate-900 to-tealpro/10 p-6">
        <h1 className="text-xl font-semibold">Protein–Drug Docking (Setup)</h1>
        <p className="mt-2 max-w-2xl text-slate-300">Upload or search a protein, provide a drug molecule, and get AI-guided binding site analysis. Detailed docking comes next.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <div>
            <div className="text-sm font-medium text-slate-200">Protein</div>
            <div className="mt-2 flex gap-2">
              <select className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" value={proteinSource} onChange={(e) => setProteinSource(e.target.value as any)}>
                <option value="pdb_id">PDB ID</option>
                <option value="url">URL</option>
                <option value="pdb_text">PDB Text</option>
              </select>
              {proteinSource !== 'pdb_text' ? (
                <input className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" value={proteinData} onChange={(e) => setProteinData(e.target.value)} placeholder={proteinSource === 'pdb_id' ? 'e.g., 1CRN' : 'https://...'} />
              ) : (
                <textarea className="h-40 w-full rounded-md border border-slate-700 bg-slate-900 p-2 text-slate-100" value={proteinData} onChange={(e) => setProteinData(e.target.value)} placeholder="Paste PDB content" />
              )}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-slate-200">Docking Parameters</div>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <label className="text-xs text-slate-400">Exhaustiveness
                <input type="number" min={1} max={64} className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" value={params.exhaustiveness} onChange={(e) => setParams({ ...params, exhaustiveness: Number(e.target.value) })} />
              </label>
              <label className="text-xs text-slate-400"># Poses
                <input type="number" min={1} max={100} className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" value={params.numPoses} onChange={(e) => setParams({ ...params, numPoses: Number(e.target.value) })} />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <MoleculeInput onChange={(mode, value) => { ligandRef.current = { mode, value } }} />
          <button className="rounded-md bg-tealpro px-4 py-2 text-slate-950 shadow hover:brightness-110 disabled:opacity-50" onClick={start} disabled={loading}>
            {loading ? 'Analyzing…' : 'Start Docking'}
          </button>
          {error && <div className="text-sm text-rose-400">{error}</div>}
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
        <div className="text-lg font-semibold">Results</div>
        {!result && <div className="mt-2 text-xs text-slate-400">No results yet.</div>}
        {result && (
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded border border-slate-800 bg-slate-950 p-3">
              <div className="text-sm font-medium text-slate-200">Best Pose Score</div>
              <div className="mt-2 text-2xl">{result.poseScore ?? '—'}</div>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950 p-3">
              <div className="text-sm font-medium text-slate-200">Binding Energy (kcal/mol)</div>
              <div className="mt-2 text-2xl">{result.bindingEnergy ?? '—'}</div>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950 p-3">
              <div className="text-sm font-medium text-slate-200">Affinity/IC50/Ki</div>
              <div className="mt-2 text-sm text-slate-300">Affinity: {result.affinity ?? '—'} μM</div>
              <div className="text-sm text-slate-300">IC50: {result.ic50 ?? '—'} μM</div>
              <div className="text-sm text-slate-300">Ki: {result.ki ?? '—'} μM</div>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950 p-3 md:col-span-2">
              <div className="text-sm font-medium text-slate-200">Preparation Steps</div>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">
                {(result.preparationSteps || []).map((s: string, i: number) => (<li key={i}>{s}</li>))}
              </ul>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950 p-3 md:col-span-2">
              <div className="text-sm font-medium text-slate-200">Binding Sites</div>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                {(result.sites || []).map((s: any) => (
                  <div key={s.id} className="rounded border border-slate-800 bg-slate-900 p-2 text-sm text-slate-300">
                    <div className="font-medium text-slate-200">{s.id}</div>
                    <div className="text-xs text-slate-400">{s.description}</div>
                    <div className="text-xs text-slate-400">Residues: {(s.residues || []).join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950 p-3 md:col-span-2">
              <div className="text-sm font-medium text-slate-200">Interactions</div>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-300">
                {(result.interactions || []).map((i: any, idx: number) => (
                  <li key={idx}>{i.type} — residues: {(i.residues || []).join(', ')} {i.description ? `(${i.description})` : ''} {i.distance ? `, d=${i.distance.toFixed?.(2)||i.distance}Å` : ''} {i.angle ? `, θ=${i.angle.toFixed?.(1)||i.angle}°` : ''}</li>
                ))}
              </ul>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950 p-3">
              <div className="text-sm font-medium text-slate-200">Selectivity & Confidence</div>
              <div className="mt-2 text-sm text-slate-300">{result.selectivityNotes || '—'}</div>
              <div className="text-xs text-slate-400">Confidence: {result.confidence || '—'}</div>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950 p-3 md:col-span-2">
              <div className="text-sm font-medium text-slate-200">Energy Decomposition (AI-est.)</div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-sm text-slate-300">
                <div>vdW: {result.energyDecomposition?.vdw ?? '—'}</div>
                <div>Electrostatic: {result.energyDecomposition?.electrostatic ?? '—'}</div>
                <div>Desolvation: {result.energyDecomposition?.desolvation ?? '—'}</div>
              </div>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950 p-3 md:col-span-2">
              <div className="text-sm font-medium text-slate-200">Top Poses</div>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                {(result.poses || []).slice(0,5).map((p: any) => (
                  <div key={p.id} className="rounded border border-slate-800 bg-slate-900 p-2 text-sm text-slate-300">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-slate-200">Pose {p.id}</div>
                      <div className="text-xs">Score: {p.score} • ΔG: {p.bindingEnergy ?? '—'}</div>
                    </div>
                    <div className="mt-1 text-xs text-slate-400">Residues: {(p.residues || []).join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950 p-3">
              <div className="text-sm font-medium text-slate-200">Compared Known Binders</div>
              <div className="mt-2 text-sm text-slate-300">{(result.comparedBinders || []).join(', ') || '—'}</div>
            </div>
            <div className="rounded border border-slate-800 bg-slate-950 p-3 md:col-span-2">
              <DockingViewer ligand={(ligandRef.current.value || 'Ligand')} interactions={result.interactions || []} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
