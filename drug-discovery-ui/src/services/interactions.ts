export type InteractionPair = {
  drugs: string[]
  type: 'synergistic' | 'antagonistic' | 'additive' | 'none'
  severity: 'mild' | 'moderate' | 'severe' | 'contraindicated'
  mechanism: string
  clinicalSignificance: string
  recommendations: string
}

export type InteractionResponse = {
  overallSafety: 'safe' | 'caution' | 'dangerous' | 'contraindicated'
  interactions: InteractionPair[]
  saferAlternatives: string[]
  heuristic?: boolean
  error?: string
}

export async function analyzeInteractions(drugs: string[]): Promise<InteractionResponse> {
  const resp = await fetch('/api/v1/interactions/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ drugs }),
  })
  if (!resp.ok) {
    const txt = await resp.text()
    throw new Error(`Server error: ${resp.status} ${txt}`)
  }
  return (await resp.json()) as InteractionResponse
}
