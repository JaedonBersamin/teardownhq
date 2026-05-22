import { useEffect, useLayoutEffect, useMemo } from 'react'
import { useFrame, useLoader, useThree, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { PartId } from '../data/deviceConfig'
import { IPHONE12_GLB_URL } from '../constants/model'
import { fitCameraToObject } from '../lib/fitCameraToObject'
import {
  buildAssemblyFromScene,
  setAssemblyHighlight,
} from '../lib/iphone12Assembly'
import { mountAssemblyOnBench } from '../lib/mountOnBench'

type Props = {
  selectedPartId: PartId | null
  onSelectPart: (id: PartId) => void
  removedParts: Set<PartId>
  onAttemptRemove: (id: PartId) => boolean
}

export function IPhone12Model({ selectedPartId, onSelectPart, removedParts, onAttemptRemove }: Props) {
  const gltf = useLoader(GLTFLoader, IPHONE12_GLB_URL)
  const { camera, invalidate } = useThree()
  const get = useThree((s) => s.get)

  const root = useMemo(
    () => mountAssemblyOnBench(buildAssemblyFromScene(gltf.scene)),
    [gltf],
  )

  useEffect(() => {
    let id2 = 0
    let cancelled = false
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => {
        if (cancelled) return
        fitCameraToObject(camera, root, get().controls as never)
        invalidate()
      })
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(id1)
      cancelAnimationFrame(id2)
    }
  }, [root, camera, get, invalidate])

  useLayoutEffect(() => {
    setAssemblyHighlight(root, selectedPartId)
  }, [root, selectedPartId])

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

  const partGroupMap = useMemo(() => {
    const map = new Map<PartId, THREE.Group[]>()
    root.traverse((obj) => {
      if (!(obj instanceof THREE.Group)) return
      const pid = obj.userData.partId as PartId | undefined
      if (!pid) return
      if (!map.has(pid)) map.set(pid, [])
      map.get(pid)!.push(obj)
    })
    return map
  }, [root])

  useFrame(() => {
    partGroupMap.forEach((groups, pid) => {
      const removed = removedParts.has(pid)
      for (const group of groups) {
        const home = group.userData.homePos as THREE.Vector3
        if (!home) continue
        const targetY = home.y + (removed ? 2 : 0)
        group.position.x = THREE.MathUtils.lerp(group.position.x, home.x, 0.12)
        group.position.y = THREE.MathUtils.lerp(group.position.y, targetY, 0.12)
        group.position.z = THREE.MathUtils.lerp(group.position.z, home.z, 0.12)
      }
    })
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    let o: THREE.Object3D | null = e.object
    while (o) {
      const pid = o.userData.partId as PartId | null | undefined
      if (pid) {
        onSelectPart(pid)
        onAttemptRemove(pid)
        return
      }
      o = o.parent
    }
  }


  return (
    <group onClick={handleClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
      <primitive object={root} dispose={null} />
    </group>
  )
}

useLoader.preload(GLTFLoader, IPHONE12_GLB_URL)
