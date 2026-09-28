import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Compass, MapPin, X, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface GroveData {
  id: string
  name: string
  subtitle: string
  items: number
  img: string
  description: string
  notableItems: string[]
  dangerLevel: string
}

export const GROVES: GroveData[] = [
  {
    id: 'east_blue',
    name: 'EAST BLUE',
    subtitle: 'FIRST PATH',
    items: 247,
    img: '/extracted/grove_east_blue.jpg',
    description: 'The calmest of the four blues and the origin of legends. Countless artifacts from novice adventurers and pirate captains are cataloged across its serene harbors.',
    notableItems: ['Straw Hat token', "Zoro's Bandana", 'Orange Town Clock Key', 'Baratie Chef Knife'],
    dangerLevel: 'Peaceful / Low',
  },
  {
    id: 'alabasta',
    name: 'ALABASTA',
    subtitle: 'KINGDOM OF SAND',
    items: 198,
    img: '/extracted/grove_alabasta.jpg',
    description: 'An ancient desert empire spanning vast sun-scorched sands. Relics and precious stones lost in dust storms or palace vaults await discovery.',
    notableItems: ['Royal Cobra Seal', 'Desert Water Canteen', 'Dance Powder Residue', 'Crocodile Hook Fragment'],
    dangerLevel: 'Moderate / Harsh Sun',
  },
  {
    id: 'sky_island',
    name: 'SKY ISLAND',
    subtitle: "HEAVEN'S LANDS",
    items: 192,
    img: '/extracted/grove_sky_island.jpg',
    description: 'Suspended 10,000 meters above the sea in the White-White Sea. Cloud artifacts, dials, and golden relics from ancient Shandora.',
    notableItems: ['Flame Dial', 'Golden Bell Shard', 'Tone Dial Audio Log', 'Milky Sea Skate'],
    dangerLevel: 'Extreme / Thin Air',
  },
  {
    id: 'water_7',
    name: 'WATER 7',
    subtitle: 'CITY OF WATER',
    items: 76,
    img: '/extracted/grove_water_7.jpg',
    description: 'The water metropolis and greatest shipbuilding city in the world. Shipwright blueprints, canal lost baggage, and sea train cargo.',
    notableItems: ['Galley-La Blueprint', 'Sea Train Ticket', 'Cola Barrel', 'Franky Goggles'],
    dangerLevel: 'Moderate / Aqua Laguna',
  },
  {
    id: 'marineford',
    name: 'MARINEFORD',
    subtitle: 'SUMMIT WAR',
    items: 67,
    img: '/extracted/grove_marineford.jpg',
    description: 'Site of the historic Summit War that shook the Grand Line. Marine capes, officer swords, and battlefield treasures retrieved from the bay.',
    notableItems: ['Justice Marine Cape', 'Vice Admiral Den Den Mushi', 'Cannonball of the Bay', 'Whitebeard Flag Scrap'],
    dangerLevel: 'High / Marine Garrison',
  },
  {
    id: 'new_world',
    name: 'NEW WORLD',
    subtitle: 'THE FINAL SEA',
    items: 117,
    img: '/extracted/grove_new_world.jpg',
    description: 'The second half of the Grand Line where Emperors of the Sea clash. Extreme weather, mythical artifacts, and lost Road Poneglyph rubbings.',
    notableItems: ['Log Pose Needle (Tri)', 'Poneglyph Charcoal Rubbing', 'Kaido Sake Flask', 'Wano Cherry Blossom Brooch'],
    dangerLevel: 'Deadly / Emperor Territory',
  },
]

export interface TreasureGrovesProps {
  onSelectGrove?: (grove: GroveData) => void
}

export function TreasureGroves({ onSelectGrove }: TreasureGrovesProps) {
  const [selectedGrove, setSelectedGrove] = useState<GroveData | null>(null)
  const navigate = useNavigate()

  const handleCardClick = (grove: GroveData) => {
    if (onSelectGrove) {
      onSelectGrove(grove)
    } else {
      setSelectedGrove(grove)
    }
  }

  return (
    <section className="relative w-full py-6 px-4 md:px-8 bg-[#040810] text-center">
      <div className="mx-auto max-w-[1440px]">
        {/* Ornate Section Header */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-[1px] w-12 md:w-32 bg-gradient-to-r from-transparent to-[#d4a843]/60" />
          <span className="text-[#d4a843] text-sm">⚓</span>
          <h2 className="font-[Cinzel] text-base md:text-xl font-bold tracking-[0.25em] text-[#e8d5a5] uppercase">
            TREASURE GROVES
          </h2>
          <span className="text-[#d4a843] text-sm">⚓</span>
          <div className="h-[1px] w-12 md:w-32 bg-gradient-to-l from-transparent to-[#d4a843]/60" />
        </div>

        {/* 6 Grove Cards in Landscape Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 justify-items-center">
          {GROVES.map((grove) => (
            <div
              key={grove.id}
              onClick={() => handleCardClick(grove)}
              className="group relative cursor-pointer overflow-hidden rounded-md border border-[#d4a843]/30 bg-[#091220] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#f0d060] hover:shadow-[0_8px_25px_rgba(240,208,96,0.3)] w-full max-w-[180px]"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleCardClick(grove)
              }}
            >
              {/* Exact Card Artwork from Image */}
              <div className="aspect-[98/155] w-full overflow-hidden bg-black">
                <img
                  src={grove.img}
                  alt={`${grove.name} - ${grove.subtitle}`}
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

      {/* Modal for Grove Details */}
      <AnimatePresence>
        {selectedGrove && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-xl border border-[#d4a843] bg-gradient-to-b from-[#101b2d] to-[#070e1b] p-6 text-left shadow-2xl text-[#e2e8f0]"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedGrove(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex gap-4">
                <img
                  src={selectedGrove.img}
                  alt={selectedGrove.name}
                  className="w-28 rounded border border-[#d4a843]/40 object-cover shadow-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#f0d060] tracking-widest">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{selectedGrove.subtitle}</span>
                  </div>
                  <h3 className="font-[Cinzel] text-xl font-bold text-white mt-1">
                    {selectedGrove.name}
                  </h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    {selectedGrove.description}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[#d4a843]/20 pt-4 text-xs">
                <div className="rounded bg-black/40 p-2.5">
                  <span className="text-slate-400 block mb-1">Cataloged Treasures:</span>
                  <span className="font-bold text-[#f0d060] text-sm">
                    {selectedGrove.items} Artifacts
                  </span>
                </div>
                <div className="rounded bg-black/40 p-2.5">
                  <span className="text-slate-400 block mb-1">Sea Danger:</span>
                  <span className="font-bold text-amber-300 text-sm">
                    {selectedGrove.dangerLevel}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <span className="text-xs text-slate-400 font-semibold block mb-2">
                  Notable Items in Local Registry:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedGrove.notableItems.map((item) => (
                    <span
                      key={item}
                      className="rounded bg-[#d4a843]/10 border border-[#d4a843]/30 px-2 py-0.5 text-[11px] text-[#f0d060]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedGrove(null)}
                  className="rounded px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGrove(null)
                    navigate(`/browse?location=${selectedGrove.id}`)
                  }}
                  className="flex items-center gap-2 rounded bg-gradient-to-r from-[#d4a843] to-[#b88a2e] px-4 py-2 text-xs font-bold text-black hover:brightness-110"
                >
                  <Compass className="h-4 w-4" />
                  Explore Grove Items
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
