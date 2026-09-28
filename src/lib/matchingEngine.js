// ============================================================
// PS-08: Smart Matching Engine
// Multi-Factor Scoring: Category(35) + Location(25) + Time(15) + Keywords(25)
// ============================================================

import { groveDistance } from "./sabaodyMap";

// ──────────────────────────── HELPERS ────────────────────────────

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "with", "of", "by", "from", "is", "was", "it", "this", "that", "lost",
  "found", "some", "very", "has", "have", "had", "my", "your", "his",
  "her", "its", "near", "been", "while", "after", "looks", "like",
]);

/**
 * Tokenizes a string into meaningful keywords.
 */
function tokenize(text) {
  return new Set(
    text
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
  if (lost.category === found.category) {
    return {
      score: 35,
      badge: `Exact Category Match: ${lost.category} (+35)`,
    };
  }
  return { score: 0, badge: `Category Mismatch (+0)` };
}

/**
 * Factor 2: Grove Proximity (max 25 pts)
 */
function scoreLocation(lost, found) {
  const dist = groveDistance(lost.groveNumber, found.groveNumber);

  if (dist === 0) {
    return { score: 25, badge: `Same Grove ${lost.groveNumber} (+25)` };
  }
  if (dist <= 3) {
    return { score: 22, badge: `Nearby: ${dist} groves apart (+22)` };
  }
  if (dist <= 8) {
    return { score: 16, badge: `Same Sector: ${dist} groves apart (+16)` };
  }
  if (dist <= 15) {
    return { score: 10, badge: `Adjacent Zone: ${dist} groves apart (+10)` };
  }
  return { score: 3, badge: `Distant: ${dist} groves apart (+3)` };
}

/**
 * Factor 3: Time Proximity (max 15 pts)
 */
function scoreTime(lost, found) {
  const msPerDay = 86400000;
  const diffDays = Math.abs(
    new Date(lost.incidentDate).getTime() - new Date(found.incidentDate).getTime()
  ) / msPerDay;

  if (diffDays <= 1) {
    return { score: 15, badge: `Same 24h Window (+15)` };
  }
  if (diffDays <= 3) {
    return { score: 12, badge: `Within 3 Days (+12)` };
  }
  if (diffDays <= 7) {
    return { score: 8, badge: `Within 1 Week (+8)` };
  }
  return { score: 3, badge: `Over 1 Week Apart (+3)` };
}

/**
 * Factor 4: Keyword / Description Similarity (max 25 pts)
 */
function scoreKeywords(lost, found) {
  const lostTokens = tokenize(`${lost.title} ${lost.description}`);
  const foundTokens = tokenize(`${found.title} ${found.description}`);
  const { score: jaccard, sharedTokens } = jaccardSimilarity(lostTokens, foundTokens);

  // Scale jaccard (0-1) up to 25 pts with a boost factor
  const pts = Math.min(25, Math.round(jaccard * 45));

  if (sharedTokens.length > 0) {
    const preview = sharedTokens.slice(0, 4).map((t) => `'${t}'`).join(", ");
    return { score: pts, badge: `Shared Clues: ${preview} (+${pts})` };
  }
  return { score: pts, badge: `No Shared Keywords (+0)` };
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

  const totalScore = Math.min(100, cat.score + loc.score + time.score + kw.score);

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
 * @param {number} [minScore=35]
 * @returns {Array} sorted match results (highest first)
 */
export function rankAllMatches(lostList, foundList, minScore = 35) {
  const results = [];

  for (const lost of lostList) {
    for (const found of foundList) {
      // Must be same category: comparing across different categories is irrelevant
      if (lost.category !== found.category) continue;

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
  if (reportA.type === reportB.type) {
    return {
      matchId: `CMP-${reportA.id}-${reportB.id}`,
      reportA,
      reportB,
      score: 0,
      confidenceTier: "LOW",
      sameType: true,
      matchBadges: [
        "Cannot match: both reports are " + reportA.type + ". Select one LOST and one FOUND report.",
      ],
      breakdown: { categoryScore: 0, locationScore: 0, timeScore: 0, keywordScore: 0, totalScore: 0 },
      error: true,
    };
  }

  // Enforce: Category must match
  if (reportA.category !== reportB.category) {
    return {
      matchId: `CMP-${reportA.id}-${reportB.id}`,
      reportA,
      reportB,
      score: 0,
      confidenceTier: "LOW",
      sameType: false,
      matchBadges: [
        `Category mismatch: "${reportA.category}" vs "${reportB.category}". Cannot match items of different categories.`,
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
export function findBestMatchesForReport(targetReport, allReports, minScore = 35, limit = 10) {
  const oppositeType = targetReport.type === "LOST" ? "FOUND" : "LOST";
  // Filter by opposite type AND exact same category
  const candidates = allReports.filter(
    (r) =>
      r.type === oppositeType &&
      r.status !== "RECOVERED" &&
      r.id !== targetReport.id &&
      r.category === targetReport.category
  );

  const results = [];
  for (const candidate of candidates) {
    const match = computeMatchScore(
      targetReport.type === "LOST" ? targetReport : candidate,
      targetReport.type === "FOUND" ? targetReport : candidate
    );
    if (match.score >= minScore) {
      results.push(match);
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

