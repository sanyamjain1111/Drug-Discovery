import MoleculeViewer from '../../components/three/MoleculeViewer'

export default function MoleculeDetailModal({ open, onClose, smiles }: { open: boolean; onClose: () => void; smiles: string | null }) {
  if (!open || !smiles) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-200">Molecule Detail</div>
          <button className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800" onClick={onClose}>Close</button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded border border-slate-800 bg-slate-900 p-3">
            <MoleculeViewer name={smiles} />
          </div>
          <div className="space-y-2 text-sm text-slate-300">
            <div className="rounded border border-slate-800 bg-slate-900 p-3">
              <div className="text-slate-200">Predicted properties</div>
              <ul className="mt-2 list-disc pl-5 text-xs text-slate-400">
                <li>Toxicity: low (mock)</li>
                <li>Solubility: high (mock)</li>
                <li>Drug-likeness: passes Ro5 (mock)</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <button className="rounded-md bg-tealpro px-3 py-1.5 text-slate-950">Generate similar</button>
              <button className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-200 hover:bg-slate-800">Export</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
