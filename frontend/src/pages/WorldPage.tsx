import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { MAP_INCIDENTS, type IslandIncident } from '../components/WorldMapModal'
import { Compass, Eye, EyeOff, MapPin, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function WorldPage() {
  const [scale, setScale] = useState(1)
  const [showPins, setShowPins] = useState(true)
  const [selectedIncident, setSelectedIncident] = useState<IslandIncident | null>(null)
  const navigate = useNavigate()

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 2.5))
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.75))
  const handleReset = () => setScale(1)

  return (
    <div className="min-h-screen bg-[#060b14] text-[#e2e8f0] flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Page Banner */}
        <div className="bg-gradient-to-r from-[#0c182a] via-[#10243e] to-[#0c182a] border-b border-[#d4a843]/30 px-4 py-3 md:px-8">
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
                  A Detailed Survey of Grand Line: Paradise Section (The Kingdoms & Incidents)
                </p>
              </div>
            </div>

            {/* Map Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowPins((v) => !v)}
                className="flex items-center gap-1.5 rounded border border-[#d4a843]/30 bg-black/40 px-3 py-1.5 text-xs font-semibold text-[#e8d5a5] hover:border-[#f0d060] transition-colors"
              >
                {showPins ? <Eye className="h-3.5 w-3.5 text-[#f0d060]" /> : <EyeOff className="h-3.5 w-3.5" />}
                <span>{showPins ? 'Island Markers: ON' : 'Map Only: AS IS'}</span>
              </button>

              <div className="flex items-center rounded border border-[#d4a843]/30 bg-black/40">
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

        {/* Map Viewport Area */}
        <div className="flex-1 overflow-auto bg-[#1b150c] p-4 md:p-8 flex items-center justify-center">
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease-out',
            }}
            className="relative max-w-[1400px] w-full rounded shadow-2xl overflow-hidden border-2 border-[#8a602a]"
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
                    {inc.name} ({inc.itemsLogged} items)
                  </span>
                </button>
              ))}
          </div>
        </div>
      </main>

      {/* Island Detail Modal Drawer */}
      {selectedIncident && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm rounded-xl border border-[#d4a843] bg-gradient-to-b from-[#141d2d] to-[#070e1b] p-5 shadow-2xl text-[#e2e8f0]">
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

          <div className="mt-4 flex items-center justify-between border-t border-[#d4a843]/20 pt-3">
            <span className="text-xs text-slate-300">
              <strong className="text-[#f0d060]">{selectedIncident.itemsLogged}</strong> Lost & Found Logged
            </span>
            <button
              type="button"
              onClick={() => navigate(`/browse?location=${selectedIncident.id}`)}
              className="rounded bg-gradient-to-r from-[#d4a843] to-[#b88a2e] px-3 py-1.5 text-xs font-bold text-black hover:brightness-110"
            >
              View Items
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
