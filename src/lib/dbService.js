// ============================================================
// Database & Persistence Service
// Supports Supabase PostgreSQL with seamless localStorage fallback
// ============================================================

import { createClient } from "@supabase/supabase-js";
import { SEED_REPORTS } from "./seedData";
import { SEED_ITEMS } from "../data/seed";
import { canonicalCategory } from "./categories";
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
 * and guarantees a single canonical category across the codebase.
 */
export function normalizeReport(raw) {
  const isLost =
    String(raw.type || raw.kind || "lost").toUpperCase() === "LOST";
  const type = isLost ? REPORT_TYPE.LOST : REPORT_TYPE.FOUND;
  const kind = isLost ? "lost" : "found";

  const rawGrove = raw.groveNumber || raw.grove_number;
  const parsedGrove = rawGrove ? parseInt(String(rawGrove), 10) : 41;
  const groveNumber = isNaN(parsedGrove) || parsedGrove < 1 || parsedGrove > 79 ? 41 : parsedGrove;

  return {
    id: String(raw.id || crypto.randomUUID()),
    type,
    kind,
    title: raw.title || "Untitled Treasure",
    category: canonicalCategory(raw.category),
    description: raw.description || "",
    location: raw.location || raw.locationName || raw.location_name || `Sabaody Archipelago (Grove ${groveNumber})`,
    locationId: raw.locationId || "sabaody",
    groveNumber,
    incidentDate:
      raw.incidentDate || raw.incident_date || raw.dateLost || raw.dateFound || new Date().toISOString().split("T")[0],
    dateLost: isLost ? (raw.dateLost || raw.incidentDate || raw.incident_date || new Date().toISOString().split("T")[0]) : undefined,
    dateFound: !isLost ? (raw.dateFound || raw.incidentDate || raw.incident_date || new Date().toISOString().split("T")[0]) : undefined,
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
 * Automatically seed Supabase with starter Grand Line items if table is empty
 */
export async function seedSupabaseIfEmpty() {
  if (!supabase) return false;
  try {
    const { count, error } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true });

    if (!error && count === 0) {
      const initial = getInitialSeedReports();
      const rows = initial.map((report) => ({
        id: report.id,
        type: report.type,
        title: report.title,
        category: report.category,
        description: report.description,
        location_name: report.location,
        grove_number: report.groveNumber || 41,
        incident_date: report.incidentDate,
        image_url: report.imageUrl || "",
        contact_info: report.contactInfo,
        reward: report.reward,
        status: report.status,
      }));

      const { error: seedErr } = await supabase.from("reports").insert(rows);
      if (!seedErr) {
        console.log(`[Supabase] Seeded ${rows.length} reports into PostgreSQL.`);
        return true;
      }
    }
  } catch (err) {
    console.warn("[Supabase] Seed check error:", err);
  }
  return false;
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

      if (!error && data) {
        if (data.length === 0) {
          // If empty, auto-seed with Grand Line catalog
          const didSeed = await seedSupabaseIfEmpty();
          if (didSeed) {
            return fetchAllReports();
          }
        } else {
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
 * Fetch a single report by ID
 */
export async function fetchReportById(reportId) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", reportId)
        .single();

      if (!error && data) {
        return normalizeReport(data);
      }
    } catch (err) {
      console.warn("Supabase fetch single error:", err);
    }
  }

  const all = await fetchAllReports();
  return all.find((r) => r.id === reportId) || null;
}

/**
 * Save / Insert report into Supabase PostgreSQL (or localStorage)
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
 * Delete a report from Supabase and local storage
 */
export async function deleteReport(reportId) {
  if (supabase) {
    try {
      await supabase.from("reports").delete().eq("id", reportId);
    } catch (err) {
      console.warn("Supabase delete report error:", err);
    }
  }

  const current = getReportsFromLocalStorage();
  const updated = current.filter((r) => r.id !== reportId);
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
 * Fetch claims for a specific report
 */
export async function fetchClaimsForReport(reportId) {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("claims")
        .select("*")
        .eq("report_id", reportId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn("Supabase fetch report claims error:", err);
    }
  }

  const all = getClaimsFromLocalStorage();
  return all.filter((c) => c.reportId === reportId);
}

/**
 * Update claim status (PENDING -> APPROVED / REJECTED)
 */
export async function updateClaimStatus(claimId, newStatus, adminNotes = "") {
  if (supabase) {
    try {
      await supabase
        .from("claims")
        .update({ status: newStatus, admin_notes: adminNotes })
        .eq("id", claimId);
    } catch (err) {
      console.warn("Supabase update claim error:", err);
    }
  }

  const claims = getClaimsFromLocalStorage();
  const updated = claims.map((c) =>
    c.id === claimId ? { ...c, status: newStatus, adminNotes } : c
  );
  localStorage.setItem(LOCAL_STORAGE_KEY_CLAIMS, JSON.stringify(updated));
  return updated;
}

/**
 * Delete a claim
 */
export async function deleteClaim(claimId) {
  if (supabase) {
    try {
      await supabase.from("claims").delete().eq("id", claimId);
    } catch (err) {
      console.warn("Supabase delete claim error:", err);
    }
  }

  const claims = getClaimsFromLocalStorage();
  const updated = claims.filter((c) => c.id !== claimId);
  localStorage.setItem(LOCAL_STORAGE_KEY_CLAIMS, JSON.stringify(updated));
  return updated;
}

/**
 * Upload Image to Supabase Storage Bucket ('treasure-images')
 * Returns { url, path, error }
 */
export async function uploadTreasureImage(file, customPath) {
  if (!supabase || !file) {
    return { url: "", error: "Supabase client not configured or file missing" };
  }

  try {
    const fileExt = file.name ? file.name.split(".").pop() : "jpg";
    const fileName =
      customPath ||
      `reports/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("treasure-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.warn("Supabase Storage bucket upload error:", error.message);
      return { url: "", error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from("treasure-images")
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl, path: data.path, error: null };
  } catch (err) {
    console.error("Failed to upload treasure image:", err);
    return { url: "", error: err.message };
  }
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
