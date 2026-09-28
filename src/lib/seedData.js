// ============================================================
// PS-08: Pre-Seeded One Piece Lost & Found Reports
// Authentic Grand Line scenarios for jury demo
// ============================================================

import { REPORT_TYPE, REPORT_STATUS } from "./types";

/**
 * Pre-seeded reports for the Sabaody Archipelago Lost & Found Registry.
 * 6 LOST reports and 6 FOUND reports with intentional match pairs.
 *
 * Match Pairs (for demo):
 *   LOST-001 <-> FOUND-001  (Zoro's Wado Ichimonji — 94% match)
 *   LOST-002 <-> FOUND-002  (Luffy's Straw Hat — 92% match)
 *   LOST-003 <-> FOUND-003  (Law's Kikoku — 88% match)
 *   LOST-004 <-> FOUND-004  (Nami's Log Pose — 78% match)
 *   LOST-005 <-> FOUND-005  (Robin's Poneglyph — moderate match)
 *   LOST-006 <-> FOUND-006  (Sanji's Recipe — moderate match)
 */
export const SEED_REPORTS = [
  // ──────────────────────────── LOST REPORTS ────────────────────────────

  {
    id: "LOST-001",
    type: REPORT_TYPE.LOST,
    title: "Wado Ichimonji (Meito Katana)",
    category: "weapons-blades",
    reporterName: "Roronoa Zoro",
    crewOrAffiliation: "Straw Hat Pirates",
    contactDenDen: "Bari-Bari 4410",
    groveNumber: 41,
    locationName: "Grove 41 — Harbor Pier 3 Docks",
    incidentDate: "2026-09-28",
    description:
      "Pure white circular tsuba (guard), pristine white rayskin hilt wrap, plain polished white scabbard. Kuina's keepsake blade. Extremely sharp. I took a wrong turn after visiting a tavern and realized it was missing.",
    imageUrl: "/items/wado_ichimonji.jpg",
    secretProofQuestion: "What is the hamon (temper line) pattern along the blade steel?",
    secretProofAnswer: "straight temper line suguha",
    status: REPORT_STATUS.ACTIVE,
    createdAt: new Date("2026-09-28T09:30:00Z").toISOString(),
  },
  {
    id: "LOST-002",
    type: REPORT_TYPE.LOST,
    title: "Straw Hat with Crimson Ribbon",
    category: "pirate-gear",
    reporterName: "Monkey D. Luffy",
    crewOrAffiliation: "Straw Hat Pirates",
    contactDenDen: "Gomu-Gomu 0505",
    groveNumber: 13,
    locationName: "Grove 13 — Shakky's Rip-Off Bar Alley",
    incidentDate: "2026-09-27",
    description:
      "Hand-woven yellow straw hat featuring a wide red cloth band. Entrusted to me by Red-Haired Shanks at Windmill Village. Blown off my head while chasing a flying fish cart near the bar.",
    imageUrl: "/items/straw_hat.jpg",
    secretProofQuestion: "Whose Vivre Card piece is hidden inside the inner lining?",
    secretProofAnswer: "portgas d ace",
    status: REPORT_STATUS.ACTIVE,
    createdAt: new Date("2026-09-27T14:15:00Z").toISOString(),
  },
  {
    id: "LOST-003",
    type: REPORT_TYPE.LOST,
    title: "Cursed Nodachi 'Kikoku'",
    category: "weapons-blades",
    reporterName: "Trafalgar D. Water Law",
    crewOrAffiliation: "Heart Pirates",
    contactDenDen: "Room-Shambles 1006",
    groveNumber: 24,
    locationName: "Grove 24 — Lawless Zone Mangrove Root",
    incidentDate: "2026-09-28",
    description:
      "Unusually long black scabbard decorated with white cross motifs along its entire length. Guard is wrapped in dense black fur with red knot tie. Emits a heavy demonic aura. Was ambushed and lost it in the chaos.",
    imageUrl: "/items/kikoku.jpg",
    secretProofQuestion: "What fur material cushions the katana tsuba guard?",
    secretProofAnswer: "black leopard fur",
    status: REPORT_STATUS.ACTIVE,
    createdAt: new Date("2026-09-28T08:00:00Z").toISOString(),
  },
  {
    id: "LOST-004",
    type: REPORT_TYPE.LOST,
    title: "Triple Needle Grand Line Log Pose",
    category: "navigational-tools",
    reporterName: "Nami (Cat Burglar)",
    crewOrAffiliation: "Straw Hat Pirates",
    contactDenDen: "Mikan-Beli 7701",
    groveNumber: 42,
    locationName: "Grove 42 — Cartography & Compass Shop",
    incidentDate: "2026-09-26",
    description:
      "Brass wrist-mounted navigational gauge with three independent magnetic floating needle spheres. Calibrated for New World magnetic currents. Dropped while haggling at the compass bazaar.",
    imageUrl: "/items/log_pose.jpg",
    secretProofQuestion: "What symbol is engraved onto the wrist buckle clasp?",
    secretProofAnswer: "pinwheel and tangerine",
    status: REPORT_STATUS.ACTIVE,
    createdAt: new Date("2026-09-26T16:40:00Z").toISOString(),
  },
  {
    id: "LOST-005",
    type: REPORT_TYPE.LOST,
    title: "Poneglyph Rubbing Scroll",
    category: "mysterious-artifacts",
    reporterName: "Nico Robin",
    crewOrAffiliation: "Straw Hat Pirates",
    contactDenDen: "Hana-Hana 8803",
    groveNumber: 51,
    locationName: "Grove 51 — Rayleigh's Coating Workshop",
    incidentDate: "2026-09-27",
    description:
      "Rolled parchment scroll containing charcoal rubbings of an ancient Poneglyph. The script is in the ancient language, readable only by scholars of Ohara. Has a wax seal with the Kozuki crest.",
    imageUrl: "/items/poneglyph_scroll.jpg",
    secretProofQuestion: "What crest is on the wax seal?",
    secretProofAnswer: "kozuki",
    status: REPORT_STATUS.ACTIVE,
    createdAt: new Date("2026-09-27T11:00:00Z").toISOString(),
  },
  {
    id: "LOST-006",
    type: REPORT_TYPE.LOST,
    title: "All Blue Recipe Collection Journal",
    category: "food-provisions",
    reporterName: "Vinsmoke Sanji",
    crewOrAffiliation: "Straw Hat Pirates",
    contactDenDen: "Diable-Jambe 3302",
    groveNumber: 44,
    locationName: "Grove 44 — Seafood Market & Kitchen Row",
    incidentDate: "2026-09-28",
    description:
      "Leather-bound cooking journal with gold embossed Baratie logo. Contains 200+ original recipes, All Blue fish species notes, and sketches of legendary ingredients from every sea.",
    imageUrl: "/items/recipe_journal.jpg",
    secretProofQuestion: "What is the name of the restaurant on the journal cover?",
    secretProofAnswer: "baratie",
    status: REPORT_STATUS.ACTIVE,
    createdAt: new Date("2026-09-28T07:45:00Z").toISOString(),
  },

  // ──────────────────────────── FOUND REPORTS ────────────────────────────

  {
    id: "FOUND-001",
    type: REPORT_TYPE.FOUND,
    title: "Masterwork White Sheath Katana",
    category: "weapons-blades",
    reporterName: "Barnaby the Dockmaster",
    crewOrAffiliation: "Sabaody Harbor Guild",
    contactDenDen: "Harbor-B4 1102",
    groveNumber: 41,
    locationName: "Grove 41 — Harbor Pier 2 Tavern Porch",
    incidentDate: "2026-09-28",
    description:
      "Found leaning against an ale cask at Pier 2 tavern. Master craftsman white rayskin wrap, circular guard, plain white lacquered scabbard. Looks like one of the 21 Great O Wazamono grade swords!",
    imageUrl: "/items/wado_ichimonji.jpg",
    status: REPORT_STATUS.ACTIVE,
    createdAt: new Date("2026-09-28T10:10:00Z").toISOString(),
  },
  {
    id: "FOUND-002",
    type: REPORT_TYPE.FOUND,
    title: "Weathered Straw Hat with Scarlet Band",
    category: "pirate-gear",
    reporterName: "Shakky",
    crewOrAffiliation: "Shakky's Rip-Off Bar",
    contactDenDen: "Grove13-Tavern",
    groveNumber: 13,
    locationName: "Grove 13 — Outside Tavern Porch",
    incidentDate: "2026-09-27",
    description:
      "Found caught in the mangrove vines near the roof. Yellow woven straw with stitched brim repairs and a signature bright red cotton band. Seems very precious to someone.",
    imageUrl: "/items/straw_hat.jpg",
    status: REPORT_STATUS.ACTIVE,
    createdAt: new Date("2026-09-27T15:00:00Z").toISOString(),
  },
  {
    id: "FOUND-003",
    type: REPORT_TYPE.FOUND,
    title: "Black Cross-Patterned Giant Nodachi",
    category: "weapons-blades",
    reporterName: "Bounty Hunter Johnny",
    crewOrAffiliation: "Sabaody Bounty Guild",
    contactDenDen: "Hunter-Net 9931",
    groveNumber: 25,
    locationName: "Grove 25 — Lawless Alley Crossroads",
    incidentDate: "2026-09-28",
    description:
      "Massive two-handed sword longer than a normal man. Black lacquered saya with white plus-sign cross emblems. Guard has thick velvety black fur. Found abandoned in a fight scene.",
    imageUrl: "/items/kikoku.jpg",
    status: REPORT_STATUS.ACTIVE,
    createdAt: new Date("2026-09-28T09:00:00Z").toISOString(),
  },
  {
    id: "FOUND-004",
    type: REPORT_TYPE.FOUND,
    title: "Three-Sphere Glass Nautical Instrument",
    category: "navigational-tools",
    reporterName: "Merchant Galdino",
    crewOrAffiliation: "Sabaody Maritime Exchange",
    contactDenDen: "Trade-42 5500",
    groveNumber: 43,
    locationName: "Grove 43 — Maritime Goods Bazaar",
    incidentDate: "2026-09-26",
    description:
      "Found dropped near the compass booth. Solid polished brass frame with three floating magnetic orbs pointing toward mysterious Grand Line wave currents. Wrist-mounted style.",
    imageUrl: "/items/log_pose.jpg",
    status: REPORT_STATUS.ACTIVE,
    createdAt: new Date("2026-09-26T18:20:00Z").toISOString(),
  },
  {
    id: "FOUND-005",
    type: REPORT_TYPE.FOUND,
    title: "Ancient Scroll with Unknown Script",
    category: "mysterious-artifacts",
    reporterName: "Rayleigh's Apprentice",
    crewOrAffiliation: "Sabaody Coating Works",
    contactDenDen: "Coat-51 2200",
    groveNumber: 52,
    locationName: "Grove 52 — Resin Storage Shed",
    incidentDate: "2026-09-27",
    description:
      "Rolled parchment found behind resin barrels. Covered in charcoal rubbings of carved stone text in a language nobody can read. Has a distinctive family crest wax seal.",
    imageUrl: "/items/poneglyph_scroll.jpg",
    status: REPORT_STATUS.ACTIVE,
    createdAt: new Date("2026-09-27T13:30:00Z").toISOString(),
  },
  {
    id: "FOUND-006",
    type: REPORT_TYPE.FOUND,
    title: "Gold-Embossed Leather Cooking Journal",
    category: "food-provisions",
    reporterName: "Chef Matsuda",
    crewOrAffiliation: "Grove 44 Seafood Stalls",
    contactDenDen: "Kitchen-44 6610",
    groveNumber: 44,
    locationName: "Grove 44 — Fish Counter #7",
    incidentDate: "2026-09-28",
    description:
      "Leather journal left at the counter. Has a restaurant logo in gold on the cover. Contains hundreds of handwritten recipes with detailed fish anatomy sketches and flavor notes.",
    imageUrl: "/items/recipe_journal.jpg",
    status: REPORT_STATUS.ACTIVE,
    createdAt: new Date("2026-09-28T08:30:00Z").toISOString(),
  },
];
