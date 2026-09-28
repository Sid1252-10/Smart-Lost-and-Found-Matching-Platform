import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Archive, CheckCircle, Search } from 'lucide-react'

export function ArchivesPage() {
  const [filter, setFilter] = useState('')

  const recoveredRecords = [
    {
      id: 'rec-1',
      name: "Zoro's Sandai Kitetsu",
      category: 'Meito Blade',
      island: 'Loguetown',
      claimant: 'Roronoa Zoro',
      dateRecovered: 'Year 1522',
      seal: 'IP-90812-RECLAIMED',
      status: 'Restored to Captain',
      img: '/extracted/art_wado_ichimonji.jpg',
    },
    {
      id: 'rec-2',
      name: 'All Blue Spice Jar',
      category: 'Culinary Relic',
      island: 'Baratie',
      claimant: 'Vinsmoke Sanji',
      dateRecovered: 'Year 1523',
      seal: 'IP-33412-RECLAIMED',
      status: 'Restored to Captain',
      img: '/extracted/art_golden_lighter.jpg',
    },
    {
      id: 'rec-3',
      name: 'Triple Grand Line Log Pose',
      category: 'Navigational Tool',
      island: 'Water 7',
      claimant: 'Nami',
      dateRecovered: 'Year 1524',
      seal: 'IP-55219-RECLAIMED',
      status: 'Restored to Captain',
      img: '/extracted/art_clima_tact.jpg',
    },
    {
      id: 'rec-4',
      name: "Dr. Hiriluk's Medical Satchel",
      category: 'Medical Relic',
      island: 'Drum Island',
      claimant: 'Tony Tony Chopper',
      dateRecovered: 'Year 1524',
      seal: 'IP-77124-RECLAIMED',
      status: 'Restored to Captain',
      img: '/extracted/art_rumble_balls.jpg',
    },
  ]

  const filtered = recoveredRecords.filter(
    (r) =>
      r.name.toLowerCase().includes(filter.toLowerCase()) ||
      r.claimant.toLowerCase().includes(filter.toLowerCase()) ||
      r.island.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#050b14] text-[#e2e8f0] flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-[1200px] w-full px-4 py-8 md:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#d4a843]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4a843]/20 border border-[#d4a843]">
              <Archive className="h-6 w-6 text-[#f0d060]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#f0d060] tracking-widest block uppercase">
                HISTORICAL VAULT RECORDS
              </span>
              <h1 className="font-[Cinzel] text-2xl md:text-3xl font-bold text-white">
                Treasury Archives of Reclaimed Relics
              </h1>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter archives..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-[#d4a843]/30 bg-black/50 pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#f0d060]"
            />
          </div>
        </div>

        {/* Archives Table */}
        <div className="rounded-xl border border-[#d4a843]/30 bg-[#0a1220] p-6 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#101b2d] text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Artifact</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Recovered At</th>
                  <th className="p-3">Verified Claimant</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Status Seal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4a843]/15">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="h-10 w-8 rounded object-cover border border-[#d4a843]/30"
                      />
                      <span className="font-semibold text-white">{item.name}</span>
                    </td>
                    <td className="p-3 text-amber-300">{item.category}</td>
                    <td className="p-3">{item.island}</td>
                    <td className="p-3 text-[#f0d060] font-semibold">{item.claimant}</td>
                    <td className="p-3 text-slate-400">{item.dateRecovered}</td>
                    <td className="p-3 text-right">
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                        <CheckCircle className="h-3 w-3" />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
