import { useMemo, useState } from 'react'
import RadarChart from '../drug-generator/RadarChart'
import ProgressBar from '../../components/viz/ProgressBar'
import BadgeIndicator from '../../components/viz/BadgeIndicator'

function Section({ title, children }: { title: string; children: any }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-slate-200">{title}</div>
        <button className="text-xs text-slate-300 hover:underline" onClick={() => setOpen((o) => !o)}>{open ? 'Collapse' : 'Expand'}</button>
      </div>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

export default function AdmetPage() {
  const mock = useMemo(() => ({
    absorption: { hia: 0.82, caco2: 28, pgp: 'substrate', bioavailability: 0.55 },
    distribution: { bbb: false, ppb: 0.88, vd: 0.7 },
    metabolism: { cyp: { '3A4': 'inhibitor', '2D6': 'none', '2C9': 'substrate' }, stability: 'moderate', halfLife: 6.2 },
    excretion: { clearance: 12.5, route: 'renal/hepatic' },
    toxicity: { hepato: 'low', cardio: 'moderate', nephro: 'low', carcinogenicity: 'unknown' },
  }), [])

  const radar = useMemo(() => ([
    { label: 'Absorption', value: Math.round(mock.absorption.hia * 100) },
    { label: 'Distribution', value: Math.round((1 - (mock.distribution.ppb || 0)) * 100) },
    { label: 'Metabolism', value: mock.metabolism.halfLife ? Math.min(100, Math.round(mock.metabolism.halfLife * 10)) : 50 },
    { label: 'Excretion', value: Math.min(100, Math.round(100 - (mock.excretion.clearance || 0))) },
    { label: 'Toxicity', value: mock.toxicity.cardio === 'moderate' ? 60 : 80 },
  ]), [mock])

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-bluepro/10 via-slate-900 to-tealpro/10 p-6">
        <h1 className="text-xl font-semibold">ADMET Analysis</h1>
        <p className="mt-2 max-w-2xl text-slate-300">Comprehensive dashboard for absorption, distribution, metabolism, excretion, and toxicity. Values are placeholders; AI analysis will be integrated next.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="text-sm font-medium text-slate-200">Overall ADMET Profile</div>
          <div className="mt-2"><RadarChart data={radar} /></div>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <span>Overall:</span>
            <BadgeIndicator label="Pass" status="good" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="text-sm font-medium text-slate-200">Traffic Lights</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <BadgeIndicator label="Absorption" status="good" />
            <BadgeIndicator label="Distribution" status="caution" />
            <BadgeIndicator label="Metabolism" status="caution" />
            <BadgeIndicator label="Excretion" status="good" />
            <BadgeIndicator label="Toxicity" status="caution" />
          </div>
        </div>
      </div>

      <Section title="Absorption (HIA, Caco-2, P-gp, Bioavailability)">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-xs text-slate-400">Human Intestinal Absorption (HIA)</div>
            <ProgressBar value={Math.round(mock.absorption.hia * 100)} color="green" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Caco-2 Permeability (10⁻⁶ cm/s)</div>
            <ProgressBar value={Math.min(100, mock.absorption.caco2)} color={mock.absorption.caco2 > 20 ? 'green' : 'yellow'} />
          </div>
          <div className="text-xs text-slate-400">P-gp Interaction: <span className="text-slate-200" title="P-glycoprotein">{mock.absorption.pgp}</span></div>
          <div>
            <div className="text-xs text-slate-400">Oral Bioavailability</div>
            <ProgressBar value={Math.round(mock.absorption.bioavailability * 100)} color={mock.absorption.bioavailability > 0.5 ? 'green' : 'yellow'} />
          </div>
        </div>
      </Section>

      <Section title="Distribution (BBB, PPB, Vd)">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="text-xs text-slate-400">BBB Penetration: <BadgeIndicator label={mock.distribution.bbb ? 'Likely' : 'Unlikely'} status={mock.distribution.bbb ? 'caution' : 'good'} /></div>
          <div>
            <div className="text-xs text-slate-400">Plasma Protein Binding (PPB)</div>
            <ProgressBar value={Math.round(mock.distribution.ppb * 100)} color={mock.distribution.ppb > 0.9 ? 'red' : mock.distribution.ppb > 0.7 ? 'yellow' : 'green'} />
          </div>
          <div>
            <div className="text-xs text-slate-400">Volume of Distribution (Vd, L/kg)</div>
            <div className="mt-1 text-sm text-slate-300">{mock.distribution.vd}</div>
          </div>
        </div>
      </Section>

      <Section title="Metabolism (CYP450, Stability, t½)">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-xs text-slate-400">CYP450 interactions</div>
            <ul className="mt-1 list-disc pl-5 text-sm text-slate-300">
              {Object.entries(mock.metabolism.cyp).map(([k, v]) => (<li key={k}>{k}: {v as any}</li>))}
            </ul>
          </div>
          <div>
            <div className="text-xs text-slate-400">Stability</div>
            <BadgeIndicator label={mock.metabolism.stability} status={mock.metabolism.stability === 'high' ? 'good' : mock.metabolism.stability === 'moderate' ? 'caution' : 'poor'} />
          </div>
          <div>
            <div className="text-xs text-slate-400">Half-life (hours)</div>
            <div className="mt-1 text-sm text-slate-300">{mock.metabolism.halfLife} h</div>
          </div>
        </div>
      </Section>

      <Section title="Excretion (Clearance, Routes)">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <div className="text-xs text-slate-400">Clearance (mL/min/kg)</div>
            <ProgressBar value={Math.min(100, Math.round(mock.excretion.clearance))} color={mock.excretion.clearance > 20 ? 'red' : mock.excretion.clearance > 10 ? 'yellow' : 'green'} />
          </div>
          <div className="text-xs text-slate-400">Routes: <span className="text-slate-300">{mock.excretion.route}</span></div>
        </div>
      </Section>

      <Section title="Toxicity (Hepato, Cardio, Nephro, Carcinogenicity)">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="text-xs text-slate-400">Hepatotoxicity: <BadgeIndicator label={mock.toxicity.hepato} status={mock.toxicity.hepato === 'low' ? 'good' : mock.toxicity.hepato === 'moderate' ? 'caution' : 'poor'} /></div>
          <div className="text-xs text-slate-400">Cardiotoxicity: <BadgeIndicator label={mock.toxicity.cardio} status={mock.toxicity.cardio === 'low' ? 'good' : mock.toxicity.cardio === 'moderate' ? 'caution' : 'poor'} /></div>
          <div className="text-xs text-slate-400">Nephrotoxicity: <BadgeIndicator label={mock.toxicity.nephro} status={mock.toxicity.nephro === 'low' ? 'good' : mock.toxicity.nephro === 'moderate' ? 'caution' : 'poor'} /></div>
          <div className="text-xs text-slate-400">Carcinogenicity: <BadgeIndicator label={mock.toxicity.carcinogenicity} status={mock.toxicity.carcinogenicity === 'unknown' ? 'caution' : 'poor'} /></div>
        </div>
        <div className="mt-3 rounded border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">Warnings: Potential QT prolongation risk flagged by cardio score (mock).</div>
      </Section>
    </div>
  )
}
