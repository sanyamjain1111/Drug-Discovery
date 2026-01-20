import { PropsWithChildren, useEffect, useState } from 'react'
import TopNav from './TopNav'
import Sidebar from './Sidebar'
import WelcomeTour from '../../features/onboarding/WelcomeTour'

export default function Layout({ children }: PropsWithChildren) {
  const [showTour, setShowTour] = useState(false)

  useEffect(() => {
    try {
      const seen = localStorage.getItem('welcome_shown')
      if (!seen) {
        setShowTour(true)
        localStorage.setItem('welcome_shown', '1')
      }
    } catch {}
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <TopNav />
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[auto,1fr]">
        <Sidebar />
        <main className="min-h-[calc(100vh-64px)] p-4 md:p-8 relative z-10">
          {children}
        </main>
      </div>
      {showTour && <WelcomeTour onClose={() => setShowTour(false)} />}
    </div>
  )
}
