import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ShieldCheck, Sparkles, X, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface ArtifactData {
  id: string
  name: string
  subtitle: string
  img: string
  owner: string
  bounty: string
  description: string
  lore: string
  status: 'Lost in Sea' | 'Spotted at Island' | 'Under Claim Verification'
  location: string
}

export const ARTIFACTS: ArtifactData[] = [
  {
    id: 'straw_hat',
    name: 'STRAW HAT',
    subtitle: "CAPTAIN'S TREASURE",
    img: '/extracted/art_straw_hat.jpg',
    owner: 'Monkey D. Luffy (Passed from Shanks & Gol D. Roger)',
    bounty: '3,000,000,000 Berries',
    description: 'Woven straw with red ribbon. Holds endless sentimental value and the promise between friends to become the King of the Pirates.',
    lore: 'Given to Luffy by Red-Haired Shanks at Windmill Village. The straw hat has traveled through every sea, endured lightning, swords, and war, embodying the spirit of dawn.',
    status: 'Lost in Sea',
    location: 'Sabaody Archipelago / Thousand Sunny',
  },
  {
    id: 'wado_ichimonji',
    name: 'WADO ICHIMONJI',
    subtitle: "SWORDSMAN'S OATH",
    img: '/extracted/art_wado_ichimonji.jpg',
    owner: 'Roronoa Zoro (Heir of Kuina & Shimotsuki Kozaburo)',
    bounty: '1,111,000,000 Berries',
    description: "A legendary Meito of the 21 Great Grade Swords. Part of Zoro's soul and his eternal pledge to become the World's Greatest Swordsman.",
    lore: 'Crafted by legendary master swordsmith Shimotsuki Kozaburo. Featuring a pure white scabbard and circular tsuba, its razor edge can cleanly part steel and ship hulls.',
    status: 'Spotted at Island',
    location: 'Wano Kuni / Ringo Graves',
  },
  {
    id: 'clima_tact',
    name: 'CLIMA-TACT',
    subtitle: "NAVIGATOR'S TOOL",
    img: '/extracted/art_clima_tact.jpg',
    owner: 'Nami (The Cat Burglar)',
    bounty: '366,000,000 Berries',
    description: "Nami's signature weather weapon engineered by Usopp and enhanced with Weatheria sorcery science.",
    lore: 'A triple-staff capable of creating Heat Balls, Cool Balls, and Electric Thunder Tempo. In the right hands, it commands storm fronts, illusions, and cyclones across the ocean.',
    status: 'Lost in Sea',
    location: 'Weatheria Sky Route',
  },
  {
    id: 'slingshot',
    name: "KUFFY'S JOURNEY BEGINS",
    subtitle: 'SNIPER WEAPON',
    img: '/extracted/art_slingshot.jpg',
    owner: 'God Usopp (Sniper King)',
    bounty: '500,000,000 Berries',
    description: "Usopp's powerful slingshot with special pouch attachment and dialed ammunition chamber.",
    lore: 'Originating from Syrup Village and modified through every battle, this slingshot launched fire stars, smoke balls, and Pop Greens that saved crewmates across the Grand Line.',
    status: 'Under Claim Verification',
    location: 'Green Bit / Tontatta Kingdom',
  },
  {
    id: 'golden_lighter',
    name: 'GOLDEN LIGHTER',
    subtitle: "COOK'S PRIDE",
    img: '/extracted/art_golden_lighter.jpg',
    owner: 'Vinsmoke Sanji (Stealth Black / Cook)',
    bounty: '1,032,000,000 Berries',
    description: 'Engraved and beloved golden lighter of Sanji, bearing intricate French vintage filigree.',
    lore: 'Ignited through pouring rain, volcanic ash, and blazing battles to light cigarettes and spark the Diable Jambe flames of passion.',
    status: 'Spotted at Island',
    location: 'Baratie Ocean Restaurant',
  },
  {
    id: 'rumble_balls',
    name: 'RUMBLE BALLS',
    subtitle: "DOCTOR'S EXPERIMENT",
    img: '/extracted/art_rumble_balls.jpg',
    owner: 'Tony Tony Chopper (Cotton Candy Lover)',
    bounty: '1,000 Berries',
    description: "Vital yellow medicinal spheres for Chopper's various Zoan devil fruit point transformations.",
    lore: 'Invented through rigorous medical pharmacology on Drum Island. Temporarily disrupts Devil Fruit transformation wavelengths to unlock Heavy Point, Guard Point, Kung-Fu Point, and Monster Point.',
    status: 'Lost in Sea',
    location: 'Torino Kingdom Botanical Reserve',
  },
]

export interface SelectedArtifactsProps {
  onSelectArtifact?: (art: ArtifactData) => void
}

export function SelectedArtifacts({ onSelectArtifact }: SelectedArtifactsProps) {
  const [selectedArt, setSelectedArt] = useState<ArtifactData | null>(null)
  const navigate = useNavigate()

  const handleCardClick = (art: ArtifactData) => {
    if (onSelectArtifact) {
      onSelectArtifact(art)
    } else {
      setSelectedArt(art)
    }
  }

  return (
    <section className="relative w-full py-6 px-4 md:px-8 text-center" style={{ background: 'rgba(2,8,18,0.45)' }}>
      <div className="mx-auto max-w-[1440px]">
        {/* Ornate Section Header */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-[1px] w-12 md:w-32 bg-gradient-to-r from-transparent to-[#d4a843]/60" />
          <span className="text-[#d4a843] text-sm">⚓</span>
          <h2 className="font-pirate text-2xl md:text-3xl font-bold tracking-[0.2em] text-[#f0d060] uppercase drop-shadow-[0_2px_10px_rgba(212,168,67,0.3)]">
            SELECTED LOST ARTIFACTS
          </h2>
          <span className="text-[#d4a843] text-sm">⚓</span>
          <div className="h-[1px] w-12 md:w-32 bg-gradient-to-l from-transparent to-[#d4a843]/60" />
        </div>

        {/* 6 Artifact Cards in Landscape Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 justify-items-center">
          {ARTIFACTS.map((art) => (
            <div
              key={art.id}
              onClick={() => handleCardClick(art)}
              className="group relative cursor-pointer overflow-hidden rounded-md border border-[#d4a843]/30 bg-[#091220]/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#f0d060] hover:shadow-[0_8px_25px_rgba(240,208,96,0.3)] w-full max-w-[180px]"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleCardClick(art)
              }}
            >
              {/* Exact Card Artwork from Image */}
              <div className="aspect-[98/136] w-full overflow-hidden" style={{ background: 'rgba(5,15,30,0.7)' }}>
                <img
                  src={art.img}
                  alt={`${art.name} - ${art.subtitle}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Hover Highlight Ring */}
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#d4a843]/20 group-hover:ring-[#f0d060]/70" />
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Artifact Details */}
      <AnimatePresence>
        {selectedArt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-xl border border-[#d4a843] bg-gradient-to-b from-[#141b26] to-[#070e17] p-6 text-left shadow-2xl text-[#e2e8f0]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedArt(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex gap-4">
                <img
                  src={selectedArt.img}
                  alt={selectedArt.name}
                  className="w-28 rounded border border-[#d4a843]/40 object-cover shadow-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f0d060] tracking-widest">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{selectedArt.subtitle}</span>
                  </div>
                  <h3 className="font-[Cinzel] text-xl font-bold text-white mt-1">
                    {selectedArt.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    {selectedArt.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded bg-black/40 p-3 text-xs leading-relaxed text-slate-300 border border-[#d4a843]/15">
                <p className="italic text-[#e8d5a5]">{selectedArt.lore}</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#d4a843]/20 pt-4 text-xs">
                <div className="rounded bg-black/40 p-2.5">
                  <span className="text-slate-400 flex items-center gap-1 mb-1">
                    <User className="h-3.5 w-3.5" /> Rightful Owner:
                  </span>
                  <span className="font-semibold text-white block">
                    {selectedArt.owner}
                  </span>
                </div>
                <div className="rounded bg-black/40 p-2.5">
                  <span className="text-slate-400 block mb-1">Bounty Value:</span>
                  <span className="font-bold text-[#f0d060] text-sm">
                    {selectedArt.bounty}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedArt(null)}
                  className="rounded px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedArt(null)
                    navigate(`/claiming?artifact=${selectedArt.id}`)
                  }}
                  className="flex items-center gap-2 rounded bg-gradient-to-r from-[#d4a843] to-[#b88a2e] px-4 py-2 text-xs font-bold text-black hover:brightness-110 shadow-lg"
                >
                  <ShieldCheck className="h-4 w-4" />
                  Initiate Reclaim Claim
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
