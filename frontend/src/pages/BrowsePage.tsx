import { useMemo, useState } from 'react'
import { GrandLineMap } from '../components/GrandLineMap'
import { ItemThumb, StatusTag } from '../components/ItemArt'
import { ItemDetailModal } from '../components/Modals'
import { Navbar } from '../components/Navbar'
import { AuthModal } from '../components/AuthModal'
import { CATEGORIES, ISLANDS } from '../data/catalog'
import { useRegistry } from '../context/RegistryContext'
import type { RegistryItem } from '../types'

export function BrowsePage() {
  const { items } = useRegistry()
  const [authOpen, setAuthOpen] = useState(false)
  const [locationId, setLocationId] = useState('')
  const [category, setCategory] = useState('')
  const [kind, setKind] = useState<'all' | 'lost' | 'found'>('all')
  const [detail, setDetail] = useState<RegistryItem | null>(null)

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (locationId && item.locationId !== locationId) return false
        if (category && item.category !== category) return false
        if (kind !== 'all' && item.kind !== kind) return false
        return true
      }),
    [items, locationId, category, kind],
  )

  return (
    <div className="relative min-h-screen">
      <GrandLineMap selectedId={locationId} onSelect={setLocationId} />
      <div className="relative z-20">
        <Navbar onAuthClick={() => setAuthOpen(true)} />
        <div className="px-4 pb-10 md:px-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] tracking-[0.24em] text-emerald-300">TREASURE LEDGER</p>
              <h1 className="font-serif text-4xl text-white">Browse Found Items</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <select value={kind} onChange={(e) => setKind(e.target.value as 'all' | 'lost' | 'found')} className="rounded-lg border border-slate-600 bg-slate-950/60 px-3 py-2 text-sm">
                <option value="all">All records</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-slate-600 bg-slate-950/60 px-3 py-2 text-sm">
                <option value="">All categories</option>
                {CATEGORIES.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select value={locationId} onChange={(e) => setLocationId(e.target.value)} className="rounded-lg border border-slate-600 bg-slate-950/60 px-3 py-2 text-sm">
                <option value="">All islands</option>
                {ISLANDS.map((island) => (
                  <option key={island.id} value={island.id}>
                    {island.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setDetail(item)}
                className="glass-panel rounded-xl p-3 text-left"
              >
                <div className="relative h-28 overflow-hidden rounded-lg">
                  <ItemThumb title={item.title} />
                  <div className="absolute left-2 top-2">
                    <StatusTag status={item.status} />
                  </div>
                </div>
                <p className="mt-2 text-sm text-white">{item.title}</p>
                <p className="text-xs text-slate-400">{item.location}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <ItemDetailModal item={detail} onClose={() => setDetail(null)} />
    </div>
  )
}
