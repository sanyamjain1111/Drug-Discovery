export type ReactionRequest = {
  reactantA: string
  reactantB: string
  conditions: { temperature?: string; pressure?: string; catalyst?: string; solvent?: string }
}

export type ReactionResponse = {
  equation: string
  products: { name: string; confidence: number; byproduct: boolean }[]
  mechanismSteps: string[]
  yieldPercent: number
  energyChange: 'exothermic' | 'endothermic' | 'neutral'
  heuristic?: boolean
  error?: string
}

export async function predictReaction(input: ReactionRequest): Promise<ReactionResponse> {
  const resp = await fetch('/api/v1/reactions/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!resp.ok) throw new Error(`Server error: ${resp.status}`)
  return (await resp.json()) as ReactionResponse
}
