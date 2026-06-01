const artworkFiles = [
  { fileName: '1.jpeg', width: 768, height: 1024 },
  { fileName: '2.jpeg', width: 3024, height: 4032 },
  { fileName: '3.jpeg', width: 3024, height: 4032 },
  { fileName: '4.jpeg', width: 3024, height: 4032 },
  { fileName: '5.jpeg', width: 3024, height: 4032 },
  { fileName: '6.jpeg', width: 3024, height: 4032 },
  { fileName: '7.jpeg', width: 3024, height: 4032 },
  { fileName: '8.jpeg', width: 4032, height: 3024 },
  { fileName: '9.jpeg', width: 4032, height: 3024 },
  { fileName: '10.jpeg', width: 4032, height: 3024 },
  { fileName: '11.jpeg', width: 4032, height: 3024 },
  { fileName: '13.jpeg', width: 4032, height: 3024 },
  { fileName: '14.jpeg', width: 4032, height: 3024 },
  { fileName: '15.jpeg', width: 4032, height: 3024 },
  { fileName: '16.jpeg', width: 4032, height: 3024 },
  { fileName: '17.jpeg', width: 4032, height: 3024 },
  { fileName: '18.jpeg', width: 4032, height: 3024 },
  { fileName: '19.jpeg', width: 4032, height: 3024 },
  { fileName: '20.jpeg', width: 3024, height: 4032 },
  { fileName: '21.jpeg', width: 3024, height: 4032 },
  { fileName: '22.jpeg', width: 3024, height: 4032 },
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

export const initialArtworkIds = ['1', '2', '3', '4', '5', '20', '21', '22']

export const artworks = artworkFiles.map(({ fileName, width, height }, index) => ({
  id: fileName.replace('.jpeg', ''),
  title: `Artwork ${fileName.replace('.jpeg', '')}`,
  image: `/artworks/${fileName}`,
  width,
  height,
  ...placements[index],
}))
