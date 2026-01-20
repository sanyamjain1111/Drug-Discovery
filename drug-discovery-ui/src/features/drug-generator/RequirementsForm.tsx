import { useState } from 'react'

export type Requirements = {
  target: string
  customTarget?: string  // For user-defined diseases/proteins
  targetType?: 'preset' | 'custom'  // Track if it's preset or custom
  properties: { toxicityLow: boolean; solubilityHigh: boolean; bbbNo: boolean; ro5Yes: boolean }
  constraints: { mwMin?: number; mwMax?: number; groups?: string }
  count: 10 | 50 | 100
  strategy: 'genetic' | 'transformer' | 'rnn' | 'graph-ml'
}

const presetTargets = [
  { name: 'SARS-CoV-2 Mpro', category: 'Viral' },
  { name: 'EGFR', category: 'Cancer' },
  { name: 'KRAS G12C', category: 'Cancer' },
  { name: 'HIV-1 RT', category: 'Viral' },
  { name: 'TNF-α', category: 'Inflammation' },
  { name: 'ACE2', category: 'Viral' },
]

const diseaseCategories = [
  'Cancer',
  'Viral',
  'Bacterial',
  'Inflammation',
  'Neurological',
  'Cardiovascular',
  'Metabolic',
  'Custom'
]

export default function RequirementsForm({ onSubmit }: { onSubmit: (r: Requirements) => void }) {
  const [r, setR] = useState<Requirements>({
    target: presetTargets[0].name,
    targetType: 'preset',
    properties: { toxicityLow: true, solubilityHigh: true, bbbNo: false, ro5Yes: true },
    constraints: {},
    count: 10,
    strategy: 'transformer',
  })
  const [showCustomInput, setShowCustomInput] = useState(false)

  function set<K extends keyof Requirements>(k: K, v: Requirements[K]) { setR((prev) => ({ ...prev, [k]: v })) }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
      {/* Target Selection */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-slate-200">Target Selection</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Preset Targets */}
          <div>
            <label className="block text-xs text-slate-400 mb-2">Preset Targets</label>
            <select 
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" 
              value={r.targetType === 'preset' ? r.target : ''}
              onChange={(e) => {
                set('target', e.target.value)
                set('targetType', 'preset')
                setShowCustomInput(false)
              }}
            >
              <option value="">Choose a preset...</option>
              {presetTargets.map((t) => (
                <option key={t.name} value={t.name}>{t.name} ({t.category})</option>
              ))}
            </select>
          </div>

          {/* Custom Target Input */}
          <div>
            <label className="block text-xs text-slate-400 mb-2">Or Enter Custom</label>
            <input 
              type="text"
              placeholder="e.g., PD-L1, Alzheimer's amyloid-β"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-600"
              value={r.customTarget || ''}
              onChange={(e) => {
                const val = e.target.value
                set('customTarget', val)
                if (val) {
                  set('target', val)
                  set('targetType', 'custom')
                }
              }}
            />
            {r.targetType === 'custom' && r.customTarget && (
              <div className="mt-2 text-xs text-emerald-400">✓ Custom target: {r.customTarget}</div>
            )}
          </div>
        </div>
      </div>

      {/* Generation Strategy */}
      <div>
        <label className="block text-xs text-slate-400 mb-2">Generation Strategy</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { id: 'transformer', label: 'Transformer', desc: 'SMILES-based' },
            { id: 'graph-ml', label: 'Graph ML', desc: 'Graph networks' },
            { id: 'genetic', label: 'Genetic', desc: 'Evolutionary' },
            { id: 'rnn', label: 'RNN', desc: 'Recurrent' },
          ].map(({ id, label, desc }) => (
            <button
              key={id}
              onClick={() => set('strategy', id as any)}
              className={`rounded-lg border-2 p-3 text-center transition-all ${
                r.strategy === id
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300'
                  : 'border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600'
              }`}
            >
              <div className="text-sm font-medium">{label}</div>
              <div className="text-xs text-slate-500">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Desired Properties */}
      <div>
        <label className="block text-xs text-slate-400 mb-3">Desired Properties</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { key: 'toxicityLow', label: '🔍 Low Toxicity' },
            { key: 'solubilityHigh', label: '💧 High Solubility' },
            { key: 'bbbNo', label: '🧠 No BBB Penetration' },
            { key: 'ro5Yes', label: '✓ Lipinski Ro5' },
          ].map(({ key, label }) => (
            <label key={key} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 cursor-pointer hover:bg-slate-800/50 transition-colors">
              <input 
                type="checkbox" 
                checked={(r.properties as any)[key]}
                onChange={(e) => set('properties', { ...r.properties, [key]: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-slate-200">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Molecular Weight Constraints */}
      <div>
        <label className="block text-xs text-slate-400 mb-2">Molecular Weight (Da)</label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input 
              type="number" 
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" 
              placeholder="Min (e.g., 250)" 
              onChange={(e) => set('constraints', { ...r.constraints, mwMin: e.target.value ? Number(e.target.value) : undefined })} 
            />
          </div>
          <div>
            <input 
              type="number" 
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" 
              placeholder="Max (e.g., 500)" 
              onChange={(e) => set('constraints', { ...r.constraints, mwMax: e.target.value ? Number(e.target.value) : undefined })} 
            />
          </div>
        </div>
      </div>

      {/* Specific Functional Groups */}
      <div>
        <label className="block text-xs text-slate-400 mb-2">Required Functional Groups (optional)</label>
        <input 
          type="text"
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100" 
          placeholder="e.g., amide, pyridine, carboxylic acid" 
          onChange={(e) => set('constraints', { ...r.constraints, groups: e.target.value })} 
        />
        <div className="mt-1 text-xs text-slate-500">Comma-separated list of functional groups</div>
      </div>

      {/* Candidate Count */}
      <div>
        <label className="block text-xs text-slate-400 mb-2">Number of Candidates to Generate</label>
        <div className="grid grid-cols-3 gap-2">
          {[10, 50, 100].map((count) => (
            <button
              key={count}
              onClick={() => set('count', count as any)}
              className={`rounded-lg border-2 py-2 font-medium transition-all ${
                r.count === count
                  ? 'border-teal-500 bg-teal-500/10 text-teal-300'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4 border-t border-slate-700">
        <button 
          className="rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl hover:brightness-110 transition-all disabled:opacity-50"
          onClick={() => onSubmit(r)}
          disabled={!r.target}
        >
          🧬 Generate Novel Molecules
        </button>
      </div>
    </div>
  )
}
