export async function explainProperty(input: { molecule: string; property: string; context?: string }) {
  const resp = await fetch('/api/v1/molecule/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  return (await resp.json()) as { success: boolean; text: string }
}
