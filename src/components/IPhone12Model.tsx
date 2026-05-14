import { useEffect, useLayoutEffect, useMemo } from 'react'
import { useLoader, useThree, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { PartId } from '../data/deviceConfig'
import { IPHONE12_GLB_URL } from '../constants/model'
import { resolvePartIdFromObject } from '../lib/iphone12PartResolve'

type Props = {
  selectedPartId: PartId | null
  onSelectPart: (id: PartId) => void
}

const HIGHLIGHT = new THREE.Color('#639922')

function cloneMaterialForMesh(m: THREE.Material): THREE.Material {
  const c = m.clone()
  if (
    c instanceof THREE.MeshStandardMaterial ||
    c instanceof THREE.MeshPhysicalMaterial ||
    c instanceof THREE.MeshLambertMaterial ||
    c instanceof THREE.MeshPhongMaterial
  ) {
    c.emissive = c.emissive.clone()
  }
  return c
}

function supportsEmissive(
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

export function IPhone12Model({ selectedPartId, onSelectPart }: Props) {
  const gltf = useLoader(GLTFLoader, IPHONE12_GLB_URL)
  const { camera, invalidate } = useThree()
  const get = useThree((s) => s.get)

  const root = useMemo(() => {
    const g = gltf.scene.clone(true)
    g.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return
      const partId = resolvePartIdFromObject(obj)
      obj.userData.partId = partId
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      obj.material = mats.map((mat) => cloneMaterialForMesh(mat))
      obj.castShadow = true
      obj.receiveShadow = true
      obj.frustumCulled = false
      const matList = Array.isArray(obj.material) ? obj.material : [obj.material]
      for (const mat of matList) {
        if ('side' in mat && mat.side !== undefined) {
          mat.side = THREE.DoubleSide
        }
      }
    })
    g.updateMatrixWorld(true)
    const box = new THREE.Box3().setFromObject(g)
    if (!box.isEmpty()) {
      const center = box.getCenter(new THREE.Vector3())
      g.position.sub(center)
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z, 1e-6)
      const target = 2.2
      g.scale.setScalar(target / maxDim)
    }
    return g
  }, [gltf])

  /** After load, move camera to the model — default camera often misses scaled GLB bounds */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      root.updateMatrixWorld(true)
      const box = new THREE.Box3().setFromObject(root)
      if (box.isEmpty()) {
        invalidate()
        return
      }
      const sphere = new THREE.Sphere()
      box.getBoundingSphere(sphere)
      const c = sphere.center
      const rad = Math.max(sphere.radius, 0.05)
      const dist = rad * 3.4
      camera.position.set(c.x + dist * 0.75, c.y + dist * 0.45, c.z + dist * 0.9)
      camera.near = Math.max(0.001, rad / 300)
      camera.far = Math.max(500, rad * 120)
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.updateProjectionMatrix()
      }
      camera.lookAt(c)

      const controls = get().controls as
        | { target: THREE.Vector3; update?: () => void }
        | null
        | undefined
      if (controls?.target) {
        controls.target.copy(c)
        controls.update?.()
      }
      invalidate()
    })
    return () => cancelAnimationFrame(id)
  }, [root, camera, get, invalidate])

  useLayoutEffect(() => {
    root.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return
      const pid = obj.userData.partId as PartId | null | undefined
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
      for (const mat of mats) {
        if (!supportsEmissive(mat)) continue
        const on = Boolean(pid && selectedPartId && pid === selectedPartId)
        mat.emissive.copy(on ? HIGHLIGHT : new THREE.Color(0x000000))
        mat.emissiveIntensity = on ? 0.22 : 0
      }
    })
  }, [root, selectedPartId])

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    let o: THREE.Object3D | null = e.object
    while (o) {
      const pid = o.userData.partId as PartId | null | undefined
      if (pid) {
        onSelectPart(pid)
        return
      }
      o = o.parent
    }
  }

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    let o: THREE.Object3D | null = e.object
    while (o) {
      if (o.userData.partId) {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
        return
      }
      o = o.parent
    }
  }

  const handlePointerOut = () => {
    document.body.style.cursor = 'auto'
  }

  return (
    <group onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
      <primitive object={root} dispose={null} />
    </group>
  )
}

useLoader.preload(GLTFLoader, IPHONE12_GLB_URL)
