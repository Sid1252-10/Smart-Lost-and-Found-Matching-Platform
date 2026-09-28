// ============================================================
// PS-08: Smart Lost and Found Matching Platform
// Type Constants & Category Definitions
// Theme: Roronoa Zoro's Lost Swords & Sabaody Archipelago
// ============================================================

export const REPORT_TYPE = {
  LOST: "LOST",
  FOUND: "FOUND",
};

export const REPORT_STATUS = {
  ACTIVE: "ACTIVE",
  POTENTIAL_MATCH: "POTENTIAL_MATCH",
  CLAIM_PENDING: "CLAIM_PENDING",
  RECOVERED: "RECOVERED",
};

export const CLAIM_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
};

export const CONFIDENCE_TIER = {
  LEGENDARY: "LEGENDARY", // 85-100
  HIGH: "HIGH",           // 70-84
  MODERATE: "MODERATE",   // 50-69
  LOW: "LOW",             // 0-49
};

/**
 * Relic categories themed around the One Piece universe.
 * Each category has an id, label, icon emoji, and a lore description.
 */
export const RELIC_CATEGORIES = [
  {
    id: "weapons-blades",
    label: "Weapons & Blades",
    icon: "sword",
    lore: "Meito-grade swords, flintlock pistols, seastone weapons, and battle axes from legendary pirates.",
  },
  {
    id: "navigational-tools",
    label: "Navigational Tools",
    icon: "compass",
    lore: "Log Poses, Eternal Poses, Marine charts, and weather instruments used to navigate the Grand Line.",
  },
  {
    id: "pirate-gear",
    label: "Pirate Gear & Relics",
    icon: "flag",
    lore: "Straw hats, Jolly Roger flags, Vivre Cards, Den Den Mushi, and crew insignia.",
  },
  {
    id: "treasure-beli",
    label: "Treasure & Beli",
    icon: "coins",
    lore: "Gold treasure chests, Beli currency sacks, jeweled crowns, and plundered riches.",
  },
  {
    id: "mysterious-artifacts",
    label: "Mysterious Artifacts",
    icon: "gem",
    lore: "Devil Fruit replicas, Poneglyph rubbings, ancient Shandian dials, and Sea King scales.",
  },
];

/**
 * Returns the category object for a given category id.
 * Falls back to first category if not found.
 */
export function getCategoryById(categoryId) {
  return RELIC_CATEGORIES.find((c) => c.id === categoryId) || RELIC_CATEGORIES[0];
}

/**
 * Returns the category object matching a label string.
 */
export function getCategoryByLabel(label) {
  return RELIC_CATEGORIES.find((c) => c.label === label) || RELIC_CATEGORIES[0];
}

/**
 * Generates a unique ID with a prefix.
 * Example: generateId("LOST") => "LOST-a3f8b2c1"
 */
export function generateId(prefix = "RPT") {
  const hex = Math.random().toString(16).slice(2, 10);
  return `${prefix}-${hex}`;
}

/**
 * Returns today's date as an ISO string (YYYY-MM-DD).
 */
export function todayISO() {
  return new Date().toISOString().split("T")[0];
}
