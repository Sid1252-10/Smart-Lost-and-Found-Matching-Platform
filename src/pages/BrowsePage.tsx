import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { GrandLineMap, normalizeIslandId } from '../components/GrandLineMap'
import { ItemThumb, StatusTag } from '../components/ItemArt'
import { ItemDetailModal } from '../components/Modals'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { AuthModal } from '../components/AuthModal'
import { CATEGORIES, ISLANDS } from '../data/catalog'
import { useRegistry } from '../context/RegistryContext'
import type { RegistryItem } from '../types'
import { Compass, Map as MapIcon, RotateCcw, Search } from 'lucide-react'

export function BrowsePage() {
  const { items } = useRegistry()
  const [searchParams, setSearchParams] = useSearchParams()

  const [authOpen, setAuthOpen] = useState(false)
  const [locationId, setLocationId] = useState(searchParams.get('location') || '')
  const [category, setCategory] = useState('')
  const [kind, setKind] = useState<'all' | 'lost' | 'found'>('all')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [detail, setDetail] = useState<RegistryItem | null>(null)
  const [showMap, setShowMap] = useState(true)

  // Sync if URL query param changes
  useEffect(() => {
    const loc = searchParams.get('location')
    if (loc) {
      setLocationId(loc)
    }
    const q = searchParams.get('q')
    if (q) {
      setSearchQuery(q)
    }
  }, [searchParams])

  // Handle location change & sync with URL
  const handleSelectLocation = (id: string) => {
    setLocationId(id)
    const nextParams = new URLSearchParams(searchParams)
    if (id) {
      nextParams.set('location', id)
    } else {
      nextParams.delete('location')
    }
    setSearchParams(nextParams)
  }

  const filtered = useMemo(() => {
    return items.filter((item) => {
      // Location filter (normalized matching)
      if (locationId) {
        const normFilter = normalizeIslandId(locationId)
        const normItemLocId = normalizeIslandId(item.locationId)
        const normItemLoc = normalizeIslandId(item.location)
        if (normItemLocId !== normFilter && !normItemLoc.includes(normFilter)) {
          return false
        }
      }
      // Category filter
      if (category && item.category !== category) return false
      // Kind filter
      if (kind !== 'all' && item.kind !== kind) return false
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = item.title.toLowerCase().includes(q)
        const matchDesc = item.description?.toLowerCase().includes(q)
        const matchLoc = item.location.toLowerCase().includes(q)
        if (!matchTitle && !matchDesc && !matchLoc) return false
      }
      return true
    })
  }, [items, locationId, category, kind, searchQuery])

  const resetFilters = () => {
    setLocationId('')
    setCategory('')
    setKind('all')
    setSearchQuery('')
    setSearchParams(new URLSearchParams())
  }

  const selectedIslandName = useMemo(() => {
    if (!locationId) return ''
    const match = ISLANDS.find(
      (isl) => normalizeIslandId(isl.id) === normalizeIslandId(locationId),
    )
    return match?.name || locationId
  }, [locationId])

  return (
    <div className="min-h-screen bg-[#060b14] text-[#e2e8f0] flex flex-col">
      <Navbar onAuthClick={() => setAuthOpen(true)} />

      <main className="flex-1 flex flex-col px-4 py-6 md:px-8 max-w-[1440px] mx-auto w-full">
        {/* Page Banner Header */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-[#d4a843]/20 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-[#f0d060] animate-pulse" />
              <p className="text-[11px] font-bold tracking-[0.24em] text-[#f0d060] uppercase">
                Grand Line Registry
              </p>
            </div>
            <h1 className="font-pirate text-3xl md:text-5xl font-bold text-white tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              Browse Found & Lost Treasures
            </h1>
            <p className="text-xs md:text-sm text-slate-300 mt-1 font-body">
              Explore recovered and reported artifacts across the Paradise Section of the Grand Line.
            </p>
          </div>

          {/* Toggle Map View button */}
          <button
            type="button"
            onClick={() => setShowMap((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-[#d4a843]/40 bg-[#101b2e] px-3.5 py-2 text-xs font-semibold text-[#f0d060] hover:bg-[#182844] transition-all shadow-md"
          >
            <MapIcon className="h-4 w-4" />
            <span>{showMap ? 'Hide Grand Line Map' : 'Show Grand Line Map'}</span>
          </button>
        </div>

        {/* Grand Line World Map (The exact same map used in World) */}
        {showMap && (
          <div className="mb-8">
            <GrandLineMap
              selectedId={locationId}
              onSelect={handleSelectLocation}
              title="GRAND LINE: PARADISE SECTION SURVEY"
              subtitle="Click any island pin to filter logged items by location"
            />
          </div>
        )}

        {/* Filter Controls Toolbar */}
        <div className="mb-6 rounded-xl border border-[#d4a843]/25 bg-gradient-to-r from-[#0d1627] to-[#070e1b] p-4 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              {/* Search Input */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by treasure name, description..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950/70 pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:border-[#f0d060] focus:outline-none"
                />
              </div>

              {/* Kind Selector */}
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as 'all' | 'lost' | 'found')}
                className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white focus:border-[#f0d060] focus:outline-none"
              >
                <option value="all">All Records (Lost & Found)</option>
                <option value="found">Found Items Only</option>
                <option value="lost">Lost Items Only</option>
              </select>

              {/* Category Selector */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-white focus:border-[#f0d060] focus:outline-none"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Island Dropdown (synced with the map) */}
              <select
                value={locationId}
                onChange={(e) => handleSelectLocation(e.target.value)}
                className="rounded-lg border border-[#d4a843]/50 bg-slate-950/70 px-3 py-2 text-xs text-[#f0d060] focus:border-[#f0d060] focus:outline-none font-medium"
              >
                <option value="">All Grand Line Islands</option>
                {ISLANDS.map((island) => (
                  <option key={island.id} value={island.id}>
                    {island.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear / Reset Button */}
            {(locationId || category || kind !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-950/30 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-950/60 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Active Filter Indicator Tag */}
          {selectedIslandName && (
            <div className="mt-3 flex items-center gap-2 border-t border-[#d4a843]/15 pt-2.5 text-xs">
              <span className="text-slate-400">Current Map Filter:</span>
              <span className="rounded bg-[#d4a843]/20 border border-[#d4a843]/40 px-2 py-0.5 font-bold text-[#f0d060]">
                {selectedIslandName}
              </span>
              <button
                type="button"
                onClick={() => handleSelectLocation('')}
                className="text-xs text-slate-400 hover:text-white underline ml-1"
              >
                Clear island filter
              </button>
            </div>
          )}
        </div>

        {/* Results Count Banner */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Showing <strong className="text-[#f0d060] font-bold">{filtered.length}</strong> registered{' '}
            {filtered.length === 1 ? 'treasure' : 'treasures'}
          </p>
        </div>

        {/* Items Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setDetail(item)}
                className="group relative rounded-xl border border-[#d4a843]/25 bg-gradient-to-b from-[#0e1728] to-[#070d18] p-3 text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#f0d060] hover:shadow-[0_8px_20px_rgba(212,168,67,0.15)]"
              >
                {/* Thumbnail */}
                <div className="relative h-36 w-full overflow-hidden rounded-lg bg-black/60 border border-[#d4a843]/20">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <ItemThumb title={item.title} />
                  )}
                  <div className="absolute left-2.5 top-2.5">
                    <StatusTag status={item.status} />
                  </div>
                  <div className="absolute right-2.5 bottom-2.5 rounded bg-black/80 px-2 py-0.5 text-[10px] font-semibold text-[#f0d060] border border-[#d4a843]/30">
                    {item.kind === 'lost' ? 'LOST' : 'FOUND'}
                  </div>
                </div>

                {/* Details */}
                <div className="mt-3">
                  <h3 className="font-semibold text-sm text-white group-hover:text-[#f0d060] transition-colors truncate">
                    {item.title}
                  </h3>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                    <span className="text-amber-200/90 font-medium truncate">{item.location}</span>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {item.dateFound || item.dateLost || ''}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                    <span className="rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-slate-300 border border-slate-700/50">
                      {item.category}
                    </span>
                    {item.colour && (
                      <span className="rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-slate-400 border border-slate-700/50">
                        {item.colour}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d4a843]/30 bg-black/30 py-16 text-center">
            <Compass className="h-12 w-12 text-[#d4a843]/40 mb-3" />
            <h3 className="font-heading text-lg font-bold text-[#f0d060] tracking-wide">
              No Treasures Found
            </h3>
            <p className="mt-1 text-xs text-slate-400 max-w-md font-body">
              No items match the current filters on this section of the Grand Line. Try clearing filters or selecting another island.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 rounded-lg bg-[#d4a843] px-4 py-2 text-xs font-bold text-black hover:brightness-110 shadow-lg"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      <Footer />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <ItemDetailModal item={detail} onClose={() => setDetail(null)} />
    </div>
  )
}
