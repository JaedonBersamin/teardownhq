import { useEffect, useLayoutEffect, useMemo } from 'react'
import { useLoader, useThree, type ThreeEvent } from '@react-three/fiber'
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
}

export function IPhone12Model({ selectedPartId, onSelectPart }: Props) {
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
