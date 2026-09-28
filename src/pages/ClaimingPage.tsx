import { useState, useMemo, type FormEvent } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ShieldCheck, FileCheck, Send, CheckCircle2, AlertCircle, ArrowLeft, PackageCheck, KeyRound, Sparkles } from 'lucide-react'
import { useSearchParams, Link } from 'react-router-dom'
import { ARTIFACTS } from '../components/SelectedArtifacts'
import { useRegistry } from '../context/RegistryContext'
import { canonicalCategory } from '../lib/categories'
import { fireTreasureConfetti } from '../lib/confetti'

export function ClaimingPage() {
  const { items, claimItem } = useRegistry()
  const [searchParams] = useSearchParams()
  const artifactParam = searchParams.get('artifact') || searchParams.get('item') || ''

  const [itemId, setItemId] = useState(artifactParam)
  const [ownerName, setOwnerName] = useState('')
  const [islandLost, setIslandLost] = useState('Sabaody Archipelago')
  const [uniqueMarks, setUniqueMarks] = useState('')
  const [courierMethod, setCourierMethod] = useState('news_coo')
  const [submitted, setSubmitted] = useState(false)
  const [claimCode, setClaimCode] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Find either from live items in DB/Context or preloaded catalog
  const selectedItem = useMemo(() => {
    if (!itemId) return null
    const fromRegistry = items.find(
      (i) => i.id === itemId || i.title.toLowerCase() === itemId.toLowerCase()
    )
    if (fromRegistry) {
      return {
        id: fromRegistry.id,
        title: fromRegistry.title,
        kind: fromRegistry.kind,
        category: canonicalCategory(fromRegistry.category),
        location: fromRegistry.location,
        imageUrl: fromRegistry.imageUrl,
        reward: fromRegistry.reward || 'Pending Assessment',
        description: fromRegistry.description,
      }
    }
    const fromArtifacts = ARTIFACTS.find((a) => a.id === itemId)
    if (fromArtifacts) {
      return {
        id: fromArtifacts.id,
        title: fromArtifacts.name,
        kind: 'found',
        category: 'Relic & Gear',
        location: fromArtifacts.subtitle || 'Sabaody Archipelago',
        imageUrl: fromArtifacts.img,
        reward: fromArtifacts.bounty || '50,000 Berries',
        description: 'Cataloged pirate relic registered with the Treasury.',
      }
    }
    return null
  }, [itemId, items])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const code = `PIRATE-CLAIM-${Math.floor(100000 + Math.random() * 900000)}`
    setClaimCode(code)

    try {
      const target = items.find(
        (i) => i.id === itemId || i.title.toLowerCase().includes(itemId.toLowerCase())
      )
      const targetId = target ? target.id : (items[0]?.id || itemId)
      await claimItem(
        targetId,
        ownerName,
        `Proof marks: ${uniqueMarks}, Last seen: ${islandLost}, Courier: ${courierMethod}`
      )
      fireTreasureConfetti()
      setSubmitted(true)
    } catch (err) {
      console.error('Failed to submit claim:', err)
      fireTreasureConfetti()
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen text-[#e2e8f0] flex flex-col font-body">
      {/* Main Claiming Portal */}
      <Navbar />

      <main className="flex-1 mx-auto max-w-[1000px] w-full px-4 py-8 md:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between text-xs text-slate-400 border-b border-[#d4a843]/20 pb-3">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-[#f0d060] transition-colors">
              Grand Line Home
            </Link>
            <span>/</span>
            <Link to="/treasury" className="hover:text-[#f0d060] transition-colors">
              Smart Matching
            </Link>
            <span>/</span>
            <span className="text-[#f0d060] font-semibold">Claim Portal</span>
          </div>

          <Link
            to="/browse"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#f0d060] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Ledger</span>
          </Link>
        </div>

        {/* Portal Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#d4a843]/15 border border-[#d4a843] mb-3">
            <ShieldCheck className="h-6 w-6 text-[#f0d060]" />
          </div>
          <h1 className="font-pirate text-3xl md:text-5xl font-bold text-white tracking-wide">
            Grand Line Claim Portal
          </h1>
          <p className="mt-2 text-xs md:text-sm text-slate-300 max-w-xl mx-auto font-body">
            Legitimize your ownership of recovered treasure. Once verified against our Transponder Snail registry, the item will be dispatched to your designated port.
          </p>
        </div>

        {submitted ? (
          <div className="rounded-xl border border-[#d4a843] bg-gradient-to-b from-[#142338] to-[#0a1220] p-8 text-center shadow-2xl">
            <CheckCircle2 className="mx-auto h-16 w-16 text-[#f0d060] mb-4 animate-bounce" />
            <span className="text-xs font-semibold text-[#f0d060] tracking-widest block uppercase font-heading">
              CLAIM REGISTERED INTO TRANSPONDER SNAIL NETWORK
            </span>
            <h2 className="font-pirate text-3xl font-bold text-[#f0d060] mt-2">
              Claim Verification Dispatched!
            </h2>
            <div className="my-6 mx-auto max-w-md rounded-lg border border-[#d4a843]/40 bg-black/60 p-4 font-mono">
              <span className="text-xs text-slate-400 block mb-1">Your Royal Treasury Seal Code:</span>
              <span className="text-xl font-bold text-[#f0d060] tracking-wider">{claimCode}</span>
            </div>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              A Transponder Snail message has been forwarded to the local island magistrate. Keep your seal code safe to present at port upon item delivery.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setItemId('')
                  setOwnerName('')
                  setUniqueMarks('')
                }}
                className="rounded-lg bg-gradient-to-r from-[#d4a843] to-[#b88a2e] px-6 py-2.5 text-xs font-bold text-black hover:brightness-110"
              >
                Submit Another Claim
              </button>
              <Link
                to="/browse"
                className="rounded-lg border border-[#d4a843]/40 bg-white/5 px-5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10"
              >
                Browse All Treasures
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-[#d4a843]/30 bg-[#0a1220] p-6 md:p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selected Relic Preview Card */}
              {selectedItem && (
                <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center rounded-xl border border-[#d4a843]/50 bg-gradient-to-r from-[#121f35] to-[#0c1524] p-4 shadow-lg">
                  {selectedItem.imageUrl ? (
                    <img
                      src={selectedItem.imageUrl}
                      alt={selectedItem.title}
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover border border-[#d4a843]/50 shrink-0"
                    />
                  ) : (
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-[#d4a843]/15 border border-[#d4a843]/40 flex items-center justify-center shrink-0">
                      <PackageCheck className="h-8 w-8 text-[#f0d060]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded bg-[#d4a843]/20 border border-[#d4a843]/60 px-2 py-0.5 text-[10px] font-bold text-[#f0d060] uppercase">
                        {selectedItem.kind.toUpperCase()} ARTIFACT
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-300 font-medium">
                        {selectedItem.category}
                      </span>
                    </div>
                    <h3 className="font-heading text-base font-bold text-white">
                      {selectedItem.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      📍 {selectedItem.location} {selectedItem.reward ? `• Bounty: ${selectedItem.reward}` : ''}
                    </p>
                  </div>
                </div>
              )}

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-body">
                    Registered Relic to Claim *
                  </label>
                  <select
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                    required
                    className="w-full rounded-lg border border-[#d4a843]/30 bg-black/50 px-3.5 py-2.5 text-xs text-[#f0d060] font-semibold focus:outline-none focus:border-[#f0d060] transition-colors"
                  >
                    <option value="">-- Select from Registered Items --</option>
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.title} ({i.kind.toUpperCase()} • {canonicalCategory(i.category)} • {i.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-body">
                    Claimant Captain / Owner Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Monkey D. Luffy"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full rounded-lg border border-[#d4a843]/30 bg-black/50 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f0d060] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-body">
                    Island Where Lost / Last Seen
                  </label>
                  <select
                    value={islandLost}
                    onChange={(e) => setIslandLost(e.target.value)}
                    className="w-full rounded-lg border border-[#d4a843]/30 bg-black/50 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f0d060] transition-colors"
                  >
                    <option>Sabaody Archipelago</option>
                    <option>Alabasta Kingdom</option>
                    <option>Water 7 City</option>
                    <option>Skypiea (Sky Island)</option>
                    <option>Marineford</option>
                    <option>Wano Country</option>
                    <option>Dressrosa</option>
                    <option>East Blue / Baratie</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-body">
                    Delivery / Recovery Channel
                  </label>
                  <select
                    value={courierMethod}
                    onChange={(e) => setCourierMethod(e.target.value)}
                    className="w-full rounded-lg border border-[#d4a843]/30 bg-black/50 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f0d060] transition-colors"
                  >
                    <option value="news_coo">News Coo Delivery Bird (Standard)</option>
                    <option value="karoo">Karoo Fast-Leg Duck Express</option>
                    <option value="port_pickup">Local Harbor Master Vault Pickup</option>
                    <option value="marine_escort">Marine Escort (Requires High Bounty Bond)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-body">
                  Secret Identifying Marks / Ownership Proof *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe unique scratches, engravings, stitched initials, or secret compartment contents known only to the true owner..."
                  value={uniqueMarks}
                  onChange={(e) => setUniqueMarks(e.target.value)}
                  className="w-full rounded-lg border border-[#d4a843]/30 bg-black/50 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f0d060] transition-colors"
                />

                {/* Live Anti-Fraud Ownership Strength Barometer */}
                <div className="mt-2 rounded-lg bg-black/40 border border-slate-800 p-2.5 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <KeyRound className="h-3.5 w-3.5 text-[#f0d060]" />
                      <span>Blind Ownership Verification Strength</span>
                    </span>
                    <span
                      className={`font-mono font-bold ${
                        uniqueMarks.length > 25
                          ? 'text-emerald-400'
                          : uniqueMarks.length > 8
                          ? 'text-amber-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {Math.min(100, Math.round((uniqueMarks.length / 40) * 100))}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        uniqueMarks.length > 25
                          ? 'bg-emerald-400'
                          : uniqueMarks.length > 8
                          ? 'bg-amber-400'
                          : 'bg-slate-700'
                      }`}
                      style={{
                        width: `${Math.min(100, Math.round((uniqueMarks.length / 40) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3.5 flex gap-3 text-xs text-amber-200">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
                <p className="leading-relaxed">
                  False claims are prosecuted under Article 44 of Grand Line Maritime Law. A false claim fine of 50,000 Berries will be levied by the local island magistrate.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4a843] to-[#b88a2e] py-3 text-xs md:text-sm font-bold text-black hover:brightness-110 shadow-lg tracking-wider uppercase transition-all disabled:opacity-50"
              >
                <FileCheck className="h-4 w-4" />
                {submitting ? 'Transmitting to Transponder Snail...' : 'Transmit Ownership Claim'}
                <Send className="h-4 w-4 ml-1" />
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
