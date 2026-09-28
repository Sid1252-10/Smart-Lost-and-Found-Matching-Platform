import { useState, type FormEvent } from 'react'
import { GrandLineMap } from '../components/GrandLineMap'
import { Navbar } from '../components/Navbar'
import { AuthModal } from '../components/AuthModal'
import { CATEGORIES, COLOURS, ISLANDS, UNIQUE_MARKS } from '../data/catalog'
import { useRegistry } from '../context/RegistryContext'
import type { ItemKind } from '../types'

export function ReportPage() {
  const { addItem } = useRegistry()
  const [authOpen, setAuthOpen] = useState(false)
  const [locationId, setLocationId] = useState('marineford')
  const [submitted, setSubmitted] = useState('')

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const kind = String(data.get('kind')) as ItemKind
    const title = String(data.get('title') || 'Untitled treasure')
    const island = ISLANDS.find((item) => item.id === locationId)
    addItem({
      id: crypto.randomUUID(),
      kind,
      status: kind === 'lost' ? 'REPORTED LOST' : 'FOUND',
      title,
      locationId,
      location: island?.name || 'Unknown',
      category: String(data.get('category')),
      colour: String(data.get('colour')),
      uniqueMarks: String(data.get('uniqueMarks')),
      description: String(data.get('description')),
      dateLost: kind === 'lost' ? String(data.get('date') || '') : undefined,
      dateFound: kind === 'found' ? String(data.get('date') || '') : undefined,
    })
    setSubmitted(title)
    event.currentTarget.reset()
  }

  return (
    <div className="relative min-h-screen">
      <GrandLineMap selectedId={locationId} onSelect={setLocationId} />
      <div className="relative z-20">
        <Navbar onAuthClick={() => setAuthOpen(true)} />
        <form onSubmit={onSubmit} className="glass-panel mx-4 mb-10 max-w-2xl rounded-2xl p-6 md:mx-8">
          <p className="text-[11px] tracking-[0.24em] text-emerald-300">DEN DEN MUSHI DISPATCH</p>
          <h1 className="font-serif text-4xl text-white">Report Lost Item</h1>
          <p className="mb-5 text-sm text-slate-300">Log a treasure on the Grand Line. Island pins sync the location field.</p>
          <div className="grid gap-3 md:grid-cols-2">
            <select name="kind" className="rounded-lg border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-sm" defaultValue="lost">
              <option value="lost">I lost this</option>
              <option value="found">I found this</option>
            </select>
            <select name="category" className="rounded-lg border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-sm">
              {CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <input name="title" required placeholder="Item title" className="rounded-lg border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-sm md:col-span-2" />
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="rounded-lg border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-sm"
            >
              {ISLANDS.map((island) => (
                <option key={island.id} value={island.id}>
                  {island.name}
                </option>
              ))}
            </select>
            <input name="date" type="date" defaultValue="2026-04-10" className="rounded-lg border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-sm" />
            <select name="colour" className="rounded-lg border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-sm">
              {COLOURS.map((colour) => (
                <option key={colour}>{colour}</option>
              ))}
            </select>
            <select name="uniqueMarks" className="rounded-lg border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-sm">
              {UNIQUE_MARKS.map((mark) => (
                <option key={mark}>{mark}</option>
              ))}
            </select>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Describe unique marks, last known route, and crew details."
              className="rounded-lg border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-sm md:col-span-2"
            />
          </div>
          <button type="submit" className="mt-4 w-full rounded-full bg-emerald-500 py-3 text-sm font-semibold text-slate-950">
            File Registry Report
          </button>
          {submitted && <p className="mt-3 text-sm text-emerald-300">Logged “{submitted}” into the Grand Line registry.</p>}
        </form>
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}
