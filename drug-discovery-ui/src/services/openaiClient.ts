import { useState } from 'react'

export type ChatResponse = {
  ok: boolean
  model?: string
  content?: string
  error?: string
  details?: string
}

export async function chatAboutMolecule(moleculeName: string, signal?: AbortSignal): Promise<ChatResponse> {
  try {
    // Prefer new FastAPI endpoint
    const resp = await fetch('/api/v1/molecule/compat-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ molecule: moleculeName }),
      signal,
    })
    const data = (await resp.json()) as ChatResponse
    return data
  } catch (e) {
    // Fallback to legacy path if proxy or server not ready
    try {
      const resp2 = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moleculeName }),
        signal,
      })
      const data2 = (await resp2.json()) as ChatResponse
      return data2
    } catch (e2) {
      return { ok: false, error: 'Network error', details: String(e2 && (e2 as any).message ? (e2 as any).message : e2) }
    }
  }
}

export function useChat() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState<string | null>(null)

  async function run(name: string) {
    setLoading(true)
    setError(null)
    setContent(null)
    const res = await chatAboutMolecule(name)
    if (!res.ok) setError(res.error || 'Unknown error')
    else setContent(res.content || '')
    setLoading(false)
  }

  return { loading, error, content, run }
}
