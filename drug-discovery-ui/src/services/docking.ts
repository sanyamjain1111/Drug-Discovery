export async function analyzeDocking(body: { proteinSource: 'pdb_id' | 'url' | 'pdb_text'; proteinData?: string; ligand: string; params: { exhaustiveness: number; numPoses: number } }) {
  const resp = await fetch('/api/v1/docking/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  const data = await resp.json()
  if (!data.ok) throw new Error(data.error || 'Docking failed')
  return data as { ok: boolean; analysis: any }
}
