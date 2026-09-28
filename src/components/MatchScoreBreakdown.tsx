import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Tag, MapPin, Clock, Search, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react'

export interface MatchBreakdownData {
  categoryScore?: number
  locationScore?: number
  timeScore?: number
  keywordScore?: number
  totalScore: number
}

interface MatchScoreBreakdownProps {
  score: number
  confidenceTier?: string
  breakdown?: MatchBreakdownData
  matchBadges?: string[]
  compact?: boolean
}

export function MatchScoreBreakdown({
  score,
  confidenceTier = 'MODERATE',
  breakdown,
  matchBadges = [],
  compact = false,
}: MatchScoreBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(!compact)

  // Maximum factor point weights defined in Observation Haki algorithm
  const catScore = breakdown?.categoryScore ?? Math.round(score * 0.35)
  const locScore = breakdown?.locationScore ?? Math.round(score * 0.25)
  const timeScore = breakdown?.timeScore ?? Math.round(score * 0.15)
  const kwScore = breakdown?.keywordScore ?? Math.round(score * 0.25)

  const catPercent = Math.min(100, Math.round((catScore / 35) * 100))
  const locPercent = Math.min(100, Math.round((locScore / 25) * 100))
  const timePercent = Math.min(100, Math.round((timeScore / 15) * 100))
  const kwPercent = Math.min(100, Math.round((kwScore / 25) * 100))

  // Color theme according to score
  const getScoreColor = (val: number) => {
    if (val >= 85) return { bg: 'from-amber-400 to-[#f0d060]', text: 'text-[#f0d060]', border: 'border-[#d4a843]' }
    if (val >= 70) return { bg: 'from-emerald-400 to-teal-500', text: 'text-emerald-400', border: 'border-emerald-500/50' }
    if (val >= 50) return { bg: 'from-sky-400 to-blue-500', text: 'text-sky-400', border: 'border-sky-500/50' }
    return { bg: 'from-slate-400 to-slate-600', text: 'text-slate-400', border: 'border-slate-600' }
  }

  const theme = getScoreColor(score)

  return (
    <div className="rounded-xl border border-[#d4a843]/30 bg-[#0d1627]/90 p-4 shadow-lg text-slate-200">
      {/* Top Header: Score & Confidence Badge */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Circular Score Badge */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 border-2 border-[#d4a843] shadow-[0_0_15px_rgba(212,168,67,0.3)] shrink-0">
            <span className="font-heading font-black text-sm text-[#f0d060]">
              {score}%
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-heading font-bold uppercase tracking-wider ${theme.text}`}>
                {confidenceTier} MATCH
              </span>
              <span className="rounded bg-[#d4a843]/15 border border-[#d4a843]/30 px-1.5 py-0.2 text-[9px] text-[#f0d060]">
                4-FACTOR ALGORITHM
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Observation Haki weighted multi-factor correlation
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white hover:bg-slate-700 transition"
        >
          <span>{isExpanded ? 'Hide Factors' : 'View Factors'}</span>
          {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {/* Expandable Breakdown Bars */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-3 pt-3 border-t border-slate-800 space-y-2.5"
          >
            {/* Factor 1: Category Match (35 pts) */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Tag className="h-3 w-3 text-[#f0d060]" />
                  <span>Category Affinity (Max 35%)</span>
                </span>
                <span className="font-mono font-bold text-[#f0d060]">{catPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-[#f0d060] transition-all duration-500 rounded-full"
                  style={{ width: `${catPercent}%` }}
                />
              </div>
            </div>

            {/* Factor 2: Keyword Similarity (25 pts) */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Search className="h-3 w-3 text-emerald-400" />
                  <span>Keyword & Physical Clues (Max 25%)</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">{kwPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${kwPercent}%` }}
                />
              </div>
            </div>

            {/* Factor 3: Location Proximity (25 pts) */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <MapPin className="h-3 w-3 text-sky-400" />
                  <span>Sabaody Grove Proximity (Max 25%)</span>
                </span>
                <span className="font-mono font-bold text-sky-400">{locPercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-sky-600 to-sky-400 transition-all duration-500 rounded-full"
                  style={{ width: `${locPercent}%` }}
                />
              </div>
            </div>

            {/* Factor 4: Date Window (15 pts) */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="h-3 w-3 text-purple-400" />
                  <span>Date Window Correlation (Max 15%)</span>
                </span>
                <span className="font-mono font-bold text-purple-400">{timePercent}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-500 rounded-full"
                  style={{ width: `${timePercent}%` }}
                />
              </div>
            </div>

            {/* Badges list */}
            {matchBadges.length > 0 && (
              <div className="pt-2 flex flex-wrap gap-1.5">
                {matchBadges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-slate-900/90 border border-slate-700/80 px-2 py-0.5 text-[10px] text-slate-300"
                  >
                    ✓ {badge}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
