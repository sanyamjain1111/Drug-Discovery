import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Legend from '../viz/Legend'

export type StructureJSON = {
  elements: string[]
  positions: number[][]
  bonds: number[][]
}

const COLORS: Record<string, number> = { C: 0x9aa0a6, O: 0xef4444, N: 0x3b82f6, H: 0xffffff }
type VizMode = 'ballstick' | 'spacefill' | 'wireframe' | 'surface'

export default function StructureViewer({ data }: { data: StructureJSON }) {
  const ref = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<VizMode>('ballstick')
  const [autoRotate, setAutoRotate] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const width = ref.current.clientWidth
    const height = 320
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0b1220')
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
    camera.position.set(4, 4, 6)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 1

    const hemi = new THREE.HemisphereLight(0xffffff, 0x222233, 0.6)
    scene.add(hemi)

    const group = new THREE.Group()
    const atomMeshes: THREE.Mesh[] = []
    const atomRadius = (el: string) => (mode === 'spacefill' ? (el === 'H' ? 0.25 : el === 'O' ? 0.4 : el === 'N' ? 0.38 : 0.35) : 0.2)
    data.positions.forEach((p, i) => {
      const el = data.elements[i] || 'C'
      const geom = new THREE.SphereGeometry(atomRadius(el), 20, 20)
      const mat = new THREE.MeshStandardMaterial({ color: COLORS[el] || 0xffffff, wireframe: mode === 'wireframe', transparent: mode === 'surface', opacity: mode === 'surface' ? 0.35 : 1 })
      const m = new THREE.Mesh(geom, mat)
      m.position.set(p[0], p[1], p[2])
      atomMeshes.push(m)
      group.add(m)
    })
    if (mode !== 'spacefill' && mode !== 'surface') {
      data.bonds.forEach((b) => {
        const ai = data.positions[b[0]]
        const aj = data.positions[b[1]]
        if (!ai || !aj) return
        const start = new THREE.Vector3(ai[0], ai[1], ai[2])
        const end = new THREE.Vector3(aj[0], aj[1], aj[2])
        const axis = new THREE.Vector3().subVectors(end, start)
        const len = axis.length()
        const geom = new THREE.CylinderGeometry(0.06, 0.06, len, 12)
        const mat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, wireframe: mode === 'wireframe' })
        const cyl = new THREE.Mesh(geom, mat)
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
        cyl.position.copy(mid)
        cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis.clone().normalize())
        group.add(cyl)
      })
    }

    const box = new THREE.Box3().setFromObject(group)
    const center = box.getCenter(new THREE.Vector3())
    group.position.sub(center)

    scene.add(group)

    ref.current.appendChild(renderer.domElement)

    let raf = 0
    const animate = () => {
      controls.update()
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    const onResize = () => {
      const w = ref.current!.clientWidth
      camera.aspect = w / height
      camera.updateProjectionMatrix()
      renderer.setSize(w, height)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      ref.current?.removeChild(renderer.domElement)
    }
  }, [data, mode, autoRotate])
  const legendItems = useMemo(() => Array.from(new Set(data.elements)).slice(0, 12).map((el) => ({ label: el, color: `#${(COLORS[el] || 0x9aa0a6).toString(16).padStart(6, '0')}` })), [data.elements])

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs text-slate-400">3D Structure (from backend)</div>
        <div className="flex items-center gap-2">
          <select className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200" value={mode} onChange={(e) => setMode(e.target.value as VizMode)}>
            <option value="ballstick">Ball & Stick</option>
            <option value="spacefill">Space-filling</option>
            <option value="wireframe">Wireframe</option>
            <option value="surface">Surface</option>
          </select>
          <button className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800" onClick={() => setAutoRotate((v) => !v)}>{autoRotate ? 'Stop Rotate' : 'Auto-Rotate'}</button>
        </div>
      </div>
      <div ref={ref} className="relative w-full">
        <div className="pointer-events-none absolute right-2 top-2 z-10"><Legend items={legendItems} /></div>
      </div>
    </div>
  )
}
