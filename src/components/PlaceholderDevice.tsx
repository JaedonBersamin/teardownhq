import { useMemo, useRef } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { PartId } from '../data/deviceConfig'
import { parts } from '../data/deviceConfig'

type Props = {
  selectedPartId: PartId | null
  removalIntent: boolean
  onSelectPart: (id: PartId) => void
}

const highlightColor = new THREE.Color('#639922')
const baseMetal = new THREE.Color('#c4c2bc')
const glass = new THREE.Color('#9ec5e8')
const battery = new THREE.Color('#3B6D11')
const shield = new THREE.Color('#8a8880')

export function PlaceholderDevice({
  selectedPartId,
  removalIntent,
  onSelectPart,
}: Props) {
  const groupRef = useRef<THREE.Group>(null)

  const handlePartClick =
    (id: PartId) =>
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      onSelectPart(id)
    }

  const screenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: glass,
        metalness: 0.1,
        roughness: 0.15,
        transparent: true,
        opacity: 0.85,
      }),
    [],
  )

  return (
    <group ref={groupRef} dispose={null}>
      <RoundedBox
        name="chassis"
        args={[1, 2, 0.2]}
        radius={0.06}
        smoothness={4}
        position={[0, 0, 0]}
        onClick={handlePartClick('chassis')}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <meshStandardMaterial
          color={baseMetal}
          metalness={0.35}
          roughness={0.45}
          emissive={selectedPartId === 'chassis' ? highlightColor : '#000000'}
          emissiveIntensity={selectedPartId === 'chassis' ? 0.35 : 0}
        />
      </RoundedBox>

      <mesh
        name="display"
        position={[0, 0.15, 0.105]}
        onClick={handlePartClick('display')}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <boxGeometry args={[0.92, 1.75, 0.02]} />
        <primitive
          attach="material"
          object={screenMat}
          emissive={selectedPartId === 'display' ? highlightColor : '#000000'}
          emissiveIntensity={selectedPartId === 'display' ? 0.25 : 0}
        />
      </mesh>

      <RoundedBox
        name="connector_shield"
        args={[0.35, 0.22, 0.04]}
        radius={0.02}
        smoothness={3}
        position={[0.22, -0.35, 0.11]}
        onClick={handlePartClick('connector_shield')}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <meshStandardMaterial
          color={shield}
          metalness={0.5}
          roughness={0.35}
          emissive={selectedPartId === 'connector_shield' ? highlightColor : '#000000'}
          emissiveIntensity={selectedPartId === 'connector_shield' ? 0.4 : 0}
        />
      </RoundedBox>

      <RoundedBox
        name="battery"
        args={[0.55, 0.95, 0.06]}
        radius={0.04}
        smoothness={3}
        position={[-0.12, -0.05, 0.11]}
        onClick={handlePartClick('battery')}
        onPointerOver={(e) => {
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto'
        }}
      >
        <meshStandardMaterial
          color={battery}
          metalness={0.15}
          roughness={0.55}
          emissive={selectedPartId === 'battery' ? highlightColor : '#000000'}
          emissiveIntensity={selectedPartId === 'battery' ? 0.3 : 0}
        />
      </RoundedBox>

      {removalIntent && selectedPartId
        ? parts[selectedPartId].screws.map((s) => (
            <group key={s.id} position={s.position}>
              <mesh>
                <sphereGeometry args={[0.045, 16, 16]} />
                <meshStandardMaterial color="#EAF3DE" metalness={0.2} roughness={0.4} />
              </mesh>
              <Html distanceFactor={6} center style={{ pointerEvents: 'none' }}>
                <div className="screw-label">{s.typeLabel}</div>
              </Html>
            </group>
          ))
        : null}
    </group>
  )
}
