import React from 'react'

export default function AboutPage(){
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">About AIDiscover</h1>
        <p className="text-slate-600 mt-2">AI-powered drug discovery platform — demo build.</p>
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="text-lg font-medium">Credits & Data Sources</h2>
        <ul className="mt-2 list-disc pl-5 text-slate-700">
          <li>Public databases: PubChem, ChEMBL</li>
          <li>Open-source libraries and models</li>
        </ul>
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <h2 className="text-lg font-medium">Contact & Feedback</h2>
        <p className="mt-2 text-slate-700">Please email feedback@example.com or use the feedback form in the app.</p>
      </div>
    </div>
  )
}
