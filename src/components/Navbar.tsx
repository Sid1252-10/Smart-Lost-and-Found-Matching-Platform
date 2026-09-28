import { Menu, Search, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'

export interface NavbarProps {
  onAuthClick?: () => void
  onWorldClick?: () => void
  onSearchClick?: () => void
}

const links = [
  { to: '/browse', label: 'TREASURE LEDGER' },
  { to: '/report', label: 'REPORT AN ITEM' },
  { to: '/treasury', label: 'SMART MATCHING' },
  { to: '/claiming', label: 'CLAIM DESK' },
  { to: '/world', label: 'WORLD MAP' },
  { to: '/admin', label: 'ADMIN DESK' },
]

export function Navbar({ onWorldClick, onSearchClick }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-[#070e1b]/95 backdrop-blur-md border-b border-[#d4a843]/20 shadow-lg">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-2.5 md:px-8">
        {/* One Piece Logo */}
        <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105">
          <img
            src="/extracted/logo.png"
            alt="ONE PIECE"
            className="h-8 md:h-10 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(212,168,67,0.3)]"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-7 text-[12px] font-semibold tracking-[0.22em] text-[#d6dbe4] lg:flex">
          {links.map((link) => {
            if (link.to === '/world' && onWorldClick) {
              return (
                <button
                  key={link.to}
                  type="button"
                  onClick={onWorldClick}
                  className="transition-colors duration-200 hover:text-[#f0d060] uppercase text-[#d6dbe4] tracking-[0.22em]"
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
                  `transition-colors duration-200 hover:text-[#f0d060] ${
                    isActive ? 'text-[#f0d060] border-b border-[#f0d060]/50 pb-0.5' : ''
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Search */}
        <div className="flex items-center gap-3">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lost treasures..."
                className="search-input w-48 text-xs py-1.5 px-3"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (onSearchClick) onSearchClick()
                else setSearchOpen(true)
              }}
              className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.22em] text-[#d6dbe4] transition-colors hover:text-[#f0d060]"
            >
              SEARCH
              <Search className="h-4 w-4 text-[#f0d060]" />
            </button>
          )}

          {/* Mobile toggle */}
          <button
            type="button"
            className="rounded-md border border-[#d4a843]/30 p-1.5 text-[#d4a843] lg:hidden hover:bg-white/5"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="absolute left-0 right-0 top-full z-40 border-t border-[#d4a843]/20 bg-[#070e1b]/98 backdrop-blur-xl lg:hidden shadow-2xl">
          <div className="flex flex-col gap-1 p-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-xs font-semibold tracking-[0.2em] transition-colors ${
                    isActive ? 'bg-[#d4a843]/15 text-[#f0d060]' : 'text-slate-200 hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
