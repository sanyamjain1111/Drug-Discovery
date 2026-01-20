import React from 'react'

export default function WelcomeTour({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow">
        <h2 className="text-2xl font-semibold mb-2">Welcome to AIDiscover</h2>
        <p className="text-sm text-slate-600">This guided tour will introduce the main features: property prediction, docking, ADMET and retrosynthesis.</p>
        <ol className="mt-4 list-decimal pl-6 text-slate-700">
          <li>Enter a molecule name or SMILES and predict properties.</li>
          <li>Run docking simulations and view 3D poses.</li>
          <li>Inspect ADMET results and export reports.</li>
          <li>Plan retrosynthesis routes and export protocols.</li>
        </ol>
        <div className="mt-4 flex justify-end">
          <button className="bg-bluepro px-4 py-2 rounded-md text-white" onClick={onClose}>Get started</button>
        </div>
      </div>
    </div>
  )
}
