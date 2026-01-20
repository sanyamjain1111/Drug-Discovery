import React, { useState } from 'react'

export default function FeedbackForm(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  async function submit(){
    setStatus('sending')
    try{
      const res = await fetch('/api/v1/feedback/submit', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ name, email, message }) })
      const j = await res.json()
      if (j.ok) { setStatus('sent'); setName(''); setEmail(''); setMessage('') } else { setStatus('error') }
    }catch(e){ setStatus('error') }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">Feedback</h1>
        <p className="text-slate-600 mt-2">Send us feedback to help improve the platform.</p>
      </div>
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="grid gap-3 md:grid-cols-2">
          <input className="p-2 border rounded" placeholder="Name (optional)" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="p-2 border rounded" placeholder="Email (optional)" value={email} onChange={(e)=>setEmail(e.target.value)} />
        </div>
        <textarea className="mt-3 w-full p-2 border rounded" rows={6} placeholder="Your feedback" value={message} onChange={(e)=>setMessage(e.target.value)} />
        <div className="mt-3 flex items-center gap-2">
          <button className="bg-tealpro px-3 py-1 rounded text-white" onClick={submit}>Send Feedback</button>
          {status === 'sending' && <div className="text-sm text-slate-500">Sending…</div>}
          {status === 'sent' && <div className="text-sm text-teal-600">Thanks — sent!</div>}
          {status === 'error' && <div className="text-sm text-rose-500">Failed to send.</div>}
        </div>
      </div>
    </div>
  )
}
