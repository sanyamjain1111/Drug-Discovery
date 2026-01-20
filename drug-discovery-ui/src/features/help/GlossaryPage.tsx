import React from 'react'

const terms = [
  { term: 'SMILES', def: 'Simplified Molecular-Input Line-Entry System — a way to encode molecular structures as text.' },
  { term: 'ADMET', def: 'Absorption, Distribution, Metabolism, Excretion, and Toxicity.' },
  { term: 'Docking', def: 'Computational prediction of a ligand binding pose and affinity to a protein.' },
]

export default function GlossaryPage(){
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">Glossary</h1>
        <p className="text-slate-600 mt-2">Key terms used in the platform.</p>
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <dl className="space-y-3">
          {terms.map((t,i)=> (
            <div key={i}>
              <dt className="font-medium text-slate-800">{t.term}</dt>
              <dd className="text-slate-600 text-sm mt-1">{t.def}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
