import { Suspense, useEffect, useMemo } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { Environment, Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/** Served from `iphone-viewer/public/` — symlink to main repo `public/models/iphone_12_teardown.glb` */
const GLB_URL = '/iphone_12_teardown.glb'

function Loading() {
  return (
    <Html center>
      <div
        style={{
          padding: '12px 16px',
          borderRadius: 8,
          background: 'rgba(247,247,245,0.96)',
          border: '1px solid #ccc',
          color: '#111',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        Loading GLB…
      </div>
    </Html>
  )
}

function Model() {
  const gltf = useLoader(GLTFLoader, GLB_URL)
  const { camera, invalidate } = useThree()
  const get = useThree((s) => s.get)

  const root = useMemo(() => {
    const g = gltf.scene.clone(true)
    g.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return
      obj.frustumCulled = false
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      for (const m of mats) {
        if ('side' in m) m.side = THREE.DoubleSide
      }
    })
    g.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(g)
    if (!box.isEmpty()) {
      const center = box.getCenter(new THREE.Vector3())
      g.position.sub(center)
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z, 1e-6)
      g.scale.setScalar(2.2 / maxDim)
    }
    return g
  }, [gltf])

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      root.updateMatrixWorld(true)
      const box = new THREE.Box3().setFromObject(root)
      if (box.isEmpty()) {
        invalidate()
        return
      }
      const sphere = new THREE.Sphere()
      box.getBoundingSphere(sphere)
      const c = sphere.center
      const rad = Math.max(sphere.radius, 0.05)
      const dist = rad * 3.4
      camera.position.set(c.x + dist * 0.75, c.y + dist * 0.45, c.z + dist * 0.9)
      camera.near = Math.max(0.001, rad / 300)
      camera.far = Math.max(500, rad * 120)
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.updateProjectionMatrix()
      }
      camera.lookAt(c)
      const controls = get().controls as
        | { target: THREE.Vector3; update?: () => void }
        | null
        | undefined
      controls?.target?.copy(c)
      controls?.update?.()
      invalidate()
    })
    return () => cancelAnimationFrame(id)
  }, [root, camera, get, invalidate])

  return <primitive object={root} dispose={null} />
}

useLoader.preload(GLTFLoader, GLB_URL)

export default function App() {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '100svh' }}>
      <Canvas
        shadows
        camera={{ position: [2.2, 1.4, 2.8], fov: 50 }}
        gl={{ antialias: true }}
        style={{ display: 'block', width: '100%', height: '100%', minHeight: '100svh', background: '#e8ebe3' }}
      >
        <color attach="background" args={['#e8ebe3']} />
        <ambientLight intensity={0.65} />
        <directionalLight position={[5, 8, 5]} intensity={1.15} castShadow />
        <OrbitControls makeDefault minDistance={0.9} maxDistance={20} enableDamping dampingFactor={0.08} />
        <Suspense fallback={null}>
          <Environment preset="city" />
        </Suspense>
        <Suspense fallback={<Loading />}>
          <Model />
        </Suspense>
      </Canvas>
    </div>
  )
}
