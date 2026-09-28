import { ISLANDS } from '../data/catalog'
import type { MatchResult, RegistryItem, SearchFilters } from '../types'

const STOP = new Set([
  'the',
  'and',
  'with',
  'from',
  'near',
  'found',
  'lost',
  'item',
  'piece',
  'small',
  'classic',
])

function tokenize(...parts: Array<string | undefined>) {
  return parts
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP.has(word))
}

function keywordScore(a: string[], b: string[]) {
  const left = new Set(a)
  const right = new Set(b)
  let overlap = 0
  left.forEach((token) => {
    if (right.has(token)) overlap += 1
  })
  const union = new Set([...left, ...right]).size
  if (union === 0) return 0.2
  return overlap / union
}

function dateScore(query: SearchFilters, item: RegistryItem) {
  const queryDate = query.dateLost || query.dateFound
  const itemDate = item.dateLost || item.dateFound
  if (!queryDate || !itemDate) return 0.4
  const days = Math.abs(Date.parse(queryDate) - Date.parse(itemDate)) / 86_400_000
  if (days <= 7) return 1
  if (days <= 21) return 0.7
  if (days <= 45) return 0.45
  if (days <= 90) return 0.2
  return 0.05
}

function locationScore(queryId: string, itemId: string) {
  if (!queryId) return 0.5
  if (queryId === itemId) return 1
  const neighbors: Record<string, string[]> = {
    sabaody: ['marineford', 'water-7'],
    'water-7': ['sabaody', 'alabasta'],
    marineford: ['sabaody', 'punk-hazard'],
    wano: ['laugh-tale'],
  }
  if (neighbors[queryId]?.includes(itemId)) return 0.45
  return 0.1
}

export function itemTokens(item: RegistryItem) {
  return tokenize(
    item.title,
    item.description,
    item.colour,
    item.uniqueMarks,
    item.category,
    item.location,
  )
}

export function scoreMatch(query: SearchFilters, item: RegistryItem): MatchResult {
  const queryTokens = tokenize(
    query.category,
    query.colour,
    query.uniqueMarks,
    ISLANDS.find((island) => island.id === query.locationId)?.name,
  )
  const category = !query.category || query.category === item.category ? 1 : 0
  const keywords = Math.min(
    1,
    keywordScore(queryTokens, itemTokens(item)) +
      (query.colour && query.colour === item.colour ? 0.25 : 0) +
      (query.uniqueMarks && query.uniqueMarks === item.uniqueMarks ? 0.3 : 0),
  )
  const location = locationScore(query.locationId, item.locationId)
  const date = dateScore(query, item)
  const score = Math.round((0.25 * category + 0.4 * keywords + 0.2 * location + 0.15 * date) * 100)
  return {
    item,
    score,
    breakdown: { category, keywords, location, date },
  }
}

export function runMatching(items: RegistryItem[], query: SearchFilters) {
  const pool = items.filter((item) => {
    if (query.onlyLost) return item.kind === 'found'
    return true
  })

  return pool
    .map((item) => scoreMatch(query, item))
    .sort((a, b) => b.score - a.score)
    .filter((match) => match.score >= 48)
}
