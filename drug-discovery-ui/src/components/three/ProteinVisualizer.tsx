import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export interface ProteinVisualizerProps {
  proteinName?: string
  targetName?: string
  animate?: boolean
}

export default function ProteinVisualizer({ 
  proteinName = 'EGFR',
  targetName = 'Cancer Target',
  animate = true 
}: ProteinVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    try {
      // Initialize Three.js scene
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x0f172a)

      const width = container.clientWidth
      const height = container.clientHeight
      
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
      camera.position.z = 5

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(width, height)
      renderer.shadowMap.enabled = true
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      
      container.innerHTML = ''
      container.appendChild(renderer.domElement)

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
      scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0x0ea5e9, 0.8)
      directionalLight.position.set(10, 10, 5)
      directionalLight.castShadow = true
      scene.add(directionalLight)

      const pointLight = new THREE.PointLight(0x8b5cf6, 0.5)
      pointLight.position.set(-5, 5, 5)
      scene.add(pointLight)

      // Create protein group
      const protein = new THREE.Group()
      scene.add(protein)

      // Create helix strands
      const helixMaterial1 = new THREE.MeshStandardMaterial({ color: 0x00d4ff, roughness: 0.4 })
      const helixMaterial2 = new THREE.MeshStandardMaterial({ color: 0x9d4edd, roughness: 0.4 })

      // Strand 1 (Cyan)
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 4
        const x = Math.cos(angle) * 2
        const y = (i / 20) * 4 - 2
        const z = Math.sin(angle) * 2

        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.15, 16, 16),
          helixMaterial1
        )
        sphere.position.set(x, y, z)
        protein.add(sphere)
      }

      // Strand 2 (Purple)
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 4 + Math.PI
        const x = Math.cos(angle) * 2
        const y = (i / 20) * 4 - 2
        const z = Math.sin(angle) * 2

        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.15, 16, 16),
          helixMaterial2
        )
        sphere.position.set(x, y, z)
        protein.add(sphere)
      }

      // Add binding sites
      const bindingSiteMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        roughness: 0.2
      })

      const bindingSites = [
        { x: 0, y: 1, z: 0 },
        { x: 1, y: -1, z: 1 }
      ]

      bindingSites.forEach(pos => {
        const site = new THREE.Mesh(
          new THREE.SphereGeometry(0.3, 16, 16),
          bindingSiteMaterial.clone()
        )
        site.position.set(pos.x, pos.y, pos.z)
        protein.add(site)
      })

      // Animation loop
      let frameId: number
      const animateFrame = () => {
        frameId = requestAnimationFrame(animateFrame)
        
        protein.rotation.x += 0.005
        protein.rotation.y += 0.008
        protein.rotation.z += 0.002

        // Pulse binding sites
        const time = Date.now() * 0.001
        const startIdx = 40
        bindingSites.forEach((_, idx) => {
          const child = protein.children[startIdx + idx]
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            const pulse = Math.sin(time + idx) * 0.5 + 0.5
            child.material.emissiveIntensity = pulse
          }
        })

        renderer.render(scene, camera)
      }

      animateFrame()
      setLoading(false)

      // Handle resize
      const handleResize = () => {
        const newWidth = container.clientWidth
        const newHeight = container.clientHeight
        camera.aspect = newWidth / newHeight
        camera.updateProjectionMatrix()
        renderer.setSize(newWidth, newHeight)
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        cancelAnimationFrame(frameId)
        renderer.dispose()
      }
    } catch (err) {
      console.error('ProteinVisualizer error:', err)
      setError('Failed to load visualization')
      setLoading(false)
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      style={{ width: '100%', height: '100%', minHeight: '300px' }}
      className="bg-slate-900 rounded-lg overflow-hidden relative"
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
          <div className="text-slate-400 text-sm">Initializing...</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
          <div className="text-red-400 text-sm">{error}</div>
        </div>
      )}
    </div>
  )
}
