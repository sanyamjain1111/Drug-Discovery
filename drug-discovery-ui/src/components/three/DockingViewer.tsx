import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export type Interaction = { type: string; residues?: string[]; description?: string; distance?: number }

const typeColor: Record<string, number> = {
  'H-bond': 0x22c55e,
  Hydrophobic: 0xf59e0b,
  'Salt bridge': 0xa855f7,
  'Pi-stacking': 0xeab308,
}

export default function DockingViewer({ ligand = 'Ligand', interactions = [], onResidueClick }: { ligand?: string; interactions?: Interaction[]; onResidueClick?: (name: string) => void }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [showH, setShowH] = useState(true)
  const [showHydro, setShowHydro] = useState(true)
  const [showSalt, setShowSalt] = useState(true)
  const [showPi, setShowPi] = useState(true)

  useEffect(() => {
    if (!mountRef.current) return
    const width = mountRef.current.clientWidth
    const height = 360

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0b1220')

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200)
    camera.position.set(0, 1.8, 7)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.autoRotate = autoRotate

    const hemi = new THREE.HemisphereLight(0xffffff, 0x222233, 0.8)
    scene.add(hemi)

    // Protein surface placeholder: blobby sphere
    const surface = new THREE.Mesh(
      new THREE.SphereGeometry(2.4, 48, 48),
      new THREE.MeshStandardMaterial({ color: 0x1f6feb, roughness: 0.9, metalness: 0.0, transparent: true, opacity: 0.28 })
    )
    scene.add(surface)

    // Binding pocket highlight
    const pocket = new THREE.Mesh(new THREE.SphereGeometry(0.6, 24, 24), new THREE.MeshStandardMaterial({ color: 0x22c55e, transparent: true, opacity: 0.35 }))
    pocket.position.set(0.7, 0.2, 0.4)
    scene.add(pocket)

    // Ligand (simple cluster)
    const ligandGroup = new THREE.Group()
    const colors = [0x9aa0a6, 0xffffff, 0x3b82f6, 0xef4444]
    for (let i = 0; i < 8; i++) {
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.12 + (i % 3 === 0 ? 0.04 : 0), 16, 16), new THREE.MeshStandardMaterial({ color: colors[i % colors.length] }))
      const a = (i / 8) * Math.PI * 2
      s.position.set(pocket.position.x + Math.cos(a) * 0.25, pocket.position.y + Math.sin(a * 1.3) * 0.18, pocket.position.z + Math.sin(a) * 0.15)
      ligandGroup.add(s)
    }
    // start outside then animate in
    ligandGroup.position.set(-5, 0, 0)
    scene.add(ligandGroup)

    // Interaction lines
    const interGroup = new THREE.Group()
    scene.add(interGroup)

    function drawInteractions() {
      interGroup.clear()
      const filters = {
        H: showH,
        Hydrophobic: showHydro,
        'Salt bridge': showSalt,
        'Pi-stacking': showPi,
      }
      ;(interactions || []).forEach((it) => {
        const t = normalizeType(it.type)
        if (t === 'H-bond' && !filters.H) return
        if (t === 'Hydrophobic' && !filters.Hydrophobic) return
        if (t === 'Salt bridge' && !filters['Salt bridge']) return
        if (t === 'Pi-stacking' && !filters['Pi-stacking']) return
        const geom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(pocket.position.x + (Math.random() - 0.5) * 0.2, pocket.position.y + (Math.random() - 0.5) * 0.2, pocket.position.z + (Math.random() - 0.5) * 0.2),
          new THREE.Vector3(pocket.position.x + (Math.random() - 0.5) * 0.2, pocket.position.y + (Math.random() - 0.5) * 0.2, pocket.position.z + (Math.random() - 0.5) * 0.2),
        ])
        const color = typeColor[t] || 0xffffff
        const mat = new THREE.LineDashedMaterial({ color, dashSize: t === 'H-bond' ? 0.1 : 0.0001, gapSize: t === 'H-bond' ? 0.06 : 0 })
        const line = new THREE.Line(geom, mat)
        line.computeLineDistances()
        interGroup.add(line)
      })
    }
    drawInteractions()

    // Animation: approach and settle
    let raf = 0
    let t = 0
    const animate = () => {
      controls.autoRotate = autoRotate
      controls.update()
      t += 0.01
      if (ligandGroup.position.x < pocket.position.x - 0.3) {
        ligandGroup.position.x = THREE.MathUtils.lerp(ligandGroup.position.x, pocket.position.x - 0.3, 0.04)
      }
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    const onResize = () => {
      const w = mountRef.current!.clientWidth
      camera.aspect = w / height
      camera.updateProjectionMatrix()
      renderer.setSize(w, height)
    }
    window.addEventListener('resize', onResize)

    mountRef.current.appendChild(renderer.domElement)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [ligand, interactions, autoRotate, showH, showHydro, showSalt, showPi])

  function snapshot() {
    const canvas = mountRef.current?.querySelector('canvas') as HTMLCanvasElement | null
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `docking_${Date.now()}.png`
    a.click()
  }

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs text-slate-400">Docking View</div>
        <div className="flex items-center gap-2 text-xs">
          <button className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-200" onClick={() => snapshot()}>Snapshot</button>
          <button className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-slate-200" onClick={() => window.dispatchEvent(new Event('resize'))}>Reset</button>
          <label className="inline-flex items-center gap-1"><input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} /> Auto-rotate</label>
          <label className="inline-flex items-center gap-1"><input type="checkbox" checked={showH} onChange={(e) => setShowH(e.target.checked)} /> H-bond</label>
          <label className="inline-flex items-center gap-1"><input type="checkbox" checked={showHydro} onChange={(e) => setShowHydro(e.target.checked)} /> Hydrophobic</label>
          <label className="inline-flex items-center gap-1"><input type="checkbox" checked={showSalt} onChange={(e) => setShowSalt(e.target.checked)} /> Salt</label>
          <label className="inline-flex items-center gap-1"><input type="checkbox" checked={showPi} onChange={(e) => setShowPi(e.target.checked)} /> π-stacking</label>
        </div>
      </div>
      <div ref={mountRef} className="w-full" />
    </div>
  )
}

function normalizeType(t?: string) {
  if (!t) return 'H-bond'
  const s = t.toLowerCase()
  if (s.includes('hydroph')) return 'Hydrophobic'
  if (s.includes('salt')) return 'Salt bridge'
  if (s.includes('pi')) return 'Pi-stacking'
  if (s.includes('h-bond') || s.includes('hydrogen')) return 'H-bond'
  return 'H-bond'
}
