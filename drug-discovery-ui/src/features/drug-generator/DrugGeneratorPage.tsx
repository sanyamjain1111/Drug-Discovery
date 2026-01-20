import { useEffect, useMemo, useRef, useState } from 'react'
import RequirementsForm, { type Requirements } from './RequirementsForm'
import ProgressPanel from './ProgressPanel'
import ResultsGallery, { type Candidate } from './ResultsGallery'
import { runGeneration } from '../../services/generator'
import MoleculeDetailModal from './MoleculeDetailModal'
import ComparePanel from './ComparePanel'
import ProteinVisualizer from '../../components/three/ProteinVisualizer'
import ReactionAnimation from '../../components/three/ReactionAnimation'

function mockSmiles(seed: number) {
  const bases = ['CC(=O)O', 'c1ccccc1', 'N(C)C(=O)', 'O=C(N)C', 'C#N', 'CCN(CC)CC']
  return bases[seed % bases.length] + String.fromCharCode(65 + (seed % 26))
}

export default function DrugGeneratorPage() {
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState({ total: 0, current: 0, eta: 0 })
  const [list, setList] = useState<Candidate[]>([])
  const [detail, setDetail] = useState<string | null>(null)
  const [compare, setCompare] = useState<string[]>([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [currentTarget, setCurrentTarget] = useState('EGFR')
  const [reactionStep, setReactionStep] = useState(0)
  const timer = useRef<number | null>(null)

  const start = async (req: Requirements) => {
    // Update target name for visualizations
    const targetName = req.customTarget || req.target
    setCurrentTarget(targetName)
    setReactionStep(0)
    
    setList([])
    setRunning(true)
    setProgress({ total: req.count, current: 0, eta: Math.round(req.count * 0.8) })
    // simulate progress while backend works
    let i = 0
    timer.current = window.setInterval(() => {
      i += 1
      setProgress((p) => ({ ...p, current: Math.min(p.total - 1, i), eta: Math.max(0, p.eta - 1) }))
    }, 800) as any
    try {
      const res = await runGeneration(req)
      console.log('Generation result:', res)
      setList(res.generated.map((g, idx) => ({ id: `${Date.now()}-${idx}`, smiles: g.smiles, score: Math.round(g.score) })))
      setProgress({ total: res.generated.length, current: res.generated.length, eta: 0 })
    } catch (e: any) {
      console.error('Generation failed:', e)
      alert(`Error: ${e.message}`)
    }
    setRunning(false)
    if (timer.current) window.clearInterval(timer.current)
    timer.current = null
  }

  const cancel = () => { setRunning(false); if (timer.current) window.clearInterval(timer.current); timer.current = null }

  // Save/Load generation session
  const saveSession = () => {
    const payload = { ts: Date.now(), list, progress }
    localStorage.setItem('generator_session', JSON.stringify(payload))
  }
  const loadSession = () => {
    try {
      const raw = localStorage.getItem('generator_session')
      if (!raw) return
      const obj = JSON.parse(raw)
      setList(obj.list || [])
      setProgress(obj.progress || { total: 0, current: 0, eta: 0 })
    } catch {}
  }

  const exportCSV = () => {
    const headers = ['smiles', 'score']
    const rows = list.map((x) => [x.smiles, x.score].join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `generated_${Date.now()}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-bluepro/10 via-slate-900 to-tealpro/10 p-6">
        <h1 className="text-xl font-semibold">AI Drug Generator</h1>
        <p className="mt-2 max-w-2xl text-slate-300">Design novel molecules from high-level requirements. This is a UI flow; AI backend will be added next.</p>
      </div>

      <RequirementsForm onSubmit={start} />

      {running && (
        <ProgressPanel total={progress.total} current={progress.current} etaSec={progress.eta} onCancel={cancel} />
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">Select up to 4 to compare.</div>
        <div className="flex items-center gap-2">
          <button
            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800 disabled:opacity-50"
            disabled={compare.length === 0}
            onClick={() => setCompareOpen(true)}
          >
            Open Compare ({compare.length})
          </button>
          <button
            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800 disabled:opacity-50"
            disabled={compare.length === 0}
            onClick={() => setCompare([])}
          >
            Clear Compare
          </button>
          <button className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800" onClick={saveSession}>Save</button>
          <button className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800" onClick={loadSession}>Load</button>
          <button className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800" onClick={() => window.print()}>Export PDF</button>
          <button className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800" onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      <ResultsGallery
        items={list}
        selectedIds={compare}
        onToggleSelect={(id) => setCompare((sel) => {
          const exists = sel.includes(id)
          if (exists) return sel.filter((x) => x !== id)
          if (sel.length >= 4) return sel
          return [...sel, id]
        })}
        onToggleFav={(id) => setList((prev) => prev.map((x) => x.id === id ? { ...x, favorite: !x.favorite } : x))}
        onOpen={(id) => setDetail(list.find((x) => x.id === id)?.smiles || null)}
      />

      <MoleculeDetailModal open={!!detail} smiles={detail} onClose={() => setDetail(null)} />
      {compareOpen && (
        <ComparePanel items={list.filter((x) => compare.includes(x.id)).slice(0,4)} onClose={() => setCompareOpen(false)} />
      )}
    </div>
  )
}
