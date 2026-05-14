import { Canvas } from '@react-three/fiber'
import { Environment, Html, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import type { PartId } from '../data/deviceConfig'
import { IPhone12Model } from './IPhone12Model'

type Props = {
  selectedPartId: PartId | null
  removalIntent: boolean
  onSelectPart: (id: PartId) => void
}

type SceneProps = Pick<Props, 'selectedPartId' | 'onSelectPart'>

function ModelLoading() {
  return (
    <Html center>
      <div
        style={{
          padding: '10px 14px',
          borderRadius: 8,
          background: 'rgba(247,247,245,0.95)',
          border: '1px solid #e0e0dc',
          color: '#111',
          fontSize: 14,
          whiteSpace: 'nowrap',
        }}
      >
        Loading 3D model…
      </div>
    </Html>
  )
}

function Scene({ selectedPartId, onSelectPart }: SceneProps) {
  return (
    <>
      <color attach="background" args={['#e8ebe3']} />
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 8, 4]} intensity={1.15} castShadow />
      <OrbitControls makeDefault minDistance={1.2} maxDistance={14} enableDamping dampingFactor={0.08} />
      {/* Separate Suspense: HDR fetch must not block the GLB from mounting */}
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>
      <Suspense fallback={<ModelLoading />}>
        <IPhone12Model selectedPartId={selectedPartId} onSelectPart={onSelectPart} />
      </Suspense>
    </>
  )
}

export function DeviceCanvas(props: Props) {
  return (
    <div className="device-canvas">
      <Canvas
        shadows
        style={{ width: '100%', height: '100%', display: 'block' }}
        camera={{ position: [2.2, 1.4, 2.8], fov: 45 }}
        gl={{ antialias: true }}
      >
        <Scene selectedPartId={props.selectedPartId} onSelectPart={props.onSelectPart} />
      </Canvas>
    </div>
  )
}
