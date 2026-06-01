/* eslint-disable react-hooks/immutability */
import { PointerLockControls, useKeyboardControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ACESFilmicToneMapping, Color, Fog, MathUtils, Vector3 } from 'three'
import ArtworkFrame from '../components/ArtworkFrame'
import GalleryRoom from '../components/GalleryRoom'
import { artworks } from '../data/artworks'

const WALK_SPEED = 4.2
const EYE_HEIGHT = 1.7
const LOOK_SENSITIVITY = 0.004
const ROOM_LIMITS = {
  x: 31.5,
  zMin: -25.5,
  zMax: 25.5,
}
const TELEPORT_POINTS = [
  { id: 'entry', position: [0, EYE_HEIGHT, 12] },
  { id: 'center', position: [0, EYE_HEIGHT, 2] },
  { id: 'left-wing', position: [-22, EYE_HEIGHT, -8] },
  { id: 'right-wing', position: [22, EYE_HEIGHT, -8] },
  { id: 'rear-gallery', position: [0, EYE_HEIGHT, -20] },
]

function clampCameraPosition(position) {
  position.x = Math.max(-ROOM_LIMITS.x, Math.min(ROOM_LIMITS.x, position.x))
  position.z = Math.max(ROOM_LIMITS.zMin, Math.min(ROOM_LIMITS.zMax, position.z))
  position.y = EYE_HEIGHT
}

function FirstPersonMovement({ isTouchNavigation }) {
  const { camera, gl } = useThree()
  const [, getKeys] = useKeyboardControls()
  const forward = useMemo(() => new Vector3(), [])
  const right = useMemo(() => new Vector3(), [])
  const movement = useMemo(() => new Vector3(), [])

  useEffect(() => {
    camera.position.set(0, EYE_HEIGHT, 5.8)
  }, [camera])

  useFrame((_, delta) => {
    const keys = getKeys()
    movement.set(0, 0, 0)

    camera.getWorldDirection(forward)
    forward.y = 0
    forward.normalize()

    right.set(1, 0, 0).applyQuaternion(camera.quaternion)
    right.y = 0
    right.normalize()

    if (keys.forward) movement.add(forward)
    if (keys.backward) movement.sub(forward)
    if (keys.rightward) movement.add(right)
    if (keys.leftward) movement.sub(right)

    if (movement.lengthSq() > 0) {
      movement.normalize().multiplyScalar(WALK_SPEED * delta)
      camera.position.add(movement)
      clampCameraPosition(camera.position)
    }
  })

  if (isTouchNavigation) return null

  return <PointerLockControls domElement={gl.domElement} makeDefault />
}

function MobileTouchNavigation() {
  const { camera, gl } = useThree()
  const activePointerId = useRef(null)
  const didDrag = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const startPointer = useRef({ x: 0, y: 0 })
  const pitch = useRef(camera.rotation.x)
  const yaw = useRef(camera.rotation.y)
  const targetPosition = useRef(null)
  const [activePointId, setActivePointId] = useState(null)

  useEffect(() => {
    const canvas = gl.domElement

    camera.rotation.order = 'YXZ'
    pitch.current = camera.rotation.x
    yaw.current = camera.rotation.y

    const handlePointerDown = (event) => {
      if (!event.isPrimary || activePointerId.current !== null) return

      activePointerId.current = event.pointerId
      didDrag.current = false
      lastPointer.current = { x: event.clientX, y: event.clientY }
      startPointer.current = { x: event.clientX, y: event.clientY }
      canvas.setPointerCapture(event.pointerId)
    }

    const handlePointerMove = (event) => {
      if (event.pointerId !== activePointerId.current) return

      const deltaX = event.clientX - lastPointer.current.x
      const deltaY = event.clientY - lastPointer.current.y
      lastPointer.current = { x: event.clientX, y: event.clientY }

      if (
        Math.abs(event.clientX - startPointer.current.x) > 8 ||
        Math.abs(event.clientY - startPointer.current.y) > 8
      ) {
        didDrag.current = true
      }

      yaw.current -= deltaX * LOOK_SENSITIVITY
      pitch.current -= deltaY * LOOK_SENSITIVITY
      pitch.current = MathUtils.clamp(
        pitch.current,
        MathUtils.degToRad(-72),
        MathUtils.degToRad(72),
      )

      camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ')
    }

    const clearPointer = (event) => {
      if (event.pointerId !== activePointerId.current) return

      activePointerId.current = null
      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId)
      }
    }

    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerup', clearPointer)
    canvas.addEventListener('pointercancel', clearPointer)

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', clearPointer)
      canvas.removeEventListener('pointercancel', clearPointer)
    }
  }, [camera, gl])

  useFrame((_, delta) => {
    if (!targetPosition.current) return

    camera.position.lerp(targetPosition.current, Math.min(1, delta * 3.6))
    clampCameraPosition(camera.position)

    if (camera.position.distanceTo(targetPosition.current) < 0.05) {
      camera.position.copy(targetPosition.current)
      targetPosition.current = null
    }
  })

  const handleTeleport = (point) => {
    if (didDrag.current) return

    targetPosition.current = new Vector3(...point.position)
    setActivePointId(point.id)
  }

  return (
    <group>
      {TELEPORT_POINTS.map((point) => (
        <group key={point.id} position={[point.position[0], 0.04, point.position[2]]}>
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            onClick={(event) => {
              event.stopPropagation()
              handleTeleport(point)
            }}
          >
            <ringGeometry args={[0.44, 0.62, 48]} />
            <meshBasicMaterial
              color={activePointId === point.id ? '#2b2118' : '#f8f1dc'}
              transparent
              opacity={0.86}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.18, 36]} />
            <meshBasicMaterial color="#2b2118" transparent opacity={0.72} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function GalleryScene({ isTouchNavigation = false, onArtworkSelect }) {
  const { gl, scene } = useThree()

  useEffect(() => {
    gl.toneMapping = ACESFilmicToneMapping
    gl.toneMappingExposure = 1.22
    scene.background = new Color('#f4f1ea')
    scene.fog = new Fog('#f4f1ea', 22, 58)
  }, [gl, scene])

  return (
    <>
      <ambientLight intensity={0.95} color="#fff6e8" />
      <hemisphereLight args={['#fffaf1', '#d4bd91', 0.9]} />
      <directionalLight
        position={[4, 9, 5]}
        intensity={0.95}
        color="#fff3dc"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-34}
        shadow-camera-right={34}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />

      <GalleryRoom />

      {artworks.map((artwork) => (
        <ArtworkFrame key={artwork.id} artwork={artwork} onSelect={onArtworkSelect} />
      ))}

      {isTouchNavigation && <MobileTouchNavigation />}
      <FirstPersonMovement isTouchNavigation={isTouchNavigation} />
    </>
  )
}
