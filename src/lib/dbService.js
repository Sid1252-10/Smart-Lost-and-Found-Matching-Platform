// ============================================================
// Database & Persistence Service
// Supports Supabase PostgreSQL with seamless localStorage fallback
// ============================================================

import { createClient } from "@supabase/supabase-js";
import { SEED_REPORTS } from "./seedData";
import { SEED_ITEMS } from "../data/seed";
import { REPORT_TYPE, REPORT_STATUS, CLAIM_STATUS } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes("your-project")
);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const LOCAL_STORAGE_KEY_REPORTS = "nexasoul_sabaody_reports_v4";
const LOCAL_STORAGE_KEY_CLAIMS = "nexasoul_sabaody_claims_v4";

/**
 * Normalizes an item to have both kind ('lost'|'found') and type ('LOST'|'FOUND')
 */
export function normalizeReport(raw) {
  const isLost =
    String(raw.type || raw.kind || "lost").toUpperCase() === "LOST";
  const type = isLost ? REPORT_TYPE.LOST : REPORT_TYPE.FOUND;
  const kind = isLost ? "lost" : "found";

  return {
    id: raw.id || crypto.randomUUID(),
    type,
    kind,
    title: raw.title || "Untitled Treasure",
    category: raw.category || "General Goods",
    description: raw.description || "",
    location: raw.location || raw.locationName || "Sabaody Archipelago",
    locationId: raw.locationId || "sabaody",
    groveNumber: raw.groveNumber || 41,
    incidentDate:
      raw.incidentDate || raw.dateLost || raw.dateFound || new Date().toISOString().split("T")[0],
    dateLost: isLost ? (raw.dateLost || raw.incidentDate) : undefined,
    dateFound: !isLost ? (raw.dateFound || raw.incidentDate) : undefined,
    colour: raw.colour || "Standard",
    uniqueMarks: raw.uniqueMarks || "None",
    imageUrl: raw.imageUrl || raw.image_url || "",
    contactInfo: raw.contactInfo || raw.contact_info || "Den Den Mushi #08",
    reward: raw.reward || "",
    claimedBy: raw.claimedBy || raw.claimed_by || undefined,
    status: raw.status || (isLost ? REPORT_STATUS.ACTIVE : "FOUND"),
    createdAt: raw.createdAt || raw.created_at || new Date().toISOString(),
  };
}

/**
 * Combine seed data from both sources into unified list
 */
function getInitialSeedReports() {
  const normalizedBack = SEED_REPORTS.map(normalizeReport);
  const normalizedFront = SEED_ITEMS.map((item) =>
    normalizeReport({
      ...item,
      incidentDate: item.dateLost || item.dateFound || "2026-04-10",
      groveNumber: 41,
    })
  );

  const seen = new Set();
  const combined = [];
  for (const item of [...normalizedBack, ...normalizedFront]) {
    if (!seen.has(item.id)) {
      seen.add(item.id);
      combined.push(item);
    }
  }
  return combined;
}

/**
 * Fetch all reports from Supabase (or localStorage fallback)
 */
export async function fetchAllReports() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((row) =>
          normalizeReport({
            id: row.id,
            type: row.type,
            title: row.title,
            category: row.category,
            description: row.description,
            location: row.location_name,
            groveNumber: row.grove_number,
            incidentDate: row.incident_date,
            imageUrl: row.image_url,
            contactInfo: row.contact_info,
            reward: row.reward,
            status: row.status,
            createdAt: row.created_at,
          })
        );
      }
    } catch (err) {
      console.warn("Supabase fetch failed, falling back to local storage:", err);
    }
  }

  // Local storage fallback
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_REPORTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeReport);
      }
    }
  } catch (e) {
    console.error("Local storage read error", e);
  }

  const initial = getInitialSeedReports();
  saveReportsToLocalStorage(initial);
  return initial;
}

/**
 * Save report into Supabase PostgreSQL (or localStorage)
 */
export async function saveReport(reportInput) {
  const report = normalizeReport(reportInput);

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("reports")
        .insert([
          {
            id: report.id,
            type: report.type,
            title: report.title,
            category: report.category,
            description: report.description,
            location_name: report.location,
            grove_number: report.groveNumber,
            incident_date: report.incidentDate,
            image_url: report.imageUrl,
            contact_info: report.contactInfo,
            reward: report.reward,
            status: report.status,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        // Also update local storage for offline speed
        const current = getReportsFromLocalStorage();
        saveReportsToLocalStorage([report, ...current.filter((r) => r.id !== report.id)]);
        return report;
      }
    } catch (err) {
      console.warn("Supabase insert failed, saving to local storage:", err);
    }
  }

  // Local Storage fallback
  const current = getReportsFromLocalStorage();
  const updated = [report, ...current.filter((r) => r.id !== report.id)];
  saveReportsToLocalStorage(updated);
  return report;
}

/**
 * Update report status (e.g. ACTIVE -> POTENTIAL_MATCH -> RECOVERED)
 */
export async function updateReportStatus(reportId, newStatus) {
  if (supabase) {
    try {
      await supabase
        .from("reports")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", reportId);
    } catch (err) {
      console.warn("Supabase update error:", err);
    }
  }

  const current = getReportsFromLocalStorage();
  const updated = current.map((r) =>
    r.id === reportId ? { ...r, status: newStatus } : r
  );
  saveReportsToLocalStorage(updated);
  return updated;
}

/**
 * Save Claim to Database
 */
export async function submitClaim(claimInput) {
  const claim = {
    id: claimInput.id || crypto.randomUUID(),
    reportId: claimInput.reportId,
    claimantName: claimInput.claimantName || "Anonymous Pirate",
    claimantContact: claimInput.claimantContact || "",
    proofDescription: claimInput.proofDescription || "",
    proofImageUrl: claimInput.proofImageUrl || "",
    status: CLAIM_STATUS.PENDING,
    createdAt: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from("claims").insert([
        {
          id: claim.id,
          report_id: claim.reportId,
          claimant_name: claim.claimantName,
          claimant_contact: claim.claimantContact,
          proof_description: claim.proofDescription,
          proof_image_url: claim.proofImageUrl,
          status: claim.status,
        },
      ]);
    } catch (err) {
      console.warn("Supabase claim insert error:", err);
    }
  }

  const claims = getClaimsFromLocalStorage();
  claims.unshift(claim);
  localStorage.setItem(LOCAL_STORAGE_KEY_CLAIMS, JSON.stringify(claims));

  // Mark the report as CLAIM_PENDING
  await updateReportStatus(claim.reportId, REPORT_STATUS.CLAIM_PENDING);

  return claim;
}

/**
 * Fetch all claims
 */
export async function fetchAllClaims() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("claims")
        .select("*, reports(title, category, type)")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn("Supabase fetch claims error:", err);
    }
  }

  return getClaimsFromLocalStorage();
}

/**
 * Helpers for Local Storage
 */
function getReportsFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_REPORTS);
    return raw ? JSON.parse(raw) : getInitialSeedReports();
  } catch {
    return getInitialSeedReports();
  }
}

function saveReportsToLocalStorage(list) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_REPORTS, JSON.stringify(list));
  } catch (e) {
    console.error("Local storage write error:", e);
  }
}

function getClaimsFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_CLAIMS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
