import { ArrowRight, Briefcase, MapPin } from 'lucide-react'
import type { ReactNode } from 'react'
import { CATEGORIES, COLOURS, ISLANDS, UNIQUE_MARKS } from '../data/catalog'
import type { SearchFilters } from '../types'

type RegistryPanelProps = {
  filters: SearchFilters
  onChange: (next: SearchFilters) => void
  onSearch: () => void
}

function FieldLabel({ children }: { children: string }) {
  return <p className="mb-1.5 text-[10px] uppercase tracking-[0.18em] text-slate-400">{children}</p>
}

function Select({
  value,
  onChange,
  children,
}: {
  value: string
  onChange: (value: string) => void
  children: ReactNode
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none rounded-lg border border-slate-600/70 bg-slate-950/40 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-400"
    >
      {children}
    </select>
  )
}

export function RegistryPanel({ filters, onChange, onSearch }: RegistryPanelProps) {
  const patch = (partial: Partial<SearchFilters>) => onChange({ ...filters, ...partial })

  return (
    <aside className="glass-panel relative z-20 w-full rounded-2xl p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[13px] font-semibold tracking-[0.2em] text-white">LOST & FOUND ITEM REGISTRY</h2>
      </div>

      <div className="space-y-4">
        <div>
          <FieldLabel>Item Category</FieldLabel>
          <div className="relative">
            <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-300" />
            <select
              value={filters.category}
              onChange={(e) => patch({ category: e.target.value })}
              className="w-full appearance-none rounded-lg border border-slate-600/70 bg-slate-950/40 py-2.5 pl-10 pr-3 text-sm text-slate-100 outline-none focus:border-emerald-400"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <FieldLabel>Location Lost/Found</FieldLabel>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-300" />
            <select
              value={filters.locationId}
              onChange={(e) => patch({ locationId: e.target.value })}
              className="w-full appearance-none rounded-lg border border-slate-600/70 bg-slate-950/40 py-2.5 pl-10 pr-3 text-sm text-slate-100 outline-none focus:border-emerald-400"
            >
              {ISLANDS.map((island) => (
                <option key={island.id} value={island.id}>
                  {island.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Date Lost</FieldLabel>
            <input
              type="date"
              value={filters.dateLost}
              onChange={(e) => patch({ dateLost: e.target.value })}
              className="w-full rounded-lg border border-slate-600/70 bg-slate-950/40 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-400"
            />
          </div>
          <div>
            <FieldLabel>Date Found</FieldLabel>
            <input
              type="date"
              value={filters.dateFound}
              onChange={(e) => patch({ dateFound: e.target.value })}
              className="w-full rounded-lg border border-slate-600/70 bg-slate-950/40 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        <div>
          <FieldLabel>Item Specifics</FieldLabel>
          <div className="grid grid-cols-2 gap-3">
            <Select value={filters.colour} onChange={(colour) => patch({ colour })}>
              {COLOURS.map((colour) => (
                <option key={colour} value={colour}>
                  Colour: {colour}
                </option>
              ))}
            </Select>
            <Select value={filters.uniqueMarks} onChange={(uniqueMarks) => patch({ uniqueMarks })}>
              {UNIQUE_MARKS.map((mark) => (
                <option key={mark} value={mark}>
                  Unique Marks: {mark}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={filters.onlyLost}
            onChange={(e) => patch({ onlyLost: e.target.checked })}
            className="h-4 w-4 accent-emerald-500"
          />
          Status
          <span className="text-slate-400">Only Lost</span>
        </label>

        <button
          type="button"
          onClick={onSearch}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 py-3 text-sm font-semibold tracking-[0.12em] text-slate-950 hover:bg-emerald-400"
        >
          SEARCH REGISTRY
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}
