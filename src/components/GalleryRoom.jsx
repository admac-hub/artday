import { useMemo } from 'react'
import { Object3D } from 'three'

function Wall({ position, size }) {
  return (
    <mesh position={position} receiveShadow castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#f7f5ef" roughness={0.82} metalness={0.01} />
    </mesh>
  )
}

function OakFloor() {
  const boards = useMemo(() => {
    const columns = 34
    const rows = 30
    const boardWidth = 2
    const boardDepth = 1.8
    const tones = ['#f1dbb6', '#e7cda1', '#f6e2bf', '#dcc08f']

    return Array.from({ length: columns * rows }, (_, index) => {
      const row = Math.floor(index / columns)
      const column = index % columns
      const offset = row % 2 === 0 ? 0 : boardWidth * 0.5

      return {
        key: `${row}-${column}`,
        color: tones[(row + column) % tones.length],
        position: [-33 + column * boardWidth + offset, 0.01, -26.2 + row * boardDepth],
      }
    })
  }, [])

  return (
    <group>
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[66, 0.1, 54]} />
        <meshStandardMaterial color="#e3c696" roughness={0.58} metalness={0.02} />
      </mesh>

      {boards.map((board) => (
        <mesh key={board.key} position={board.position} receiveShadow>
          <boxGeometry args={[1.95, 0.035, 1.75]} />
          <meshStandardMaterial color={board.color} roughness={0.52} metalness={0.01} />
        </mesh>
      ))}
    </group>
  )
}

function Skylight() {
  return (
    <group>
      <mesh position={[0, 8.75, -5]} receiveShadow>
        <boxGeometry args={[18, 0.05, 9]} />
        <meshStandardMaterial color="#b9d8ec" roughness={0.08} transparent opacity={0.42} />
      </mesh>
      {[-9, -4.5, 0, 4.5, 9].map((x) => (
        <mesh key={x} position={[x, 8.82, -5]} castShadow>
          <boxGeometry args={[0.08, 0.08, 9.2]} />
          <meshStandardMaterial color="#ded8cc" roughness={0.34} metalness={0.12} />
        </mesh>
      ))}
      {[-9.5, -7.25, -5, -2.75, -0.5].map((z) => (
        <mesh key={z} position={[0, 8.83, z]} castShadow>
          <boxGeometry args={[18.2, 0.08, 0.08]} />
          <meshStandardMaterial color="#ded8cc" roughness={0.34} metalness={0.12} />
        </mesh>
      ))}
    </group>
  )
}

function TrackLight({ position, targetPosition }) {
  const target = useMemo(() => {
    const object = new Object3D()
    object.position.set(...targetPosition)
    return object
  }, [targetPosition])

  return (
    <group>
      <primitive object={target} />
      <mesh position={position} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 0.3, 28]} />
        <meshStandardMaterial color="#f8f5ee" roughness={0.3} metalness={0.18} />
      </mesh>
      <spotLight
        position={[position[0], position[1] - 0.08, position[2]]}
        target={target}
        angle={0.45}
        penumbra={0.74}
        intensity={6.5}
        distance={18}
        color="#fff6e8"
        castShadow
        shadow-mapSize={[1536, 1536]}
        shadow-bias={-0.00015}
      />
    </group>
  )
}

function Track({ z, lights }) {
  return (
    <group>
      <mesh position={[0, 8.55, z]} castShadow>
        <boxGeometry args={[54, 0.06, 0.08]} />
        <meshStandardMaterial color="#ded8ce" roughness={0.36} metalness={0.18} />
      </mesh>
      {lights.map((light) => (
        <TrackLight
          key={`${light[0]}-${light[2]}`}
          position={[light[0], 8.35, z]}
          targetPosition={light}
        />
      ))}
    </group>
  )
}

function Bench({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.18, 0.78]} />
        <meshStandardMaterial color="#ded8cd" roughness={0.46} />
      </mesh>
      {[-1.6, 1.6].map((x) => (
        <mesh key={x} position={[x, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.18, 0.4, 0.54]} />
          <meshStandardMaterial color="#bbb3a7" roughness={0.4} metalness={0.08} />
        </mesh>
      ))}
    </group>
  )
}

export default function GalleryRoom() {
  return (
    <group>
      <OakFloor />

      <Wall position={[0, 4.25, -27]} size={[66, 8.5, 0.24]} />
      <Wall position={[-33, 4.25, 0]} size={[0.24, 8.5, 54]} />
      <Wall position={[33, 4.25, 0]} size={[0.24, 8.5, 54]} />
      <Wall position={[0, 4.25, 27]} size={[66, 8.5, 0.24]} />

      <mesh position={[0, 8.62, -18.25]} receiveShadow>
        <boxGeometry args={[66, 0.14, 17.5]} />
        <meshStandardMaterial color="#faf8f2" roughness={0.86} />
      </mesh>
      <mesh position={[0, 8.62, 13.25]} receiveShadow>
        <boxGeometry args={[66, 0.14, 26.5]} />
        <meshStandardMaterial color="#faf8f2" roughness={0.86} />
      </mesh>
      <mesh position={[-21, 8.62, -5]} receiveShadow>
        <boxGeometry args={[24, 0.14, 9]} />
        <meshStandardMaterial color="#faf8f2" roughness={0.86} />
      </mesh>
      <mesh position={[21, 8.62, -5]} receiveShadow>
        <boxGeometry args={[24, 0.14, 9]} />
        <meshStandardMaterial color="#faf8f2" roughness={0.86} />
      </mesh>
      <Skylight />

      <Wall position={[-10, 3.05, -5]} size={[0.28, 6.1, 25]} />
      <Wall position={[10, 3.05, -5]} size={[0.28, 6.1, 25]} />
      <Wall position={[0, 3.05, 13]} size={[22, 6.1, 0.28]} />
      <Wall position={[0, 3.05, -16]} size={[20, 6.1, 0.28]} />

      <Bench position={[0, 0, 4]} />
      <Bench position={[-22, 0, -8]} rotation={[0, Math.PI / 2, 0]} />
      <Bench position={[22, 0, -8]} rotation={[0, Math.PI / 2, 0]} />

      <Track
        z={-20}
        lights={[
          [-24, 2.75, -25.5],
          [-12, 2.75, -25.5],
          [0, 2.75, -25.5],
          [12, 2.75, -25.5],
          [24, 2.75, -25.5],
        ]}
      />
      <Track
        z={-3}
        lights={[
          [-28, 2.75, -6],
          [-10, 2.65, -5],
          [10, 2.65, -5],
          [28, 2.75, -6],
        ]}
      />
      <Track
        z={14}
        lights={[
          [-28, 2.75, 12],
          [-10, 2.65, 5],
          [0, 2.7, 13],
          [10, 2.65, 5],
          [28, 2.75, 12],
        ]}
      />
    </group>
  )
}
