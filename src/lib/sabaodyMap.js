// ============================================================
// PS-08: Sabaody Archipelago Grove Map & Zone System
// 79 Mangrove Groves divided into 6 named zones
// Used for location-based proximity scoring in the match engine
// ============================================================

/**
 * Sabaody Archipelago is divided into 6 distinct zones.
 * Each zone covers a range of grove numbers.
 */
export const SABAODY_ZONES = [
  {
    id: "lawless",
    range: [1, 29],
    name: "Lawless Zone",
    description: "Human Auction House, pirate hideouts, and bounty hunter taverns.",
    color: "#ef4444", // red
  },
  {
    id: "park",
    range: [30, 39],
    name: "Sabaody Park & Amusement Zone",
    description: "Giant Ferris wheel, bubble craft rentals, and souvenir stalls.",
    color: "#f59e0b", // amber
  },
  {
    id: "tourist",
    range: [40, 49],
    name: "Tourist & Shipyard Docks",
    description: "Grand Line merchant ships, coastal wharfs, and shipyard slips.",
    color: "#3b82f6", // blue
  },
  {
    id: "coating",
    range: [50, 59],
    name: "Ship Coating & Craftsmen District",
    description: "Yarnuk coating workshops and resin bubble mechanics.",
    color: "#10b981", // emerald
  },
  {
    id: "marine",
    range: [60, 69],
    name: "Marine Headquarters & Government Station",
    description: "Marine garrisons, checkpoint gates, and patrol barracks.",
    color: "#6366f1", // indigo
  },
  {
    id: "hotel",
    range: [70, 79],
    name: "Hotel & Residential Grove",
    description: "Luxurious inns, garden promenades, and harbor villas.",
    color: "#ec4899", // pink
  },
];

/**
 * Returns the zone object for a given grove number.
 */
export function getZoneForGrove(groveNumber) {
  const grove = Number(groveNumber);
  const zone = SABAODY_ZONES.find(
    (z) => grove >= z.range[0] && grove <= z.range[1]
  );
  return zone || {
    id: "unknown",
    range: [0, 0],
    name: "Unknown Waters",
    description: "Beyond the charted Sabaody Archipelago.",
    color: "#64748b",
  };
}

/**
 * Returns a formatted grove label string.
 * Example: getGroveLabel(41) => "Grove 41 — Tourist & Shipyard Docks"
 */
export function getGroveLabel(groveNumber) {
  const zone = getZoneForGrove(groveNumber);
  return `Grove ${groveNumber} — ${zone.name}`;
}

/**
 * Generates the dropdown options for grove selection (1-79).
 * Returns an array of { value, label, zone } objects.
 */
export function getGroveOptions() {
  const options = [];
  for (let i = 1; i <= 79; i++) {
    const zone = getZoneForGrove(i);
    options.push({
      value: i,
      label: `Grove ${i}`,
      zoneName: zone.name,
      zoneId: zone.id,
      color: zone.color,
    });
  }
  return options;
}

/**
 * Calculates the absolute grove distance between two grove numbers.
 */
export function groveDistance(groveA, groveB) {
  return Math.abs(Number(groveA) - Number(groveB));
}

/**
 * Checks if two groves are in the same zone.
 */
export function isSameZone(groveA, groveB) {
  const zoneA = getZoneForGrove(groveA);
  const zoneB = getZoneForGrove(groveB);
  return zoneA.id === zoneB.id;
}
