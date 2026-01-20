export const MOLECULES: Record<string, { atoms: { element: string; position: [number, number, number] }[]; bonds: [number, number][] }> = {
  aspirin: {
    atoms: [
      { element: 'C', position: [0, 0, 0] },
      { element: 'C', position: [1.2, 0, 0] },
      { element: 'C', position: [1.8, 1.1, 0] },
      { element: 'C', position: [1.2, 2.1, 0] },
      { element: 'C', position: [0, 2.1, 0] },
      { element: 'C', position: [-0.6, 1.1, 0] },
      { element: 'O', position: [3.0, 1.1, 0] },
      { element: 'O', position: [3.6, 0.2, 0] },
      { element: 'C', position: [4.6, 0.2, 0] },
      { element: 'O', position: [-1.7, 1.1, 0] },
      { element: 'H', position: [-2.2, 1.8, 0] },
    ],
    bonds: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
      [2, 6], [6, 7], [7, 8],
      [5, 9], [9, 10],
    ],
  },
  caffeine: {
    atoms: [
      { element: 'C', position: [0, 0, 0] },
      { element: 'N', position: [1.3, 0.2, 0] },
      { element: 'C', position: [2.3, 1.0, 0] },
      { element: 'N', position: [1.9, 2.2, 0] },
      { element: 'C', position: [0.8, 2.5, 0] },
      { element: 'N', position: [-0.2, 1.7, 0] },
      { element: 'O', position: [3.5, 1.0, 0] },
      { element: 'O', position: [2.3, -0.8, 0] },
      { element: 'C', position: [-0.8, -0.9, 0] },
      { element: 'H', position: [-1.7, -0.5, 0] },
      { element: 'H', position: [-0.6, -1.9, 0] },
    ],
    bonds: [
      [0,1],[1,2],[2,3],[3,4],[4,5],[5,0],
      [2,6],[1,7],[0,8],[8,9],[8,10]
    ]
  }
}

export const COLORS: Record<string, number> = {
  C: 0x9aa0a6,
  O: 0xef4444,
  N: 0x3b82f6,
  H: 0xffffff,
}
