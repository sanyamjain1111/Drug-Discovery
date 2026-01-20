import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreePlaceholder() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100)
    camera.position.z = 3

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(300, 180)

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.3, metalness: 0.2 })
    const cube = new THREE.Mesh(geometry, material)

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(1, 1, 2)

    scene.add(cube)
    scene.add(light)

    ref.current.appendChild(renderer.domElement)

    let raf = 0
    const animate = () => {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.012
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (renderer.domElement && ref.current?.contains(renderer.domElement)) {
        ref.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
      <div ref={ref} className="flex items-center justify-center" />
      <div className="mt-2 text-center text-xs text-slate-400">Three.js placeholder</div>
    </div>
  )
}
