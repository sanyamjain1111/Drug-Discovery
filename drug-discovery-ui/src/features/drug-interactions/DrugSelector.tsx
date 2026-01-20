import { useState } from 'react'
import { classNames } from '../../utils'

export type Drug = { id: string; name: string }

const examples = ['Aspirin', 'Ibuprofen', 'Paracetamol', 'Warfarin', 'Metformin', 'Caffeine', 'Omeprazole']

export default function DrugSelector({ onChange }: { onChange: (drugs: Drug[]) => void }) {
  const [input, setInput] = useState('')
  const [drugs, setDrugs] = useState<Drug[]>([])

  function addDrug(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    if (drugs.length >= 5) return
    if (drugs.find((d) => d.name.toLowerCase() === trimmed.toLowerCase())) return
    const next = [...drugs, { id: `${Date.now()}-${Math.random()}`, name: trimmed }]
    setDrugs(next)
    onChange(next)
    setInput('')
  }

  function removeDrug(id: string) {
    const next = drugs.filter((d) => d.id !== id)
    setDrugs(next)
    onChange(next)
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-200">Select Drugs (2–5)</div>
        <div className="text-xs text-slate-500">Examples below</div>
      </div>
      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-bluepro focus:outline-none"
          placeholder="Add a drug by name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addDrug(input)
          }}
        />
        <button
          className="rounded-md bg-tealpro px-4 py-2 text-slate-950 shadow hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!input.trim() || drugs.length >= 5}
          onClick={() => addDrug(input)}
        >
          Add
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        {drugs.map((d) => (
          <div key={d.id} className="group flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2">
            <div className="h-3 w-3 rounded-full gradient-brand" />
            <div className="text-sm text-slate-200">{d.name}</div>
            <button className="ml-2 text-xs text-slate-400 hover:text-red-400" onClick={() => removeDrug(d.id)} title="Remove">
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-slate-400">Examples:</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button key={ex} className="card-hover rounded-md border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs text-slate-200" onClick={() => addDrug(ex)}>{ex}</button>
        ))}
      </div>
    </div>
  )
}
