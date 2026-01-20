import type { Requirements } from '../features/drug-generator/RequirementsForm'

export type GeneratedCandidate = {
  smiles: string
  rationale?: string
  valid: boolean
  unique: boolean
  synthesizable: boolean
  filtered: boolean
  score: number
  properties?: any
}

export async function runGeneration(req: Requirements) {
  const resp = await fetch('/api/v1/generator/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  const data = await resp.json()
  if (!data.ok) throw new Error(data.error || 'Generation failed')
  return data as { ok: boolean; total: number; generated: GeneratedCandidate[] }
}
