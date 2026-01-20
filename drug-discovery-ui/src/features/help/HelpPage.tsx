import React from 'react'
import { Link } from 'react-router-dom'

export default function HelpPage(){
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">Help & Resources</h1>
        <p className="text-slate-600 mt-2">Find FAQs, glossary, and contextual guides below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/help/faq" className="rounded-lg bg-white p-4 shadow">FAQ</Link>
        <Link to="/help/glossary" className="rounded-lg bg-white p-4 shadow">Glossary</Link>
        <Link to="/help/tutorials" className="rounded-lg bg-white p-4 shadow">Tutorials</Link>
      </div>
    </div>
  )
}
