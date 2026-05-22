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

export function buildAssemblyFromScene(source: THREE.Object3D): THREE.Group {
  // make sure every part knows where it is in the scene before we read positions
  source.updateMatrixWorld(true)

  const assembly = new THREE.Group()
  assembly.name = 'iphone12-assembly'

  // keeps track of which group belongs to which part name so we don't create duplicates
  const partGroupMap = new Map<string, THREE.Group>()

  source.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return

    // copy the mesh and lock its position in place so it renders correctly
    const piece = meshToWorldPiece(obj)
    if (!piece) return

    const partId = resolvePartIdFromObject(obj)
    const partGroupName = findPartGroupName(obj) ?? '__ungrouped__'

    piece.userData.partId = partId
    piece.userData.partGroup = partGroupName

    // if this part doesn't have a group yet, create one and add it to the scene
    if (!partGroupMap.has(partGroupName)) {
      const g = new THREE.Group()
      g.name = partGroupName
      g.userData.partGroup = partGroupName
      g.userData.partId = partId
      partGroupMap.set(partGroupName, g)
      assembly.add(g)
    }

    // add this mesh into its part's group
    partGroupMap.get(partGroupName)!.add(piece)
  })

  // center the phone in the scene
  assembly.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(assembly)
  if (!box.isEmpty()) {
    const center = box.getCenter(new THREE.Vector3())
    assembly.position.sub(center)
    assembly.updateMatrixWorld(true)

    // resize so the phone always appears the same size regardless of the original model scale
    const box2 = new THREE.Box3().setFromObject(assembly)
    const size = box2.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z, 1e-6)
    assembly.scale.setScalar(2.5 / maxDim)
  }

  // save each part's starting position so we can animate it back later
  assembly.traverse((obj) => {
    if (obj instanceof THREE.Group && obj.userData.partId) {
      obj.userData.homePos = obj.position.clone()
    }
  })

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
export const ASSEMBLY_BLOCKING = new THREE.Color('#e85d04')

export function setAssemblyHighlight(
  root: THREE.Object3D,
  selectedPartId: PartId | null,
  blockingPartIds: Set<PartId> = new Set(),
) {
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return
    const pid = obj.userData.partId as PartId | null | undefined
    const isSelected = Boolean(pid && selectedPartId && pid === selectedPartId)
    const isBlocking = Boolean(pid && blockingPartIds.has(pid))

    // x-ray: blocking parts render on top of everything else
    obj.renderOrder = isBlocking ? 999 : 0

    const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
    for (const mat of mats) {
      mat.depthTest = !isBlocking

      if (!supportsEmissive(mat)) continue
      if (isSelected) {
        mat.emissive.copy(ASSEMBLY_HIGHLIGHT)
        mat.emissiveIntensity = 0.22
      } else if (isBlocking) {
        mat.emissive.copy(ASSEMBLY_BLOCKING)
        mat.emissiveIntensity = 0.5
      } else {
        mat.emissive.set(0x000000)
        mat.emissiveIntensity = 0
      }
    }
  })
}
