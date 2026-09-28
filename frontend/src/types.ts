export type ItemKind = 'lost' | 'found'

export type DisplayStatus =
  | 'CLAIMED'
  | 'FOUND'
  | 'CONFIRMED'
  | 'REPORTED LOST'
  | 'RECOVERED'

export type RegistryItem = {
  id: string
  kind: ItemKind
  status: DisplayStatus
  title: string
  locationId: string
  location: string
  category: string
  colour: string
  uniqueMarks: string
  description: string
  dateLost?: string
  dateFound?: string
  claimedBy?: string
}

export type SearchFilters = {
  category: string
  locationId: string
  dateLost: string
  dateFound: string
  colour: string
  uniqueMarks: string
  onlyLost: boolean
}

export type MatchResult = {
  item: RegistryItem
  score: number
  breakdown: {
    category: number
    keywords: number
    location: number
    date: number
  }
}
