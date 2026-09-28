export type ItemKind = 'lost' | 'found'

export type DisplayStatus =
  | 'CLAIMED'
  | 'FOUND'
  | 'CONFIRMED'
  | 'REPORTED LOST'
  | 'RECOVERED'
  | 'ACTIVE'
  | 'POTENTIAL_MATCH'
  | 'CLAIM_PENDING'

export type RegistryItem = {
  id: string
  kind: ItemKind
  type?: 'LOST' | 'FOUND'
  status: DisplayStatus
  title: string
  locationId?: string
  location: string
  groveNumber?: number
  category: string
  colour?: string
  uniqueMarks?: string
  description: string
  dateLost?: string
  dateFound?: string
  incidentDate?: string
  claimedBy?: string
  imageUrl?: string
  reward?: string
  contactInfo?: string
  createdAt?: string
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
  matchId?: string
  item?: RegistryItem
  lostReport?: RegistryItem
  foundReport?: RegistryItem
  score: number
  confidenceTier?: 'LEGENDARY' | 'HIGH' | 'MODERATE' | 'LOW'
  matchBadges?: string[]
  breakdown?: {
    category?: number
    categoryScore?: number
    location?: number
    locationScore?: number
    timeScore?: number
    date?: number
    keywords?: number
    keywordScore?: number
    totalScore?: number
  }
}

