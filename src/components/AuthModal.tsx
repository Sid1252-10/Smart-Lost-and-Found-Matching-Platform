import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

type AuthModalProps = {
  open: boolean
  onClose: () => void
}

export function AuthModal({ open, onClose }: AuthModalProps) {
  const { login } = useAuth()
  const [name, setName] = useState('Monkey D. Luffy')
  const [crew, setCrew] = useState('Straw Hat Pirates')

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className="glass-panel w-full max-w-md rounded-2xl p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-3xl text-white">Join the Registry</h3>
              <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400"
                placeholder="Pirate name"
              />
              <input
                value={crew}
                onChange={(e) => setCrew(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-sm outline-none focus:border-emerald-400"
                placeholder="Crew"
              />
              <button
                type="button"
                onClick={() => {
                  login({ name: name || 'Wanderer', crew: crew || 'Independent' })
                  onClose()
                }}
                className="w-full rounded-full bg-emerald-500 py-3 text-sm font-semibold text-slate-950"
              >
                LOGIN / SIGN UP
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
