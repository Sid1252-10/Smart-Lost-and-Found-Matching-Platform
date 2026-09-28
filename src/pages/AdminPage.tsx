import { useState, useMemo } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { useRegistry } from '../context/RegistryContext'
import {
  ShieldCheck,
  Eye,
  FileSpreadsheet,
  Search,
  BarChart3,
  Layers,
  Trash2,
} from 'lucide-react'
import { CATEGORIES } from '../data/catalog'
import { canonicalCategory } from '../lib/categories'
import { StatusTag } from '../components/ItemArt'
import { ItemDetailModal } from '../components/Modals'
import { AdminAuthGate } from '../components/AdminAuthGate'
import { RecoveredStampCelebration, type RecoveredCelebrationState } from '../components/RecoveredStampCelebration'
import { fireTreasureConfetti } from '../lib/confetti'
import type { RegistryItem } from '../types'

export function AdminPage() {
  const { items, recoverItem, deleteItem } = useRegistry()
  const [activeTab, setActiveTab] = useState<'analytics' | 'reports' | 'claims'>('analytics')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [detailItem, setDetailItem] = useState<RegistryItem | null>(null)
  const [celebrationState, setCelebrationState] = useState<RecoveredCelebrationState>({
    isOpen: false,
    title: '',
  })

  // Analytics Metrics
  const total = items.length
  const totalLost = items.filter((i) => i.kind === 'lost').length
  const totalFound = items.filter((i) => i.kind === 'found').length
  const totalRecovered = items.filter((i) => i.status === 'RECOVERED').length
  const pendingClaims = items.filter((i) => i.status === 'CLAIMED' || i.status === 'CLAIM_PENDING').length
  const recoveryRate = total > 0 ? Math.round((totalRecovered / total) * 100) : 0

  // Category distribution with canonical mapping
  const categoryStats = useMemo(() => {
    const map: Record<string, number> = {}
    items.forEach((item) => {
      const cat = canonicalCategory(item.category)
      map[cat] = (map[cat] || 0) + 1
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [items])

  // Filtered reports
  const filteredReports = useMemo(() => {
    return items.filter((item) => {
      if (search && !item.title.toLowerCase().includes(search.toLowerCase()) && !item.description.toLowerCase().includes(search.toLowerCase())) {
        return false
      }
      if (selectedCategory && canonicalCategory(item.category) !== canonicalCategory(selectedCategory)) return false
      if (statusFilter && item.status !== statusFilter) return false
      return true
    })
  }, [items, search, selectedCategory, statusFilter])

  function exportJSON() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2))
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute('download', `sabaody_lost_found_export_${new Date().toISOString().split('T')[0]}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  return (
    <AdminAuthGate>
      <div className="relative min-h-screen text-[#e2e8f0] flex flex-col font-body">
        <Navbar />

      <main className="flex-1 mx-auto max-w-[1440px] w-full px-4 py-8 md:px-8">
        {/* Admin Header */}
        <div className="mb-6 rounded-xl border border-[#d4a843]/40 bg-gradient-to-r from-[#101b2d] via-[#1a2942] to-[#101b2d] p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4a843]/20 border border-[#d4a843]">
              <ShieldCheck className="h-6 w-6 text-[#f0d060]" />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#f0d060] tracking-widest block uppercase font-heading">
                HEADQUARTERS COMMAND DESK
              </span>
              <h1 className="font-pirate text-3xl md:text-5xl font-bold text-white tracking-wide">
                Registry Admin & Analytics Desk
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportJSON}
              className="flex items-center gap-2 rounded-lg border border-[#d4a843]/40 bg-black/40 px-3 py-2 text-xs font-bold text-[#f0d060] hover:bg-[#d4a843]/15 transition font-heading"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export Ledger JSON</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-[#d4a843]/20 mb-6 font-heading text-xs">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold transition-all ${
              activeTab === 'analytics'
                ? 'border-[#f0d060] text-[#f0d060] bg-[#d4a843]/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>ANALYTICS & METRICS</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold transition-all ${
              activeTab === 'reports'
                ? 'border-[#f0d060] text-[#f0d060] bg-[#d4a843]/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>MANAGE ALL REPORTS ({items.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('claims')}
            className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold transition-all ${
              activeTab === 'claims'
                ? 'border-[#f0d060] text-[#f0d060] bg-[#d4a843]/10'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>CLAIMS MODERATION ({pendingClaims})</span>
          </button>
        </div>

        {/* Tab 1: Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-[#d4a843]/30 bg-[#0c1422] p-5">
                <span className="text-xs text-slate-400 uppercase font-heading">Total Registry Entries</span>
                <p className="text-3xl font-black text-white mt-1 font-heading">{total}</p>
                <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                  <span>Lost: <strong className="text-red-400">{totalLost}</strong></span>
                  <span>Found: <strong className="text-emerald-400">{totalFound}</strong></span>
                </div>
              </div>

              <div className="rounded-xl border border-[#d4a843]/30 bg-[#0c1422] p-5">
                <span className="text-xs text-slate-400 uppercase font-heading">Successful Recoveries</span>
                <p className="text-3xl font-black text-emerald-400 mt-1 font-heading">{totalRecovered}</p>
                <p className="mt-2 text-xs text-slate-400">Reunited with captains</p>
              </div>

              <div className="rounded-xl border border-[#d4a843]/30 bg-[#0c1422] p-5">
                <span className="text-xs text-slate-400 uppercase font-heading">Recovery Match Rate</span>
                <p className="text-3xl font-black text-[#f0d060] mt-1 font-heading">{recoveryRate}%</p>
                <p className="mt-2 text-xs text-slate-400">Resolution ratio</p>
              </div>

              <div className="rounded-xl border border-[#d4a843]/30 bg-[#0c1422] p-5">
                <span className="text-xs text-slate-400 uppercase font-heading">Active Claims Queue</span>
                <p className="text-3xl font-black text-amber-300 mt-1 font-heading">{pendingClaims}</p>
                <p className="mt-2 text-xs text-slate-400">Awaiting port verification</p>
              </div>
            </div>

            {/* Category Distribution Chart / Breakdown */}
            <div className="rounded-xl border border-[#d4a843]/30 bg-[#0a1220] p-6 shadow-xl">
              <h3 className="font-heading text-base font-bold text-[#f0d060] mb-4">
                Category Distribution of Registered Relics
              </h3>
              <div className="space-y-3">
                {categoryStats.map(([catName, count]) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0
                  return (
                    <div key={catName}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-200">{catName}</span>
                        <span className="text-[#f0d060] font-bold">{count} items ({pct}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#d4a843] to-[#f0d060]"
                          style={{ width: `${Math.max(5, pct)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Reports Management */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {/* Filters bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#d4a843]/20 bg-[#0a1220] p-4">
              <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search item title or description..."
                  className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white"
                >
                  <option value="">All Statuses</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="POTENTIAL_MATCH">POTENTIAL_MATCH</option>
                  <option value="CLAIM_PENDING">CLAIM_PENDING</option>
                  <option value="CLAIMED">CLAIMED</option>
                  <option value="RECOVERED">RECOVERED</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-[#d4a843]/20 bg-[#0a1220]">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#101b2d] text-[#f0d060] uppercase tracking-wider text-[10px] font-heading">
                  <tr>
                    <th className="p-3">Type</th>
                    <th className="p-3">Relic / Title</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Location / Grove</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredReports.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/60 transition">
                      <td className="p-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            item.kind === 'lost'
                              ? 'bg-red-950/80 text-red-300 border border-red-500/40'
                              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {item.kind.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-white">
                        {item.title}
                      </td>
                      <td className="p-3 text-slate-400">
                        {item.category}
                      </td>
                      <td className="p-3 text-slate-300">
                        {item.location}
                      </td>
                      <td className="p-3 text-slate-400">
                        {item.incidentDate || item.dateLost || item.dateFound}
                      </td>
                      <td className="p-3">
                        <StatusTag status={item.status} />
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setDetailItem(item)}
                            title="Inspect details"
                            className="rounded p-1 text-slate-400 hover:text-white hover:bg-slate-800"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {item.status !== 'RECOVERED' && (
                            <button
                              onClick={async () => {
                                await recoverItem(item.id)
                                fireTreasureConfetti()
                                setCelebrationState({ isOpen: true, title: item.title })
                              }}
                              title="Mark as RECOVERED with Official Stamp"
                              className="rounded bg-emerald-500/20 border border-emerald-500/50 px-2 py-0.5 text-[10px] font-bold text-emerald-300 hover:bg-emerald-500/40"
                            >
                              Recover
                            </button>
                          )}

                          <button
                            onClick={async () => {
                              if (window.confirm(`Permanently remove "${item.title}" from registry?`)) {
                                await deleteItem(item.id)
                              }
                            }}
                            title="Delete report"
                            className="rounded p-1 text-red-400 hover:text-red-300 hover:bg-red-950/50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Claims Moderation */}
        {activeTab === 'claims' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#d4a843]/20 bg-[#0a1220] p-4 text-xs text-slate-300">
              <p>
                Review submitted claims from citizens and pirate crews. Approving a claim marks the item as <strong>CLAIMED</strong> and initiates dispatch to designated harbor outposts.
              </p>
            </div>

            {items.filter((i) => i.status === 'CLAIMED' || i.status === 'CLAIM_PENDING').length > 0 ? (
              <div className="space-y-3">
                {items
                  .filter((i) => i.status === 'CLAIMED' || i.status === 'CLAIM_PENDING')
                  .map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <StatusTag status={item.status} />
                          <span className="font-bold text-white text-sm">{item.title}</span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Claimed by: <strong className="text-[#f0d060]">{item.claimedBy || 'Pending Claimant'}</strong> • Location: {item.location} • Category: {item.category}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 font-heading text-xs">
                        <button
                          onClick={async () => {
                            await recoverItem(item.id)
                            fireTreasureConfetti()
                            setCelebrationState({ isOpen: true, title: item.title })
                          }}
                          className="rounded-lg bg-emerald-500 px-3 py-1.5 font-bold text-black hover:bg-emerald-400"
                        >
                          Approve & Recover
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 text-xs italic rounded-xl border border-dashed border-slate-800">
                No claims pending review. All items are clear.
              </div>
            )}
          </div>
        )}
      </main>

      {/* Recovered stamp confetti celebration */}
      <RecoveredStampCelebration
        state={celebrationState}
        onClose={() => setCelebrationState({ isOpen: false, title: '' })}
      />

      {/* Item detail modal */}
      <ItemDetailModal item={detailItem} onClose={() => setDetailItem(null)} />
      <Footer />
      </div>
    </AdminAuthGate>
  )
}
