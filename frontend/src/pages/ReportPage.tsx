import { useState, type FormEvent, type ChangeEvent, useMemo } from 'react'
import { GrandLineMap, normalizeIslandId } from '../components/GrandLineMap'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { AuthModal } from '../components/AuthModal'
import { CalendarDatePicker } from '../components/CalendarDatePicker'
import { CATEGORIES, COLOURS, ISLANDS, UNIQUE_MARKS } from '../data/catalog'
import { useRegistry } from '../context/RegistryContext'
import type { ItemKind, MatchResult } from '../types'
import { getGroveOptions, getZoneForGrove } from '../lib/sabaodyMap'
import { CheckCircle2, MapPin, Radio, Send, Sparkles, X, Compass, Image as ImageIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ReportPage() {
  const { addItem } = useRegistry()
  const [authOpen, setAuthOpen] = useState(false)
  const [locationId, setLocationId] = useState('water-7')
  const [groveNumber, setGroveNumber] = useState(41)
  const [reportKind, setReportKind] = useState<ItemKind>('lost')
  const [incidentDate, setIncidentDate] = useState<string>(() => new Date().toISOString().split('T')[0])
  const [submitted, setSubmitted] = useState<{ id: string; title: string; kind: ItemKind } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [foundMatches, setFoundMatches] = useState<MatchResult[]>([])
  const [showMatchModal, setShowMatchModal] = useState(false)

  const selectedIsland = useMemo(() => {
    return (
      ISLANDS.find((item) => normalizeIslandId(item.id) === normalizeIslandId(locationId)) ||
      ISLANDS[0]
    )
  }, [locationId])

  function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    const form = event.currentTarget
    const data = new FormData(form)
    const kind = String(data.get('kind')) as ItemKind
    const title = String(data.get('title') || 'Untitled treasure')
    const island = ISLANDS.find((item) => normalizeIslandId(item.id) === normalizeIslandId(locationId))
    const category = String(data.get('category'))
    const newId = crypto.randomUUID()

    try {
      const result = await addItem({
        id: newId,
        kind,
        status: kind === 'lost' ? 'REPORTED LOST' : 'FOUND',
        title,
        locationId: island?.id || locationId,
        location: `${island?.name || 'Sabaody'} (Grove ${groveNumber})`,
        groveNumber: Number(groveNumber),
        category,
        colour: String(data.get('colour')),
        uniqueMarks: String(data.get('uniqueMarks')),
        description: String(data.get('description')),
        dateLost: kind === 'lost' ? String(data.get('date') || '') : undefined,
        dateFound: kind === 'found' ? String(data.get('date') || '') : undefined,
        incidentDate: String(data.get('date') || ''),
        imageUrl: imagePreview,
      })

      setSubmitted({ id: newId, title, kind })

      if (result.matches && result.matches.length > 0) {
        setFoundMatches(result.matches)
        setShowMatchModal(true)
      }

      form.reset()
      setIncidentDate(new Date().toISOString().split('T')[0])
      setImagePreview('')
    } catch (err) {
      console.error('Failed to submit report:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#060b14] text-[#e2e8f0] flex flex-col">
      <Navbar onAuthClick={() => setAuthOpen(true)} />

      <main className="flex-1 px-4 py-6 md:px-8 max-w-[1440px] mx-auto w-full">
        {/* Page Banner Header */}
        <div className="mb-6 border-b border-[#d4a843]/20 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Radio className="h-4 w-4 text-[#f0d060] animate-pulse" />
            <p className="text-[11px] font-bold tracking-[0.24em] text-[#f0d060] uppercase">
              Den Den Mushi Dispatch Network
            </p>
          </div>
          <h1 className="font-pirate text-3xl md:text-5xl font-bold text-white tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            Report Lost or Found Treasure
          </h1>
          <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl font-body">
            Transmit an official report across the Grand Line. Pick the island from the survey map below or dropdown to synchronize coordinates. The engine immediately scans opposite reports in the <strong>same category</strong>.
          </p>
        </div>

        {/* Success Banner */}
        {submitted && (
          <div className="mb-6 rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 to-[#070e1b] p-4 text-emerald-200 shadow-xl flex flex-wrap items-center justify-between gap-4 font-body">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-white text-sm">
                  Report Successfully Transmitted to the Fleet!
                </p>
                <p className="text-xs text-emerald-300/90 mt-0.5">
                  Logged “<strong>{submitted.title}</strong>” under {submitted.kind.toUpperCase()} records at {selectedIsland?.name || 'the Grand Line'}.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/browse?location=${locationId}`}
                className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-black hover:bg-emerald-400 transition"
              >
                View in Browse Ledger
              </Link>
              <button
                type="button"
                onClick={() => setSubmitted(null)}
                className="rounded-lg border border-emerald-500/30 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-950/50"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Two-Column Layout: World Map + Report Form */}
        <div className="grid gap-8 lg:grid-cols-12 items-start font-body">
          {/* Left Column: Interactive Grand Line World Map */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="rounded-xl border border-[#d4a843]/20 bg-[#0d1524] p-3 text-xs text-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#f0d060]" />
                <span>
                  Click an island marker on the map to set the dispatch location:
                </span>
              </div>
              <span className="font-bold text-[#f0d060] bg-black/50 px-2 py-0.5 rounded border border-[#d4a843]/30">
                {selectedIsland?.name || 'Select Island'}
              </span>
            </div>

            {/* The World Map */}
            <GrandLineMap
              selectedId={locationId}
              onSelect={setLocationId}
              title="GRAND LINE: PARADISE SECTION SURVEY"
              subtitle="Click any island pin to lock coordinates into your report"
            />
          </div>

          {/* Right Column: Dispatch Report Form */}
          <div className="lg:col-span-5">
            <form
              onSubmit={onSubmit}
              className="rounded-2xl border-2 border-[#d4a843]/40 bg-gradient-to-b from-[#0e1728] to-[#070e1b] p-6 shadow-2xl space-y-4"
            >
              <div className="border-b border-[#d4a843]/20 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#f0d060]">
                  Registry Transmission
                </span>
                <h2 className="font-heading text-lg font-bold text-white tracking-wide">
                  Dispatch Details
                </h2>
              </div>

              {/* Kind Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Report Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950/60 p-2.5 text-xs font-semibold text-slate-200 has-[:checked]:border-[#f0d060] has-[:checked]:bg-[#d4a843]/15 has-[:checked]:text-[#f0d060]">
                    <input
                      type="radio"
                      name="kind"
                      value="lost"
                      checked={reportKind === 'lost'}
                      onChange={() => setReportKind('lost')}
                      className="sr-only"
                    />
                    <span>I Lost a Treasure</span>
                  </label>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-950/60 p-2.5 text-xs font-semibold text-slate-200 has-[:checked]:border-emerald-400 has-[:checked]:bg-emerald-500/15 has-[:checked]:text-emerald-300">
                    <input
                      type="radio"
                      name="kind"
                      value="found"
                      checked={reportKind === 'found'}
                      onChange={() => setReportKind('found')}
                      className="sr-only"
                    />
                    <span>I Found a Treasure</span>
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Treasure Title *
                </label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Zoro's Wado Ichimonji, Golden Log Pose..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f0d060] focus:outline-none"
                />
              </div>

              {/* Island Dropdown (Synced with World Map) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Grand Line Island Location</span>
                  <span className="text-[10px] text-[#f0d060]">Synced with Map</span>
                </label>
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full rounded-lg border border-[#d4a843]/50 bg-slate-950/80 px-3 py-2 text-xs text-[#f0d060] font-semibold focus:border-[#f0d060] focus:outline-none"
                >
                  {ISLANDS.map((island) => (
                    <option key={island.id} value={island.id}>
                      {island.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sabaody Grove Number (1 to 79) Selector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5 text-[#f0d060]" />
                    <span>Sabaody Grove Coordinate (1–79) *</span>
                  </label>
                  <span className="text-[10px] font-bold text-[#f0d060] bg-black/50 px-2 py-0.5 rounded border border-[#d4a843]/30">
                    {getZoneForGrove(groveNumber).name}
                  </span>
                </div>
                <select
                  value={groveNumber}
                  onChange={(e) => setGroveNumber(Number(e.target.value))}
                  className="w-full rounded-lg border border-[#d4a843]/50 bg-slate-950/80 px-3 py-2 text-xs text-[#f0d060] font-semibold focus:border-[#f0d060] focus:outline-none"
                >
                  {getGroveOptions().map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} — {opt.zoneName}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Proximity scoring uses this grove coordinate to calculate distance across Sabaody zones.
                </p>
              </div>

              {/* Category & Date Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category (Strict Match)
                  </label>
                  <select
                    name="category"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white focus:border-[#f0d060] focus:outline-none"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <CalendarDatePicker
                    name="date"
                    value={incidentDate}
                    onChange={setIncidentDate}
                    label={reportKind === 'lost' ? 'Date Lost (Incident Log)' : 'Date Found (Discovery Log)'}
                  />
                </div>
              </div>

              {/* Colour & Unique Marks */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary Colour
                  </label>
                  <select
                    name="colour"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white focus:border-[#f0d060] focus:outline-none"
                  >
                    {COLOURS.map((colour) => (
                      <option key={colour}>{colour}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Distinct Markings
                  </label>
                  <select
                    name="uniqueMarks"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white focus:border-[#f0d060] focus:outline-none"
                  >
                    {UNIQUE_MARKS.map((mark) => (
                      <option key={mark}>{mark}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Optional Treasure Photo
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-1.5 text-xs text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-[#d4a843] file:px-2.5 file:py-0.5 file:text-xs file:font-semibold file:text-black hover:file:brightness-110"
                  />
                  {imagePreview && (
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-[#d4a843]/60">
                      <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Detailed Description & Route *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="Describe last known location, pirate crew markings, or physical condition..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f0d060] focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-r from-[#d4a843] via-[#f0d060] to-[#b88a2e] py-3 text-xs font-bold text-black hover:brightness-110 shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4 text-black" />
                <span>{submitting ? 'Transmitting Dispatch...' : 'Transmit Den Den Mushi Dispatch'}</span>
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Instant Smart Match Modal */}
      {showMatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl border-2 border-[#d4a843] bg-[#0c1422] p-6 shadow-2xl">
            <button
              onClick={() => setShowMatchModal(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4a843]/20 border border-[#d4a843]">
                <Sparkles className="h-6 w-6 text-[#f0d060]" />
              </div>
              <div>
                <h3 className="font-pirate text-2xl font-bold text-[#f0d060] tracking-wide">Smart Match Detected!</h3>
                <p className="text-xs text-slate-300 font-body">
                  Found {foundMatches.length} candidate(s) in the exact same category
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {foundMatches.map((m, idx) => {
                const target = m.foundReport || m.lostReport || m.item
                return (
                  <div key={idx} className="rounded-xl border border-slate-700 bg-slate-900/90 p-3.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-sm text-white">{target?.title || 'Report Match'}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{target?.location} • {target?.category}</p>
                      </div>
                      <span className="rounded-full bg-[#d4a843]/20 border border-[#d4a843] px-2.5 py-0.5 text-xs font-bold text-[#f0d060]">
                        {m.score}% Match
                      </span>
                    </div>
                    {m.matchBadges && (
                      <div className="mt-2.5 flex flex-wrap gap-1">
                        {m.matchBadges.map((badge, bIdx) => (
                          <span key={bIdx} className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mt-5 flex gap-3">
              <Link
                to={`/browse?location=${locationId}`}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#d4a843] to-[#b88a2e] py-2.5 text-center text-xs font-bold text-black hover:brightness-110"
              >
                Browse Matching Relics
              </Link>
              <button
                onClick={() => setShowMatchModal(false)}
                className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}
