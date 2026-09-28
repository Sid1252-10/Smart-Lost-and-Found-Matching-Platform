import { Menu, Search, X, PlusCircle, Compass, Sparkles, ShieldCheck, Map, Shield, ArrowRight } from 'lucide-react'
import { useState, useEffect, useRef, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useRegistry } from '../context/RegistryContext'
import { canonicalCategory } from '../lib/categories'

export interface NavbarProps {
  onAuthClick?: () => void
  onWorldClick?: () => void
  onSearchClick?: () => void
}

const links = [
  { to: '/browse', label: 'TREASURE LEDGER', icon: Compass },
  { to: '/report', label: 'REPORT AN ITEM', icon: PlusCircle },
  { to: '/treasury', label: 'SMART MATCHING', icon: Sparkles },
  { to: '/claiming', label: 'CLAIM DESK', icon: ShieldCheck },
  { to: '/world', label: 'WORLD MAP', icon: Map },
  { to: '/admin', label: 'ADMIN DESK', icon: Shield },
]

export function Navbar({ onWorldClick, onSearchClick }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { items } = useRegistry()

  // Open on Ctrl+K / Cmd+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSearchModalOpen(true)
      } else if (e.key === 'Escape') {
        setSearchModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [searchModalOpen])

  // Instant live search results
  const liveResults = searchQuery.trim()
    ? items
        .filter((item) => {
          const q = searchQuery.toLowerCase()
          return (
            item.title?.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q) ||
            item.location?.toLowerCase().includes(q) ||
            canonicalCategory(item.category).toLowerCase().includes(q)
          )
        })
        .slice(0, 6)
    : []

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchModalOpen(false)
      setSearchQuery('')
    }
  }

  function handleItemClick(itemId: string) {
    navigate(`/browse?q=${encodeURIComponent(searchQuery.trim() || '')}&item=${itemId}`)
    setSearchModalOpen(false)
    setSearchQuery('')
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#070e1b]/95 backdrop-blur-md border-b border-[#d4a843]/25 shadow-[0_4px_25px_rgba(0,0,0,0.7)] font-body">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-2.5 md:px-8">
          {/* One Piece Logo + Home anchor */}
          <Link
            to="/"
            className="flex items-center gap-3 transition-transform hover:scale-105 group"
            title="Return to Grand Line Home"
          >
            <img
              src="/extracted/logo.png"
              alt="ONE PIECE"
              className="h-8 md:h-10 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(212,168,67,0.4)]"
            />
            <div className="hidden sm:flex flex-col">
              <span className="font-pirate text-sm md:text-base text-[#f0d060] tracking-wider leading-none">
                Lost & Found
              </span>
              <span className="text-[9px] text-slate-400 tracking-widest uppercase">
                Sabaody Registry
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-6 text-[12px] font-semibold tracking-[0.2em] text-[#d6dbe4] lg:flex">
            {links.map((link) => {
              if (link.to === '/world' && onWorldClick) {
                return (
                  <button
                    key={link.to}
                    type="button"
                    onClick={onWorldClick}
                    className="transition-colors duration-200 hover:text-[#f0d060] uppercase text-[#d6dbe4] tracking-[0.2em] py-1"
                  >
                    {link.label}
                  </button>
                )
              }
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative py-1.5 transition-all duration-200 uppercase tracking-[0.2em] ${
                      isActive
                        ? 'text-[#f0d060] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-gradient-to-r after:from-transparent after:via-[#f0d060] after:to-transparent'
                        : 'text-slate-300 hover:text-[#f0d060]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              )
            })}
          </nav>

          {/* Right Actions: ONLY Search (removed duplicate Report button) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onSearchClick) onSearchClick()
                else setSearchModalOpen(true)
              }}
              className="flex items-center gap-2 rounded-lg border border-[#d4a843]/40 bg-black/40 px-3 py-1.5 text-[12px] font-semibold tracking-[0.2em] text-[#f0d060] hover:bg-[#d4a843]/20 hover:border-[#f0d060] transition-all shadow-sm"
              title="Search Registry (Ctrl+K)"
            >
              <Search className="h-4 w-4 text-[#f0d060]" />
              <span>SEARCH</span>
              <kbd className="hidden md:inline-block rounded bg-black/60 border border-slate-700 px-1.5 py-0.2 text-[9px] text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="rounded-lg border border-[#d4a843]/30 p-1.5 text-[#d4a843] lg:hidden hover:bg-white/5 transition-colors"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-[#f0d060]" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {open && (
          <div className="absolute left-0 right-0 top-full z-40 border-t border-[#d4a843]/20 bg-[#070e1b]/98 backdrop-blur-xl lg:hidden shadow-2xl">
            <div className="flex flex-col gap-1 p-4">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setSearchModalOpen(true)
                }}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#d4a843]/40 bg-[#d4a843]/15 py-2.5 text-xs font-bold text-[#f0d060] mb-2"
              >
                <Search className="h-4 w-4" />
                <span>Quick Search Treasures</span>
              </button>

              {links.map((link) => {
                const Icon = link.icon
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-4 py-3 text-xs font-semibold tracking-[0.2em] transition-colors ${
                        isActive
                          ? 'bg-[#d4a843]/20 text-[#f0d060] border-l-4 border-[#f0d060]'
                          : 'text-slate-200 hover:bg-white/5'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 text-[#f0d060]" />
                    <span>{link.label}</span>
                  </NavLink>
                )
              })}
            </div>
          </div>
        )}
      </header>

      {/* Universal Search Modal (Available on every page) */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-2xl border border-[#d4a843] bg-gradient-to-b from-[#0f1b2e] to-[#070e1b] p-6 shadow-2xl text-[#e2e8f0] font-body">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-[#f0d060]" />
                <h3 className="font-heading text-lg font-bold text-white tracking-wide">
                  Global Treasury Registry Search
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSearchModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lost blades, straw hats, log poses, devil fruits..."
                className="w-full rounded-xl border border-[#d4a843]/50 bg-black/70 pl-11 pr-24 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#f0d060] focus:ring-1 focus:ring-[#f0d060]"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#f0d060]" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-gradient-to-r from-[#d4a843] to-[#b88a2e] px-4 py-1.5 text-xs font-bold text-black hover:brightness-110 shadow"
              >
                Search
              </button>
            </form>

            {/* Instant Live Results */}
            {searchQuery.trim() && (
              <div className="mb-4">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Direct Registry Matches ({liveResults.length})</span>
                  <span className="text-[10px] text-slate-500">Click to view in ledger</span>
                </div>

                {liveResults.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {liveResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3 hover:border-[#d4a843]/60 hover:bg-[#132238] transition cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                              item.kind === 'lost'
                                ? 'bg-red-950 border border-red-500/50 text-red-300'
                                : 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                            }`}
                          >
                            {item.kind}
                          </span>
                          <div>
                            <p className="font-semibold text-sm text-white hover:text-[#f0d060]">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {canonicalCategory(item.category)} • 📍 {item.location}
                            </p>
                          </div>
                        </div>

                        <ArrowRight className="h-4 w-4 text-slate-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-slate-800 bg-black/40 p-4 text-center text-xs text-slate-400 italic">
                    No immediate match found for “{searchQuery}”. Press Enter to search all archives.
                  </div>
                )}
              </div>
            )}

            {/* Footer with hint */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
              <span className="text-[11px]">
                Tip: Filter by island or grove directly on the{' '}
                <Link
                  to="/browse"
                  onClick={() => setSearchModalOpen(false)}
                  className="text-[#f0d060] underline"
                >
                  Treasure Ledger Map
                </Link>
              </span>
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="text-[#f0d060] hover:underline font-semibold"
              >
                View Full Search Results →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
