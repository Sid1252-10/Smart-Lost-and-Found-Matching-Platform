import { useState, useMemo } from 'react'
import { ZoomIn, ZoomOut, RotateCcw, MapPin, Compass, Eye, EyeOff, X } from 'lucide-react'
import { MAP_INCIDENTS, type IslandIncident } from './WorldMapModal'
import { useRegistry } from '../context/RegistryContext'
import type { RegistryItem } from '../types'

export interface GrandLineMapProps {
  selectedId?: string
  onSelect?: (id: string) => void
  variant?: 'interactive' | 'background' | 'embedded'
  title?: string
  subtitle?: string
  className?: string
  height?: string
}

// Helper to normalize island IDs for matching across formats (dashes, underscores, casing)
export function normalizeIslandId(id?: string): string {
  if (!id) return ''
  return id.toLowerCase().replace(/[-_\s]/g, '')
}

// Single source of truth to get actual database items for any island
export function getIslandActualItems(items: RegistryItem[] = [], islandId: string, islandName: string): RegistryItem[] {
  const normTarget = normalizeIslandId(islandId)
  const normName = normalizeIslandId(islandName)
  return items.filter((item) => {
    const locId = normalizeIslandId(item.locationId)
    const loc = normalizeIslandId(item.location)
    return (
      locId === normTarget ||
      locId === normName ||
      loc.includes(normTarget) ||
      loc.includes(normName)
    )
  })
}

export function GrandLineMap({
  selectedId = '',
  onSelect,
  variant = 'interactive',
  title = 'GRAND LINE: PARADISE SECTION',
  subtitle = 'Official Navigational Chart — Click pins on the map to select destination',
  className = '',
}: GrandLineMapProps) {
  const { items } = useRegistry()
  const [scale, setScale] = useState(1)
  const [showPins, setShowPins] = useState(true)

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 2.5))
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.8))
  const handleReset = () => setScale(1)

  const normalizedSelected = useMemo(() => normalizeIslandId(selectedId), [selectedId])

  const selectedIncident = useMemo(() => {
    if (!normalizedSelected) return null
    return MAP_INCIDENTS.find(
      (inc) =>
        normalizeIslandId(inc.id) === normalizedSelected ||
        normalizeIslandId(inc.name) === normalizedSelected,
    )
  }, [normalizedSelected])

  const selectedIslandItems = useMemo(() => {
    if (!selectedIncident) return []
    return getIslandActualItems(items, selectedIncident.id, selectedIncident.name)
  }, [items, selectedIncident])

  // Background variant (for ContactPage, FaqPage, etc.)
  if (variant === 'background') {
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        <img
          src="/grand_line_map.jpg"
          alt="Grand Line Map Background"
          className="w-full h-full object-cover object-center opacity-25 filter brightness-75 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060b14]/90 via-[#060b14]/75 to-[#060b14]/95" />
      </div>
    )
  }

  // Interactive full map viewer
  return (
    <div
      className={`rounded-2xl border-2 border-[#8a602a]/60 bg-[#0c1424] shadow-2xl overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Map Header / Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d4a843]/25 bg-gradient-to-r from-[#0b1424] via-[#10223b] to-[#0b1424] px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d4a843]/40 bg-[#d4a843]/15 shadow-inner">
            <Compass className="h-5 w-5 text-[#f0d060] animate-spin-slow" />
          </div>
          <div>
            <h2 className="font-[Cinzel] text-sm md:text-base font-bold tracking-widest text-[#f0d060]">
              {title}
            </h2>
            <p className="text-[11px] text-slate-300 hidden sm:block">{subtitle}</p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Toggle Pins */}
          <button
            type="button"
            onClick={() => setShowPins((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg border border-[#d4a843]/30 bg-black/50 px-2.5 py-1.5 text-xs font-medium text-[#e8d5a5] hover:border-[#f0d060] hover:text-[#f0d060] transition-colors"
            title={showPins ? 'Hide Pins (View Map Image)' : 'Show Pins'}
          >
            {showPins ? <Eye className="h-3.5 w-3.5 text-[#f0d060]" /> : <EyeOff className="h-3.5 w-3.5" />}
            <span className="text-[11px] font-semibold">{showPins ? 'Pins ON' : 'Map Only'}</span>
          </button>

          {/* Zoom In/Out/Reset */}
          <div className="flex items-center rounded-lg border border-[#d4a843]/30 bg-black/50">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 text-slate-300 hover:text-[#f0d060] transition-colors"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <div className="h-4 w-[1px] bg-[#d4a843]/20" />
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 text-slate-300 hover:text-[#f0d060] transition-colors"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <div className="h-4 w-[1px] bg-[#d4a843]/20" />
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 text-slate-300 hover:text-[#f0d060] transition-colors"
              title="Reset Zoom"
              aria-label="Reset Zoom"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Selected Island Banner (if an island is chosen) */}
      {selectedIncident && (
        <div className="flex items-center justify-between bg-[#19283f]/90 border-b border-[#d4a843]/30 px-4 py-2 text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-2 w-2 rounded-full bg-[#f0d060] animate-ping" />
            <span className="text-slate-400">Selected Island:</span>
            <span className="font-bold text-[#f0d060] truncate">{selectedIncident.name}</span>
            <span className="hidden md:inline text-slate-400">
              — {selectedIslandItems.length} {selectedIslandItems.length === 1 ? 'relic' : 'relics'} on record
              {selectedIslandItems.length > 0 && ` (${selectedIslandItems.filter(i => i.kind === 'found').length} Found, ${selectedIslandItems.filter(i => i.kind === 'lost').length} Lost)`}
            </span>
          </div>
          {onSelect && (
            <button
              type="button"
              onClick={() => onSelect('')}
              className="flex items-center gap-1 rounded bg-black/40 px-2 py-0.5 text-[11px] font-medium text-amber-200 hover:text-white hover:bg-black/60 transition"
            >
              <X className="h-3 w-3" />
              <span>Clear Island</span>
            </button>
          )}
        </div>
      )}

      {/* Map Viewport Area */}
      <div className="relative overflow-auto bg-[#050e1c] p-2 sm:p-3 flex items-start justify-center">
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease-out',
          }}
          className="relative w-full max-w-[1280px] rounded-lg shadow-xl overflow-hidden select-none"
        >
          {/* THE EXACT MAP IMAGE USED IN WORLD */}
          <img
            src="/grand_line_map.jpg"
            alt="Grand Line Paradise Section Map"
            className="w-full h-auto block select-none pointer-events-none"
          />

          {/* Interactive Pins Overlay */}
          {showPins &&
            MAP_INCIDENTS.map((inc: IslandIncident) => {
              const isSelected =
                normalizeIslandId(inc.id) === normalizedSelected ||
                normalizeIslandId(inc.name) === normalizedSelected

              return (
                <button
                  key={inc.id}
                  type="button"
                  style={{
                    position: 'absolute',
                    left: `${inc.xPercent}%`,
                    top: `${inc.yPercent}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => {
                    if (onSelect) {
                      // Toggle off if already clicked, else select
                      if (isSelected) {
                        onSelect('')
                      } else {
                        onSelect(inc.id)
                      }
                    }
                  }}
                  className={`group z-10 flex items-center justify-center focus:outline-none transition-transform ${
                    isSelected ? 'scale-125 z-20' : 'hover:scale-115'
                  }`}
                  title={`${inc.name} — Click to filter / select`}
                >
                  {/* Ping Animation ring */}
                  <span
                    className={`absolute inline-flex rounded-full opacity-60 ${
                      isSelected
                        ? 'h-9 w-9 animate-ping bg-[#f0d060]'
                        : 'h-6 w-6 group-hover:animate-ping bg-[#d4a843]/50'
                    }`}
                  />

                  {/* Marker Pin */}
                  <span
                    className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
                      isSelected
                        ? 'h-6 w-6 border-2 border-white bg-gradient-to-br from-[#f0d060] to-[#b88a2e] text-black shadow-[0_0_15px_rgba(240,208,96,1)] scale-110'
                        : 'h-5 w-5 border border-[#f0d060] bg-[#1a1005] text-[#f0d060] shadow-[0_0_8px_rgba(240,208,96,0.6)] group-hover:bg-[#d4a843] group-hover:text-black'
                    }`}
                  >
                    <MapPin className="h-3 w-3 fill-current" />
                  </span>

                  {/* Label / Tooltip */}
                  <span
                    className={`pointer-events-none absolute bottom-full mb-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider border shadow-xl transition-all duration-150 ${
                      isSelected
                        ? 'block bg-[#f0d060] text-black border-white shadow-[0_0_10px_rgba(240,208,96,0.5)] z-30'
                        : 'hidden group-hover:block bg-black/95 text-[#f0d060] border-[#d4a843]/60'
                    }`}
                  >
                    {inc.name}
                    {getIslandActualItems(items, inc.id, inc.name).length > 0
                      ? ` (${getIslandActualItems(items, inc.id, inc.name).length})`
                      : ''}
                  </span>
                </button>
              )
            })}
        </div>
      </div>

      {/* Island Quick Selector Bar */}
      <div className="border-t border-[#d4a843]/20 bg-[#09111e] px-4 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 shrink-0">
            Quick Nav:
          </span>
          {onSelect && (
            <button
              type="button"
              onClick={() => onSelect('')}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide whitespace-nowrap transition-colors ${
                !normalizedSelected
                  ? 'bg-[#d4a843] text-black shadow-md'
                  : 'bg-black/40 text-slate-300 hover:text-white hover:bg-black/70 border border-[#d4a843]/30'
              }`}
            >
              All Islands
            </button>
          )}
          {MAP_INCIDENTS.map((inc) => {
            const isSelected =
              normalizeIslandId(inc.id) === normalizedSelected ||
              normalizeIslandId(inc.name) === normalizedSelected
            const count = getIslandActualItems(items, inc.id, inc.name).length

            return (
              <button
                key={inc.id}
                type="button"
                onClick={() => onSelect?.(isSelected ? '' : inc.id)}
                className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#f0d060] text-black font-bold shadow-[0_0_10px_rgba(240,208,96,0.6)]'
                    : 'bg-black/40 text-slate-300 hover:text-[#f0d060] hover:bg-black/70 border border-[#d4a843]/20'
                }`}
              >
                <span>{inc.name}</span>
                {count > 0 && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                      isSelected
                        ? 'bg-black/80 text-[#f0d060]'
                        : 'bg-[#d4a843]/20 text-[#f0d060] border border-[#d4a843]/40'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
