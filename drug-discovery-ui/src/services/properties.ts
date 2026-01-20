export type PropertyPrediction = {
  toxicity: { score: number; level: string; explanation: string }
  solubility: { score: number; details: string }
  drugLikeness: { score: number; passes: boolean }
  bioavailability: { percentage: number; explanation: string }
  bbbPenetration: { canCross: boolean; confidence: string }
  lipinskiRules: { passes: boolean; violations: string[] }
}

export type PropertyPredictionResponse = {
  success: boolean
  molecule: string
  smiles?: string
  predictions?: PropertyPrediction
  error?: string
}

export async function predictProperties(input: { molecule: string; smiles?: string }): Promise<PropertyPredictionResponse> {
  console.log('[predictProperties] request', input)
  const resp = await fetch('/api/v1/molecule/predict-properties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  console.log('[predictProperties] status', resp.status)
  if (!resp.ok) {
    try {
      const j = await resp.json()
      console.warn('[predictProperties] error body', j)
      return { success: false, molecule: input.molecule, smiles: input.smiles, error: j?.detail || 'Server error' }
    } catch {
      return { success: false, molecule: input.molecule, smiles: input.smiles, error: 'Server error' }
    }
  }
  const data = (await resp.json()) as PropertyPredictionResponse
  console.log('[predictProperties] response', data)
  return data
}
