import React from 'react'

export default function VideoTutorials(){
  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">Video Tutorials</h1>
        <p className="text-slate-600 mt-2">Short walkthroughs and screencasts to get started.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="font-medium">Getting Started</h2>
          <p className="text-slate-500 text-sm mt-2">Overview of the platform and basic workflows.</p>
          <div className="mt-3">
            <div className="w-full h-44 bg-slate-100 flex items-center justify-center text-slate-400">Video placeholder</div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow">
          <h2 className="font-medium">Retrosynthesis Planner</h2>
          <p className="text-slate-500 text-sm mt-2">How to plan and export synthesis routes.</p>
          <div className="mt-3">
            <div className="w-full h-44 bg-slate-100 flex items-center justify-center text-slate-400">Video placeholder</div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow md:col-span-2">
          <h2 className="font-medium">Create Your Own Tutorial</h2>
          <p className="text-slate-500 text-sm mt-2">Record a short screencast to include in the help center.</p>
          <div className="mt-3 flex gap-2">
            <a className="bg-bluepro px-3 py-1 rounded text-white" href="#recorder">Open Recorder Guide</a>
          </div>
        </div>
      </div>
    </div>
  )
}
