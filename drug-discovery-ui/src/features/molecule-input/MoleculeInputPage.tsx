import MoleculeInput from '../../components/molecules/MoleculeInput'

export default function MoleculeInputPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6">
        <h1 className="text-xl font-semibold text-slate-900">Molecular Input</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Provide a molecule by name, SMILES, or draw a structure. This is a UI-only prototype; analysis
          will be enabled in later phases.
        </p>
      </div>

      <MoleculeInput />
    </div>
  )
}
