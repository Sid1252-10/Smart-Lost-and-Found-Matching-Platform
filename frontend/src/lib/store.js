// ============================================================
// PS-08: Data Store — In-Memory + localStorage Persistence
// Handles all CRUD operations for reports & claims.
// The matching algorithm is NOT in this file (separate module).
// ============================================================

import { SEED_REPORTS } from "./seedData";
import {
  REPORT_TYPE,
  REPORT_STATUS,
  CLAIM_STATUS,
  generateId,
} from "./types";

const REPORTS_STORAGE_KEY = "nexasoul_sabaody_reports_v2";
const CLAIMS_STORAGE_KEY = "nexasoul_sabaody_claims_v1";

// ──────────────────────────── INTERNAL STATE ────────────────────────────

let _reports = [];
let _claims = [];
let _initialized = false;

// ──────────────────────────── INITIALIZATION ────────────────────────────

/**
 * Initialize the store. Loads from localStorage if available,
 * otherwise seeds with demo data. Safe to call multiple times.
 */
export function initStore() {
  if (_initialized) return;

  // Load reports
  try {
    const savedReports = localStorage.getItem(REPORTS_STORAGE_KEY);
    if (savedReports) {
      _reports = JSON.parse(savedReports);
    } else {
      _reports = [...SEED_REPORTS];
      _persist();
    }
  } catch {
    _reports = [...SEED_REPORTS];
  }

  // Load claims
  try {
    const savedClaims = localStorage.getItem(CLAIMS_STORAGE_KEY);
    if (savedClaims) {
      _claims = JSON.parse(savedClaims);
    } else {
      _claims = [];
    }
  } catch {
    _claims = [];
  }

  _initialized = true;
}

/**
 * Persist current state to localStorage.
 */
function _persist() {
  try {
    localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(_reports));
    localStorage.setItem(CLAIMS_STORAGE_KEY, JSON.stringify(_claims));
  } catch (e) {
    console.error("Failed to persist store:", e);
  }
}

/**
 * Reset the store back to seed data (useful for demo resets).
 */
export function resetStore() {
  _reports = [...SEED_REPORTS];
  _claims = [];
  _initialized = true;
  _persist();
}

// ──────────────────────────── REPORT CRUD ────────────────────────────

/**
 * Get all reports, optionally filtered.
 *
 * @param {Object} filters
 * @param {string} [filters.type]       - "LOST" or "FOUND"
 * @param {string} [filters.category]   - category id (e.g. "weapons-blades")
 * @param {string} [filters.status]     - report status
 * @param {number} [filters.groveZone]  - start of zone range (1, 30, 40, 50, 60, 70) or 0 for all
 * @param {string} [filters.search]     - free-text search query
 * @returns {Array} filtered reports sorted by createdAt descending
 */
export function getReports(filters = {}) {
  initStore();
  let results = [..._reports];

  if (filters.type) {
    results = results.filter((r) => r.type === filters.type);
  }

  if (filters.category && filters.category !== "all") {
    results = results.filter((r) => r.category === filters.category);
  }

  if (filters.status) {
    results = results.filter((r) => r.status === filters.status);
  }

  if (filters.groveZone && filters.groveZone > 0) {
    const zoneStart = Number(filters.groveZone);
    const zoneEnd = zoneStart === 1 ? 29 : zoneStart + 9;
    results = results.filter(
      (r) => r.groveNumber >= zoneStart && r.groveNumber <= zoneEnd
    );
  }

  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    results = results.filter((r) => {
      return (
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.locationName.toLowerCase().includes(q) ||
        r.reporterName.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q)
      );
    });
  }

  // Sort by most recent first
  results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return results;
}

/**
 * Get a single report by ID.
 */
export function getReportById(id) {
  initStore();
  return _reports.find((r) => r.id === id) || null;
}

/**
 * Create a new report (lost or found).
 *
 * @param {Object} reportData - The report fields (without id, createdAt, status)
 * @returns {Object} the created report
 */
export function createReport(reportData) {
  initStore();

  const prefix = reportData.type === REPORT_TYPE.LOST ? "LOST" : "FOUND";
  const newReport = {
    ...reportData,
    id: generateId(prefix),
    status: REPORT_STATUS.ACTIVE,
    createdAt: new Date().toISOString(),
  };

  _reports.unshift(newReport);
  _persist();
  return newReport;
}

/**
 * Update a report's status.
 *
 * @param {string} id - Report ID
 * @param {string} newStatus - One of REPORT_STATUS values
 * @returns {Object|null} updated report or null if not found
 */
export function updateReportStatus(id, newStatus) {
  initStore();
  const report = _reports.find((r) => r.id === id);
  if (!report) return null;

  report.status = newStatus;
  _persist();
  return report;
}

/**
 * Mark a report as RECOVERED (final state).
 * Also marks the paired report (if any) as RECOVERED.
 *
 * @param {string} id - Report ID to mark as recovered
 * @param {string} [pairedId] - Optional paired report ID to also mark
 * @returns {Object|null} the recovered report
 */
export function markRecovered(id, pairedId) {
  initStore();

  const report = _reports.find((r) => r.id === id);
  if (!report) return null;
  report.status = REPORT_STATUS.RECOVERED;

  if (pairedId) {
    const paired = _reports.find((r) => r.id === pairedId);
    if (paired) paired.status = REPORT_STATUS.RECOVERED;
  }

  _persist();
  return report;
}

/**
 * Delete a report by ID.
 *
 * @param {string} id - Report ID
 * @returns {boolean} true if deleted
 */
export function deleteReport(id) {
  initStore();
  const idx = _reports.findIndex((r) => r.id === id);
  if (idx === -1) return false;

  _reports.splice(idx, 1);
  _persist();
  return true;
}

// ──────────────────────────── CLAIM OPERATIONS ────────────────────────────

/**
 * Submit a new claim on a found/lost item.
 *
 * @param {Object} claimData
 * @param {string} claimData.reportId     - The report being claimed
 * @param {string} claimData.claimantName - Name of the claimant
 * @param {string} claimData.crewName     - Crew affiliation
 * @param {string} claimData.proofAnswer  - Answer to the secret question
 * @returns {Object} result with { success, claim, message }
 */
export function submitClaim(claimData) {
  initStore();

  const report = _reports.find((r) => r.id === claimData.reportId);
  if (!report) {
    return { success: false, claim: null, message: "Report not found." };
  }

  if (report.status === REPORT_STATUS.RECOVERED) {
    return { success: false, claim: null, message: "This item has already been recovered." };
  }

  // Verify the proof answer (case-insensitive, trimmed)
  const expectedAnswer = (report.secretProofAnswer || "").toLowerCase().trim();
  const givenAnswer = (claimData.proofAnswer || "").toLowerCase().trim();

  const isVerified = expectedAnswer && givenAnswer && expectedAnswer === givenAnswer;

  const newClaim = {
    id: generateId("CLM"),
    reportId: claimData.reportId,
    claimantName: claimData.claimantName,
    crewName: claimData.crewName,
    proofAnswer: claimData.proofAnswer,
    status: isVerified ? CLAIM_STATUS.APPROVED : CLAIM_STATUS.REJECTED,
    submittedAt: new Date().toISOString(),
  };

  _claims.push(newClaim);

  // Update report status based on verification result
  if (isVerified) {
    report.status = REPORT_STATUS.CLAIM_PENDING;
  }

  _persist();

  return {
    success: isVerified,
    claim: newClaim,
    message: isVerified
      ? "Ownership verified! The relic awaits its true captain."
      : "Verification failed. The proof answer does not match.",
  };
}

/**
 * Get all claims for a specific report.
 */
export function getClaimsForReport(reportId) {
  initStore();
  return _claims.filter((c) => c.reportId === reportId);
}

/**
 * Get all claims.
 */
export function getAllClaims() {
  initStore();
  return [..._claims];
}

// ──────────────────────────── STATISTICS ────────────────────────────

/**
 * Get summary statistics for the dashboard.
 */
export function getStats() {
  initStore();

  const lost = _reports.filter((r) => r.type === REPORT_TYPE.LOST);
  const found = _reports.filter((r) => r.type === REPORT_TYPE.FOUND);
  const recovered = _reports.filter((r) => r.status === REPORT_STATUS.RECOVERED);
  const active = _reports.filter((r) => r.status === REPORT_STATUS.ACTIVE);

  return {
    totalReports: _reports.length,
    totalLost: lost.length,
    totalFound: found.length,
    totalRecovered: recovered.length,
    totalActive: active.length,
    totalClaims: _claims.length,
    approvedClaims: _claims.filter((c) => c.status === CLAIM_STATUS.APPROVED).length,
  };
}
