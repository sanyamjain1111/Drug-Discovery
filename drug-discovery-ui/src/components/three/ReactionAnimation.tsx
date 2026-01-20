import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MOLECULES, COLORS } from './moleculesData'

export default function ReactionAnimation({ a = 'aspirin', b = 'caffeine' }: { a?: string; b?: string }) {
  const mount = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    if (!mount.current) return
    const width = mount.current.clientWidth
    const height = 260
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0b1220')
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200)
    camera.position.set(0, 3, 9)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    const hemi = new THREE.HemisphereLight(0xffffff, 0x222233, 0.7)
    scene.add(hemi)

    function buildMolecule(name: string, offsetX: number, colorizeBonds?: (i: number, j: number) => THREE.ColorRepresentation) {
      const data = MOLECULES[name]
      const group = new THREE.Group()
      if (!data) return group
      const atomGeom = new THREE.SphereGeometry(0.18, 18, 18)
      data.atoms.forEach((atom) => {
        const mat = new THREE.MeshStandardMaterial({ color: COLORS[atom.element] || 0xffffff, roughness: 0.4 })
        const m = new THREE.Mesh(atomGeom, mat)
        m.position.set(atom.position[0] + offsetX, atom.position[1], atom.position[2])
        group.add(m)
      })
      data.bonds.forEach(([i, j], idx) => {
        const ai = data.atoms[i]
        const aj = data.atoms[j]
        const start = new THREE.Vector3(ai.position[0] + offsetX, ai.position[1], ai.position[2])
        const end = new THREE.Vector3(aj.position[0] + offsetX, aj.position[1], aj.position[2])
        const axis = new THREE.Vector3().subVectors(end, start)
        const len = axis.length()
        const geom = new THREE.CylinderGeometry(0.05, 0.05, len, 10)
        const mat = new THREE.MeshStandardMaterial({ color: colorizeBonds ? colorizeBonds(i, j) : 0x94a3b8 })
        const cyl = new THREE.Mesh(geom, mat)
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
        cyl.position.copy(mid)
        cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), axis.clone().normalize())
        group.add(cyl)
      })
      return group
    }

    // random bonds to break/form as a simple effect
    const colorizeBreak = (i: number, j: number) => (Math.random() < 0.15 ? 0xef4444 : 0x94a3b8)
    const colorizeForm = (i: number, j: number) => (Math.random() < 0.15 ? 0x22c55e : 0x94a3b8)

    const molA = buildMolecule(a.toLowerCase(), -3, colorizeBreak)
    const molB = buildMolecule(b.toLowerCase(), 3, colorizeBreak)
    scene.add(molA)
    scene.add(molB)

    const products = buildMolecule(a.toLowerCase(), 0, colorizeForm)
    products.visible = false
    scene.add(products)

    mount.current.appendChild(renderer.domElement)

    let raf = 0
    let t = 0
    const animate = () => {
      controls.update()
      if (playing) t += 0.008 * speed
      // phases: 0..1 approach, 1..2 reaction, 2..3 products separate
      const phase = t % 3
      if (phase < 1) {
        molA.position.x = THREE.MathUtils.lerp(-3, -0.6, phase)
        molB.position.x = THREE.MathUtils.lerp(3, 0.6, phase)
      } else if (phase < 2) {
        molA.visible = false
        molB.visible = false
        products.visible = true
        products.scale.setScalar(1 + Math.sin((phase - 1) * Math.PI) * 0.05)
      } else {
        products.visible = true
        products.position.x = THREE.MathUtils.lerp(0, 1.2, phase - 2)
      }
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    const onResize = () => {
      const w = mount.current!.clientWidth
      camera.aspect = w / height
      camera.updateProjectionMatrix()
      renderer.setSize(w, height)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      mount.current?.removeChild(renderer.domElement)
    }
  }, [a, b, playing, speed])

  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-xs text-slate-300">
        <button className="rounded border border-slate-700 bg-slate-900 px-2 py-1 hover:bg-slate-800" onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</button>
        <label className="flex items-center gap-2"><span>Speed</span><input type="range" min={0.2} max={3} step={0.2} value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} /></label>
      </div>
      <div ref={mount} className="w-full" />
    </div>
  )
}
