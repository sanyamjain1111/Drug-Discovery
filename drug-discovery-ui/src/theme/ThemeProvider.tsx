import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Theme = 'light' | 'dark'

type Ctx = { theme: Theme; toggle: () => void; set: (t: Theme) => void }

const ThemeCtx = createContext<Ctx | null>(null)

export function useTheme() {
  const c = useContext(ThemeCtx)
  if (!c) throw new Error('ThemeProvider missing')
  return c
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('theme-light')
      root.classList.remove('theme-dark')
    } else {
      root.classList.add('theme-dark')
      root.classList.remove('theme-light')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const value = useMemo<Ctx>(() => ({ theme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')), set: setTheme }), [theme])

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}
