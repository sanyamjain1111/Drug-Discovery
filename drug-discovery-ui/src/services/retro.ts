import type { RetroConstraints } from '../features/retrosynthesis/RetroInputForm'

export type RetroStep = { id: string; label: string; yieldPct?: number; reagents?: string; conditions?: string }
export type RetroRoute = { id: string; steps: RetroStep[]; overallYield?: number; cost?: string; time?: string; safety?: string; difficulty?: string; hazards?: string[]; greenScore?: number; references?: string[] }

export async function planRetrosynthesis(input: { target: string; constraints: RetroConstraints; starting?: string[]; routes?: number }): Promise<{ ok: boolean; routes: RetroRoute[]; meta?: any; error?: string }> {
  const resp = await fetch('/api/v1/retro/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...input, routes: input.routes ?? 3 }),
  })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  return (await resp.json()) as any
}
