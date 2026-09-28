import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { TreasureGroves } from '../components/TreasureGroves'
import { SelectedArtifacts } from '../components/SelectedArtifacts'
import { Chronicle } from '../components/Chronicle'
import { Footer } from '../components/Footer'
import { WorldMapModal } from '../components/WorldMapModal'
import { AuthModal } from '../components/AuthModal'

export function HomePage() {
  const [worldOpen, setWorldOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen text-[#e2e8f0] flex flex-col overflow-x-hidden font-body">
      {/* Top Navigation Bar with Universal Search */}
      <Navbar onWorldClick={() => setWorldOpen(true)} />

      {/* Hero Section (Thousand Sunny Sunset + Treasury Title + Action Buttons) */}
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

      {/* WORLD MAP MODAL */}
      <WorldMapModal open={worldOpen} onClose={() => setWorldOpen(false)} />

      {/* Auth Modal if needed */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}
