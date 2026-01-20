import React from 'react'
import { Link } from 'react-router-dom'

export default function ExampleWorkflows(){
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">Example Workflows</h1>
        <p className="text-slate-600 mt-2">Starter workflows to try: property screening, docking + ADMET, retrosynthesis planning.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="font-medium">Quick: Property Screening</h2>
          <p className="text-slate-500 text-sm mt-2">Enter a molecule name and run the property predictor to get solubility, logP, and basic metrics.</p>
          <div className="mt-3"><Link to="/property-predictor" className="bg-bluepro px-3 py-1 rounded text-white">Try it</Link></div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="font-medium">Docking + ADMET</h2>
          <p className="text-slate-500 text-sm mt-2">Run docking to get poses, then analyze ADMET for candidate compounds.</p>
          <div className="mt-3"><Link to="/docking" className="bg-tealpro px-3 py-1 rounded text-white">Start</Link></div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="font-medium">Retrosynthesis Planning</h2>
          <p className="text-slate-500 text-sm mt-2">Plan multiple synthesis routes and export lab protocols.</p>
          <div className="mt-3"><Link to="/retrosynthesis" className="bg-bluepro px-3 py-1 rounded text-white">Open Planner</Link></div>
        </div>
      </div>
    </div>
  )
}
