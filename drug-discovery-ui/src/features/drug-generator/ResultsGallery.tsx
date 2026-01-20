import MoleculeThumb from './MoleculeThumb'

export type Candidate = { id: string; smiles: string; score: number; favorite?: boolean }

export default function ResultsGallery({ items, selectedIds = [], onToggleSelect, onToggleFav, onOpen }: { items: Candidate[]; selectedIds?: string[]; onToggleSelect?: (id: string) => void; onToggleFav: (id: string) => void; onOpen: (id: string) => void }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-200">Results</div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>{items.length} molecules</span>
        </div>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((c) => (
          <div key={c.id} className="relative">
            {onToggleSelect && (
              <label
                className="absolute left-2 top-2 z-10 flex cursor-pointer items-center gap-1 rounded bg-slate-900/80 px-1.5 py-0.5 text-[10px] text-slate-200 hover:bg-slate-800"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => { e.stopPropagation(); e.preventDefault() }}
                title="Select for compare"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(c.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => onToggleSelect(c.id)}
                />
                Compare
              </label>
            )}
            <button className="absolute right-2 top-2 z-10 rounded bg-slate-900/80 px-1.5 py-0.5 text-[10px] text-slate-200 hover:bg-slate-800" onClick={() => onToggleFav(c.id)}>{c.favorite ? '★' : '☆'}</button>
            <button className="block w-full text-left" onClick={() => onOpen(c.id)}>
              <MoleculeThumb smiles={c.smiles} score={c.score} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
