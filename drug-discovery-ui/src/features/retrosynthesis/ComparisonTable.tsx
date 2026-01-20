type Route = { id: string; steps: number; yield: number; cost: string; time: string; safety: string; difficulty: 'green'|'yellow'|'red' }

export default function ComparisonTable({ routes, onOpen }: { routes: Route[]; onOpen: (id: string) => void }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50">
      <table className="w-full text-sm text-slate-300">
        <thead className="bg-slate-900 text-slate-400">
          <tr>
            <th className="px-3 py-2 text-left">Route</th>
            <th className="px-3 py-2">Steps</th>
            <th className="px-3 py-2">Yield</th>
            <th className="px-3 py-2">Cost</th>
            <th className="px-3 py-2">Time</th>
            <th className="px-3 py-2">Safety</th>
            <th className="px-3 py-2">Difficulty</th>
            <th className="px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((r) => (
            <tr key={r.id} className="border-t border-slate-800">
              <td className="px-3 py-2">{r.id}</td>
              <td className="px-3 py-2 text-center">{r.steps}</td>
              <td className="px-3 py-2 text-center">{r.yield}%</td>
              <td className="px-3 py-2 text-center">{r.cost}</td>
              <td className="px-3 py-2 text-center">{r.time}</td>
              <td className="px-3 py-2 text-center">{r.safety}</td>
              <td className="px-3 py-2 text-center"><span className={`rounded px-2 py-0.5 text-xs ${r.difficulty === 'green' ? 'bg-green-500/20 text-green-300' : r.difficulty === 'yellow' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'}`}>{r.difficulty}</span></td>
              <td className="px-3 py-2 text-center"><button className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800" onClick={() => onOpen(r.id)}>View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
