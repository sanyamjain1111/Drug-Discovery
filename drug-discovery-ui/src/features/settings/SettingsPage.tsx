import React, { useState } from 'react'

export default function SettingsPage(){
  const [apiKey, setApiKey] = useState(localStorage.getItem('OPENAI_API_KEY')||'')
  function save(){
    localStorage.setItem('OPENAI_API_KEY', apiKey)
    alert('Saved')
  }
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-slate-600 mt-2">Manage your preferences and API keys.</p>
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <label className="block text-sm font-medium text-slate-700">OpenAI API Key</label>
        <input className="mt-2 w-full p-2 border rounded" value={apiKey} onChange={(e)=>setApiKey(e.target.value)} placeholder="sk-..." />
        <div className="mt-3 flex gap-2">
          <button className="bg-tealpro px-3 py-1 rounded text-white" onClick={save}>Save</button>
          <button className="border px-3 py-1 rounded" onClick={()=>{setApiKey(''); localStorage.removeItem('OPENAI_API_KEY')}}>Clear</button>
        </div>
      </div>
    </div>
  )
}
