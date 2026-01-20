import { useMemo, useState } from 'react'
import { classNames } from '../../utils'
import Tooltip from '../ui/Tooltip'

export type MoleculeInputMode = 'name' | 'smiles' | 'draw'

const examples = {
  name: ['Aspirin', 'Ibuprofen', 'Paracetamol', 'Caffeine'],
  smiles: [
    'CC(=O)OC1=CC=CC=C1C(=O)O', // Aspirin
    'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O', // Ibuprofen
    'CC(=O)NC1=CC=C(O)C=C1', // Acetanilide-like
    'Cn1cnc2c1n(C)c(=O)n(C)c2=O', // Caffeine
  ],
}

function validateName(value: string) {
  if (!value.trim()) return 'Please enter a molecule name.'
  if (!/^[a-zA-Z0-9\-\s()+.,]+$/.test(value)) return 'Name contains invalid characters.'
  return null
}

function validateSmiles(value: string) {
  if (!value.trim()) return 'Please enter a SMILES string.'
  // Basic sanity checks for SMILES (very loose)
  const basicPattern = /^[A-Za-z0-9@+\-=#()\[\]\\\/%.]+$/
  if (!basicPattern.test(value)) return 'SMILES contains invalid characters.'
  const bracketsBalance = (value.match(/\[/g)?.length || 0) === (value.match(/\]/g)?.length || 0)
  const parenBalance = (value.match(/\(/g)?.length || 0) === (value.match(/\)/g)?.length || 0)
  if (!bracketsBalance || !parenBalance) return 'Unbalanced brackets or parentheses in SMILES.'
  return null
}

export interface MoleculeInputProps {
  className?: string
  onChange?: (mode: MoleculeInputMode, value: string) => void
}

export default function MoleculeInput({ className, onChange }: MoleculeInputProps) {
  const [mode, setMode] = useState<MoleculeInputMode>('name')
  const [value, setValue] = useState('')
  const [touched, setTouched] = useState(false)

  const error = useMemo(() => {
    if (!touched && !value) return null
    if (mode === 'name') return validateName(value)
    if (mode === 'smiles') return validateSmiles(value)
    return null
  }, [mode, value, touched])

  function setExample(v: string) {
    setValue(v)
    setTouched(true)
    onChange?.(mode, v)
  }

  function handleAnalyze() {
    setTouched(true)
    const err = mode === 'name' ? validateName(value) : mode === 'smiles' ? validateSmiles(value) : null
    if (!err) {
      // Placeholder action
      // In later phases, trigger analysis
      // eslint-disable-next-line no-alert
      alert(`Ready to analyze ${mode === 'name' ? 'molecule' : 'SMILES'}: ${value}`)
    }
  }

  return (
    <div className={classNames('rounded-xl border border-slate-200 bg-white p-6', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium text-slate-900">Molecular Input</div>
        <div className="text-xs text-slate-500" title="Provide a molecule by common name, SMILES string, or draw a structure.">
          How it works
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        {([
          { k: 'name', label: 'Name' },
          { k: 'smiles', label: 'SMILES' },
          { k: 'draw', label: 'Draw' },
        ] as const).map(({ k, label }) => (
          <button
            key={k}
            className={classNames(
              'rounded-md border px-3 py-1.5 text-sm transition-colors',
              mode === k
                ? 'border-primary-300 bg-primary-100 text-primary-700'
                : 'border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
            onClick={() => {
              setMode(k)
              setTouched(false)
              setValue('')
              onChange?.(k, '')
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="mt-4">
        {mode === 'name' && (
          <div>
            <label className="block text-xs font-medium text-slate-700">Molecule name</label>
            <Tooltip tip="Enter a common name (e.g., Aspirin) or click examples below"> 
              <input
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                placeholder="e.g., Aspirin"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                  onChange?.('name', e.target.value)
                }}
                onBlur={() => setTouched(true)}
              />
            </Tooltip>
          </div>
        )}

        {mode === 'smiles' && (
          <div>
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-700">SMILES</label>
              <span className="text-[10px] text-slate-500" title="Simplified Molecular-Input Line-Entry System">
                What is SMILES?
              </span>
            </div>
            <input
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              placeholder="e.g., CC(=O)OC1=CC=CC=C1C(=O)O"
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                onChange?.('smiles', e.target.value)
              }}
              onBlur={() => setTouched(true)}
            />
          </div>
        )}

        {mode === 'draw' && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 text-xs text-slate-600">Drawing canvas (placeholder)</div>
            <div className="flex h-40 items-center justify-center rounded-md border-2 border-dashed border-slate-300 bg-slate-100 text-slate-500">
              Coming soon — sketch molecules here
            </div>
          </div>
        )}

        {error && (
          <div className="mt-2 text-sm text-rose-600 font-medium" role="alert">
            {error}
          </div>
        )}
      </div>

      {/* Examples */}
      <div className="mt-4">
        <div className="text-xs font-medium text-slate-700">Examples</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {(mode === 'name' ? examples.name : mode === 'smiles' ? examples.smiles : examples.name).map((ex) => (
            <button
              key={ex}
              className="rounded-md border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-200 transition-colors"
              onClick={() => setExample(ex)}
              title="Click to use this example"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex justify-end">
        <button
          className="rounded-md bg-primary-600 px-4 py-2 text-white font-medium shadow hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          onClick={handleAnalyze}
          disabled={mode !== 'draw' && !value}
          title="Validate your input, then proceed to analysis in later phases"
        >
          Analyze
        </button>
      </div>
    </div>
  )
}
