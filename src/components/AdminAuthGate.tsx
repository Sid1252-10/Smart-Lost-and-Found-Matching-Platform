import { useState, useEffect, type ReactNode, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, KeyRound, Lock, Eye, EyeOff, Radio, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

const ADMIN_STORAGE_KEY = 'grand_line_admin_auth_v1'

// Default accepted passcodes for demo and jury evaluations
const ACCEPTED_PASSCODES = [
  'marine2026',
  'sabaody2026',
  'fleetadmiral',
  'gorosei',
  ((import.meta as any).env?.VITE_ADMIN_PASSCODE as string) || ''
].filter(Boolean).map(p => p.toLowerCase())

interface AdminAuthGateProps {
  children: ReactNode
}

export function AdminAuthGate({ children }: AdminAuthGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'authorized'
  })
  const [passcode, setPasscode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  useEffect(() => {
    const isAuth = sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'authorized'
    setIsAuthenticated(isAuth)
  }, [])

  function handleUnlock(enteredCode: string) {
    setErrorMsg('')
    setIsAuthenticating(true)

    setTimeout(() => {
      const clean = enteredCode.trim().toLowerCase()
      if (ACCEPTED_PASSCODES.includes(clean)) {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, 'authorized')
        setIsAuthenticated(true)
      } else {
        setAttempts(prev => prev + 1)
        setErrorMsg('ACCESS DENIED: Invalid Marine Headquarters Fleet Admiral Security Code.')
      }
      setIsAuthenticating(false)
    }, 400)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!passcode) return
    handleUnlock(passcode)
  }

  function handleQuickBypass() {
    setPasscode('sabaody2026')
    handleUnlock('sabaody2026')
  }

  function handleLogout() {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY)
    setIsAuthenticated(false)
    setPasscode('')
    setErrorMsg('')
  }

  if (isAuthenticated) {
    return (
      <div className="relative">
        {/* Active Admin Session Status Bar */}
        <div className="bg-gradient-to-r from-emerald-950 via-[#0a1b15] to-[#060b14] border-b border-emerald-500/30 px-4 py-1.5 text-xs text-emerald-300 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white tracking-wider">SECURE ADMIRAL CLEARANCE:</span>
            <span>CIPHER POL AIGIS 0 — ACTIVE</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded bg-red-950/60 border border-red-500/40 px-2.5 py-0.5 text-[11px] font-semibold text-red-200 hover:bg-red-900 hover:text-white transition"
          >
            <Lock className="w-3 h-3" />
            <span>Lock Admin Desk</span>
          </button>
        </div>

        {children}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#060b14] text-[#e2e8f0] flex flex-col font-body">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md rounded-2xl border-2 border-red-500/30 bg-gradient-to-b from-[#101726] to-[#080d17] p-7 shadow-2xl shadow-black/80 relative overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Radar / Security Scanner Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="font-mono text-[10px] tracking-widest text-red-400 uppercase font-semibold">
                RESTRICTED ZONE // GROVE 66 HQ
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-black/40 px-2 py-0.5 rounded border border-slate-800">
              LEVEL 5 BUSTER CLEARANCE
            </span>
          </div>

          {/* Central Emblem & Title */}
          <div className="text-center my-6">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-950/80 to-[#120a0a] border-2 border-red-500/40 text-red-400 shadow-lg shadow-red-950/50">
              <ShieldAlert className="h-8 w-8 text-red-400" />
            </div>

            <h1 className="font-heading text-2xl font-bold tracking-wide text-white">
              Fleet Admiral Security Gate
            </h1>
            <p className="mt-1 text-xs text-slate-400">
              Enter your World Government authorization key to access live claims, registry moderation, and database analytics.
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-200"
              >
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Authorization Passphrase</span>
                <span className="text-[10px] text-amber-400 font-mono">Encrypted</span>
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <KeyRound className="h-4 w-4 text-[#f0d060]" />
                </div>

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Admiral Passcode..."
                  autoFocus
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:border-[#f0d060] focus:outline-none focus:ring-1 focus:ring-[#f0d060] transition font-mono tracking-wider"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-yellow-600 py-3 text-xs font-bold text-white hover:brightness-110 shadow-lg shadow-red-950/50 transition active:scale-98 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isAuthenticating ? 'Decrypting Security Cipher...' : 'Authorize Admiral Access'}</span>
            </button>
          </form>

          {/* Quick Demo Bypass (For Evaluators & Hackathon Jury) */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="text-[11px] text-slate-400 mb-2">
              Evaluating or testing the platform?
            </p>

            <button
              type="button"
              onClick={handleQuickBypass}
              className="w-full flex items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-semibold text-[#f0d060] hover:bg-amber-500/20 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>One-Click Jury Evaluation Access (`sabaody2026`)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            
            <p className="mt-2 text-[10px] text-slate-500 font-mono">
              Accepted keys: <code className="text-slate-400">sabaody2026</code> · <code className="text-slate-400">marine2026</code>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
