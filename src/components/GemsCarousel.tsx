import { ItemThumb, StatusTag } from './ItemArt'
import type { RegistryItem } from '../types'

type GemsCarouselProps = {
  items: RegistryItem[]
  onSelect: (item: RegistryItem) => void
}

export function GemsCarousel({ items, onSelect }: GemsCarouselProps) {
  return (
    <section className="relative z-20">
      <div className="mb-3 flex items-end gap-4">
        <h3 className="text-lg text-white">Explore Our Gems</h3>
        <p className="pb-0.5 text-[10px] uppercase tracking-[0.24em] text-slate-400">Recently Found Treasures</p>
      </div>
      <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-2">
        {items.slice(0, 4).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item)}
            className="glass-panel min-w-[210px] max-w-[220px] flex-1 rounded-xl p-2.5 text-left transition hover:-translate-y-0.5"
          >
            <div className="relative h-24 overflow-hidden rounded-lg">
              <ItemThumb title={item.title} />
              <div className="absolute left-2 top-2">
                <StatusTag status={item.status} />
              </div>
            </div>
            <p className="mt-2 text-sm font-medium text-white">{item.title}</p>
            <p className="text-[11px] text-slate-400">{item.location}</p>
            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-300">{item.description}</p>
          </button>
        ))}
      </div>
    </section>
  )
}
