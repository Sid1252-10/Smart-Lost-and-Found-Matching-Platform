// ============================================================
// Single Source of Truth for Relic & Treasure Categories
// Unifies all categories, slugs, display labels, icons, and lore.
// ============================================================

export interface CategoryDefinition {
  id: string
  label: string
  icon: string
  color: string
  lore: string
  aliases: string[]
}

export const CANONICAL_CATEGORIES: CategoryDefinition[] = [
  {
    id: 'weapons-blades',
    label: 'Weapons & Blades',
    icon: 'Sword',
    color: '#ef4444',
    lore: 'Meito-grade swords, flintlocks, daggers, seastone javelins, and battle gear.',
    aliases: ['weapons-blades', 'swords & gear', 'swords', 'weapons', 'blades', 'gear'],
  },
  {
    id: 'navigational-tools',
    label: 'Navigational Tools',
    icon: 'Compass',
    color: '#06b6d4',
    lore: 'Log Poses, Eternal Poses, Marine charts, and Grand Line weather dials.',
    aliases: ['navigational-tools', 'navigation instruments', 'navigation', 'compass', 'log pose'],
  },
  {
    id: 'pirate-gear',
    label: 'Pirate Gear & Relics',
    icon: 'Flag',
    color: '#f59e0b',
    lore: 'Straw hats, Jolly Roger insignia, Vivre Cards, Den Den Mushi, and crew keepsakes.',
    aliases: ['pirate-gear', 'apparel & accessories', 'pirate-gear-relics', 'relics', 'pirate relics'],
  },
  {
    id: 'treasure-beli',
    label: 'Treasure & Beli',
    icon: 'Coins',
    color: '#f0d060',
    lore: 'Gold chests, Beli sacks, plundered jewels, ancient coins, and jewelry.',
    aliases: ['treasure-beli', 'jewelry & treasure', 'treasure', 'beli', 'gold', 'jewelry'],
  },
  {
    id: 'mysterious-artifacts',
    label: 'Mysterious Artifacts & Devil Fruits',
    icon: 'Sparkles',
    color: '#a855f7',
    lore: 'Devil Fruits, Poneglyph rubbings, Shandian dials, and Sea King fossils.',
    aliases: ['mysterious-artifacts', 'devil fruits & relics', 'devil fruits', 'artifacts', 'poneglyph'],
  },
  {
    id: 'clothing-accessories',
    label: 'Clothing & Apparel',
    icon: 'Shirt',
    color: '#3b82f6',
    lore: 'Captain coats, Marine capes, bandanas, pirate boots, and crew cloaks.',
    aliases: ['clothing-accessories', 'clothing & accessories', 'clothing', 'apparel', 'apparel & accessories'],
  },
  {
    id: 'bags-luggage',
    label: 'Bags & Luggage',
    icon: 'Briefcase',
    color: '#10b981',
    lore: 'Travel sea chests, leather knapsacks, cargo trunks, and haversacks.',
    aliases: ['bags-luggage', 'bags & luggage', 'bags', 'luggage', 'chests', 'backpack'],
  },
  {
    id: 'medical-supplies',
    label: 'Medical Supplies',
    icon: 'HeartPulse',
    color: '#ec4899',
    lore: "Chopper's apothecary kits, Rumble Balls, healing herbs from Drum Island.",
    aliases: ['medical-supplies', 'medical & supplies', 'medical', 'medicine'],
  },
  {
    id: 'musical-instruments',
    label: 'Musical Instruments',
    icon: 'Music',
    color: '#8b5cf6',
    lore: "Brook's violin, Tone Dials, Binks' Sake sheet music, and festival drums.",
    aliases: ['musical-instruments', 'musical instruments', 'music', 'instruments'],
  },
  {
    id: 'documents-maps',
    label: 'Documents & Sea Charts',
    icon: 'Map',
    color: '#eab308',
    lore: 'Grand Line charts, Marine wanted posters, bounty papers, and logbooks.',
    aliases: ['documents-maps', 'documents & maps', 'documents', 'maps', 'charts'],
  },
  {
    id: 'food-provisions',
    label: 'Provisions & Rations',
    icon: 'Utensils',
    color: '#f97316',
    lore: "Sanji's secret recipe rolls, Baratie preserves, Sea King meat, and emergency rations.",
    aliases: ['food-provisions', 'food & provisions', 'food', 'provisions', 'rations'],
  },
]

// Quick lookup map: alias (lowercased) -> Canonical Display Label
const ALIAS_TO_CANONICAL = new Map<string, CategoryDefinition>()

CANONICAL_CATEGORIES.forEach((cat) => {
  ALIAS_TO_CANONICAL.set(cat.id.toLowerCase(), cat)
  ALIAS_TO_CANONICAL.set(cat.label.toLowerCase(), cat)
  cat.aliases.forEach((alias) => {
    ALIAS_TO_CANONICAL.set(alias.toLowerCase(), cat)
  })
})

/**
 * Returns the standardized canonical display label for any category string.
 * Example: 'weapons-blades' -> 'Weapons & Blades'
 * Example: 'Swords & Gear' -> 'Weapons & Blades'
 */
export function canonicalCategory(rawCategory: string | undefined | null): string {
  if (!rawCategory) return 'Weapons & Blades'
  const cleaned = rawCategory.trim().toLowerCase()
  const matched = ALIAS_TO_CANONICAL.get(cleaned)
  if (matched) return matched.label

  // Fallback: check if any canonical label or alias is contained
  for (const cat of CANONICAL_CATEGORIES) {
    if (
      cleaned.includes(cat.id.toLowerCase()) ||
      cleaned.includes(cat.label.toLowerCase()) ||
      cat.aliases.some((a) => cleaned.includes(a))
    ) {
      return cat.label
    }
  }

  // If no match found, capitalize words cleanly
  return rawCategory
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Returns the URL/id slug for a category.
 * Example: 'Weapons & Blades' -> 'weapons-blades'
 */
export function getCategorySlug(rawCategory: string | undefined | null): string {
  const label = canonicalCategory(rawCategory)
  const cat = CANONICAL_CATEGORIES.find((c) => c.label === label)
  return cat ? cat.id : 'weapons-blades'
}

/**
 * Returns the category metadata definition.
 */
export function getCategoryDefinition(rawCategory: string | undefined | null): CategoryDefinition {
  const label = canonicalCategory(rawCategory)
  return (
    CANONICAL_CATEGORIES.find((c) => c.label === label) ||
    CANONICAL_CATEGORIES[0]
  )
}

/**
 * Helper list of all canonical category labels for dropdowns.
 */
export const ALL_CATEGORY_LABELS = CANONICAL_CATEGORIES.map((c) => c.label)
