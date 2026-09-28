import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ShieldCheck, FileCheck, Send, CheckCircle2, AlertCircle } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { ARTIFACTS } from '../components/SelectedArtifacts'
import { useRegistry } from '../context/RegistryContext'

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

  const selectedPreload = ARTIFACTS.find((a) => a.id === itemId)

  const handleSubmit = async (e: React.FormEvent) => {
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
      setSubmitted(true)
    } catch (err) {
      console.error('Failed to submit claim:', err)
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050b14] text-[#e2e8f0] flex flex-col">
      <Navbar />

      <main className="flex-1 mx-auto max-w-[1000px] w-full px-4 py-8 md:px-8">
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
            <button
              type="button"
              onClick={() => {
                setSubmitted(false)
                setItemId('')
                setOwnerName('')
                setUniqueMarks('')
              }}
              className="mt-6 rounded bg-gradient-to-r from-[#d4a843] to-[#b88a2e] px-6 py-2.5 text-xs font-bold text-black hover:brightness-110"
            >
              Submit Another Claim
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-[#d4a843]/30 bg-[#0a1220] p-6 md:p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {selectedPreload && (
                <div className="flex gap-4 items-center rounded-lg border border-[#d4a843]/40 bg-[#121d30] p-4">
                  <img
                    src={selectedPreload.img}
                    alt={selectedPreload.name}
                    className="h-16 w-16 rounded object-cover border border-[#d4a843]/50"
                  />
                  <div>
                    <span className="text-[10px] text-[#f0d060] font-bold uppercase tracking-wider block">
                      Selected Artifact for Reclaim
                    </span>
                    <h3 className="font-[Cinzel] text-base font-bold text-white">
                      {selectedPreload.name} ({selectedPreload.subtitle})
                    </h3>
                    <p className="text-xs text-slate-300">Reward: {selectedPreload.bounty}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-heading">
                    Registered Relic to Claim *
                  </label>
                  <select
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                    required
                    className="w-full rounded-lg border border-[#d4a843]/30 bg-black/50 px-3.5 py-2.5 text-xs text-[#f0d060] font-semibold focus:outline-none focus:border-[#f0d060]"
                  >
                    <option value="">-- Select from Registered Items --</option>
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.title} ({i.kind.toUpperCase()} • {i.category} • {i.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Claimant Captain / Owner Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Monkey D. Luffy"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full rounded-lg border border-[#d4a843]/30 bg-black/50 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f0d060]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Island Where Lost / Last Seen
                  </label>
                  <select
                    value={islandLost}
                    onChange={(e) => setIslandLost(e.target.value)}
                    className="w-full rounded-lg border border-[#d4a843]/30 bg-black/50 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f0d060]"
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Delivery / Recovery Channel
                  </label>
                  <select
                    value={courierMethod}
                    onChange={(e) => setCourierMethod(e.target.value)}
                    className="w-full rounded-lg border border-[#d4a843]/30 bg-black/50 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f0d060]"
                  >
                    <option value="news_coo">News Coo Delivery Bird (Standard)</option>
                    <option value="karoo">Karoo Fast-Leg Duck Express</option>
                    <option value="port_pickup">Local Harbor Master Vault Pickup</option>
                    <option value="marine_escort">Marine Escort (Requires High Bounty Bond)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Secret Identifying Marks / Ownership Proof
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe unique scratches, engravings, stitched initials, or secret compartment contents known only to the true owner..."
                  value={uniqueMarks}
                  onChange={(e) => setUniqueMarks(e.target.value)}
                  className="w-full rounded-lg border border-[#d4a843]/30 bg-black/50 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f0d060]"
                />
              </div>

              <div className="rounded border border-amber-500/30 bg-amber-950/20 p-3 flex gap-2.5 text-xs text-amber-200">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-400" />
                <p>
                  False claims are prosecuted under Article 44 of Grand Line Maritime Law. A false claim fee of 50,000 Berries will be charged by the local magistrate.
                </p>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded bg-gradient-to-r from-[#d4a843] to-[#b88a2e] py-3 text-xs md:text-sm font-bold text-black hover:brightness-110 shadow-lg tracking-wider uppercase"
              >
                <FileCheck className="h-4 w-4" />
                Transmit Ownership Claim
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
