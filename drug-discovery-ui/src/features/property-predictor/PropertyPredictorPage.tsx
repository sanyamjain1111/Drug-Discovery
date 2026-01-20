import { useRef, useState, useEffect } from 'react'
import MoleculeInput from '../../components/molecules/MoleculeInput'
import Gauge from '../../components/viz/Gauge'
import ProgressBar from '../../components/viz/ProgressBar'
import BadgeIndicator from '../../components/viz/BadgeIndicator'
import { predictProperties, type PropertyPrediction } from '../../services/properties'
import MoleculeViewer from '../../components/three/MoleculeViewer'
import StructureViewer from '../../components/three/StructureViewer'
import { fetchStructureJSON } from '../../services/structure'
import { explainProperty } from '../../services/explain'
import { analyzeAdmet, type AdmetResponse } from '../../services/admet'
import { enrichWithAIStructure, type StructureGenerationResponse } from '../../services/structureGeneration'

export default function PropertyPredictorPage() {
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAILoading] = useState(false)
  const [hasResults, setHasResults] = useState(false)
  const [pred, setPred] = useState<PropertyPrediction | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [remoteStruct, setRemoteStruct] = useState<any | null>(null)
  const [aiStructure, setAIStructure] = useState<StructureGenerationResponse | null>(null)
  const [structureSource, setStructureSource] = useState<'direct' | 'ai' | 'database'>('database')
  const inputRef = useRef<{ mode: string; value: string }>({ mode: 'name', value: '' })
  const [heuristic, setHeuristic] = useState<boolean>(false)
  const [history, setHistory] = useState<Array<{ ts: number; molecule: string; smiles?: string; predictions: PropertyPrediction; heuristic?: boolean }>>(() => {
    try {
      const raw = localStorage.getItem('property_history')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [admet, setAdmet] = useState<AdmetResponse | null>(null)

  async function onPredict() {
    console.log('[PropertyPredictor] onPredict click')
    setLoading(true)
    setHasResults(false)
    setError(null)
    setPred(null)
    setAIStructure(null)
    try {
      let smiles = inputRef.current.mode === 'smiles' ? inputRef.current.value : undefined
      const moleculeName = inputRef.current.value || 'Unknown'

      // If no SMILES provided, try to generate via AI
      if (!smiles) {
        console.log('[PropertyPredictor] No SMILES provided, attempting AI generation...')
        setAILoading(true)
        try {
          const enrichedData = await enrichWithAIStructure(moleculeName)
          if (enrichedData.smiles) {
            smiles = enrichedData.smiles
            setStructureSource(enrichedData.source)
            if (enrichedData.source === 'ai') {
              setAIStructure(enrichedData.metadata as any)
            }
            console.log('[PropertyPredictor] Generated SMILES via AI:', smiles)
          }
        } catch (e) {
          console.warn('[PropertyPredictor] AI structure generation failed, continuing without SMILES', e)
        } finally {
          setAILoading(false)
        }
      } else {
        setStructureSource('direct')
      }

      const payload = {
        molecule: moleculeName,
        ...(smiles && { smiles })
      }
      
      console.log('[PropertyPredictor] payload', payload)
      const res = await predictProperties(payload)
      console.log('[PropertyPredictor] result', res)
      
      if (!res.success || !res.predictions) {
        setError(res.error || 'Unable to analyze molecule.')
      } else {
        setPred(res.predictions)
        setHeuristic(!!(res as any).heuristic)
        setHasResults(true)
        analyzeAdmet(payload).then(setAdmet).catch(() => setAdmet(null))
        const entry = { ts: Date.now(), molecule: (res as any).molecule || payload.molecule, smiles: (res as any).smiles || smiles, predictions: res.predictions, heuristic: !!(res as any).heuristic }
        const next = [entry, ...history].slice(0, 20)
        setHistory(next)
        try { localStorage.setItem('property_history', JSON.stringify(next)) } catch {}
      }
    } catch (e: any) {
      console.error('[PropertyPredictor] error', e)
      setError(e?.message || 'Network error')
    }
    setLoading(false)
  }

  useEffect(() => {
    const q = inputRef.current.value?.trim()
    if (!q) { setRemoteStruct(null); return }
    // try fetch remote 3D if preset not found
    const key = (q || '').toLowerCase()
    const hasPreset = ['aspirin', 'caffeine'].includes(key)
    if (hasPreset) { setRemoteStruct(null); return }
    let alive = true
    fetchStructureJSON(q).then((d) => { if (alive) setRemoteStruct(d) }).catch(() => { if (alive) setRemoteStruct(null) })
    return () => { alive = false }
  }, [inputRef.current.value])

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-purple-50 p-6">
        <h1 className="text-3xl font-bold text-slate-900">Molecular Property Predictor</h1>
        <p className="mt-2 max-w-2xl text-slate-600">Provide a molecule and preview predicted properties. This is a UI preview; computations will be added later.</p>
      </div>

      {admet && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">ADMET Summary</h2>
            <button className="text-xs text-sky-600 hover:text-sky-700 font-medium transition-colors" onClick={() => {
              const blob = new Blob([JSON.stringify(admet, null, 2)], { type: 'application/json' })
              const a = document.createElement('a')
              a.href = URL.createObjectURL(blob)
              a.download = `admet_${Date.now()}.json`
              a.click()
            }}>Export Report</button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Overall</div>
              <div className="mt-2 text-sm text-slate-700">{admet.overallAssessment || '—'}</div>
              <div className="mt-1 text-xs text-slate-600">Regulatory: {admet.regulatoryOutlook || '—'}</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Absorption</div>
              <div className="mt-2 text-sm text-slate-700">HIA: {admet.absorption?.hia != null ? Math.round(admet.absorption.hia * 100) + '%' : '—'}</div>
              <div className="mt-1 text-sm text-slate-700">Caco-2: {admet.absorption?.caco2 ?? '—'}</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Distribution</div>
              <div className="mt-2 text-sm text-slate-700">BBB: {admet.distribution?.bbb ? 'Likely' : 'Unlikely'}</div>
              <div className="mt-1 text-sm text-slate-700">PPB: {admet.distribution?.ppb != null ? Math.round(admet.distribution.ppb * 100) + '%' : '—'}</div>
            </div>
          </div>
        </div>
      )}

      {aiStructure && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-emerald-900">✨ AI-Generated Molecular Structure</h2>
              <p className="mt-1 text-sm text-emerald-700">This structure was automatically generated using AI since a direct database entry was not available.</p>
            </div>
            <button className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors" onClick={() => {
              const blob = new Blob([JSON.stringify(aiStructure, null, 2)], { type: 'application/json' })
              const a = document.createElement('a')
              a.href = URL.createObjectURL(blob)
              a.download = `structure_${Date.now()}.json`
              a.click()
            }}>Export</button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {aiStructure.molecularFormula && (
              <div className="rounded-lg bg-white border border-emerald-200 p-3">
                <div className="text-xs font-semibold text-slate-600">Molecular Formula</div>
                <div className="mt-2 text-sm font-mono text-emerald-900">{aiStructure.molecularFormula}</div>
              </div>
            )}
            {aiStructure.iupacName && (
              <div className="rounded-lg bg-white border border-emerald-200 p-3">
                <div className="text-xs font-semibold text-slate-600">IUPAC Name</div>
                <div className="mt-2 text-sm text-emerald-900">{aiStructure.iupacName}</div>
              </div>
            )}
            {aiStructure.smiles && (
              <div className="rounded-lg bg-white border border-emerald-200 p-3">
                <div className="text-xs font-semibold text-slate-600">SMILES</div>
                <div className="mt-2 text-xs font-mono text-emerald-900 break-all">{aiStructure.smiles}</div>
              </div>
            )}
            {aiStructure.confidence && (
              <div className="rounded-lg bg-white border border-emerald-200 p-3">
                <div className="text-xs font-semibold text-slate-600">AI Confidence</div>
                <div className="mt-2 text-sm font-semibold text-emerald-900">{Math.round(aiStructure.confidence * 100)}%</div>
              </div>
            )}
          </div>
          {aiStructure.description && (
            <div className="mt-4 rounded-lg bg-white border border-emerald-200 p-3">
              <div className="text-xs font-semibold text-slate-600">Description</div>
              <div className="mt-2 text-sm text-slate-700">{aiStructure.description}</div>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left: Molecule Input */}
        <div className="md:col-span-1">
          <MoleculeInput
            onChange={(mode, value) => {
              inputRef.current = { mode, value }
            }}
          />
        </div>

        {/* Middle: Actions */}
        <div className="md:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Analysis</h3>
              {loading && <div className="animate-pulse text-xs text-sky-600 font-medium">Analyzing…</div>}
            </div>
            <p className="text-sm text-slate-600 mb-6">Click the button below to generate property predictions</p>
            
            <div className="space-y-3 flex-1">
              <button
                className="w-full rounded-lg bg-gradient-to-r from-sky-600 to-purple-600 px-4 py-3 text-white font-semibold shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                onClick={onPredict}
                disabled={loading || aiLoading}
              >
                {loading ? 'Predicting…' : aiLoading ? 'Generating Structure…' : 'Predict Properties'}
              </button>
              <button
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 font-medium hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                onClick={() => { setHasResults(false); setPred(null); setError(null); setAIStructure(null) }}
                disabled={loading || aiLoading}
              >
                Reset
              </button>
              <button
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 font-medium hover:bg-slate-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                onClick={() => window.print()}
                disabled={loading || !hasResults || aiLoading}
                title="Export this page to PDF via print"
              >
                Export PDF
              </button>
            </div>

            {(loading || aiLoading) && (
              <div className="mt-6 flex items-center gap-3 text-slate-600">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v3M12 18v3M4.22 4.22l2.12 2.12M15.66 15.66l2.12 2.12M3 12h3M18 12h3M4.22 19.78l2.12-2.12M15.66 8.34l2.12-2.12" />
                </svg>
                <span className="text-sm">{aiLoading ? 'Generating structure with AI…' : 'Running analysis…'}</span>
              </div>
            )}
            {error && <div className="mt-4 text-sm text-rose-600 font-medium">{error}</div>}
            {aiStructure && (
              <div className="mt-4 text-xs bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-800">
                <div className="font-semibold mb-1">✨ AI-Generated Structure</div>
                <div>Formula: {aiStructure.molecularFormula}</div>
                {aiStructure.confidence && <div>Confidence: {Math.round(aiStructure.confidence * 100)}%</div>}
              </div>
            )}
          </div>
        </div>

        {/* Right: 3D Viewer */}
        <div className="md:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-white p-6 h-full overflow-hidden">
            {remoteStruct ? (
              <StructureViewer data={remoteStruct} />
            ) : (
              <MoleculeViewer name={inputRef.current.value} />
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Results Dashboard</h2>
          {!hasResults && <span className="text-sm text-slate-500 font-medium">No results yet</span>}
        </div>

        {hasResults ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
              <Gauge
                value={hasResults ? (pred?.toxicity.score ?? 0) : 0}
                label="Toxicity Score"
                color={hasResults ? (pred?.toxicity.level === 'low' ? 'green' : pred?.toxicity.level === 'high' ? 'red' : 'yellow') : 'yellow'}
              />
              <div className="mt-2 text-xs text-slate-400">Lower is better</div>
              {hasResults && (
                <div className="mt-2 text-xs text-slate-400">{pred?.toxicity.explanation}</div>
              )}
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <button className="text-xs text-sky-600 hover:text-sky-700 font-medium" onClick={async () => {
                  if (!pred) return
                  const r = await explainProperty({ molecule: inputRef.current.value || 'Molecule', property: 'toxicity', context: JSON.stringify(pred.toxicity) })
                  if (r.success) alert(r.text)
                }}>Explain</button>
                {heuristic && <span className="text-[10px] rounded bg-amber-100 px-2 py-1 text-amber-700 font-medium">Heuristic</span>}
                <span className="text-[10px] text-slate-500">FDA avg: ~40</span>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-semibold text-slate-900">Solubility</h3>
              <div className="mt-4">
                <ProgressBar value={hasResults ? (pred?.solubility.score ?? 0) : 0} color={hasResults ? ((pred?.solubility.score ?? 0) > 66 ? 'green' : (pred?.solubility.score ?? 0) > 33 ? 'yellow' : 'red') : 'yellow'} />
                <div className="mt-3 text-sm text-slate-600">Aqueous solubility estimate</div>
                {hasResults && (
                  <div className="mt-1 text-sm text-slate-700">{pred?.solubility.details}</div>
                )}
                <div className="mt-3 flex items-center gap-2">
                  <button className="text-xs text-sky-600 hover:text-sky-700 font-medium" onClick={async () => {
                    if (!pred) return
                    const r = await explainProperty({ molecule: inputRef.current.value || 'Molecule', property: 'solubility', context: JSON.stringify(pred.solubility) })
                    if (r.success) alert(r.text)
                  }}>Explain</button>
                  <span className="text-[10px] text-slate-500">FDA avg: 60</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-semibold text-slate-900">Drug-likeness</h3>
              <div className="mt-4">
                <BadgeIndicator label="Drug-likeness" status={hasResults ? (pred?.drugLikeness.passes ? 'good' : 'poor') : 'unknown'} />
                <div className="mt-3 text-sm text-slate-600">Color-coded overview</div>
                <div className="mt-3 flex items-center gap-2">
                  <button className="text-xs text-sky-600 hover:text-sky-700 font-medium" onClick={async () => {
                    if (!pred) return
                    const r = await explainProperty({ molecule: inputRef.current.value || 'Molecule', property: 'drug-likeness', context: JSON.stringify(pred.drugLikeness) })
                    if (r.success) alert(r.text)
                  }}>Explain</button>
                  <span className="text-[10px] text-slate-500">Confidence: {hasResults ? ((pred?.drugLikeness.score ?? 0) > 70 ? 'high' : (pred?.drugLikeness.score ?? 0) > 40 ? 'medium' : 'low') : '—'}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-semibold text-slate-900">Bioavailability</h3>
              <div className="mt-4">
                <BadgeIndicator label="Oral bioavailability" status={hasResults ? ((pred?.bioavailability.percentage ?? 0) > 66 ? 'good' : (pred?.bioavailability.percentage ?? 0) > 33 ? 'caution' : 'poor') : 'unknown'} />
                <div className="mt-3 text-sm text-slate-600">Preliminary indicator</div>
                {hasResults && <div className="mt-1 text-sm text-slate-700 font-semibold">{pred?.bioavailability.percentage}%</div>}
                <div className="mt-3 flex items-center gap-2">
                  <button className="text-xs text-sky-600 hover:text-sky-700 font-medium" onClick={async () => {
                    if (!pred) return
                    const r = await explainProperty({ molecule: inputRef.current.value || 'Molecule', property: 'bioavailability', context: JSON.stringify(pred.bioavailability) })
                    if (r.success) alert(r.text)
                  }}>Explain</button>
                  <span className="text-[10px] text-slate-500">FDA avg: ~50%</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-semibold text-slate-900">BBB Penetration</h3>
              <div className="mt-4">
                <BadgeIndicator label="Blood-brain barrier" status={hasResults ? (pred?.bbbPenetration.canCross ? 'caution' : 'good') : 'unknown'} />
                <div className="mt-3 text-sm text-slate-600">Likelihood indicator</div>
                {hasResults && (
                  <div className="mt-1 text-sm text-slate-700">Confidence: {pred?.bbbPenetration.confidence}</div>
                )}
                <div className="mt-3">
                  <button className="text-xs text-sky-600 hover:text-sky-700 font-medium" onClick={async () => {
                    if (!pred) return
                    const r = await explainProperty({ molecule: inputRef.current.value || 'Molecule', property: 'bbb penetration', context: JSON.stringify(pred.bbbPenetration) })
                    if (r.success) alert(r.text)
                  }}>Explain</button>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h3 className="text-sm font-semibold text-slate-900">Lipinski's Rule of Five</h3>
              <div className="mt-4 space-y-3">
                <BadgeIndicator label="Ro5" status={hasResults ? (pred?.lipinskiRules.passes ? 'good' : 'poor') : 'unknown'} />
                <div className="text-sm text-slate-700">Violations: {hasResults ? ((pred?.lipinskiRules.violations?.length ?? 0) === 0 ? 'None' : pred?.lipinskiRules.violations.join(', ')) : '—'}</div>
                <div className="mt-2">
                  <button className="text-xs text-sky-600 hover:text-sky-700 font-medium" onClick={async () => {
                    if (!pred) return
                    const r = await explainProperty({ molecule: inputRef.current.value || 'Molecule', property: 'lipinski rules', context: JSON.stringify(pred.lipinskiRules) })
                    if (r.success) alert(r.text)
                  }}>Explain</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 font-medium">Run an analysis to see results</p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">Result History</h3>
          <button className="text-xs text-rose-600 hover:text-rose-700 font-medium transition-colors" onClick={() => { setHistory([]); localStorage.removeItem('property_history') }}>Clear</button>
        </div>
        <div className="divide-y divide-slate-200">
          {history.length === 0 && <div className="py-4 text-sm text-slate-500 text-center">No history yet</div>}
          {history.map((h, idx) => (
            <div key={idx} className="flex items-center justify-between py-3">
              <div className="text-sm text-slate-700">
                <span className="font-medium">{h.molecule}</span>
                <span className="text-slate-500 ml-2">{new Date(h.ts).toLocaleString()}</span>
                {h.heuristic && <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded font-medium">heuristic</span>}
              </div>
              <button className="text-xs text-sky-600 hover:text-sky-700 font-medium transition-colors" onClick={() => { setPred(h.predictions); setHasResults(true); setHeuristic(!!h.heuristic) }}>Load</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}