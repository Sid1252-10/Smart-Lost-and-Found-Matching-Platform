import { useState, useMemo } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { MAP_INCIDENTS, type IslandIncident } from '../components/WorldMapModal'
import { getIslandActualItems } from '../components/GrandLineMap'
import { useRegistry } from '../context/RegistryContext'
import { Compass, Eye, EyeOff, MapPin, RotateCcw, X, ZoomIn, ZoomOut, PlusCircle, ArrowRight, Info, ChevronDown, ChevronUp, TreePine } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SABAODY_ZONES } from '../lib/sabaodyMap'

export function WorldPage() {
  const { items } = useRegistry()
  const [scale, setScale] = useState(1)
  const [showPins, setShowPins] = useState(true)
  const [selectedIncident, setSelectedIncident] = useState<IslandIncident | null>(null)
  const [showExplainer, setShowExplainer] = useState(true)
  const navigate = useNavigate()

  const selectedItems = useMemo(() => {
    if (!selectedIncident) return []
    return getIslandActualItems(items, selectedIncident.id, selectedIncident.name)
  }, [items, selectedIncident])

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 2.5))
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.75))
  const handleReset = () => setScale(1)

  // Calculate live item counts per Sabaody grove zone
  const groveZoneStats = useMemo(() => {
    return SABAODY_ZONES.map((zone) => {
      const zoneItems = items.filter((item) => {
        const g = Number(item.groveNumber)
        return g >= zone.range[0] && g <= zone.range[1]
      })
      return {
        ...zone,
        itemCount: zoneItems.length,
        lost: zoneItems.filter(i => i.kind === 'lost').length,
        found: zoneItems.filter(i => i.kind === 'found').length,
      }
    })
  }, [items])

  const totalGroveItems = groveZoneStats.reduce((sum, z) => sum + z.itemCount, 0)

  return (
    <div className="relative min-h-screen text-[#e2e8f0] flex flex-col font-body">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Page Banner */}
        <div className="bg-gradient-to-r from-[#071326] via-[#0d223f] to-[#071326] border-b border-[#d4a843]/30 px-4 py-3 md:px-8 shadow-md">
          <div className="mx-auto max-w-[1440px] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4a843]/15 border border-[#d4a843]/40">
                <Compass className="h-5 w-5 text-[#f0d060]" />
              </div>
              <div>
                <h1 className="font-[Cinzel] text-base md:text-xl font-bold tracking-widest text-[#f0d060]">
                  GRAND LINE: PARADISE SECTION
                </h1>
                <p className="text-xs text-slate-300">
                  A Detailed Survey of Grand Line: Paradise Section (The Kingdoms &amp; Incidents)
                </p>
              </div>
            </div>

            {/* Map Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPins((v) => !v)}
                className="flex items-center gap-1.5 rounded border border-[#d4a843]/40 bg-[#09172c]/90 px-3 py-1.5 text-xs font-semibold text-[#f0d060] hover:border-[#f0d060] transition-colors shadow-sm"
              >
                {showPins ? <Eye className="h-3.5 w-3.5 text-[#f0d060]" /> : <EyeOff className="h-3.5 w-3.5" />}
                <span>{showPins ? 'Island Markers: ON' : 'Map Only: AS IS'}</span>
              </button>

              <div className="flex items-center rounded border border-[#d4a843]/40 bg-[#09172c]/90 shadow-sm">
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1.5 text-slate-300 hover:text-[#f0d060]"
                  title="Zoom In"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <div className="h-4 w-[1px] bg-[#d4a843]/20" />
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1.5 text-slate-300 hover:text-[#f0d060]"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <div className="h-4 w-[1px] bg-[#d4a843]/20" />
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 text-slate-300 hover:text-[#f0d060]"
                  title="Reset Zoom"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* How This Map Works — Explainer for Judges */}
        {showExplainer && (
          <div className="bg-[#061224]/90 px-4 py-3 md:px-8">
            <div className="mx-auto max-w-[1440px]">
              <div className="rounded-xl border border-[#d4a843]/30 bg-[#091830]/80 p-4 flex flex-wrap gap-4 items-start relative shadow-lg">
                <button
                  onClick={() => setShowExplainer(false)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  title="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#d4a843]/15 border border-[#d4a843]/40">
                  <Info className="h-4 w-4 text-[#f0d060]" />
                </div>
                <div className="flex-1 min-w-[200px] space-y-2">
                  <p className="text-xs font-bold text-[#f0d060] uppercase tracking-widest font-heading">How This Map Works</p>
                  <div className="grid sm:grid-cols-3 gap-3 text-[11px] text-slate-300 leading-relaxed">
                    <div className="rounded-lg bg-[#050e1c]/90 p-3">
                      <p className="font-semibold text-white mb-1">🗺️ One Piece Universe Map</p>
                      <p>This is a lore-accurate map of the <strong className="text-[#f0d060]">Grand Line: Paradise Section</strong> — the first half of the Grand Line in the One Piece world. Our lost-and-found platform is themed around this universe.</p>
                    </div>
                    <div className="rounded-lg bg-[#050e1c]/90 p-3">
                      <p className="font-semibold text-white mb-1">📍 Interactive Island Pins</p>
                      <p>Each <strong className="text-[#f0d060]">glowing gold pin</strong> is a clickable island hotspot. Click any pin to see how many Lost &amp; Found reports are linked to that island in our live database, and jump directly to Browse or Report.</p>
                    </div>
                    <div className="rounded-lg bg-[#050e1c]/90 p-3">
                      <p className="font-semibold text-white mb-1">🔢 Why No Grove Pins?</p>
                      <p>Sabaody Archipelago's <strong className="text-[#f0d060]">79 Groves</strong> are used <em>internally</em> by our matching engine for proximity scoring — the algorithm computes grove-distance between lost &amp; found reports. They aren't individual islands, so they're not shown as map pins here.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {!showExplainer && (
          <div className="bg-[#07152b] px-4 md:px-8">
            <div className="mx-auto max-w-[1440px]">
              <button
                onClick={() => setShowExplainer(true)}
                className="flex items-center gap-1.5 py-1.5 text-[10px] text-slate-400 hover:text-[#f0d060] transition"
              >
                <Info className="h-3 w-3" />
                <span>Show map guide</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Map Viewport Area */}
        <div className="flex-1 overflow-auto bg-[#040c1a] p-4 md:p-8 flex items-start justify-center min-h-[500px]">
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-out',
            }}
            className="relative max-w-[1400px] w-full rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.85)] overflow-hidden select-none"
          >
            {/* FIRST IMAGE AS IS */}
            <img
              src="/grand_line_map.jpg"
              alt="A Detailed Survey of Grand Line: Paradise Section (The Kingdoms & Incidents)"
              className="w-full h-auto block select-none pointer-events-none"
            />

            {/* Interactive Pins Overlay */}
            {showPins &&
              MAP_INCIDENTS.map((inc) => (
                <button
                  key={inc.id}
                  type="button"
                  style={{
                    position: 'absolute',
                    left: `${inc.xPercent}%`,
                    top: `${inc.yPercent}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => setSelectedIncident(inc)}
                  className="group z-10 flex items-center justify-center focus:outline-none"
                  title={`${inc.name} — Click to inspect`}
                >
                  <span className="absolute inline-flex h-7 w-7 animate-ping rounded-full bg-[#f0d060] opacity-40 group-hover:opacity-75" />
                  <span className="relative flex h-5 w-5 items-center justify-center rounded-full border border-[#f0d060] bg-[#1a1005] shadow-[0_0_10px_rgba(240,208,96,0.8)] transition-transform group-hover:scale-125">
                    <MapPin className="h-3 w-3 text-[#f0d060]" />
                  </span>
                  <span className="pointer-events-none absolute bottom-full mb-1.5 hidden whitespace-nowrap rounded bg-black/90 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#f0d060] border border-[#d4a843]/50 group-hover:block shadow-lg">
                    {inc.name}
                    {getIslandActualItems(items, inc.id, inc.name).length > 0
                      ? ` (${getIslandActualItems(items, inc.id, inc.name).length})`
                      : ''}
                  </span>
                </button>
              ))}
          </div>
        </div>
      </main>

      {/* ===== SABAODY GROVE ZONE MAP ===== */}
      <section className="bg-gradient-to-b from-[#051122] via-[#081a33] to-[#040c1a] border-t border-[#d4a843]/15 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-[1440px]">
          {/* Section Header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4a843]/15 border border-[#d4a843]/40">
                <TreePine className="h-5 w-5 text-[#f0d060]" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-[#f0d060] uppercase">Internal Location Engine</p>
                <h2 className="font-[Cinzel] text-lg md:text-2xl font-bold text-white">Sabaody Archipelago — 79 Grove Zone Map</h2>
              </div>
            </div>
            <div className="rounded-lg border border-[#d4a843]/30 bg-[#061224]/80 px-4 py-2 text-xs text-slate-300">
              <span className="text-[#f0d060] font-bold">{totalGroveItems}</span> active reports across all Sabaody Groves
            </div>
          </div>

          {/* Explainer */}
          <div className="mb-6 rounded-xl border border-[#d4a843]/30 bg-[#07172e]/80 p-4 text-xs text-slate-200 leading-relaxed">
            <strong className="text-[#f0d060]">How Grove Mapping Powers Our Match Engine:</strong> When a user files a report, they select a Grove (1–79). Our matching algorithm uses the absolute grove-distance
            {' '}between a lost and found report to compute a <span className="font-bold text-[#f0d060]">Proximity Score</span>. Groves in the same zone score higher (closer proximity),
            {' '}while cross-zone reports score lower. This creates a fine-grained location layer unique to Sabaody, which no other lost-and-found platform models.
          </div>

          {/* Zone Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {groveZoneStats.map((zone) => {
              const pct = totalGroveItems > 0 ? Math.round((zone.itemCount / totalGroveItems) * 100) : 0
              return (
                <div
                  key={zone.id}
                  className="rounded-xl border bg-[#081528]/90 p-4 space-y-3 transition hover:brightness-110 shadow-xl"
                  style={{ borderColor: zone.color + '55' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: zone.color }}>
                        Groves {zone.range[0]}–{zone.range[1]}
                      </p>
                      <h3 className="text-sm font-bold text-white mt-0.5">{zone.name}</h3>
                    </div>
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-black"
                      style={{ backgroundColor: zone.color + '22', color: zone.color, border: `1px solid ${zone.color}55` }}
                    >
                      {zone.range[1] - zone.range[0] + 1}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">{zone.description}</p>

                  {/* Item count bar */}
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-slate-400">{zone.itemCount} reports ({pct}%)</span>
                      <span className="text-slate-500">
                        <span className="text-amber-400">{zone.lost} lost</span> · <span className="text-emerald-400">{zone.found} found</span>
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(3, pct)}%`,
                          backgroundColor: zone.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Visual Grove Number Strip */}
          <div className="rounded-xl border border-[#d4a843]/25 bg-[#061224]/90 p-4 shadow-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">All 79 Groves — Color-coded by Zone</p>
            <div className="flex flex-wrap gap-1">
              {Array.from({ length: 79 }, (_, i) => i + 1).map((grove) => {
                const zone = SABAODY_ZONES.find(z => grove >= z.range[0] && grove <= z.range[1])
                const hasItems = items.some(item => Number(item.groveNumber) === grove)
                return (
                  <div
                    key={grove}
                    title={`Grove ${grove} — ${zone?.name ?? 'Unknown'}${hasItems ? ' (has reports)' : ''}`}
                    className="flex h-7 w-7 items-center justify-center rounded text-[9px] font-bold cursor-default transition hover:scale-110"
                    style={{
                      backgroundColor: zone ? zone.color + (hasItems ? 'cc' : '22') : '#33333366',
                      color: zone ? (hasItems ? '#fff' : zone.color) : '#666',
                      border: hasItems ? `1px solid ${zone?.color ?? '#666'}` : '1px solid transparent',
                    }}
                  >
                    {grove}
                  </div>
                )
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              {SABAODY_ZONES.map(z => (
                <div key={z.id} className="flex items-center gap-1.5 text-[10px]">
                  <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: z.color }} />
                  <span className="text-slate-400">{z.name} ({z.range[0]}–{z.range[1]})</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 text-[10px]">
                <div className="h-2.5 w-2.5 rounded-sm bg-white/80" />
                <span className="text-slate-400">Solid = has active reports</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Island Detail Modal Drawer */}
      {selectedIncident && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-xl border-2 border-[#d4a843] bg-gradient-to-b from-[#0a1830] to-[#040e1c] p-5 shadow-2xl text-[#e2e8f0]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#f0d060] tracking-widest block uppercase">
                ISLAND SURVEY
              </span>
              <h3 className="font-[Cinzel] text-lg font-bold text-white">
                {selectedIncident.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedIncident(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            {selectedIncident.lore}
          </p>

          <div className="mt-3 rounded bg-black/50 p-2.5 text-[11px] border border-[#d4a843]/20 space-y-1">
            <div>
              <span className="text-slate-400">Jurisdiction: </span>
              <span className="text-[#f0d060] font-semibold">{selectedIncident.ruler}</span>
            </div>
            <div>
              <span className="text-slate-400">Key Incident: </span>
              <span className="text-amber-200">{selectedIncident.keyIncidents}</span>
            </div>
          </div>

          {/* Real Live Database Items for this Island */}
          <div className="mt-3 pt-2 border-t border-slate-700/50">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-300 text-[11px]">
                <strong className="text-[#f0d060]">{selectedItems.length}</strong> {selectedItems.length === 1 ? 'Relic' : 'Relics'} on Record
              </span>
              {selectedItems.length > 0 && (
                <span className="text-[10px] text-slate-400">
                  {selectedItems.filter(i => i.kind === 'found').length} Found · {selectedItems.filter(i => i.kind === 'lost').length} Lost
                </span>
              )}
            </div>

            {selectedItems.length > 0 ? (
              <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                {selectedItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded bg-black/40 px-2 py-1 text-[11px] border border-slate-800"
                  >
                    <span className="truncate text-white font-medium pr-2">{item.title}</span>
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.2 text-[9px] font-bold uppercase ${item.kind === 'found'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                        }`}
                    >
                      {item.kind}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-400 italic">
                No reports currently recorded for this island.
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#d4a843]/20 pt-3">
            <button
              type="button"
              onClick={() => navigate(`/report?location=${selectedIncident.id}`)}
              className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-white"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Report Item</span>
            </button>
            <button
              type="button"
              onClick={() => navigate(`/browse?location=${selectedIncident.id}`)}
              className="flex items-center gap-1 rounded bg-gradient-to-r from-[#d4a843] to-[#b88a2e] px-3 py-1.5 text-xs font-bold text-black hover:brightness-110 shadow-md"
            >
              <span>View in Ledger</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
