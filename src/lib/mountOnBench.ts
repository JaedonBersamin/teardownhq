import * as THREE from 'three'
import { BENCH_MAT_SURFACE_Y } from '../constants/bench'

/** Snap the assembly upright onto the bench surface. */
export function mountAssemblyOnBench(assembly: THREE.Group): THREE.Group {
  const mount = new THREE.Group()
  mount.name = 'bench-mount'

  mount.add(assembly)

  // snap lowest point of the model to the bench surface
  mount.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(mount)
  if (!box.isEmpty()) {
    mount.position.y = BENCH_MAT_SURFACE_Y - box.min.y
  }

  return mount
}
