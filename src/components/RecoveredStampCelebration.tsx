import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Award, CheckCircle } from 'lucide-react'
import { fireTreasureConfetti, playConfettiAudio } from '../lib/confetti'

export interface RecoveredCelebrationState {
  isOpen: boolean
  title: string
}

interface RecoveredStampCelebrationProps {
  state: RecoveredCelebrationState
  onClose: () => void
}

/**
 * Triggers full confetti cannon burst and celebratory audio
 */
export function celebrateRecovery() {
  playConfettiAudio()
  fireTreasureConfetti()
}

export function RecoveredStampCelebration({ state, onClose }: RecoveredStampCelebrationProps) {
  useEffect(() => {
    if (state.isOpen) {
      celebrateRecovery()
    }
  }, [state.isOpen])

  if (!state.isOpen) return null


  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 pointer-events-auto cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 3, rotate: -25, opacity: 0 }}
          animate={{ scale: 1, rotate: -6, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 14, stiffness: 220 }}
          className="relative max-w-md w-full rounded-3xl border-4 border-emerald-400 bg-gradient-to-b from-[#0a2318] to-[#04130d] p-8 text-center shadow-[0_0_50px_rgba(16,185,129,0.5)] select-none"
        >
          {/* Circular Stamp Border Inside */}
          <div className="rounded-2xl border-2 border-dashed border-emerald-400/60 p-6 relative">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 mb-3 shadow-[0_0_20px_rgba(52,211,153,0.4)]">
              <Award className="h-8 w-8 text-emerald-300 animate-pulse" />
            </div>

            <div className="font-heading uppercase tracking-widest text-[11px] text-emerald-300/80 mb-1">
              GRAND LINE ARCHIPELAGO REGISTRY
            </div>

            <h2 className="font-pirate text-3xl sm:text-4xl font-extrabold text-emerald-300 tracking-wider drop-shadow-md">
              OFFICIALLY RECOVERED!
            </h2>

            <p className="font-heading text-sm text-white font-bold mt-2 truncate">
              {state.title}
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-emerald-200/90 font-mono">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>REUNITED WITH RIGHTFUL CAPTAIN</span>
            </div>

            <div className="mt-5 inline-block rounded-full bg-emerald-500/20 border border-emerald-400/50 px-4 py-1 text-[11px] text-emerald-300 font-semibold tracking-wide">
              Click anywhere to dismiss
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
