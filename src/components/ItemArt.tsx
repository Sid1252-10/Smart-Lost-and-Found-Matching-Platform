import type { RegistryItem } from '../types'

function artFor(title: string) {
  const t = title.toLowerCase()
  if (t.includes('sword') || t.includes('hilt') || t.includes('kitetsu') || t.includes('blade')) {
    return (
      <svg viewBox="0 0 80 80" className="h-full w-full">
        <rect width="80" height="80" fill="#1a1410" />
        <path d="M18 58 L62 22" stroke="#c9b48a" strokeWidth="8" />
        <path d="M14 62 L26 50" stroke="#d4af37" strokeWidth="6" />
        <circle cx="22" cy="58" r="6" fill="#7dd3a0" />
      </svg>
    )
  }
  if (t.includes('sling')) {
    return (
      <svg viewBox="0 0 80 80" className="h-full w-full">
        <rect width="80" height="80" fill="#24160f" />
        <path d="M24 20 C 20 48, 36 62, 40 66 C 44 62, 60 48, 56 20" fill="none" stroke="#b4532a" strokeWidth="6" />
        <path d="M24 22 h32" stroke="#d6b17a" strokeWidth="5" />
      </svg>
    )
  }
  if (t.includes('bandana')) {
    return (
      <svg viewBox="0 0 80 80" className="h-full w-full">
        <rect width="80" height="80" fill="#111827" />
        <path d="M16 34 C 28 22, 52 22, 64 34 L 58 50 C 40 42, 28 50, 22 48 Z" fill="#1f2937" />
        <path d="M58 48 l12 8 -6 6" fill="#111827" />
      </svg>
    )
  }
  if (t.includes('hat') || t.includes('straw')) {
    return (
      <svg viewBox="0 0 80 80" className="h-full w-full">
        <rect width="80" height="80" fill="#2a1f12" />
        <ellipse cx="40" cy="50" rx="28" ry="8" fill="#e8c36a" />
        <path d="M26 48 C 28 30, 52 30, 54 48" fill="#d4a84a" />
        <path d="M24 48 h32" stroke="#b42318" strokeWidth="3" />
      </svg>
    )
  }
  if (t.includes('log') || t.includes('pose')) {
    return (
      <svg viewBox="0 0 80 80" className="h-full w-full">
        <rect width="80" height="80" fill="#1f2937" />
        <circle cx="40" cy="40" r="18" fill="#d4af37" />
        <circle cx="40" cy="40" r="10" fill="#0f172a" />
        <circle cx="40" cy="40" r="3" fill="#34d399" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full">
      <rect width="80" height="80" fill="#1e293b" />
      <rect x="22" y="24" width="36" height="34" rx="4" fill="#334155" />
      <path d="M26 24 C 26 16, 54 16, 54 24" fill="none" stroke="#94a3b8" strokeWidth="4" />
    </svg>
  )
}

const statusClass: Record<RegistryItem['status'], string> = {
  CLAIMED: 'bg-slate-500/80 text-white',
  FOUND: 'bg-emerald-500 text-slate-950',
  CONFIRMED: 'bg-teal-700 text-white',
  'REPORTED LOST': 'bg-amber-500 text-slate-950',
  RECOVERED: 'bg-emerald-700 text-white',
}

export function ItemThumb({ title }: { title: string }) {
  return <div className="h-full w-full overflow-hidden rounded-lg">{artFor(title)}</div>
}

export function StatusTag({ status }: { status: RegistryItem['status'] }) {
  return (
    <span className={`rounded px-2 py-0.5 text-[9px] font-semibold tracking-[0.14em] ${statusClass[status]}`}>
      {status}
    </span>
  )
}
