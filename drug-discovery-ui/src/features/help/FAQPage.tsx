import React from 'react'

const faqs = [
  { q: 'How do I predict properties?', a: 'Go to Property Predictor, enter a molecule name or SMILES, and click Predict.' },
  { q: 'How do I run docking?', a: 'Open Docking Simulator, provide a protein (PDB ID) and ligand, then run analysis.' },
  { q: 'Where do results go?', a: 'Results show inline and can be exported as JSON or PDF where available.' },
]

export default function FAQPage(){
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">Frequently Asked Questions</h1>
        <p className="text-slate-600 mt-2">Common questions about using AIDiscover.</p>
      </div>

      <div className="rounded-lg bg-white p-4 shadow space-y-3">
        {faqs.map((f, i) => (
          <div key={i}>
            <div className="font-medium text-slate-800">{f.q}</div>
            <div className="text-slate-600 text-sm mt-1">{f.a}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
