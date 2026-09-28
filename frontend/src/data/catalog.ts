export const CATEGORIES = [
  'Bags & Luggage',
  'Swords & Gear',
  'Navigation Instruments',
  'Apparel & Accessories',
  'Devil Fruits & Relics',
  'Jewelry & Treasure',
] as const

export const COLOURS = [
  'Black',
  'Red',
  'Gold',
  'White',
  'Green',
  'Blue',
  'Straw',
  'Silver',
] as const

export const UNIQUE_MARKS = [
  'Sticker',
  'Jeweled Guard',
  'Red Ribbon',
  'Crew Jolly Roger',
  'Burn Marks',
  'Engraved Name',
  'Straw Weave',
  'Log Pose Dial',
] as const

export type Island = {
  id: string
  name: string
  x: number
  y: number
  tag?: string
}

export const ISLANDS: Island[] = [
  { id: 'reverse-mountain', name: 'Reverse Mountain', x: 17, y: 15, tag: 'CANONICAL' },
  { id: 'water-7', name: 'Water 7', x: 48, y: 27 },
  { id: 'sabaody', name: 'Sabaody Archipelago', x: 73, y: 30 },
  { id: 'alabasta', name: 'Alabasta', x: 32, y: 50 },
  { id: 'marineford', name: 'Marineford', x: 49, y: 64 },
  { id: 'wano', name: 'Wano', x: 73, y: 58 },
  { id: 'laugh-tale', name: 'Laugh Tale', x: 89, y: 74, tag: "???" },
  { id: 'punk-hazard', name: 'Punk Hazard', x: 38, y: 72 },
]
