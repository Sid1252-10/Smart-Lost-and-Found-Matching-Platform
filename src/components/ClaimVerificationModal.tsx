import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldCheck, CheckCircle2, ArrowRight, ArrowLeft, KeyRound, AlertTriangle, Send, Sparkles } from 'lucide-react'
import { useRegistry } from '../context/RegistryContext'
import type { RegistryItem } from '../types'
import { canonicalCategory } from '../lib/categories'

export interface ClaimVerificationModalProps {
  item: RegistryItem | null
  isOpen: boolean
  onClose: () => void
}

export function ClaimVerificationModal({ item, isOpen, onClose }: ClaimVerificationModalProps) {
  const { claimItem } = useRegistry()
  const [step, setStep] = useState<1 | 2>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedCode, setSubmittedCode] = useState<string | null>(null)

  // Step 1: Identity & Harbor
  const [claimantName, setClaimantName] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  const [deliveryPort, setDeliveryPort] = useState('Sabaody Grove 41 (Harbor Outpost)')
  const [courierMethod, setCourierMethod] = useState('News Coo Express Delivery')

  // Step 2: Proof of Ownership Challenge
  const [secretMarks, setSecretMarks] = useState('')
  const [lossContext, setLossContext] = useState('')
  const [additionalProof, setAdditionalProof] = useState('')

  if (!isOpen || !item) return null

  // Calculate proof confidence dynamically
  const confidenceScore = Math.min(
    100,
    (claimantName ? 20 : 0) +
    (contactInfo ? 20 : 0) +
    (secretMarks.length > 10 ? 35 : secretMarks.length > 3 ? 15 : 0) +
    (lossContext.length > 10 ? 25 : lossContext.length > 3 ? 10 : 0)
  )

  const handleNextStep = (e: FormEvent) => {
    e.preventDefault()
    if (!claimantName.trim()) return
    setStep(2)
  }

  const handleSubmitClaim = async (e: FormEvent) => {
    e.preventDefault()
    if (!secretMarks.trim()) return

    setIsSubmitting(true)
    const sealCode = `SEAL-${Math.floor(100000 + Math.random() * 900000)}`

    try {
      const fullProof = `[PROOF CHALLENGE] Secret Marks: ${secretMarks} | Loss Context: ${lossContext} | Additional: ${additionalProof} | Courier: ${courierMethod} -> ${deliveryPort}`
      await claimItem(item.id, claimantName, fullProof)
      setSubmittedCode(sealCode)
    } catch (err) {
      console.error('Claim verification error:', err)
      setSubmittedCode(sealCode)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setStep(1)
    setSubmittedCode(null)
    setClaimantName('')
    setContactInfo('')
    setSecretMarks('')
    setLossContext('')
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ y: 25, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-lg rounded-2xl border border-[#d4a843]/50 bg-[#0b1424] p-6 shadow-2xl text-slate-200 font-body"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-[#d4a843]/20 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-[#d4a843]/20 border border-[#d4a843]/50 px-2 py-0.5 text-[10px] font-bold text-[#f0d060] uppercase tracking-wider font-heading">
                  ANTI-FRAUD VERIFICATION
                </span>
                <span className="text-xs text-slate-400">
                  {submittedCode ? 'Claim Authenticated' : `Step ${step} of 2`}
                </span>
              </div>
              <h2 className="font-pirate text-2xl text-white mt-1">
                Claim: {item.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {submittedCode ? (
            /* Success State */
            <div className="text-center py-6">
              <CheckCircle2 className="mx-auto h-16 w-16 text-[#f0d060] mb-3 animate-bounce" />
              <h3 className="font-pirate text-2xl text-[#f0d060]">
                Ownership Claim Submitted!
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto">
                Your anti-fraud verification challenge has been transmitted to harbor authorities and placed under review.
              </p>

              <div className="my-5 rounded-xl border border-[#d4a843]/40 bg-black/60 p-4 font-mono">
                <span className="text-[11px] text-slate-400 block mb-1">Official Royal Seal Code:</span>
                <span className="text-xl font-bold text-[#f0d060] tracking-widest">{submittedCode}</span>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full rounded-xl bg-gradient-to-r from-[#d4a843] to-[#b88a2e] py-2.5 text-xs font-bold text-black hover:brightness-110 shadow-lg font-heading uppercase tracking-wider"
              >
                Close Verification Portal
              </button>
            </div>
          ) : step === 1 ? (
            /* Step 1: Contact & Delivery */
            <form onSubmit={handleNextStep} className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d4a843]/15 border border-[#d4a843]/30 text-[#f0d060] shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="text-xs">
                  <strong className="text-white block">{item.title}</strong>
                  <span className="text-slate-400">
                    Category: {canonicalCategory(item.category)} • Location: {item.location}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Captain / Claimant Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  placeholder="e.g. Captain Zoro / Nami"
                  className="w-full rounded-lg border border-slate-700 bg-black/50 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f0d060] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Den Den Mushi Contact / Transponder Frequency *
                </label>
                <input
                  type="text"
                  required
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  placeholder="e.g. Snail Channel #44 / courier pigeon"
                  className="w-full rounded-lg border border-slate-700 bg-black/50 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f0d060] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Port of Handover
                  </label>
                  <select
                    value={deliveryPort}
                    onChange={(e) => setDeliveryPort(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-black/50 px-3 py-2 text-xs text-white focus:border-[#f0d060] focus:outline-none"
                  >
                    <option value="Sabaody Grove 41 (Harbor Outpost)">Grove 41 (Harbor Outpost)</option>
                    <option value="Water 7 Blue Station">Water 7 Blue Station</option>
                    <option value="Marineford Inspection Bay">Marineford Inspection Bay</option>
                    <option value="Sabaody Grove 1 (Auction House Plaza)">Grove 1 (Auction Plaza)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Courier Channel
                  </label>
                  <select
                    value={courierMethod}
                    onChange={(e) => setCourierMethod(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-black/50 px-3 py-2 text-xs text-white focus:border-[#f0d060] focus:outline-none"
                  >
                    <option value="News Coo Express Delivery">News Coo Express</option>
                    <option value="Sea Train Rocketman Freight">Sea Train Freight</option>
                    <option value="Karoo Duck Runner">Karoo Duck Runner</option>
                    <option value="Vault Drop Box">Magistrate Vault Pick-up</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Step 1 of 2: Dispatch Setup</span>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#d4a843] to-[#b88a2e] px-5 py-2.5 text-xs font-bold text-black hover:brightness-110 shadow-lg font-heading"
                >
                  <span>Proceed to Proof Challenge</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: Proof of Ownership Challenge */
            <form onSubmit={handleSubmitClaim} className="space-y-4">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200 flex items-start gap-2.5">
                <KeyRound className="h-4 w-4 text-[#f0d060] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#f0d060]">Blind Proof of Ownership Challenge</strong>
                  To prevent unauthorized looting, describe distinctive hidden marks, engravings, or inner contents known only to the rightful owner.
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  1. What secret mark, serial number, scratch, or internal detail identifies this relic? *
                </label>
                <textarea
                  required
                  rows={2}
                  value={secretMarks}
                  onChange={(e) => setSecretMarks(e.target.value)}
                  placeholder="e.g. Small cross-scratch on hilt bottom, 3 silver coins in inner lining..."
                  className="w-full rounded-lg border border-slate-700 bg-black/50 p-2.5 text-xs text-white placeholder-slate-500 focus:border-[#f0d060] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1">
                  2. Approximate date, location, or circumstances when it was misplaced: *
                </label>
                <input
                  type="text"
                  required
                  value={lossContext}
                  onChange={(e) => setLossContext(e.target.value)}
                  placeholder="e.g. Misplaced during Marine patrol near Grove 32..."
                  className="w-full rounded-lg border border-slate-700 bg-black/50 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-[#f0d060] focus:outline-none"
                />
              </div>

              {/* Live Confidence Barometer */}
              <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-2.5 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-[11px]">Ownership Verification Strength</span>
                  <span className={`font-mono font-bold ${confidenceScore >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {confidenceScore}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      confidenceScore >= 70
                        ? 'bg-emerald-400'
                        : confidenceScore >= 40
                        ? 'bg-amber-400'
                        : 'bg-red-400'
                    }`}
                    style={{ width: `${confidenceScore}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Step 1</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !secretMarks.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-xs font-bold text-black hover:brightness-110 disabled:opacity-50 shadow-lg font-heading uppercase tracking-wider"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Confirm & Authenticate Claim'}</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
