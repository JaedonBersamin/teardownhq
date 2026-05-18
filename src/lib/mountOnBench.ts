import * as THREE from 'three'
import { alignAssemblyBackToMat } from './alignAssemblyToMat'
import { BENCH_MAT_SURFACE_Y, BENCH_PHONE_SPIN_Y } from '../constants/bench'

/** Orient back glass onto the mat, spin 180°, and snap to the surface. */
export function mountAssemblyOnBench(assembly: THREE.Group): THREE.Group {
  const mount = new THREE.Group()
  mount.name = 'bench-mount'

  alignAssemblyBackToMat(assembly)

  const heading = new THREE.Group()
  heading.name = 'bench-heading'
  heading.rotation.y = BENCH_PHONE_SPIN_Y
  heading.add(assembly)
  mount.add(heading)

  mount.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(mount)
  if (!box.isEmpty()) {
    mount.position.y = BENCH_MAT_SURFACE_Y - box.min.y
  }

  return mount
}
