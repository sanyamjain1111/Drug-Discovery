import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Zap, Settings, HelpCircle } from 'lucide-react'

interface NavItemProps {
  to: string
  label: string
  icon: React.ReactNode
}

function NavItem({ to, label, icon }: NavItemProps) {
  const { pathname } = useLocation()
  const active = pathname === to

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 group relative overflow-hidden ${
        active
          ? 'bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 shadow-md'
          : 'text-slate-600 hover:text-primary-600 hover:bg-slate-100'
      }`}
    >
      {active && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 animate-pulse" />
      )}
      <span className={`relative flex-shrink-0 transition-colors ${active ? 'text-primary-600' : 'text-slate-500 group-hover:text-primary-500'}`}>
        {icon}
      </span>
      <span className="relative flex-1">{label}</span>
      {active && <div className="absolute right-0 w-1 h-8 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-l-full" />}
    </Link>
  )
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`relative hidden md:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-out shadow-sm ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Button */}
      <button
        className="absolute -right-4 top-8 z-50 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-300 shadow-md hover:shadow-lg transition-all duration-200"
        onClick={() => setCollapsed((c) => !c)}
        aria-label="Toggle Sidebar"
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Navigation Section */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-6 space-y-6">
          {/* Main Navigation */}
          {!collapsed && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Navigation</h3>
            </div>
          )}
          <nav className="space-y-2">
            <NavItem to="/" label="Home" icon={<Zap className="h-5 w-5" />} />
          </nav>

          {/* Features Section */}
          {!collapsed && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Analysis Tools</h3>
            </div>
          )}
          <nav className="space-y-2">
            <NavItem to="/feature1" label="Target Prediction" icon={<div className="h-5 w-5 rounded-full border-2 border-current" />} />
            <NavItem to="/molecule-input" label="Molecule Design" icon={<div className="h-5 w-5">🧪</div>} />
            <NavItem to="/property-predictor" label="Property Screening" icon={<div className="h-5 w-5">🔍</div>} />
            <NavItem to="/feature4" label="ADMET" icon={<div className="h-5 w-5">🧬</div>} />
            <NavItem to="/feature5" label="3D Visualizer" icon={<div className="h-5 w-5">🧊</div>} />
          </nav>

          {/* Advanced Tools Section */}
          {!collapsed && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Advanced Tools</h3>
            </div>
          )}
          <nav className="space-y-2">
            <NavItem to="/drug-interactions" label="Drug Interactions" icon={<div className="h-5 w-5">⚗️</div>} />
            <NavItem to="/drug-generator" label="AI Generator" icon={<div className="h-5 w-5">✨</div>} />
            <NavItem to="/docking" label="Docking Simulator" icon={<div className="h-5 w-5">🔗</div>} />
            <NavItem to="/admet" label="ADMET Dashboard" icon={<div className="h-5 w-5">📊</div>} />
            <NavItem to="/retrosynthesis" label="Retrosynthesis" icon={<div className="h-5 w-5">🧫</div>} />
          </nav>

          {/* Testing Section */}
          {!collapsed && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 px-2">Testing</h3>
            </div>
          )}
          <nav className="space-y-2">
            <NavItem to="/openai-test" label="OpenAI Test" icon={<div className="h-5 w-5">🤖</div>} />
          </nav>
        </div>
      </div>

      {/* Footer Section */}
      <div className={`border-t border-slate-200 bg-slate-50 transition-all duration-300 ${collapsed ? 'p-3' : 'p-6'}`}>
        {!collapsed && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors" title="Help">
                <HelpCircle className="h-4 w-4" />
                <span className="text-xs font-medium hidden sm:inline">Help</span>
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors" title="Settings">
                <Settings className="h-4 w-4" />
                <span className="text-xs font-medium hidden sm:inline">Settings</span>
              </button>
            </div>
            <div className="text-xs text-slate-400 font-medium">v0.1 Beta</div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center gap-2">
            <button className="p-2 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors" title="Help">
              <HelpCircle className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors" title="Settings">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
