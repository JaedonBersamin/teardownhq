import { Canvas } from '@react-three/fiber'
import { Environment, Html, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import type { PartId } from '../data/deviceConfig'
import { IPhone12Model } from './IPhone12Model'
import { RepairBench } from './RepairBench'

type Props = {
  selectedPartId: PartId | null
  removalIntent: boolean
  onSelectPart: (id: PartId) => void
  removedParts: Set<PartId>
  onAttemptRemove: (id: PartId) => boolean
  blockingPartIds: Set<PartId>
}

type SceneProps = Pick<Props, 'selectedPartId' | 'onSelectPart' | 'removedParts' | 'onAttemptRemove' | 'blockingPartIds'>

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

function Scene({ selectedPartId, onSelectPart, removedParts, onAttemptRemove, blockingPartIds }: SceneProps) {
  return (
    <>
      <color attach="background" args={['#1a1a1a']} />
      <ambientLight intensity={0.85} />
      <directionalLight
        position={[6, 14, 5]}
        intensity={1.45}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={28}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-bias={-0.0002}
      />
      <directionalLight position={[-8, 6, -6]} intensity={0.55} />
      <RepairBench />
      <OrbitControls makeDefault minDistance={0.5} maxDistance={50} enableDamping dampingFactor={0.08} />
      {/* Separate Suspense: HDR fetch must not block the GLB from mounting */}
      <Suspense fallback={null}>
        <Environment preset="sunset" background={false} />
      </Suspense>
      <Suspense fallback={<ModelLoading />}>
        <IPhone12Model
          selectedPartId={selectedPartId}
          onSelectPart={onSelectPart}
          removedParts={removedParts}
          onAttemptRemove={onAttemptRemove}
          blockingPartIds={blockingPartIds}
        />
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
        camera={{ position: [0, 6, 10], fov: 45, near: 0.05, far: 5000 }}
        gl={{ antialias: true }}
      >
        <Scene
          selectedPartId={props.selectedPartId}
          onSelectPart={props.onSelectPart}
          removedParts={props.removedParts}
          onAttemptRemove={props.onAttemptRemove}
          blockingPartIds={props.blockingPartIds}
        />
      </Canvas>
    </div>
  )
}
