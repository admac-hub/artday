/* eslint-disable react-hooks/immutability */
import { PointerLockControls, useKeyboardControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { ACESFilmicToneMapping, Color, Fog, Vector3 } from 'three'
import ArtworkFrame from '../components/ArtworkFrame'
import GalleryRoom from '../components/GalleryRoom'
import { artworks } from '../data/artworks'

const WALK_SPEED = 4.2
const ROOM_LIMITS = {
  x: 31.5,
  zMin: -25.5,
  zMax: 25.5,
}

function FirstPersonMovement() {
  const { camera, gl } = useThree()
  const [, getKeys] = useKeyboardControls()
  const forward = useMemo(() => new Vector3(), [])
  const right = useMemo(() => new Vector3(), [])
  const movement = useMemo(() => new Vector3(), [])

  useEffect(() => {
    camera.position.set(0, 1.7, 5.8)
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
      camera.position.x = Math.max(
        -ROOM_LIMITS.x,
        Math.min(ROOM_LIMITS.x, camera.position.x),
      )
      camera.position.z = Math.max(
        ROOM_LIMITS.zMin,
        Math.min(ROOM_LIMITS.zMax, camera.position.z),
      )
      camera.position.y = 1.7
    }
  })

  return <PointerLockControls domElement={gl.domElement} makeDefault />
}

export default function GalleryScene() {
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
        <ArtworkFrame key={artwork.id} artwork={artwork} />
      ))}

      <FirstPersonMovement />
    </>
  )
}
