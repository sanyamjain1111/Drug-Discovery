import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MOLECULES, COLORS } from './moleculesData'

// Data now imported from moleculesData

type VizMode = 'ballstick' | 'spacefill' | 'wireframe' | 'surface'

export default function MoleculeViewer({ name }: { name: string }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<VizMode>('ballstick')
  const [autoRotate, setAutoRotate] = useState(false)
  const [thermal, setThermal] = useState(false)
  const [info, setInfo] = useState<string>('')
  const [distanceMode, setDistanceMode] = useState(false)
  const [distanceLabel, setDistanceLabel] = useState<string>('')

  useEffect(() => {
    if (!mountRef.current) return

    const width = mountRef.current.clientWidth
    const height = 320

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0b1220')

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
    camera.position.set(4, 4, 6)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.autoRotate = autoRotate
    controls.autoRotateSpeed = 1

    const hemi = new THREE.HemisphereLight(0xffffff, 0x222233, 0.6)
    scene.add(hemi)
    const dir = new THREE.DirectionalLight(0xffffff, 0.8)
    dir.position.set(5, 5, 5)
    scene.add(dir)

    // Build molecule
    const key = (name || '').toLowerCase()
    const data = MOLECULES[key as keyof typeof MOLECULES]
    const group = new THREE.Group()
    group.name = 'molecule-group'

    if (data) {
      const atomMeshes: THREE.Mesh[] = []
      const basePositions: THREE.Vector3[] = []
      const atomRadius = (el: string) => (mode === 'spacefill' ? (el === 'H' ? 0.25 : el === 'O' ? 0.4 : el === 'N' ? 0.38 : 0.35) : 0.2)
      const sphereDetail = 20
      data.atoms.forEach((a) => {
        const geom = new THREE.SphereGeometry(atomRadius(a.element), sphereDetail, sphereDetail)
        const mat = new THREE.MeshStandardMaterial({ color: COLORS[a.element] || 0xffffff, roughness: 0.4, metalness: 0.1, wireframe: mode === 'wireframe', transparent: mode === 'surface', opacity: mode === 'surface' ? 0.35 : 1 })
        const m = new THREE.Mesh(geom, mat)
        m.position.set(a.position[0], a.position[1], a.position[2])
        ;(m as any).element = a.element
        atomMeshes.push(m)
        basePositions.push(m.position.clone())
        group.add(m)
      })
      if (mode !== 'spacefill' && mode !== 'surface') {
        data.bonds.forEach(([i, j]) => {
          const ai = data.atoms[i]
          const aj = data.atoms[j]
          if (!ai || !aj) return
          const start = new THREE.Vector3(...ai.position)
          const end = new THREE.Vector3(...aj.position)
          const axis = new THREE.Vector3().subVectors(end, start)
          const len = axis.length()
          const geom = new THREE.CylinderGeometry(0.06, 0.06, len, 12)
          const mat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5, metalness: 0.1, wireframe: mode === 'wireframe' })
          const cyl = new THREE.Mesh(geom, mat)
          const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
          cyl.position.copy(mid)
          cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis.clone().normalize())
          group.add(cyl)
        })
      }

      // highlight simple functional groups (O and neighbors)
      const neighbors: Set<THREE.Mesh> = new Set()
      data.bonds.forEach(([i, j]) => {
        const ai = data.atoms[i]
        const aj = data.atoms[j]
        if (ai.element === 'O') neighbors.add(atomMeshes[j])
        if (aj.element === 'O') neighbors.add(atomMeshes[i])
      })
      atomMeshes.forEach((m) => {
        const mat = m.material as THREE.MeshStandardMaterial
        if ((m as any).element === 'O' || neighbors.has(m)) {
          mat.emissive = new THREE.Color(0x2563eb)
          mat.emissiveIntensity = 0.35
        }
      })

      // thermal vibrations
      const phases = basePositions.map(() => Math.random() * Math.PI * 2)
      const amp = 0.03

      // picking and distance measure
      const raycaster = new THREE.Raycaster()
      const pointer = new THREE.Vector2()
      const selected: THREE.Mesh[] = []
      const onClick = (event: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect()
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(pointer, camera)
        const intersects = raycaster.intersectObjects(atomMeshes)
        if (intersects.length > 0) {
          const m = intersects[0].object as THREE.Mesh
          const idx = atomMeshes.indexOf(m)
          const el = (m as any).element as string
          setInfo(`Atom ${idx} (${el})`)
          if (distanceMode) {
            if (selected.length === 2) selected.shift()
            selected.push(m)
            if (selected.length === 2) {
              const d = selected[0].position.distanceTo(selected[1].position)
              setDistanceLabel(`${d.toFixed(2)} Å`)
            }
          }
        }
      }
      renderer.domElement.addEventListener('click', onClick)

      const updateHook = (t: number) => {
        if (thermal) {
          atomMeshes.forEach((m, i) => {
            const base = basePositions[i]
            m.position.set(
              base.x + Math.sin(t * 2 + phases[i]) * amp,
              base.y + Math.cos(t * 1.6 + phases[i]) * amp,
              base.z + Math.sin(t * 1.3 + phases[i]) * amp,
            )
          })
        }
      }
      ;(group as any)._updateHook = updateHook

      // center group
      const box = new THREE.Box3().setFromObject(group)
      const center = box.getCenter(new THREE.Vector3())
      group.position.sub(center)
    }

    scene.add(group)

    mountRef.current.appendChild(renderer.domElement)

    let raf = 0
    const clock = new THREE.Clock()
    const animate = () => {
      const t = clock.getElapsedTime()
      controls.update()
      const g = scene.getObjectByName('molecule-group') as any
      if (g && typeof g._updateHook === 'function') g._updateHook(t)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    const onResize = () => {
      if (!mountRef.current) return
      const w = mountRef.current.clientWidth
      camera.aspect = w / height
      camera.updateProjectionMatrix()
      renderer.setSize(w, height)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, [name, mode, autoRotate, thermal, distanceMode])

  const moleculeData = useMemo(() => MOLECULES[(name || '').toLowerCase()], [name])
  const formula = useMemo(() => {
    if (!moleculeData) return ''
    const counts: Record<string, number> = {}
    moleculeData.atoms.forEach((a) => { counts[a.element] = (counts[a.element] || 0) + 1 })
    return Object.keys(counts).sort().map((el) => `${el}${counts[el] > 1 ? counts[el] : ''}`).join('')
  }, [moleculeData])

  function snapshot(highRes = false) {
    const el = mountRef.current?.querySelector('canvas') as HTMLCanvasElement | null
    if (!el) return
    if (!highRes) {
      const url = el.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `${(name || 'molecule')}-${Date.now()}.png`
      a.click()
      return
    }
    const prev = el.style.width
    el.style.width = '200%'
    setTimeout(() => {
      const url = el.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `${(name || 'molecule')}-${Date.now()}-hi.png`
      a.click()
      el.style.width = prev
    }, 100)
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm text-slate-300">3D Viewer {formula && <span className="ml-2 text-xs text-slate-500">Formula: {formula}</span>} <span className="ml-2 text-[10px] text-slate-500">(Drag to rotate, wheel to zoom)</span></div>
        <div className="flex items-center gap-2">
          <select className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200" value={mode} onChange={(e) => setMode(e.target.value as VizMode)}>
            <option value="ballstick">Ball & Stick</option>
            <option value="spacefill">Space-filling</option>
            <option value="wireframe">Wireframe</option>
            <option value="surface">Surface (basic)</option>
          </select>
          <button className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800" onClick={() => setAutoRotate((v) => !v)}>{autoRotate ? 'Stop Rotate' : 'Auto-Rotate'}</button>
          <button className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800" onClick={() => setThermal((v) => !v)}>{thermal ? 'Thermal Off' : 'Thermal On'}</button>
          <button className={`rounded border border-slate-700 px-2 py-1 text-xs ${distanceMode ? 'bg-bluepro text-slate-900' : 'bg-slate-900 text-slate-200'} hover:bg-slate-800`} onClick={() => setDistanceMode((v) => !v)} title="Measure distance">Measure</button>
          <button
            className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
            onClick={() => {
              // trigger re-mount by toggling key or reset controls via event
              // simplest: do nothing here as orbit controls have right-click pan, mousewheel zoom
              // could be enhanced later
              window.dispatchEvent(new Event('resize'))
            }}
          >
            Reset
          </button>
          <button className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800" onClick={() => snapshot(false)}>Snapshot</button>
          <button className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800" onClick={() => snapshot(true)} title="High-res PNG">Hi-Res</button>
        </div>
      </div>
      <div ref={mountRef} className="w-full" />
      <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
        {info && <span>Selected: {info}</span>}
        {distanceLabel && <span>Distance: {distanceLabel}</span>}
      </div>
      {!MOLECULES[(name || '').toLowerCase()] && (
        <div className="mt-2 text-xs text-slate-500">No preset for this molecule. Try Aspirin or Caffeine.</div>
      )}
    </div>
  )
}
