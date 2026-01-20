export type AdmetResponse = {
  ok: boolean
  absorption?: any
  distribution?: any
  metabolism?: any
  excretion?: any
  toxicity?: any
  overallAssessment?: string
  regulatoryOutlook?: string
  error?: string
}

export async function analyzeAdmet(input: { molecule: string; smiles?: string }): Promise<AdmetResponse> {
  const resp = await fetch('/api/v1/admet/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  return (await resp.json()) as AdmetResponse
}
