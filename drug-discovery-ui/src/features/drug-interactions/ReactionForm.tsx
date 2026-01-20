import { useState } from 'react'

export type ReactionFormState = {
  reactantA: string
  reactantB: string
  temperature?: string
  pressure?: string
  catalyst?: string
  solvent?: string
}

export default function ReactionForm({ onSubmit }: { onSubmit: (s: ReactionFormState) => void }) {
  const [s, setS] = useState<ReactionFormState>({ reactantA: '', reactantB: '' })

  function set<K extends keyof ReactionFormState>(k: K, v: ReactionFormState[K]) {
    setS((prev) => ({ ...prev, [k]: v }))
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-xs text-slate-400">Reactant A</label>
          <input className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-bluepro focus:outline-none" placeholder="e.g., Benzene" value={s.reactantA} onChange={(e) => set('reactantA', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-slate-400">Reactant B</label>
          <input className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-bluepro focus:outline-none" placeholder="e.g., Bromine" value={s.reactantB} onChange={(e) => set('reactantB', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-slate-400">Temperature</label>
          <input className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-bluepro focus:outline-none" placeholder="e.g., 25 C" value={s.temperature || ''} onChange={(e) => set('temperature', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-slate-400">Pressure</label>
          <input className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-bluepro focus:outline-none" placeholder="e.g., 1 atm" value={s.pressure || ''} onChange={(e) => set('pressure', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-slate-400">Catalyst</label>
          <input className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-bluepro focus:outline-none" placeholder="e.g., FeBr3" value={s.catalyst || ''} onChange={(e) => set('catalyst', e.target.value)} />
        </div>
        <div>
          <label className="block text-xs text-slate-400">Solvent</label>
          <input className="mt-1 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-bluepro focus:outline-none" placeholder="e.g., CCl4" value={s.solvent || ''} onChange={(e) => set('solvent', e.target.value)} />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button className="rounded-md bg-tealpro px-4 py-2 text-slate-950 shadow hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50" disabled={!s.reactantA.trim() || !s.reactantB.trim()} onClick={() => onSubmit(s)}>Predict Reaction</button>
      </div>
    </div>
  )
}
