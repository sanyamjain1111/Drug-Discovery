export type StructureJSON = {
  elements: string[]
  positions: number[][]
  bonds: number[][]
  source?: string
  inchikey?: string
}

export async function fetchStructureJSON(query: string): Promise<StructureJSON> {
  const resp = await fetch(`/api/v1/structure?query=${encodeURIComponent(query)}&format=json`)
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  const data = await resp.json()
  if (!data.ok || !data.data) throw new Error(data.error || 'No data')
  return data.data as StructureJSON
}
