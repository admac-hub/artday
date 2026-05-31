import { useTexture } from '@react-three/drei'
import { useMemo } from 'react'

export default function ArtworkFrame({ artwork }) {
  const texture = useTexture(artwork.image)
  console.log("artwork", artwork.image)
  console.log("texture", texture)
  console.log("texture image", texture.image)

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
    </group>
  )
}
