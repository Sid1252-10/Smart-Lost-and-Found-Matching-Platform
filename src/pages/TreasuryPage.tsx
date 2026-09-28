import { useState, useMemo } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import {
  Coins,
  Shield,
  Sparkles,
  Trophy,
  Vault,
  Search,
  Eye,
  MapPin,
  Clock,
  Tag,
  ArrowLeftRight,
  X,
  ShieldCheck,
  Radio,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegistry } from '../context/RegistryContext'
import { rankAllMatches, compareAnyTwo } from '../lib/matchingEngine'
import { canonicalCategory } from '../lib/categories'
import { MatchScoreBreakdown } from '../components/MatchScoreBreakdown'
import { ImageZoomModal } from '../components/ImageZoomModal'
import { ClaimVerificationModal } from '../components/ClaimVerificationModal'
import type { RegistryItem } from '../types'

export function TreasuryPage() {
  const { items } = useRegistry()
  const navigate = useNavigate()
  const [selectedLostId, setSelectedLostId] = useState<string>('')
  const [selectedFoundId, setSelectedFoundId] = useState<string>('')
  const [manualResult, setManualResult] = useState<any>(null)
  const [inspectingMatch, setInspectingMatch] = useState<any>(null)
  const [claimModalItem, setClaimModalItem] = useState<RegistryItem | null>(null)
  const [zoomData, setZoomData] = useState<{
    isOpen: boolean
    imageUrl: string
    title: string
    location?: string
    category?: string
    incidentDate?: string
  }>({ isOpen: false, imageUrl: '', title: '' })

  // Live real data metrics
  const totalReports = items.length
  const lostList = useMemo(() => items.filter((i) => i.kind === 'lost'), [items])
  const foundList = useMemo(() => items.filter((i) => i.kind === 'found'), [items])
  const recoveredList = useMemo(() => items.filter((i) => i.status === 'RECOVERED'), [items])
  const pendingClaims = useMemo(
    () => items.filter((i) => i.status === 'CLAIMED' || i.status === 'CLAIM_PENDING'),
    [items]
  )

  const matchRate = totalReports > 0 ? Math.round((recoveredList.length / totalReports) * 100) : 0

  // Live same-category matches computed dynamically
  const liveMatches = useMemo(() => {
    return rankAllMatches(lostList, foundList, 50).slice(0, 10)
  }, [lostList, foundList])

  function handleManualCompare() {
    const reportA = items.find((i) => i.id === selectedLostId)
    const reportB = items.find((i) => i.id === selectedFoundId)
    if (!reportA || !reportB) return

    const res = compareAnyTwo(reportA, reportB)
    setManualResult(res)
  }

  function getTierBadgeClass(tier: string, score: number) {
    if (score >= 85 || tier === 'LEGENDARY') {
      return 'bg-amber-500/20 text-[#f0d060] border-amber-500/50 shadow-[0_0_12px_rgba(240,208,96,0.2)]'
    }
    if (score >= 70 || tier === 'HIGH') {
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
    }
    return 'bg-sky-500/20 text-sky-300 border-sky-500/40'
  }

  return (
    <div className="relative min-h-screen text-[#e2e8f0] flex flex-col font-body">
      <Navbar />

      <main className="flex-1 mx-auto max-w-[1440px] w-full px-4 py-8 md:px-8">
        {/* Navigation Breadcrumbs */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-b border-[#d4a843]/20 pb-3">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-[#f0d060] transition-colors">
              Grand Line Home
            </Link>
            <span>/</span>
            <Link to="/browse" className="hover:text-[#f0d060] transition-colors">
              Treasure Ledger
            </Link>
            <span>/</span>
            <span className="text-[#f0d060] font-semibold">Observation Haki Treasury</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/report"
              className="text-xs text-[#f0d060] hover:underline font-semibold flex items-center gap-1"
            >
              <span>+ Transmit New Report</span>
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              to="/claiming"
              className="text-xs text-slate-300 hover:text-[#f0d060] transition-colors"
            >
              Open Claim Desk
            </Link>
          </div>
        </div>

        {/* Banner */}
        <div className="mb-8 rounded-2xl border border-[#d4a843]/40 bg-gradient-to-r from-[#101b2d] via-[#1a2942] to-[#101b2d] p-6 md:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Sparkles className="w-80 h-80 text-[#f0d060]" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f0d060]/20 to-[#d4a843]/10 border border-[#d4a843] shadow-[0_0_20px_rgba(212,168,67,0.25)]">
                <Sparkles className="h-7 w-7 text-[#f0d060] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#f0d060] tracking-widest uppercase font-heading">
                    OBSERVATION HAKI CORRELATION ENGINE
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    <Radio className="h-3 w-3 animate-pulse" />
                    LIVE INTEL
                  </span>
                </div>
                <h1 className="font-pirate text-3xl md:text-5xl font-bold text-white tracking-wide mt-1">
                  Smart Matching & Registry Treasury
                </h1>
                <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl">
                  Observation Haki synchronizes lost and found relics across Sabaody by relic category, spatial grove coordinates, timeline window, and distinctive physical markings.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Live Registered Records</span>
                <span className="font-heading text-2xl md:text-3xl font-black text-[#f0d060]">
                  {totalReports} Items Logged
                </span>
              </div>
              <Link
                to="/report"
                className="rounded-xl bg-gradient-to-r from-[#d4a843] to-[#b88a2e] px-5 py-3 text-xs font-bold text-black hover:brightness-110 shadow-lg tracking-wider uppercase transition-transform hover:scale-105"
              >
                File New Report
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Real-time Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="rounded-xl border border-[#d4a843]/30 bg-[#0c1422] p-5 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Coins className="h-5 w-5 text-[#f0d060]" />
              <h3 className="font-bold text-xs text-[#f0d060] tracking-wider uppercase font-heading">
                Registry Balance
              </h3>
            </div>
            <p className="text-2xl font-black text-white font-heading">
              {lostList.length} Lost <span className="text-slate-500 font-normal">/</span> {foundList.length} Found
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Active ledger entries across Sabaody Groves and Grand Line sectors
            </p>
          </div>

          <div className="rounded-xl border border-[#d4a843]/30 bg-[#0c1422] p-5 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-[#f0d060]" />
              <h3 className="font-bold text-xs text-[#f0d060] tracking-wider uppercase font-heading">
                Recovered / Reunited
              </h3>
            </div>
            <p className="text-2xl font-black text-white font-heading">
              {recoveredList.length} Reclaimed <span className="text-[#f0d060] text-lg font-bold">({matchRate}%)</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {pendingClaims.length} claims currently undergoing verification
            </p>
          </div>

          <div className="rounded-xl border border-[#d4a843]/30 bg-[#0c1422] p-5 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="h-5 w-5 text-[#f0d060]" />
              <h3 className="font-bold text-xs text-[#f0d060] tracking-wider uppercase font-heading">
                Discovered Matches
              </h3>
            </div>
            <p className="text-2xl font-black text-white font-heading">
              {liveMatches.length} Candidate Pairs
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Cross-correlated with high Observation Haki resonance
            </p>
          </div>
        </div>

        {/* Section 1: Auto-Discovered Category Matches */}
        <div className="mb-10 rounded-2xl border border-[#d4a843]/30 bg-[#0a1220] p-6 md:p-8 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
            <div>
              <h2 className="font-heading text-xl font-bold text-[#f0d060] flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#f0d060]" />
                Auto-Discovered Matches (Resonant Pairs)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Correlated through relic category affinity, Sabaody Grove proximity, timeline alignment, and shared physical clues.
              </p>
            </div>
            <span className="rounded-full bg-[#d4a843]/15 border border-[#d4a843]/40 px-3.5 py-1 text-xs font-bold text-[#f0d060]">
              {liveMatches.length} Candidate Matches Active
            </span>
          </div>

          {liveMatches.length > 0 ? (
            <div className="space-y-4">
              {liveMatches.map((match, idx) => {
                const lost = match.lostReport
                const found = match.foundReport
                const tierClass = getTierBadgeClass(match.confidenceTier, match.score)

                return (
                  <div
                    key={match.matchId || idx}
                    className="rounded-xl border border-slate-700/80 bg-slate-900/90 p-5 transition-all hover:border-[#d4a843]/70 hover:shadow-[0_4px_20px_rgba(212,168,67,0.15)]"
                  >
                    {/* Top Row: Dual Artifact Dossier */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      {/* Left: Lost Relic Card */}
                      <div className="lg:col-span-5 rounded-lg border border-red-500/20 bg-red-950/20 p-3.5">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="rounded bg-red-500/20 border border-red-500/40 px-2 py-0.5 text-[10px] font-bold text-red-300 tracking-wider uppercase">
                            LOST RELIC
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-red-400" />
                            {lost?.incidentDate || lost?.dateLost || 'Recent'}
                          </span>
                        </div>
                        <h4 className="font-heading text-sm md:text-base font-bold text-white line-clamp-1">
                          {lost?.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-300">
                          <span className="flex items-center gap-1 text-slate-400">
                            <MapPin className="h-3 w-3 text-red-400" />
                            {lost?.location}
                          </span>
                        </div>
                        {lost?.description && (
                          <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 italic">
                            “{lost.description}”
                          </p>
                        )}
                      </div>

                      {/* Center: Haki Resonance Bridge */}
                      <div className="lg:col-span-2 flex flex-col items-center justify-center text-center py-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d4a843]/15 border border-[#d4a843]/60 mb-2">
                          <ArrowLeftRight className="h-5 w-5 text-[#f0d060]" />
                        </div>
                        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-black tracking-wide ${tierClass}`}>
                          {match.score}% Resonance
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">
                          {match.confidenceTier} MATCH
                        </span>
                      </div>

                      {/* Right: Found Relic Card */}
                      <div className="lg:col-span-5 rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-3.5">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300 tracking-wider uppercase">
                            FOUND RELIC
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-emerald-400" />
                            {found?.incidentDate || found?.dateFound || 'Recent'}
                          </span>
                        </div>
                        <h4 className="font-heading text-sm md:text-base font-bold text-white line-clamp-1">
                          {found?.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-300">
                          <span className="flex items-center gap-1 text-slate-400">
                            <MapPin className="h-3 w-3 text-emerald-400" />
                            {found?.location}
                          </span>
                        </div>
                        {found?.description && (
                          <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 italic">
                            “{found.description}”
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Interactive 4-Factor Percentage Breakdown */}
                    <div className="mt-3">
                      <MatchScoreBreakdown
                        compact
                        score={match.score}
                        confidenceTier={match.confidenceTier}
                        breakdown={match.breakdown}
                        matchBadges={match.matchBadges}
                      />
                    </div>

                    {/* Bottom Row: Clean Intelligence Badges & Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1 rounded-md bg-slate-800/90 border border-slate-700 px-2.5 py-1 text-[11px] text-slate-300 font-medium">
                          <Tag className="h-3 w-3 text-[#f0d060]" />
                          {canonicalCategory(lost?.category)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setInspectingMatch(match)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-400" />
                          <span>Inspect Evidence</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setClaimModalItem(found || null)}
                          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-1.5 text-xs font-bold text-black hover:brightness-110 shadow-md transition-all font-heading"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          <span>Two-Step Claim</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs italic bg-black/20 rounded-xl border border-slate-800">
              No conflicting cross-category claims found. All active reports are cataloged and synchronized.
            </div>
          )}
        </div>

        {/* Section 2: Manual Report Pair Matcher */}
        <div className="mb-10 rounded-2xl border border-[#d4a843]/30 bg-[#0a1220] p-6 md:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="font-heading text-xl font-bold text-[#f0d060] flex items-center gap-2">
              <Vault className="h-5 w-5 text-[#f0d060]" />
              Manual Observation Haki Cross-Comparison
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select any LOST report and any FOUND report to test Haki resonance and examine cross-relic correlation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-body">
                Select Lost Report
              </label>
              <select
                value={selectedLostId}
                onChange={(e) => setSelectedLostId(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-[#f0d060] focus:outline-none transition-colors"
              >
                <option value="">-- Choose a Lost Report --</option>
                {lostList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({canonicalCategory(item.category)} • {item.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-body">
                Select Found Report
              </label>
              <select
                value={selectedFoundId}
                onChange={(e) => setSelectedFoundId(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3.5 py-2.5 text-xs text-white focus:border-[#f0d060] focus:outline-none transition-colors"
              >
                <option value="">-- Choose a Found Report --</option>
                {foundList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({canonicalCategory(item.category)} • {item.location})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleManualCompare}
            disabled={!selectedLostId || !selectedFoundId}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4a843] to-[#b88a2e] py-3 text-xs md:text-sm font-bold text-black hover:brightness-110 disabled:opacity-50 transition-all uppercase tracking-wider shadow-lg"
          >
            <Sparkles className="h-4 w-4" />
            <span>Run Observation Haki Comparison</span>
          </button>

          {manualResult && (
            <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900/90 p-5">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                <span className="font-heading font-bold text-white text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#f0d060]" />
                  Observation Haki Correlation Result:
                </span>
                <span
                  className={`rounded-full px-3.5 py-1 text-xs font-bold border ${
                    manualResult.error
                      ? 'bg-red-950/80 text-red-300 border-red-500/50'
                      : 'bg-[#d4a843]/20 text-[#f0d060] border-[#d4a843]'
                  }`}
                >
                  {manualResult.score}% Haki Resonance ({manualResult.confidenceTier || 'LOW'})
                </span>
              </div>

              {manualResult.matchBadges && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {manualResult.matchBadges.map((b: string, i: number) => (
                    <span
                      key={i}
                      className={`rounded-md px-2.5 py-1 text-xs ${
                        manualResult.error
                          ? 'bg-red-950/50 border border-red-500/30 text-red-300'
                          : 'bg-slate-800 border border-slate-700 text-slate-300'
                      }`}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}

              {!manualResult.error && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs border-t border-slate-800 pt-4">
                  <div className="rounded-lg bg-black/40 border border-slate-800/80 p-3">
                    <span className="text-slate-400 block text-[11px] uppercase tracking-wider mb-1">
                      Relic Category
                    </span>
                    <strong className="text-emerald-400 font-bold text-sm">
                      Direct Category Match
                    </strong>
                  </div>
                  <div className="rounded-lg bg-black/40 border border-slate-800/80 p-3">
                    <span className="text-slate-400 block text-[11px] uppercase tracking-wider mb-1">
                      Spatial Proximity
                    </span>
                    <strong className="text-[#f0d060] font-bold text-sm">
                      Sabaody Sector Correlation
                    </strong>
                  </div>
                  <div className="rounded-lg bg-black/40 border border-slate-800/80 p-3">
                    <span className="text-slate-400 block text-[11px] uppercase tracking-wider mb-1">
                      Incident Timeline
                    </span>
                    <strong className="text-sky-400 font-bold text-sm">
                      Synchronized Window
                    </strong>
                  </div>
                  <div className="rounded-lg bg-black/40 border border-slate-800/80 p-3">
                    <span className="text-slate-400 block text-[11px] uppercase tracking-wider mb-1">
                      Markings & Clues
                    </span>
                    <strong className="text-purple-400 font-bold text-sm">
                      Evidence Cross-Verified
                    </strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal: Inspect Evidence Side-by-Side */}
        {inspectingMatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="max-w-3xl w-full rounded-2xl border border-[#d4a843]/50 bg-[#0d1627] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setInspectingMatch(null)}
                className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-6 w-6 text-[#f0d060]" />
                <h3 className="font-heading text-lg font-bold text-white">
                  Observation Haki Evidence Dossier
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                {/* Lost Dossier */}
                <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-300 uppercase">
                      LOST DOSSIER
                    </span>
                    <span className="text-xs text-slate-400">
                      {inspectingMatch.lostReport?.incidentDate}
                    </span>
                  </div>
                  <h4 className="font-heading text-base font-bold text-white mb-1">
                    {inspectingMatch.lostReport?.title}
                  </h4>
                  <p className="text-xs text-[#f0d060] font-medium mb-2">
                    📍 {inspectingMatch.lostReport?.location}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {inspectingMatch.lostReport?.description}
                  </p>
                  {inspectingMatch.lostReport?.uniqueMarks && (
                    <div className="mt-3 pt-2 border-t border-red-500/20 text-xs text-slate-300">
                      <strong className="text-slate-400 block text-[10px] uppercase">
                        Distinctive Markings:
                      </strong>
                      {inspectingMatch.lostReport?.uniqueMarks}
                    </div>
                  )}
                </div>

                {/* Found Dossier */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 uppercase">
                      FOUND DOSSIER
                    </span>
                    <span className="text-xs text-slate-400">
                      {inspectingMatch.foundReport?.incidentDate}
                    </span>
                  </div>
                  <h4 className="font-heading text-base font-bold text-white mb-1">
                    {inspectingMatch.foundReport?.title}
                  </h4>
                  <p className="text-xs text-emerald-400 font-medium mb-2">
                    📍 {inspectingMatch.foundReport?.location}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {inspectingMatch.foundReport?.description}
                  </p>
                  {inspectingMatch.foundReport?.uniqueMarks && (
                    <div className="mt-3 pt-2 border-t border-emerald-500/20 text-xs text-slate-300">
                      <strong className="text-slate-400 block text-[10px] uppercase">
                        Distinctive Markings:
                      </strong>
                      {inspectingMatch.foundReport?.uniqueMarks}
                    </div>
                  )}
                </div>
              </div>

              {/* Observation Haki 4-Factor Percentage Breakdown */}
              <div className="mb-6">
                <MatchScoreBreakdown
                  score={inspectingMatch.score}
                  confidenceTier={inspectingMatch.confidenceTier}
                  breakdown={inspectingMatch.breakdown}
                  matchBadges={inspectingMatch.matchBadges}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setInspectingMatch(null)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
                >
                  Close Dossier
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const target = inspectingMatch.foundReport
                    setInspectingMatch(null)
                    setClaimModalItem(target)
                  }}
                  className="rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-xs font-bold text-black hover:brightness-110 shadow-lg font-heading uppercase tracking-wider"
                >
                  Two-Step Claim Verification
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bonus Feature: Interactive Image Zoom Modal */}
      <ImageZoomModal
        isOpen={zoomData.isOpen}
        imageUrl={zoomData.imageUrl}
        title={zoomData.title}
        location={zoomData.location}
        category={zoomData.category}
        incidentDate={zoomData.incidentDate}
        onClose={() => setZoomData({ isOpen: false, imageUrl: '', title: '' })}
      />

      {/* Bonus Feature: Two-Step Claim Verification Modal */}
      <ClaimVerificationModal
        item={claimModalItem}
        isOpen={!!claimModalItem}
        onClose={() => setClaimModalItem(null)}
      />

      <Footer />
    </div>
  )
}
