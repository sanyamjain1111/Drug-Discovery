import { useState } from 'react'
import { useChat } from '../../services/openaiClient'

export default function OpenAITestPage() {
  const [name, setName] = useState('Aspirin')
  const { loading, error, content, run } = useChat()

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-bluepro/10 via-slate-900 to-tealpro/10 p-6">
        <h1 className="text-xl font-semibold">OpenAI Connection Test</h1>
        <p className="mt-2 max-w-2xl text-slate-300">
          Enter a molecule name and send to OpenAI. This validates the API connection.
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <label className="block text-xs text-slate-400">Molecule name</label>
        <div className="mt-1 flex gap-2">
          <input
            className="flex-1 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder-slate-500 focus:border-bluepro focus:outline-none"
            placeholder="e.g., Ibuprofen"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            className="rounded-md bg-bluepro px-4 py-2 text-white shadow hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => run(name)}
            disabled={!name.trim() || loading}
          >
            {loading ? 'Sending…' : 'Send'}
          </button>
        </div>
        {error && <div className="mt-3 text-sm text-rose-400">{error}</div>}
        {content && (
          <div className="mt-4 rounded-md border border-slate-800 bg-slate-950 p-3 text-slate-200 whitespace-pre-wrap">
            {content}
          </div>
        )}
      </div>
    </div>
  )
}
