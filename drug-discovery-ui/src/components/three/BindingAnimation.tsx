import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MOLECULES, COLORS } from './moleculesData'

export default function BindingAnimation({ drug = 'aspirin' }: { drug?: string }) {
  const mount = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!mount.current) return
    const width = mount.current.clientWidth
    const height = 240
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#0b1220')
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 200)
    camera.position.set(0, 2.2, 7)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true

    const hemi = new THREE.HemisphereLight(0xffffff, 0x222233, 0.8)
    scene.add(hemi)

    // protein pocket as blobby surface
    const protein = new THREE.Group()
    const pocketGeom = new THREE.SphereGeometry(2.2, 24, 24)
    const pocketMat = new THREE.MeshStandardMaterial({ color: 0x1f6feb, roughness: 0.8, metalness: 0.0, transparent: true, opacity: 0.25 })
    const pocket = new THREE.Mesh(pocketGeom, pocketMat)
    protein.add(pocket)
    scene.add(protein)

    // binding site indicator
    const site = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshStandardMaterial({ color: 0x22c55e }))
    site.position.set(0.6, 0.2, 0.4)
    protein.add(site)

    // drug molecule
    const data = MOLECULES[drug.toLowerCase()]
    const drugGroup = new THREE.Group()
    if (data) {
      const atomGeom = new THREE.SphereGeometry(0.16, 18, 18)
      data.atoms.forEach((atom) => {
        const mat = new THREE.MeshStandardMaterial({ color: COLORS[atom.element] || 0xffffff, roughness: 0.4 })
        const m = new THREE.Mesh(atomGeom, mat)
        m.position.set(atom.position[0], atom.position[1], atom.position[2])
        drugGroup.add(m)
      })
    }
    drugGroup.position.set(-5, 0, 0)
    scene.add(drugGroup)

    // highlight interactions as lines when near
    const interactionLines = new THREE.Group()
    scene.add(interactionLines)

    let raf = 0
    let t = 0
    const animate = () => {
      controls.update()
      if (playing) t += 0.01
      // stages: approach (-5 -> -1), find site (orbit), settle (lerp to site)
      if (t < 2) {
        drugGroup.position.x = THREE.MathUtils.lerp(-5, -1, t / 2)
      } else if (t < 4) {
        const phase = (t - 2) / 2
        drugGroup.position.set(-1 + Math.cos(phase * Math.PI * 2) * 0.6, 0.1 + Math.sin(phase * Math.PI * 2) * 0.3, 0.2)
      } else {
        const phase = Math.min(1, (t - 4) / 2)
        drugGroup.position.lerp(site.position, 0.05)
        // draw simple interaction lines
        interactionLines.clear()
        for (let i = 0; i < 3; i++) {
          const geom = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(site.position.x + (i - 1) * 0.1, site.position.y + 0.1 * i, site.position.z + 0.1),
            new THREE.Vector3(drugGroup.position.x, drugGroup.position.y, drugGroup.position.z),
          ])
          const mat = new THREE.LineBasicMaterial({ color: i % 2 === 0 ? 0x22c55e : 0xf59e0b })
          const line = new THREE.Line(geom, mat)
          interactionLines.add(line)
        }
      }
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    mount.current.appendChild(renderer.domElement)

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
  }, [drug, playing])

  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-xs text-slate-300">
        <button className="rounded border border-slate-700 bg-slate-900 px-2 py-1 hover:bg-slate-800" onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</button>
      </div>
      <div ref={mount} className="w-full" />
    </div>
  )
}
