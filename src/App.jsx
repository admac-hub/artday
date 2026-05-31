import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Suspense } from 'react'
import GalleryScene from './scenes/GalleryScene'
import './App.css'

const keyboardMap = [
  { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
  { name: 'backward', keys: ['KeyS', 'ArrowDown'] },
  { name: 'leftward', keys: ['KeyA', 'ArrowLeft'] },
  { name: 'rightward', keys: ['KeyD', 'ArrowRight'] },
]

function App() {
  return (
    <main className="gallery-app">
      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows
          camera={{ position: [0, 1.7, 13.4], fov: 66, near: 0.1, far: 90 }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <GalleryScene />
          </Suspense>
        </Canvas>
      </KeyboardControls>

      <div className="gallery-hud">
        <strong>ArtDay Virtual Gallery</strong>
        <span>Click to look around. WASD to walk. Approach artworks to reveal plaques.</span>
      </div>
    </main>
  )
}

export default App
