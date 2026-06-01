import { useTexture } from '@react-three/drei'
import { useMemo, useRef } from 'react'

const TAP_LIMIT = 10

function getPointerPosition(event) {
  const sourceEvent = event.nativeEvent ?? event

  return {
    pointerId: sourceEvent.pointerId,
    x: sourceEvent.clientX,
    y: sourceEvent.clientY,
  }
}

export default function ArtworkFrame({ artwork, onSelect }) {
  const texture = useTexture(artwork.image)
  const activePointer = useRef(null)

  const { imageWidth, imageHeight, frameWidth, frameHeight } = useMemo(() => {
    const aspect = texture.image ? texture.image.width / texture.image.height : 1
    const maxWidth = 1.75
    const maxHeight = 2
    const imageWidth = aspect >= 1 ? maxWidth : maxHeight * aspect
    const imageHeight = aspect >= 1 ? maxWidth / aspect : maxHeight
    const border = 0.14

    return {
      imageWidth,
      imageHeight,
      frameWidth: imageWidth + border * 2,
      frameHeight: imageHeight + border * 2,
    }
  }, [texture.image])

  const handlePointerDown = (event) => {
    event.stopPropagation()

    const pointer = getPointerPosition(event)
    activePointer.current = {
      ...pointer,
      startX: pointer.x,
      startY: pointer.y,
      didMove: false,
    }
  }

  const handlePointerMove = (event) => {
    const active = activePointer.current
    const pointer = getPointerPosition(event)
    if (!active || pointer.pointerId !== active.pointerId) return

    if (
      Math.abs(pointer.x - active.startX) > TAP_LIMIT ||
      Math.abs(pointer.y - active.startY) > TAP_LIMIT
    ) {
      active.didMove = true
    }
  }

  const handlePointerUp = (event) => {
    event.stopPropagation()

    const active = activePointer.current
    const pointer = getPointerPosition(event)
    activePointer.current = null

    if (!active || pointer.pointerId !== active.pointerId || active.didMove) return

    onSelect?.(artwork)
  }

  const clearPointer = (event) => {
    const pointer = getPointerPosition(event)
    if (activePointer.current?.pointerId === pointer.pointerId) {
      activePointer.current = null
    }
  }

  return (
    <group position={artwork.position} rotation={artwork.rotation}>
      <mesh position={[0, 0, -0.035]} castShadow receiveShadow>
        <boxGeometry args={[frameWidth, frameHeight, 0.08]} />
        <meshStandardMaterial color="#080706" roughness={0.52} metalness={0.18} />
      </mesh>

      <mesh position={[0, 0, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[imageWidth + 0.08, imageHeight + 0.08, 0.035]} />
        <meshStandardMaterial color="#d8d0bf" roughness={0.74} />
      </mesh>

      <mesh position={[0, 0, 0.065]} castShadow>
        <planeGeometry args={[imageWidth, imageHeight]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      <mesh position={[0, frameHeight / 2 - 0.04, 0.085]} castShadow>
        <boxGeometry args={[frameWidth, 0.08, 0.12]} />
        <meshStandardMaterial color="#17110d" roughness={0.48} metalness={0.22} />
      </mesh>
      <mesh position={[0, -frameHeight / 2 + 0.04, 0.085]} castShadow>
        <boxGeometry args={[frameWidth, 0.08, 0.12]} />
        <meshStandardMaterial color="#17110d" roughness={0.48} metalness={0.22} />
      </mesh>
      <mesh position={[-frameWidth / 2 + 0.04, 0, 0.085]} castShadow>
        <boxGeometry args={[0.08, frameHeight, 0.12]} />
        <meshStandardMaterial color="#17110d" roughness={0.48} metalness={0.22} />
      </mesh>
      <mesh position={[frameWidth / 2 - 0.04, 0, 0.085]} castShadow>
        <boxGeometry args={[0.08, frameHeight, 0.12]} />
        <meshStandardMaterial color="#17110d" roughness={0.48} metalness={0.22} />
      </mesh>

      <mesh
        position={[0, 0, 0.14]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={clearPointer}
        onPointerOut={clearPointer}
      >
        <planeGeometry args={[frameWidth + 0.28, frameHeight + 0.28]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}
