import { Suspense, useEffect, useMemo, useState } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { Environment, Html, OrbitControls } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { buildFlatLayout, fitCameraToObject } from './layoutFlat'

const GLB_FILENAME = 'iphone_12_teardown.glb'
const GLB_URL = `/${GLB_FILENAME}`

function Loading() {
  return (
    <Html center>
      <div
        style={{
          padding: '12px 16px',
          borderRadius: 8,
          background: '#fff',
          border: '1px solid #ccc',
          color: '#111',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        Loading model…
      </div>
    </Html>
  )
}

type FlatProps = { onReady: (count: number) => void }

function FlatPartsModel({ onReady }: FlatProps) {
  const gltf = useLoader(GLTFLoader, GLB_URL)
  const { camera, invalidate } = useThree()
  const get = useThree((s) => s.get)

  const { root, count } = useMemo(() => {
    const { root: layout, pieces } = buildFlatLayout(gltf.scene)
    return { root: layout, count: pieces.length }
  }, [gltf])

  useEffect(() => {
    onReady(count)
  }, [count, onReady])

  useEffect(() => {
    let id2 = 0
    let cancelled = false
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => {
        if (cancelled) return
        fitCameraToObject(camera, root, get().controls as never)
        invalidate()
      })
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(id1)
      cancelAnimationFrame(id2)
    }
  }, [root, camera, get, invalidate])

  return <primitive object={root} dispose={null} />
}

useLoader.preload(GLTFLoader, GLB_URL)

export default function App() {
  const [pieceCount, setPieceCount] = useState<number | null>(null)

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#c5cdc0' }}>
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 10,
          padding: '8px 12px',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.95)',
          border: '1px solid #999',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 13,
          color: '#111',
        }}
      >
        <p style={{ margin: 0 }}>
          {pieceCount === null
            ? 'Loading…'
            : `${pieceCount} parts — drag to orbit, scroll to zoom`}
        </p>
        <p style={{ margin: '8px 0 0', fontSize: 12 }}>
          <a href={GLB_URL} download={GLB_FILENAME} style={{ color: '#3b6d11', fontWeight: 600 }}>
            Download GLB
          </a>
        </p>
      </div>

      <Canvas
        camera={{ position: [0, 6, 10], fov: 45, near: 0.05, far: 5000 }}
        gl={{ antialias: true, alpha: false }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        onCreated={({ gl }) => {
          gl.setClearColor('#c5cdc0')
        }}
      >
        <color attach="background" args={['#c5cdc0']} />
        <ambientLight intensity={0.85} />
        <directionalLight position={[12, 18, 8]} intensity={1.5} />
        <directionalLight position={[-10, 8, -8]} intensity={0.6} />
        <Suspense fallback={null}>
          <Environment preset="sunset" background={false} />
        </Suspense>
        <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
        <Suspense fallback={<Loading />}>
          <FlatPartsModel onReady={setPieceCount} />
        </Suspense>
      </Canvas>
    </div>
  )
}
