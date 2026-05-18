import { ContactShadows } from '@react-three/drei'
import {
  BENCH_SCENE_ROTATION_Y,
  BENCH_SURFACE_COLOR,
  BENCH_SURFACE_SIZE,
  BENCH_SURFACE_Y,
} from '../constants/bench'

/** Minimal work surface — one mat plane, soft shadow, rotated in the scene. */
export function RepairBench() {
  return (
    <group name="repair-bench" rotation={[0, BENCH_SCENE_ROTATION_Y, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, BENCH_SURFACE_Y, 0]} receiveShadow>
        <planeGeometry args={[BENCH_SURFACE_SIZE, BENCH_SURFACE_SIZE]} />
        <meshStandardMaterial color={BENCH_SURFACE_COLOR} roughness={0.9} metalness={0.02} />
      </mesh>

      <ContactShadows
        position={[0, BENCH_SURFACE_Y + 0.002, 0]}
        opacity={0.45}
        scale={5}
        blur={2.6}
        far={3}
        resolution={512}
        color="#1a1f18"
      />
    </group>
  )
}
