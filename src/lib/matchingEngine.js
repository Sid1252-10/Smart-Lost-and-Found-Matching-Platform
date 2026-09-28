// ============================================================
// PS-08: Smart Matching Engine
// Multi-Factor Scoring: Category(35) + Location(25) + Time(15) + Keywords(25)
// ============================================================

import { groveDistance } from "./sabaodyMap";
import { canonicalCategory } from "./categories";

// ──────────────────────────── HELPERS ────────────────────────────

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "with", "of", "by", "from", "is", "was", "it", "this", "that", "lost",
  "found", "some", "very", "has", "have", "had", "my", "your", "his",
  "her", "its", "near", "been", "while", "after", "looks", "like",
  "none", "small", "large", "piece", "item", "items", "standard",
  "marks", "marking", "markings", "color", "colour", "unique", "details",
  "holds", "contains", "found", "around", "about", "also", "into", "onto",
]);

/**
 * Tokenizes a string into meaningful keywords.
 */
function tokenize(text) {
  return new Set(
    (text || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
  );
}

/**
 * Jaccard similarity between two sets.
 * Returns { score: 0-1, sharedTokens: string[] }
 */
function jaccardSimilarity(setA, setB) {
  const shared = [...setA].filter((x) => setB.has(x));
  const unionSize = new Set([...setA, ...setB]).size;
  if (unionSize === 0) return { score: 0, sharedTokens: [] };
  return { score: shared.length / unionSize, sharedTokens: shared };
}

// ──────────────────────────── SCORING FACTORS ────────────────────────────

/**
 * Factor 1: Category Match (max 35 pts)
 */
function scoreCategory(lost, found) {
  const catLost = canonicalCategory(lost.category);
  const catFound = canonicalCategory(found.category);

  if (catLost === catFound) {
    return {
      score: 35,
      badge: `Category: ${catLost}`,
      categoryName: catLost,
    };
  }
  return { score: 0, badge: `Different Categories`, categoryName: catLost };
}

/**
 * Factor 2: Grove Proximity (max 25 pts)
 */
function scoreLocation(lost, found) {
  const dist = groveDistance(lost.groveNumber || 41, found.groveNumber || 41);

  if (dist === 0) {
    return { score: 25, badge: `Same Location (Grove ${lost.groveNumber || 41})` };
  }
  if (dist <= 3) {
    return { score: 22, badge: `Nearby (${dist} Groves apart)` };
  }
  if (dist <= 8) {
    return { score: 16, badge: `Same Sector (${dist} Groves apart)` };
  }
  if (dist <= 15) {
    return { score: 10, badge: `Adjacent Zone (${dist} Groves apart)` };
  }
  return { score: 3, badge: `Grand Line Vicinity (${dist} Groves apart)` };
}

/**
 * Factor 3: Time Proximity (max 15 pts)
 */
function scoreTime(lost, found) {
  const msPerDay = 86400000;
  const dateLost = new Date(lost.incidentDate || lost.dateLost || Date.now()).getTime();
  const dateFound = new Date(found.incidentDate || found.dateFound || Date.now()).getTime();
  const diffDays = Math.abs(dateLost - dateFound) / msPerDay;

  if (diffDays <= 1) {
    return { score: 15, badge: `Timeline: Reported within 24 hours` };
  }
  if (diffDays <= 3) {
    return { score: 12, badge: `Timeline: Within 3 days` };
  }
  if (diffDays <= 7) {
    return { score: 8, badge: `Timeline: Within 1 week` };
  }
  return { score: 3, badge: `Timeline: Over 1 week apart` };
}

/**
 * Factor 4: Keyword / Description Similarity (max 25 pts)
 */
function scoreKeywords(lost, found) {
  const lostTokens = tokenize(`${lost.title || ""} ${lost.description || ""} ${lost.uniqueMarks || ""}`);
  const foundTokens = tokenize(`${found.title || ""} ${found.description || ""} ${found.uniqueMarks || ""}`);
  const { score: jaccard, sharedTokens } = jaccardSimilarity(lostTokens, foundTokens);

  // Scale jaccard (0-1) up to 25 pts with a boost factor
  const pts = Math.min(25, Math.round(jaccard * 45));

  if (sharedTokens.length > 0) {
    const preview = sharedTokens
      .slice(0, 4)
      .map((t) => t.charAt(0).toUpperCase() + t.slice(1))
      .join(", ");
    return { score: pts, badge: `Distinctive Clues: ${preview}`, sharedTokens };
  }
  return { score: pts, badge: `No Shared Keywords (Inspection Required)`, sharedTokens: [] };
}

// ──────────────────────────── PUBLIC API ────────────────────────────

/**
 * Compute the match score between one lost and one found report.
 *
 * @param {Object} lostReport
 * @param {Object} foundReport
 * @returns {Object} matchResult
 */
export function computeMatchScore(lostReport, foundReport) {
  const cat = scoreCategory(lostReport, foundReport);
  const loc = scoreLocation(lostReport, foundReport);
  const time = scoreTime(lostReport, foundReport);
  const kw = scoreKeywords(lostReport, foundReport);

  let rawScore = cat.score + loc.score + time.score + kw.score;

  // 1. PHYSICAL KEYWORD GUARD:
  // If reports share 0 distinctive keywords/clues, cap score at 38 so random coincidences never match!
  if (!kw.sharedTokens || kw.sharedTokens.length === 0) {
    rawScore = Math.min(rawScore, 38);
  }

  // 2. COLOR COMPATIBILITY:
  const colorA = (lostReport.colour || "").trim().toLowerCase();
  const colorB = (foundReport.colour || "").trim().toLowerCase();
  const isGeneric = (c) => !c || c === "standard" || c === "none" || c === "any" || c === "unknown";

  if (!isGeneric(colorA) && !isGeneric(colorB)) {
    if (colorA === colorB) {
      rawScore = Math.min(100, rawScore + 8);
    } else {
      // Conflicting colors penalize score heavily (-20 pts)
      rawScore = Math.max(0, rawScore - 20);
    }
  }

  const totalScore = Math.max(0, Math.min(100, rawScore));

  let confidenceTier = "LOW";
  if (totalScore >= 85) confidenceTier = "LEGENDARY";
  else if (totalScore >= 70) confidenceTier = "HIGH";
  else if (totalScore >= 50) confidenceTier = "MODERATE";

  return {
    matchId: `MATCH-${lostReport.id}-${foundReport.id}`,
    lostReport,
    foundReport,
    score: totalScore,
    confidenceTier,
    matchBadges: [cat.badge, loc.badge, time.badge, kw.badge],
    breakdown: {
      categoryScore: cat.score,
      locationScore: loc.score,
      timeScore: time.score,
      keywordScore: kw.score,
      totalScore,
    },
  };
}

/**
 * Rank all possible matches between lost and found report lists.
 *
 * @param {Array} lostList
 * @param {Array} foundList
 * @param {number} [minScore=55]
 * @returns {Array} sorted match results (highest first)
 */
export function rankAllMatches(lostList, foundList, minScore = 55) {
  const results = [];

  for (const lost of lostList) {
    for (const found of foundList) {
      // Must be same category: strictly matching across equivalent categories
      if (canonicalCategory(lost.category) !== canonicalCategory(found.category)) continue;

      const match = computeMatchScore(lost, found);
      if (match.score >= minScore) {
        results.push(match);
      }
    }
  }

  return results.sort((a, b) => b.score - a.score);
}

/**
 * Compare any two specific reports regardless of their type (lost/found).
 * Useful when a user wants to manually check if two reports might be the same item.
 *
 * @param {Object} reportA - Any report object
 * @param {Object} reportB - Any report object
 * @returns {Object} matchResult with the same shape as computeMatchScore
 */
export function compareAnyTwo(reportA, reportB) {
  // Enforce: one must be LOST and one must be FOUND
  const isLostA = String(reportA.type || reportA.kind).toUpperCase() === 'LOST';
  const isLostB = String(reportB.type || reportB.kind).toUpperCase() === 'LOST';

  if (isLostA === isLostB) {
    return {
      matchId: `CMP-${reportA.id}-${reportB.id}`,
      reportA,
      reportB,
      score: 0,
      confidenceTier: "LOW",
      sameType: true,
      matchBadges: [
        `Cannot match: both reports are ${isLostA ? 'LOST' : 'FOUND'}. Select one LOST and one FOUND report.`,
      ],
      breakdown: { categoryScore: 0, locationScore: 0, timeScore: 0, keywordScore: 0, totalScore: 0 },
      error: true,
    };
  }

  // Enforce: Category must match
  const catA = canonicalCategory(reportA.category);
  const catB = canonicalCategory(reportB.category);
  if (catA !== catB) {
    return {
      matchId: `CMP-${reportA.id}-${reportB.id}`,
      reportA,
      reportB,
      score: 0,
      confidenceTier: "LOW",
      sameType: false,
      matchBadges: [
        `Category mismatch: "${catA}" vs "${catB}". Please choose items in the same relic category.`,
      ],
      breakdown: { categoryScore: 0, locationScore: 0, timeScore: 0, keywordScore: 0, totalScore: 0 },
      error: true,
    };
  }

  const cat = scoreCategory(reportA, reportB);
  const loc = scoreLocation(reportA, reportB);
  const time = scoreTime(reportA, reportB);
  const kw = scoreKeywords(reportA, reportB);

  const totalScore = Math.min(100, cat.score + loc.score + time.score + kw.score);

  let confidenceTier = "LOW";
  if (totalScore >= 85) confidenceTier = "LEGENDARY";
  else if (totalScore >= 70) confidenceTier = "HIGH";
  else if (totalScore >= 50) confidenceTier = "MODERATE";

  return {
    matchId: `CMP-${reportA.id}-${reportB.id}`,
    reportA,
    reportB,
    score: totalScore,
    confidenceTier,
    sameType: false,
    matchBadges: [cat.badge, loc.badge, time.badge, kw.badge],
    breakdown: {
      categoryScore: cat.score,
      locationScore: loc.score,
      timeScore: time.score,
      keywordScore: kw.score,
      totalScore,
    },
  };
}

/**
 * Find the best matches for a single report from a list of all reports.
 * Only compares against reports of the opposite type in the EXACT SAME CATEGORY.
 *
 * @param {Object} targetReport - The report to find matches for
 * @param {Array} allReports - All available reports
 * @param {number} [minScore=35] - Minimum score threshold
 * @param {number} [limit=10] - Max number of results
 * @returns {Array} sorted match results
 */
export function findBestMatchesForReport(targetReport, allReports, minScore = 55, limit = 10) {
  const targetIsLost = String(targetReport.type || targetReport.kind).toUpperCase() === "LOST";
  const targetCategory = canonicalCategory(targetReport.category);

  // Filter by opposite type AND exact same canonical category
  const candidates = allReports.filter((r) => {
    const isLost = String(r.type || r.kind).toUpperCase() === "LOST";
    return (
      isLost !== targetIsLost &&
      r.status !== "RECOVERED" &&
      r.id !== targetReport.id &&
      canonicalCategory(r.category) === targetCategory
    );
  });

  const results = [];
  for (const candidate of candidates) {
    const lostItem = targetIsLost ? targetReport : candidate;
    const foundItem = targetIsLost ? candidate : targetReport;
    const match = computeMatchScore(lostItem, foundItem);
    if (match.score >= minScore) {
      results.push(match);
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

