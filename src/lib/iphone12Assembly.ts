import * as THREE from 'three'
import type { PartId } from '../data/deviceConfig'
import { findPartGroupName, resolvePartIdFromObject } from './iphone12PartResolve'

function cloneMaterial(mat: THREE.Material): THREE.Material {
  const c = mat.clone()
  c.side = THREE.DoubleSide
  if (c instanceof THREE.MeshStandardMaterial || c instanceof THREE.MeshPhysicalMaterial) {
    c.metalness = Math.min(c.metalness ?? 0, 0.35)
    c.roughness = Math.max(c.roughness ?? 0.5, 0.45)
    c.envMapIntensity = 1.2
    if (c.color) c.color.multiplyScalar(1.15)
    c.emissive = c.emissive.clone()
  }
  return c
}

/** Bake world transform into geometry so the assembled phone renders reliably. */
function meshToWorldPiece(mesh: THREE.Mesh): THREE.Mesh | null {
  const geo = mesh.geometry
  if (!geo) return null

  const baked = geo.clone()
  baked.applyMatrix4(mesh.matrixWorld)

  const src = mesh.material
  const material = Array.isArray(src) ? src.map(cloneMaterial) : cloneMaterial(src)

  const piece = new THREE.Mesh(baked, material)
  piece.name = mesh.name
  piece.frustumCulled = false
  piece.castShadow = true
  piece.receiveShadow = true
  return piece
}

/**
 * Flatten the GLB into world-space meshes (same idea as iphone-viewer) but keep
 * the original assembly positions instead of a catalog grid.
 */
export function buildAssemblyFromScene(source: THREE.Object3D): THREE.Group {
  source.updateMatrixWorld(true)

  const assembly = new THREE.Group()
  assembly.name = 'iphone12-assembly'

  source.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return
    const piece = meshToWorldPiece(obj)
    if (!piece) return
    piece.userData.partId = resolvePartIdFromObject(obj)
    piece.userData.partGroup = findPartGroupName(obj)
    assembly.add(piece)
  })

  assembly.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(assembly)
  if (!box.isEmpty()) {
    const center = box.getCenter(new THREE.Vector3())
    assembly.position.sub(center)
    assembly.updateMatrixWorld(true)
    const box2 = new THREE.Box3().setFromObject(assembly)
    const size = box2.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z, 1e-6)
    const target = 2.5
    assembly.scale.setScalar(target / maxDim)
  }

  return assembly
}

export function supportsEmissive(
  mat: THREE.Material,
): mat is
  | THREE.MeshStandardMaterial
  | THREE.MeshPhysicalMaterial
  | THREE.MeshLambertMaterial
  | THREE.MeshPhongMaterial {
  return (
    mat instanceof THREE.MeshStandardMaterial ||
    mat instanceof THREE.MeshPhysicalMaterial ||
    mat instanceof THREE.MeshLambertMaterial ||
    mat instanceof THREE.MeshPhongMaterial
  )
}

export const ASSEMBLY_HIGHLIGHT = new THREE.Color('#639922')

export function setAssemblyHighlight(
  root: THREE.Object3D,
  selectedPartId: PartId | null,
) {
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return
    const pid = obj.userData.partId as PartId | null | undefined
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
    for (const mat of mats) {
      if (!supportsEmissive(mat)) continue
      const on = Boolean(pid && selectedPartId && pid === selectedPartId)
      mat.emissive.copy(on ? ASSEMBLY_HIGHLIGHT : new THREE.Color(0x000000))
      mat.emissiveIntensity = on ? 0.22 : 0
    }
  })
}
