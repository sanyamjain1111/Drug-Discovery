import React from 'react'

export default function RecorderGuide(){
  return (
    <div className="space-y-6" id="recorder">
      <div className="rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-semibold">Recorder Guide</h1>
        <p className="text-slate-600 mt-2">Steps to create a short screencast for the tutorial library.</p>
      </div>

      <div className="rounded-lg bg-white p-4 shadow">
        <ol className="list-decimal pl-5 space-y-2 text-slate-700">
          <li>Choose the workflow to record (e.g., Property Predictor).</li>
          <li>Keep the recording short (1-3 minutes) and focused on a single task.</li>
          <li>Use the browser's screen recorder or a tool like OBS. Ensure microphone is enabled if adding narration.</li>
          <li>Export the video as MP4 (H.264). Upload to an internal server or cloud storage and paste the link into the Video Tutorials admin (future feature).</li>
        </ol>
        <div className="mt-4">
          <button className="bg-tealpro px-3 py-1 rounded text-white">Open screen recorder (external)</button>
        </div>
      </div>
    </div>
  )
}
