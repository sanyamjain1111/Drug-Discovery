import { useState } from 'react'

export type RetroConstraints = { time?: string; cost?: string; safety?: string }

export default function RetroInputForm({ onRun }: { onRun: (target: string, constraints: RetroConstraints, starting?: string[]) => void }) {
  const [target, setTarget] = useState('Aspirin')
  const [constraints, setConstraints] = useState<RetroConstraints>({ time: 'standard', cost: 'medium', safety: 'standard' })
  const [starting, setStarting] = useState('')

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-xs text-slate-400">Target molecule</label>
          <input className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Name or SMILES" />
        </div>
        <div>
          <label className="block text-xs text-slate-400">Preferred starting materials (optional)</label>
          <input className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" value={starting} onChange={(e) => setStarting(e.target.value)} placeholder="comma-separated" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <label className="text-xs text-slate-400">Time
            <select className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-2 text-slate-100" value={constraints.time} onChange={(e) => setConstraints({ ...constraints, time: e.target.value })}>
              <option value="fast">Fast</option>
              <option value="standard">Standard</option>
              <option value="extended">Extended</option>
            </select>
          </label>
          <label className="text-xs text-slate-400">Cost
            <select className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-2 text-slate-100" value={constraints.cost} onChange={(e) => setConstraints({ ...constraints, cost: e.target.value })}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
          <label className="text-xs text-slate-400">Safety
            <select className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-2 text-slate-100" value={constraints.safety} onChange={(e) => setConstraints({ ...constraints, safety: e.target.value })}>
              <option value="standard">Standard</option>
              <option value="cautious">Cautious</option>
              <option value="stringent">Stringent</option>
            </select>
          </label>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button className="rounded-md bg-tealpro px-4 py-2 text-slate-950 shadow hover:brightness-110" onClick={() => onRun(target, constraints, starting ? starting.split(',').map(s => s.trim()).filter(Boolean) : undefined)}>Plan Synthesis</button>
      </div>
    </div>
  )
}
