import React from 'react'

export default function Tooltip({ children, tip }: { children: React.ReactNode; tip: string }){
  return (
    <span className="relative group inline-flex items-center">
      {children}
      <span className="absolute bottom-full mb-2 hidden group-hover:block w-max max-w-xs rounded-md bg-slate-900 text-white text-xs px-2 py-1 shadow-lg">
        {tip}
      </span>
    </span>
  )
}
