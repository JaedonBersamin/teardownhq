import * as THREE from 'three'
import {
  BENCH_BACK_PART_GROUPS,
  BENCH_DISPLAY_PART_GROUP,
} from '../constants/bench'

const WORLD_DOWN = new THREE.Vector3(0, -1, 0)
const BACK_GROUPS = new Set<string>(BENCH_BACK_PART_GROUPS)

function partGroupCenter(assembly: THREE.Object3D, groupName: string): THREE.Vector3 | null {
  const box = new THREE.Box3()
  let found = false
  assembly.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return
    if (obj.userData.partGroup !== groupName) return
    box.expandByObject(obj)
    found = true
  })
  if (!found || box.isEmpty()) return null
  return box.getCenter(new THREE.Vector3())
}

/** Direction from phone center toward the back cover (outward from the body). */
function computeBackOutward(assembly: THREE.Group): THREE.Vector3 | null {
  const phoneBox = new THREE.Box3().setFromObject(assembly)
  if (phoneBox.isEmpty()) return null
  const phoneCenter = phoneBox.getCenter(new THREE.Vector3())

  const backBox = new THREE.Box3()
  let hasBack = false
  assembly.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return
    const g = obj.userData.partGroup as string | undefined
    if (!g || !BACK_GROUPS.has(g)) return
    backBox.expandByObject(obj)
    hasBack = true
  })

  if (!hasBack || backBox.isEmpty()) return null

  const backCenter = backBox.getCenter(new THREE.Vector3())
  const outward = backCenter.sub(phoneCenter)
  if (outward.lengthSq() < 1e-10) return null
  return outward.normalize()
}

/** Point the back cover toward the mat; flip if the screen ended up underneath. */
export function alignAssemblyBackToMat(assembly: THREE.Group): boolean {
  const outward = computeBackOutward(assembly)
  if (!outward) return false

  const q = new THREE.Quaternion().setFromUnitVectors(outward, WORLD_DOWN)
  assembly.quaternion.premultiply(q)
  assembly.updateMatrixWorld(true)

  const backY = partGroupCenter(assembly, BENCH_BACK_PART_GROUPS[0])
  const displayY = partGroupCenter(assembly, BENCH_DISPLAY_PART_GROUP)
  if (backY !== null && displayY !== null && displayY.y < backY.y) {
    assembly.rotateY(Math.PI)
    assembly.updateMatrixWorld(true)
  }

  return true
}
