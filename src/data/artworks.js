const artworkFiles = [
  '1.jpeg',
  '2.jpeg',
  '3.jpeg',
  '4.jpeg',
  '5.jpeg',
  '6.jpeg',
  '7.jpeg',
  '8.jpeg',
  '9.jpeg',
  '10.jpeg',
  '11.jpeg',
  '13.jpeg',
  '14.jpeg',
  '15.jpeg',
  '16.jpeg',
  '17.jpeg',
  '18.jpeg',
  '19.jpeg',
  '20.jpeg',
  '21.jpeg',
  '22.jpeg',
]

const placements = [
  ...[-8, -4, 0, 4, 8].map((x) => ({
    position: [x, 2.05, -15.82],
    rotation: [0, 0, 0],
  })),
  ...[-24, -16, -8, 0, 8, 16, 24].map((x) => ({
    position: [x, 2.05, -26.82],
    rotation: [0, 0, 0],
  })),
  ...[-17, -8, 2].map((z) => ({
    position: [-32.82, 2.05, z],
    rotation: [0, Math.PI / 2, 0],
  })),
  ...[-17, -8, 2].map((z) => ({
    position: [32.82, 2.05, z],
    rotation: [0, -Math.PI / 2, 0],
  })),
  ...[-10, 0].map((z) => ({
    position: [-9.82, 2.05, z],
    rotation: [0, Math.PI / 2, 0],
  })),
  ...[-10, 0].map((z) => ({
    position: [9.82, 2.05, z],
    rotation: [0, -Math.PI / 2, 0],
  })),
  { position: [-4, 2.05, 12.82], rotation: [0, Math.PI, 0] },
  { position: [4, 2.05, 12.82], rotation: [0, Math.PI, 0] },
]

export const artworks = artworkFiles.map((fileName, index) => ({
  id: fileName.replace('.jpeg', ''),
  title: `Artwork ${fileName.replace('.jpeg', '')}`,
  image: `/artworks/${fileName}`,
  ...placements[index],
}))
