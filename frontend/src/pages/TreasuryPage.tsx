import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Coins, Shield, Sparkles, Trophy, Vault, Search, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ARTIFACTS } from '../components/SelectedArtifacts'

export function TreasuryPage() {
  const [filter, setFilter] = useState('')

  const vaults = [
    { name: 'Mary Geoise Celestial Vault', security: 'Level 5 (Gorosei Seal)', berries: '450,000,000,000', items: 840 },
    { name: 'Marineford HQ Deep Armory', security: 'Level 4 (Fleet Admiral)', berries: '120,000,000,000', items: 1250 },
    { name: 'Gran Tesoro Gold Vault', security: 'Level 4 (Gild Tesoro Lock)', berries: '500,000,000,000', items: 3100 },
    { name: 'Wano Country Sukiyaki Vault', security: 'Level 3 (Kozuki Crest)', berries: '85,000,000,000', items: 620 },
    { name: 'Baratie Safe & Ledger', security: 'Level 2 (Zeff Protection)', berries: '2,500,000', items: 94 },
  ]

  const filteredArtifacts = ARTIFACTS.filter(a => 
    a.name.toLowerCase().includes(filter.toLowerCase()) || 
    a.owner.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#050b14] text-[#e2e8f0] flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-[1440px] w-full px-4 py-8 md:px-8">
        {/* Banner */}
        <div className="mb-8 rounded-xl border border-[#d4a843]/40 bg-gradient-to-r from-[#101b2d] via-[#1a2942] to-[#101b2d] p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4a843]/20 border border-[#d4a843]">
                <Vault className="h-6 w-6 text-[#f0d060]" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#f0d060] tracking-widest block uppercase">
                  CENTRAL REPOSITORY
                </span>
                <h1 className="font-[Cinzel] text-2xl md:text-3xl font-bold text-white">
                  Treasury of the Grand Line
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Valued Bounties</span>
                <span className="font-[Cinzel] text-xl md:text-2xl font-black text-[#f0d060]">
                  ฿ 1,157,502,500,000
                </span>
              </div>
              <Link
                to="/report"
                className="rounded bg-gradient-to-r from-[#d4a843] to-[#b88a2e] px-4 py-2.5 text-xs font-bold text-black hover:brightness-110 shadow-lg"
              >
                Deposit / Report Relic
              </Link>
            </div>
          </div>
        </div>

        {/* 3 Overview Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-[#d4a843]/30 bg-[#0c1422] p-5">
            <div className="flex items-center gap-3 mb-2">
              <Coins className="h-5 w-5 text-[#f0d060]" />
              <h3 className="font-bold text-sm text-[#f0d060] tracking-wider uppercase">Active Treasure Escrows</h3>
            </div>
            <p className="text-2xl font-black text-white font-[Cinzel]">1,432 Claims</p>
            <p className="text-xs text-slate-400 mt-1">Insured by World Economic News Paper & Morgans Guild</p>
          </div>

          <div className="rounded-xl border border-[#d4a843]/30 bg-[#0c1422] p-5">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-[#f0d060]" />
              <h3 className="font-bold text-sm text-[#f0d060] tracking-wider uppercase">Recovered This Cycle</h3>
            </div>
            <p className="text-2xl font-black text-white font-[Cinzel]">89.4% Match Rate</p>
            <p className="text-xs text-slate-400 mt-1">Over 700 items safely reunited with rightful captains</p>
          </div>

          <div className="rounded-xl border border-[#d4a843]/30 bg-[#0c1422] p-5">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="h-5 w-5 text-[#f0d060]" />
              <h3 className="font-bold text-sm text-[#f0d060] tracking-wider uppercase">Legendary Meito Registered</h3>
            </div>
            <p className="text-2xl font-black text-white font-[Cinzel]">12 Supreme / Great</p>
            <p className="text-xs text-slate-400 mt-1">Including Wado Ichimonji, Enma, and Shusui ledger records</p>
          </div>
        </div>

        {/* Global Vaults Table */}
        <div className="mb-8 rounded-xl border border-[#d4a843]/30 bg-[#0a1220] p-6 shadow-xl">
          <h2 className="font-[Cinzel] text-lg font-bold text-[#f0d060] mb-4 flex items-center gap-2">
            <Vault className="h-5 w-5 text-[#f0d060]" />
            Affiliated Island Vaults & Fortresses
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#101b2d] text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Vault Name</th>
                  <th className="p-3">Security Level</th>
                  <th className="p-3">Estimated Berries</th>
                  <th className="p-3">Cataloged Items</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d4a843]/15">
                {vaults.map((v) => (
                  <tr key={v.name} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-semibold text-white">{v.name}</td>
                    <td className="p-3 text-amber-300">{v.security}</td>
                    <td className="p-3 text-[#f0d060] font-mono">฿ {v.berries}</td>
                    <td className="p-3">{v.items} Relics</td>
                    <td className="p-3 text-right">
                      <Link
                        to="/browse"
                        className="inline-flex items-center gap-1 text-[#f0d060] hover:underline"
                      >
                        Inspect <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Wanted Lost Artifacts */}
        <div className="rounded-xl border border-[#d4a843]/30 bg-[#0a1220] p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-[Cinzel] text-lg font-bold text-[#f0d060] flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#f0d060]" />
                Highest Valued Lost Artifacts
              </h2>
              <p className="text-xs text-slate-400">Search priority items cataloged across the Grand Line</p>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search artifacts..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border border-[#d4a843]/30 bg-black/50 pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#f0d060]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArtifacts.map((art) => (
              <div
                key={art.id}
                className="flex gap-3 rounded-lg border border-[#d4a843]/20 bg-[#121c2d] p-3 hover:border-[#f0d060] transition-colors"
              >
                <img
                  src={art.img}
                  alt={art.name}
                  className="h-20 w-16 rounded object-cover border border-[#d4a843]/30"
                />
                <div className="flex-1">
                  <h4 className="font-[Cinzel] font-bold text-white text-sm">{art.name}</h4>
                  <p className="text-[11px] text-[#f0d060]">{art.subtitle}</p>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{art.description}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] text-amber-300 font-mono">{art.bounty}</span>
                    <Link
                      to={`/claiming?artifact=${art.id}`}
                      className="text-[10px] text-[#f0d060] font-semibold hover:underline"
                    >
                      Reclaim →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
