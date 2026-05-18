import * as THREE from 'three'

export type FlatPiece = {
  key: string
  group: THREE.Group
}

function cloneMaterial(mat: THREE.Material): THREE.Material {
  const c = mat.clone()
  c.side = THREE.DoubleSide
  if (c instanceof THREE.MeshStandardMaterial || c instanceof THREE.MeshPhysicalMaterial) {
    c.metalness = Math.min(c.metalness ?? 0, 0.35)
    c.roughness = Math.max(c.roughness ?? 0.5, 0.45)
    c.envMapIntensity = 1.2
    if (c.color) c.color.multiplyScalar(1.15)
  }
  return c
}

/** Build one mesh with geometry centered at origin (ignores world matrix — reliable for catalog view). */
function meshToCenteredPiece(mesh: THREE.Mesh): THREE.Mesh | null {
  const geo = mesh.geometry
  if (!geo) return null
  const centered = geo.clone()
  centered.computeBoundingBox()
  const bb = centered.boundingBox
  if (!bb || bb.isEmpty()) return null

  const c = bb.getCenter(new THREE.Vector3())
  centered.translate(-c.x, -c.y, -c.z)

  const src = mesh.material
  const material = Array.isArray(src)
    ? src.map(cloneMaterial)
    : cloneMaterial(src)

  const piece = new THREE.Mesh(centered, material)
  piece.name = mesh.name
  piece.frustumCulled = false
  piece.castShadow = true
  piece.receiveShadow = true
  return piece
}

export function buildFlatLayout(source: THREE.Object3D): {
  root: THREE.Group
  pieces: FlatPiece[]
  gridSize: { cols: number; rows: number; spacing: number }
} {
  const meshes: THREE.Mesh[] = []
  source.traverse((obj) => {
    if (obj instanceof THREE.Mesh) meshes.push(obj)
  })

  const pieces: FlatPiece[] = []
  let maxExtent = 0.001

  for (const mesh of meshes) {
    const piece = meshToCenteredPiece(mesh)
    if (!piece) continue

    const group = new THREE.Group()
    group.name = mesh.name || `part_${pieces.length}`
    group.add(piece)

    piece.geometry.computeBoundingBox()
    const bb = piece.geometry.boundingBox!
    const size = bb.getSize(new THREE.Vector3())
    maxExtent = Math.max(maxExtent, size.x, size.y, size.z)

    pieces.push({ key: group.name, group })
  }

  const count = pieces.length
  const cols = Math.ceil(Math.sqrt(count))
  const rows = Math.ceil(count / cols)
  const spacing = Math.max(maxExtent * 1.8, 0.015)

  const layoutRoot = new THREE.Group()
  layoutRoot.name = 'flat-layout'

  pieces.forEach(({ group }, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    group.position.set(
      (col - (cols - 1) / 2) * spacing,
      0,
      (row - (rows - 1) / 2) * spacing,
    )
    layoutRoot.add(group)
  })

  layoutRoot.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(layoutRoot)
  if (!box.isEmpty()) {
    const center = box.getCenter(new THREE.Vector3())
    layoutRoot.position.sub(center)
    layoutRoot.updateMatrixWorld(true)
    const box2 = new THREE.Box3().setFromObject(layoutRoot)
    const size = box2.getSize(new THREE.Vector3())
    const span = Math.max(size.x, size.z, 0.001)
    const scale = 10 / span
    layoutRoot.scale.setScalar(scale)
  }

  const wrapper = new THREE.Group()
  wrapper.add(layoutRoot)

  return { root: wrapper, pieces, gridSize: { cols, rows, spacing } }
}

export function fitCameraToObject(
  camera: THREE.Camera,
  object: THREE.Object3D,
  controls?: { target: THREE.Vector3; update?: () => void } | null,
) {
  object.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(object)
  if (box.isEmpty()) return

  const sphere = new THREE.Sphere()
  box.getBoundingSphere(sphere)
  const c = sphere.center
  const rad = Math.max(sphere.radius, 0.5)
  const dist = rad * 2.5

  camera.position.set(c.x + dist * 0.55, c.y + dist * 1.05, c.z + dist * 0.85)
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.near = 0.05
    camera.far = 5000
    camera.fov = 45
    camera.updateProjectionMatrix()
  }
  camera.lookAt(c)
  controls?.target?.copy(c)
  controls?.update?.()
}
