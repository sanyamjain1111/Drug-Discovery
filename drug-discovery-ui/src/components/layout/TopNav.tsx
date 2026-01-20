import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Sparkles } from 'lucide-react'

export default function TopNav() {
  const [open, setOpen] = useState(false)
  
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative h-10 w-10 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gradient">AIDiscover</span>
            <span className="text-xs text-slate-500 font-medium">Drug Discovery</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden gap-1 md:flex">
          <NavLink to="/" label="Home" />
          <NavLink to="#features" label="Features" isAnchor />
          <NavLink to="#about" label="About" isAnchor />
          <div className="ml-6 flex gap-2">
            <button className="px-4 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors">
              Sign In
            </button>
            <button className="btn btn-primary-gradient">
              Get Started
            </button>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
          aria-label="Toggle Menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="md:hidden border-t border-slate-200/50 bg-white/95 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <div className="space-y-1 px-6 py-4">
            <MobileNavLink to="/" label="Home" onClick={() => setOpen(false)} />
            <MobileNavLink to="/#features" label="Features" onClick={() => setOpen(false)} />
            <MobileNavLink to="/#about" label="About" onClick={() => setOpen(false)} />
            <div className="pt-4 border-t border-slate-200 mt-4 space-y-2">
              <button className="w-full px-4 py-2 text-primary-600 font-medium hover:bg-primary-50 rounded-lg transition-colors">
                Sign In
              </button>
              <button className="w-full btn btn-primary-gradient">
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function NavLink({ to, label, isAnchor }: { to: string; label: string; isAnchor?: boolean }) {
  const Component = isAnchor ? 'a' : Link
  return (
    <Component
      href={isAnchor ? to : undefined}
      to={!isAnchor ? to : undefined}
      className="px-4 py-2 text-slate-600 hover:text-primary-600 font-medium transition-colors relative group"
    >
      {label}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 transition-all group-hover:w-full rounded-full" />
    </Component>
  )
}

function MobileNavLink({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-2.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 font-medium rounded-lg transition-all"
    >
      {label}
    </Link>
  )
}
