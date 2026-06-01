import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Suspense, useEffect, useState } from 'react'
import GalleryScene from './scenes/GalleryScene'
import { artworks, initialArtworkIds } from './data/artworks'
import './App.css'

const keyboardMap = [
  { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
  { name: 'backward', keys: ['KeyS', 'ArrowDown'] },
  { name: 'leftward', keys: ['KeyA', 'ArrowLeft'] },
  { name: 'rightward', keys: ['KeyD', 'ArrowRight'] },
]
const initialArtworkSet = new Set(initialArtworkIds)
const initialArtworks = artworks.filter((artwork) => initialArtworkSet.has(artwork.id))

function useTouchNavigation() {
  const [isTouchNavigation, setIsTouchNavigation] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)')
    const updateNavigationMode = () => setIsTouchNavigation(query.matches)

    updateNavigationMode()
    query.addEventListener('change', updateNavigationMode)

    return () => query.removeEventListener('change', updateNavigationMode)
  }, [])

  return isTouchNavigation
}

function useInitialArtworkPreload() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let isMounted = true
    let loadedCount = 0

    const updateProgress = () => {
      loadedCount += 1
      if (isMounted) {
        setProgress(Math.round((loadedCount / initialArtworks.length) * 100))
      }
    }

    initialArtworks.forEach((artwork) => {
      const image = new Image()

      image.onload = async () => {
        try {
          await image.decode?.()
        } finally {
          updateProgress()
        }
      }
      image.onerror = updateProgress
      image.src = artwork.image
    })

    return () => {
      isMounted = false
    }
  }, [])

  return progress
}

function App() {
  const isTouchNavigation = useTouchNavigation()
  const initialLoadProgress = useInitialArtworkPreload()
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const selectedArtworkIndex = selectedArtwork
    ? artworks.findIndex((artwork) => artwork.id === selectedArtwork.id)
    : -1
  const currentArtworkIndex = selectedArtworkIndex >= 0 ? selectedArtworkIndex : 0
  const artworkCount = artworks.length

  const showPreviousArtwork = () => {
    const previousIndex = (currentArtworkIndex - 1 + artworkCount) % artworkCount

    setSelectedArtwork(artworks[previousIndex])
  }

  const showNextArtwork = () => {
    const nextIndex = (currentArtworkIndex + 1) % artworkCount

    setSelectedArtwork(artworks[nextIndex])
  }

  return (
    <main className="gallery-app">
      <KeyboardControls map={keyboardMap}>
        <Canvas
          shadows
          camera={{ position: [0, 1.7, 13.4], fov: 66, near: 0.1, far: 90 }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <GalleryScene
              isTouchNavigation={isTouchNavigation}
              onArtworkSelect={setSelectedArtwork}
            />
          </Suspense>
        </Canvas>
      </KeyboardControls>

      <div className="gallery-hud">
        <strong>ArtDay Virtual Gallery</strong>
        <span>
          {isTouchNavigation
            ? 'Drag to look around. Tap artworks to view them.'
            : 'Click to look around. WASD to walk. Approach artworks to reveal plaques.'}
        </span>
      </div>

      {initialLoadProgress < 100 && (
        <div className="gallery-loading" role="status" aria-live="polite">
          <strong>Loading ArtDay Virtual Gallery</strong>
          <span>{initialLoadProgress}%</span>
          <div className="gallery-loading__bar">
            <div style={{ width: `${initialLoadProgress}%` }} />
          </div>
        </div>
      )}

      {selectedArtwork && (
        <div
          className="artwork-focus"
          role="dialog"
          aria-modal="true"
          aria-labelledby="artwork-focus-title"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <button
            className="artwork-focus__close"
            type="button"
            aria-label="Close artwork detail"
            onClick={() => setSelectedArtwork(null)}
          >
            &times;
          </button>
          <img src={selectedArtwork.image} alt={selectedArtwork.title} />
          <button
            className="artwork-focus__nav artwork-focus__nav--previous"
            type="button"
            aria-label="Previous artwork"
            onClick={showPreviousArtwork}
          >
            {'<'}
          </button>
          <button
            className="artwork-focus__nav artwork-focus__nav--next"
            type="button"
            aria-label="Next artwork"
            onClick={showNextArtwork}
          >
            {'>'}
          </button>
          <div className="artwork-focus__caption">
            <strong id="artwork-focus-title">{selectedArtwork.title}</strong>
            <span>
              {currentArtworkIndex + 1} of {artworkCount}
            </span>
          </div>
        </div>
      )}
    </main>
  )
}

export default App
