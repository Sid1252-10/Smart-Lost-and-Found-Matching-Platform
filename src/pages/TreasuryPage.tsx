import { useState, useMemo } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Coins, Shield, Sparkles, Trophy, Vault, Search, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useRegistry } from '../context/RegistryContext'
import { rankAllMatches, compareAnyTwo } from '../lib/matchingEngine'

export function TreasuryPage() {
  const { items } = useRegistry()
  const [selectedLostId, setSelectedLostId] = useState<string>('')
  const [selectedFoundId, setSelectedFoundId] = useState<string>('')
  const [manualResult, setManualResult] = useState<any>(null)

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
    return rankAllMatches(lostList, foundList, 30).slice(0, 10)
  }, [lostList, foundList])

  function handleManualCompare() {
    const reportA = items.find((i) => i.id === selectedLostId)
    const reportB = items.find((i) => i.id === selectedFoundId)
    if (!reportA || !reportB) return

    const res = compareAnyTwo(reportA, reportB)
    setManualResult(res)
  }

  return (
    <div className="min-h-screen bg-[#050b14] text-[#e2e8f0] flex flex-col font-body">
      <Navbar />

      <main className="flex-1 mx-auto max-w-[1440px] w-full px-4 py-8 md:px-8">
        {/* Banner */}
        <div className="mb-8 rounded-xl border border-[#d4a843]/40 bg-gradient-to-r from-[#101b2d] via-[#1a2942] to-[#101b2d] p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4a843]/20 border border-[#d4a843]">
                <Sparkles className="h-6 w-6 text-[#f0d060]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#f0d060] tracking-widest block uppercase font-heading">
                  OBSERVATION HAKI MATCHING ENGINE
                </span>
                <h1 className="font-pirate text-3xl md:text-5xl font-bold text-white tracking-wide">
                  Smart Matching & Registry Treasury
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Live Registered Records</span>
                <span className="font-heading text-xl md:text-2xl font-black text-[#f0d060]">
                  {totalReports} Items Logged
                </span>
              </div>
              <Link
                to="/report"
                className="rounded-xl bg-gradient-to-r from-[#d4a843] to-[#b88a2e] px-4 py-2.5 text-xs font-bold text-black hover:brightness-110 shadow-lg font-heading"
              >
                File New Report
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Real-time Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-[#d4a843]/30 bg-[#0c1422] p-5">
            <div className="flex items-center gap-3 mb-2">
              <Coins className="h-5 w-5 text-[#f0d060]" />
              <h3 className="font-bold text-xs text-[#f0d060] tracking-wider uppercase font-heading">
                Registry Balance
              </h3>
            </div>
            <p className="text-2xl font-black text-white font-heading">
              {lostList.length} Lost / {foundList.length} Found
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Active ledger entries across Sabaody and Grand Line sectors
            </p>
          </div>

          <div className="rounded-xl border border-[#d4a843]/30 bg-[#0c1422] p-5">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-[#f0d060]" />
              <h3 className="font-bold text-xs text-[#f0d060] tracking-wider uppercase font-heading">
                Recovered / Reunited
              </h3>
            </div>
            <p className="text-2xl font-black text-white font-heading">
              {recoveredList.length} Reclaimed ({matchRate}%)
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {pendingClaims.length} claims currently in verification queue
            </p>
          </div>

          <div className="rounded-xl border border-[#d4a843]/30 bg-[#0c1422] p-5">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="h-5 w-5 text-[#f0d060]" />
              <h3 className="font-bold text-xs text-[#f0d060] tracking-wider uppercase font-heading">
                Smart Category Matches
              </h3>
            </div>
            <p className="text-2xl font-black text-white font-heading">
              {liveMatches.length} Matches Found
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Strictly filtered by identical item category
            </p>
          </div>
        </div>

        {/* Section 1: Auto-Discovered Category Matches */}
        <div className="mb-8 rounded-xl border border-[#d4a843]/30 bg-[#0a1220] p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#f0d060] flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#f0d060]" />
                Auto-Discovered Matches (Same Category Pairs)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically scored via Multi-Factor Observation Haki: Category (35) + Grove Distance (25) + Time (15) + Keywords (25).
              </p>
            </div>
            <span className="rounded-full bg-[#d4a843]/15 border border-[#d4a843]/40 px-3 py-1 text-xs font-bold text-[#f0d060]">
              {liveMatches.length} Candidate Pairs
            </span>
          </div>

          {liveMatches.length > 0 ? (
            <div className="space-y-3">
              {liveMatches.map((match, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 transition-all hover:border-[#d4a843]/60"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex-1 min-w-[280px]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="rounded bg-red-950/80 border border-red-500/50 px-2 py-0.5 text-[10px] font-bold text-red-300">
                          LOST: {match.lostReport?.title}
                        </span>
                        <span className="text-slate-400 text-xs">⟷</span>
                        <span className="rounded bg-emerald-950/80 border border-emerald-500/50 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                          FOUND: {match.foundReport?.title}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Category: <strong className="text-white">{match.lostReport?.category}</strong> • 
                        Lost at: {match.lostReport?.location} • Found at: {match.foundReport?.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="rounded-full bg-[#d4a843]/20 border border-[#d4a843] px-3 py-1 text-xs font-bold text-[#f0d060]">
                          {match.score}% Score ({match.confidenceTier})
                        </span>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Cat: {match.breakdown?.categoryScore} | Grove: {match.breakdown?.locationScore} | Time: {match.breakdown?.timeScore} | Kw: {match.breakdown?.keywordScore}
                        </div>
                      </div>
                      <Link
                        to={`/claiming?item=${match.foundReport?.id}`}
                        className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-black hover:bg-emerald-400"
                      >
                        Claim Match
                      </Link>
                    </div>
                  </div>

                  {match.matchBadges && (
                    <div className="mt-3 flex flex-wrap gap-1.5 border-t border-slate-800 pt-2.5">
                      {match.matchBadges.map((badge, bIdx) => (
                        <span key={bIdx} className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300">
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 text-xs italic">
              No cross-category or low-confidence matches. All active reports are cataloged without conflicting claims.
            </div>
          )}
        </div>

        {/* Section 2: Manual Report Pair Matcher */}
        <div className="mb-8 rounded-xl border border-[#d4a843]/30 bg-[#0a1220] p-6 shadow-xl">
          <div className="mb-4">
            <h2 className="font-heading text-lg font-bold text-[#f0d060] flex items-center gap-2">
              <Vault className="h-5 w-5 text-[#f0d060]" />
              Manual Report Cross-Comparison Tool
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any LOST report and any FOUND report to test the scoring algorithm. Requires matching categories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Lost Report
              </label>
              <select
                value={selectedLostId}
                onChange={(e) => setSelectedLostId(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white"
              >
                <option value="">-- Choose a Lost Report --</option>
                {lostList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({item.category} • {item.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Select Found Report
              </label>
              <select
                value={selectedFoundId}
                onChange={(e) => setSelectedFoundId(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-white"
              >
                <option value="">-- Choose a Found Report --</option>
                {foundList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} ({item.category} • {item.location})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleManualCompare}
            disabled={!selectedLostId || !selectedFoundId}
            className="w-full rounded-xl bg-gradient-to-r from-[#d4a843] to-[#b88a2e] py-2.5 text-xs font-bold text-black hover:brightness-110 disabled:opacity-50"
          >
            Run Observation Haki Comparison
          </button>

          {manualResult && (
            <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/90 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading font-bold text-white text-sm">
                  Comparison Result:
                </span>
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                    manualResult.error
                      ? 'bg-red-950 text-red-300 border border-red-500'
                      : 'bg-[#d4a843]/20 text-[#f0d060] border border-[#d4a843]'
                  }`}
                >
                  {manualResult.score}% Match Score
                </span>
              </div>

              {manualResult.matchBadges && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {manualResult.matchBadges.map((b: string, i: number) => (
                    <span key={i} className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      {b}
                    </span>
                  ))}
                </div>
              )}

              {manualResult.breakdown && !manualResult.error && (
                <div className="grid grid-cols-4 gap-2 text-center text-xs border-t border-slate-800 pt-3">
                  <div className="rounded bg-black/40 p-2">
                    <span className="text-slate-400 block text-[10px]">Category (Max 35)</span>
                    <strong className="text-[#f0d060]">{manualResult.breakdown.categoryScore} pts</strong>
                  </div>
                  <div className="rounded bg-black/40 p-2">
                    <span className="text-slate-400 block text-[10px]">Grove Dist (Max 25)</span>
                    <strong className="text-[#f0d060]">{manualResult.breakdown.locationScore} pts</strong>
                  </div>
                  <div className="rounded bg-black/40 p-2">
                    <span className="text-slate-400 block text-[10px]">Time Window (Max 15)</span>
                    <strong className="text-[#f0d060]">{manualResult.breakdown.timeScore} pts</strong>
                  </div>
                  <div className="rounded bg-black/40 p-2">
                    <span className="text-slate-400 block text-[10px]">Keywords (Max 25)</span>
                    <strong className="text-[#f0d060]">{manualResult.breakdown.keywordScore} pts</strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
