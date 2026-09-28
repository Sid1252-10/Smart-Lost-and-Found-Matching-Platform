import { ALL_CATEGORY_LABELS, CANONICAL_CATEGORIES, canonicalCategory } from '../lib/categories'

export { CANONICAL_CATEGORIES, canonicalCategory }
export const CATEGORIES = ALL_CATEGORY_LABELS

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
  { id: 'reverse-mountain', name: 'Reverse Mountain', x: 8.5, y: 51.0, tag: 'ENTRANCE' },
  { id: 'whiskey-peak', name: 'Whiskey Peak', x: 20.0, y: 49.0 },
  { id: 'little-garden', name: 'Little Garden', x: 28.5, y: 49.5 },
  { id: 'drum-island', name: 'Drum Island', x: 39.5, y: 37.0 },
  { id: 'alabasta', name: 'Alabasta Kingdom', x: 46.5, y: 65.0 },
  { id: 'jaya', name: 'Jaya', x: 52.0, y: 45.0 },
  { id: 'skypiea', name: 'Skypiea (Sky Island)', x: 61.5, y: 21.0 },
  { id: 'long-ring', name: 'Long Ring Long Land', x: 61.0, y: 56.0 },
  { id: 'water-7', name: 'Water 7', x: 72.0, y: 49.5 },
  { id: 'enies-lobby', name: 'Enies Lobby', x: 80.5, y: 50.5 },
  { id: 'marineford', name: 'Marineford', x: 83.5, y: 62.0 },
  { id: 'thriller-bark', name: 'Thriller Bark', x: 67.5, y: 74.0 },
  { id: 'sabaody', name: 'Sabaody Archipelago', x: 90.0, y: 52.0 },
  { id: 'red-line', name: 'Red Line & Fish-Man Descent', x: 97.0, y: 54.0 },
  { id: 'punk-hazard', name: 'Punk Hazard', x: 38.0, y: 72.0 },
  { id: 'wano', name: 'Wano Country', x: 73.0, y: 58.0 },
  { id: 'laugh-tale', name: 'Laugh Tale', x: 89.0, y: 74.0, tag: '???' },
]
