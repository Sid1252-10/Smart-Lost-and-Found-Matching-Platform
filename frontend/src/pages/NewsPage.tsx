import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Newspaper, Flame, Eye, X } from 'lucide-react'

export function NewsPage() {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null)

  const articles = [
    {
      id: 1,
      badge: 'BREAKING NEWS',
      headline: 'Straw Hat Spotted in Sabaody Archipelago! Thousand Sunny Reclaim Notice Filed',
      source: 'World Economic Journal — "Big News" Morgans',
      date: 'Today, 08:30 Sea Time',
      img: '/extracted/art_straw_hat.jpg',
      content: 'The iconic straw hat worn by Emperor Monkey D. Luffy was temporarily logged at Sabaody Grove 42 after turbulent ocean tides. Thousands of bounty hunters converged on the harbor before Straw Hat Grand Fleet representatives presented verification seals.',
    },
    {
      id: 2,
      badge: 'MEITO DISCOVERY',
      headline: 'Wado Ichimonji Scabbard Inscription Verified by Kozuki Blacksmiths in Wano',
      source: 'Kuri Daily Scroll',
      date: 'Yesterday, 14:15 Sea Time',
      img: '/extracted/art_wado_ichimonji.jpg',
      content: 'One of the 21 Great Grade Meito, Wado Ichimonji, was surveyed during an incident at the capital. Officials confirmed the temper line and Kozaburo signature remain pristine despite clashes against the strongest blades in the world.',
    },
    {
      id: 3,
      badge: 'SKY WEATHER ALERT',
      headline: 'Clima-Tact Sparks Unusual Thundercloud over Weatheria Express Route',
      source: 'Sky Island Gazette',
      date: '2 Days Ago',
      img: '/extracted/art_clima_tact.jpg',
      content: 'A high-voltage surge in the White-White Sea was traced to an unattended Clima-Tact floating on a cloud dial raft. Sky scholars safely neutralised the static field and transferred the relic to the Skypiea lost registry.',
    },
    {
      id: 4,
      badge: 'TREASURE GROVE UPDATE',
      headline: 'Alabasta Kingdom Uncovers Ancient Royal Vault Following Sandstorm',
      source: 'Alabarna Royal Dispatch',
      date: '4 Days Ago',
      img: '/extracted/grove_alabasta.jpg',
      content: 'A massive gale in the southern dunes unburied an old caravan treasure chest containing 198 historic relics. Queen Vivi has ordered all items entered into the Treasury of the Lost & Found for international recovery.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#050b14] text-[#e2e8f0] flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-[1200px] w-full px-4 py-8 md:px-8">
        <div className="mb-8 flex items-center justify-between border-b border-[#d4a843]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d4a843]/20 border border-[#d4a843]">
              <Newspaper className="h-6 w-6 text-[#f0d060]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#f0d060] tracking-widest block uppercase">
                WORLD ECONOMIC JOURNAL
              </span>
              <h1 className="font-[Cinzel] text-2xl md:text-3xl font-bold text-white">
                Grand Line Dispatch & News
              </h1>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#d4a843]/40 bg-black/40 px-3 py-1 text-xs text-[#f0d060]">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>Morgans Special Edition</span>
          </div>
        </div>

        {/* Featured Top Article */}
        <div className="mb-8 rounded-xl border border-[#d4a843] bg-gradient-to-r from-[#141e30] to-[#0a1220] p-6 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <img
              src="/extracted/hero_bg.jpg"
              alt="Thousand Sunny News"
              className="w-full md:w-1/2 rounded-lg border border-[#d4a843]/40 object-cover shadow-lg aspect-[16/9]"
            />
            <div className="flex-1">
              <span className="inline-block rounded bg-red-600/80 px-2 py-0.5 text-[10px] font-bold text-white tracking-widest uppercase mb-2">
                TOP HEADLINE
              </span>
              <h2 className="font-[Cinzel] text-xl md:text-2xl font-bold text-white mb-2 leading-snug">
                Treasury of the Lost & Found Records Historic 10,000th Artifact Match!
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                "Big News" Morgans reports that the shared Transponder Snail ledger has reached an unprecedented milestone across all four blues and the Grand Line. Pirates and citizens alike celebrate the safe recovery of cherished artifacts.
              </p>
              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span>By: Big News Morgans</span>
                <span>•</span>
                <span className="text-[#f0d060]">Grand Line Fleet Bureau</span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedArticle(idx)}
              className="group cursor-pointer rounded-xl border border-[#d4a843]/30 bg-[#0a1220] p-5 transition-all hover:border-[#f0d060] hover:shadow-[0_8px_25px_rgba(240,208,96,0.15)] flex gap-4"
            >
              <img
                src={item.img}
                alt={item.headline}
                className="h-24 w-20 shrink-0 rounded object-cover border border-[#d4a843]/30 group-hover:scale-105 transition-transform"
              />
              <div className="flex-1">
                <span className="inline-block rounded bg-[#d4a843]/20 px-2 py-0.5 text-[10px] font-bold text-[#f0d060] tracking-wider uppercase mb-1">
                  {item.badge}
                </span>
                <h3 className="font-[Cinzel] text-sm font-bold text-white group-hover:text-[#f0d060] transition-colors line-clamp-2">
                  {item.headline}
                </h3>
                <p className="mt-1.5 text-xs text-slate-400 line-clamp-2">
                  {item.content}
                </p>
                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{item.date}</span>
                  <span className="flex items-center gap-1 text-[#f0d060]">
                    Read Dispatch <Eye className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedArticle !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-xl border border-[#d4a843] bg-gradient-to-b from-[#141e30] to-[#0a1220] p-6 shadow-2xl text-[#e2e8f0]">
              <button
                type="button"
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <span className="inline-block rounded bg-[#d4a843]/20 px-2 py-0.5 text-[10px] font-bold text-[#f0d060] tracking-wider uppercase mb-2">
                {articles[selectedArticle].badge}
              </span>
              <h3 className="font-[Cinzel] text-lg font-bold text-white mb-2">
                {articles[selectedArticle].headline}
              </h3>
              <p className="text-[11px] text-slate-400 mb-4">
                {articles[selectedArticle].source} • {articles[selectedArticle].date}
              </p>
              <img
                src={articles[selectedArticle].img}
                alt={articles[selectedArticle].headline}
                className="w-full h-48 rounded-lg object-cover border border-[#d4a843]/30 mb-4"
              />
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {articles[selectedArticle].content}
              </p>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="rounded bg-[#d4a843] px-4 py-2 text-xs font-bold text-black hover:bg-[#f0d060]"
                >
                  Close Dispatch
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
