import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { TreasureGroves } from '../components/TreasureGroves'
import { SelectedArtifacts } from '../components/SelectedArtifacts'
import { Chronicle } from '../components/Chronicle'
import { Footer } from '../components/Footer'
import { WorldMapModal } from '../components/WorldMapModal'
import { AuthModal } from '../components/AuthModal'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'

export function HomePage() {
  const [worldOpen, setWorldOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/browse?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchModalOpen(false)
    }
  }

  return (
    <div className="relative min-h-screen text-[#e2e8f0] flex flex-col overflow-x-hidden">
      {/* Top Navigation Bar */}
      <Navbar
        onWorldClick={() => setWorldOpen(true)}
        onSearchClick={() => setSearchModalOpen(true)}
      />

      {/* Hero Section (Thousand Sunny Sunset + Treasury Title + 2 Action Buttons) */}
      <main className="flex-1 flex flex-col">
        <Hero
          onBrowseClick={() => navigate('/browse')}
          onReportClick={() => navigate('/report')}
        />

        {/* Section 1: Treasure Groves (6 Location Cards in Landscape Row) */}
        <TreasureGroves />

        {/* Section 2: Selected Lost Artifacts (6 Iconic Treasures in Landscape Row) */}
        <SelectedArtifacts />

        {/* Section 3: The Chronicle of Lost & Found (5-Step Process Flow + Laugh Tale) */}
        <Chronicle />
      </main>

      {/* Footer Section (Parchment Chart, Jolly Roger Crest, All Navigation Links) */}
      <Footer onWorldClick={() => setWorldOpen(true)} />

      {/* WORLD MAP MODAL (Displaying First Image Map AS IS!) */}
      <WorldMapModal open={worldOpen} onClose={() => setWorldOpen(false)} />

      {/* Auth Modal if needed */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      {/* Quick Search Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-xl border border-[#d4a843] bg-gradient-to-b from-[#101b2d] to-[#070e1b] p-6 shadow-2xl text-[#e2e8f0]">
            <button
              type="button"
              onClick={() => setSearchModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-[Cinzel] text-xl font-bold text-[#f0d060] mb-2 flex items-center gap-2">
              <Search className="h-5 w-5" />
              Global Treasury Search
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Query lost weapons, devil fruit artifacts, hats, dials, and treasure registries across all four seas.
            </p>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                autoFocus
                type="text"
                placeholder="Search by name, island, or pirate captain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 rounded-lg border border-[#d4a843]/40 bg-black/60 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#f0d060]"
              />
              <button
                type="submit"
                className="rounded bg-gradient-to-r from-[#d4a843] to-[#b88a2e] px-4 py-2 text-xs font-bold text-black hover:brightness-110"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
