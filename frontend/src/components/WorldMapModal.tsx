import { useState, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ZoomOut, RotateCcw, MapPin, Compass, Eye, EyeOff } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface IslandIncident {
  id: string
  name: string
  xPercent: number // Coordinates on the map image
  yPercent: number
  lore: string
  itemsLogged: number
  keyIncidents: string
  ruler: string
}

export const MAP_INCIDENTS: IslandIncident[] = [
  {
    id: 'reverse_mountain',
    name: 'Reverse Mountain',
    xPercent: 8.5,
    yPercent: 51.0,
    lore: 'The entrance to the Grand Line where currents from the four blues climb up and meet at the crest before plunging down the Starting Canal into Paradise.',
    itemsLogged: 42,
    keyIncidents: 'Straw Hat encounter with Laboon and Crocus at the Twin Capes.',
    ruler: 'Natural Wonder / Twin Capes Lighthouse',
  },
  {
    id: 'whiskey_peak',
    name: 'Whiskey Peak',
    xPercent: 20.0,
    yPercent: 49.0,
    lore: 'A cactus-shaped island town that welcomes pirates with lavish hospitality only to ambush them as Baroque Works bounty hunters.',
    itemsLogged: 31,
    keyIncidents: 'Zoro defeated 100 Baroque Works bounty hunters in one night.',
    ruler: 'Baroque Works Frontier Agents',
  },
  {
    id: 'little_garden',
    name: 'Little Garden',
    xPercent: 28.5,
    yPercent: 49.5,
    lore: 'A prehistoric island stuck in the dinosaur era where giant duelists Dorry and Brogy have fought for over a century for pride of Elbaf.',
    itemsLogged: 24,
    keyIncidents: 'Clash with Mr. 3, Candle Champions, and the Giant goldfish Island Eater.',
    ruler: 'Giants Dorry & Brogy (Elbaf)',
  },
  {
    id: 'drum_island',
    name: 'Drum Island',
    xPercent: 39.5,
    yPercent: 37.0,
    lore: 'A winter island with drum-shaped mountains. Home of Chopper and the pink cherry blossom miracle created by Dr. Hiriluk.',
    itemsLogged: 53,
    keyIncidents: 'Defeat of tyrant Wapol; Chopper joins the Straw Hat crew.',
    ruler: 'Dalton / Sakura Kingdom',
  },
  {
    id: 'alabasta',
    name: 'Alabasta Kingdom',
    xPercent: 46.5,
    yPercent: 65.0,
    lore: 'Vast desert kingdom including Alabarna, Rainbase, and Yuba. Holds an ancient Poneglyph concealing Pluton the ancient weapon.',
    itemsLogged: 198,
    keyIncidents: 'Defeat of Warlord Crocodile; Princess Vivi bids farewell with the X mark.',
    ruler: 'Nefertari Dynasty (King Cobra & Vivi)',
  },
  {
    id: 'jaya',
    name: 'Jaya',
    xPercent: 52.0,
    yPercent: 45.0,
    lore: 'The pirate haven town of Mock Town, formerly half of the ancient golden island blasted into the clouds by the Knock Up Stream.',
    itemsLogged: 64,
    keyIncidents: 'Luffy one-punches Bellamy; Blackbeard proclaims "People\'s dreams never end!".',
    ruler: 'Lawless Pirate Haven / Bellamy Pirates',
  },
  {
    id: 'skypiea',
    name: 'Skypiea (Sky Island)',
    xPercent: 61.5,
    yPercent: 21.0,
    lore: 'Located 10,000 meters above the sea in the White-White Sea. Encompasses Angel Island, Upper Yard, Giant Jack, and the Shandora Golden Bell.',
    itemsLogged: 192,
    keyIncidents: 'Luffy defeats God Enel and rings the Golden Bell to fulfill the 400-year promise.',
    ruler: 'Gan Fall (God of Skypiea)',
  },
  {
    id: 'long_ring',
    name: 'Long Ring Long Land',
    xPercent: 61.0,
    yPercent: 56.0,
    lore: 'An archipelago of elongated islands where every plant and animal is extraordinarily stretched out. Location of the Davy Back Fight.',
    itemsLogged: 38,
    keyIncidents: 'Davy Back Fight vs Foxy Pirates; First encounter with Admiral Aokiji.',
    ruler: 'Nomadic Steppe Nomads / Tonjit',
  },
  {
    id: 'water_7',
    name: 'Water 7',
    xPercent: 72.0,
    yPercent: 49.5,
    lore: 'The metropolis of water built atop sunken foundations. Centers around Galley-La shipwrights, Yagara bulls, and the Puffing Tom Sea Train network.',
    itemsLogged: 76,
    keyIncidents: 'Going Merry farewell; Franky builds the Thousand Sunny; CP9 conspiracy.',
    ruler: 'Mayor Iceburg / Galley-La Co.',
  },
  {
    id: 'enies_lobby',
    name: 'Enies Lobby',
    xPercent: 80.5,
    yPercent: 50.5,
    lore: 'The World Government judicial stronghold suspended over an immense bottomless waterfall pit connected to the Tarai Current.',
    itemsLogged: 55,
    keyIncidents: 'Straw Hats declare war on the World Government; Robin screams "I WANT TO LIVE!"; Buster Call annihilation.',
    ruler: 'World Government Justice Department',
  },
  {
    id: 'thriller_bark',
    name: 'Thriller Bark',
    xPercent: 67.5,
    yPercent: 74.0,
    lore: 'The world\'s largest pirate ship masquerading as an island drifting through the fog-shrouded Florian Triangle.',
    itemsLogged: 82,
    keyIncidents: 'Defeat of Warlord Gecko Moria; Zoro takes all of Luffy\'s pain ("Nothing happened").',
    ruler: 'Gecko Moria (Former Warlord)',
  },
  {
    id: 'sabaody',
    name: 'Sabaody Archipelago',
    xPercent: 90.0,
    yPercent: 52.0,
    lore: 'A grove of 79 giant Yarukiman Mangrove trees producing resilient bubbles. Gateway for coating ships to dive into Fish-Man Island.',
    itemsLogged: 120,
    keyIncidents: 'Celestial Dragon punched; Bartholomew Kuma scatters the Straw Hats for 2 years.',
    ruler: 'World Nobles & Marine Outposts',
  },
  {
    id: 'red_line',
    name: 'Red Line & Fish-Man Descent',
    xPercent: 97.0,
    yPercent: 54.0,
    lore: 'The monolithic continent separating the hemispheres. Beneath lies the 10,000-meter oceanic trench leading to Fish-Man Island.',
    itemsLogged: 60,
    keyIncidents: 'Descent into deep sea monsters and underwater trench.',
    ruler: 'Red Line / World Government Holy Land Mary Geoise',
  },
]

export interface WorldMapModalProps {
  open: boolean
  onClose: () => void
}

export function WorldMapModal({ open, onClose }: WorldMapModalProps) {
  const [scale, setScale] = useState(1)
  const [showPins, setShowPins] = useState(true)
  const [selectedIncident, setSelectedIncident] = useState<IslandIncident | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  if (!open) return null

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 2.5))
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.75))
  const handleReset = () => setScale(1)

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050912]/95 backdrop-blur-md">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[#d4a843]/30 bg-[#070e1b] px-4 py-3 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d4a843]/15 border border-[#d4a843]/40">
            <Compass className="h-5 w-5 text-[#f0d060] animate-spin-slow" />
          </div>
          <div>
            <h2 className="font-[Cinzel] text-sm md:text-lg font-bold tracking-widest text-[#f0d060]">
              GRAND LINE: PARADISE SECTION
            </h2>
            <p className="text-[11px] text-slate-400">
              A Detailed Survey of Kingdoms & Incidents — Complete Navigational Chart
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Toggle Pins */}
          <button
            type="button"
            onClick={() => setShowPins((v) => !v)}
            className="flex items-center gap-1.5 rounded border border-[#d4a843]/30 bg-black/40 px-3 py-1.5 text-xs font-semibold text-[#e8d5a5] hover:border-[#f0d060] transition-colors"
            title={showPins ? 'Hide Interactive Markers' : 'Show Interactive Markers'}
          >
            {showPins ? <Eye className="h-3.5 w-3.5 text-[#f0d060]" /> : <EyeOff className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{showPins ? 'Markers On' : 'Map Only'}</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center rounded border border-[#d4a843]/30 bg-black/40">
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 text-slate-300 hover:text-[#f0d060]"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <div className="h-4 w-[1px] bg-[#d4a843]/20" />
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 text-slate-300 hover:text-[#f0d060]"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <div className="h-4 w-[1px] bg-[#d4a843]/20" />
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 text-slate-300 hover:text-[#f0d060]"
              title="Reset Zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-[#d4a843]/40 p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
            aria-label="Close World Map"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Map Viewer Area */}
      <div
        ref={mapContainerRef}
        className="relative flex-1 overflow-auto bg-[#1a140c] flex items-center justify-center p-2 sm:p-4"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out',
          }}
          className="relative max-w-[1400px] w-full rounded shadow-2xl overflow-hidden border-2 border-[#8a602a]"
        >
          {/* THE FIRST IMAGE AS IS: EXACT PARADISE SURVEY MAP */}
          <img
            src="/grand_line_map.jpg"
            alt="A Detailed Survey of Grand Line: Paradise Section (The Kingdoms & Incidents)"
            className="w-full h-auto block select-none pointer-events-none"
          />

          {/* Optional Interactive Hotspots overlay (precisely located on each island) */}
          {showPins &&
            MAP_INCIDENTS.map((inc) => (
              <button
                key={inc.id}
                type="button"
                style={{
                  position: 'absolute',
                  left: `${inc.xPercent}%`,
                  top: `${inc.yPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => setSelectedIncident(inc)}
                className="group z-10 flex items-center justify-center focus:outline-none"
                title={`${inc.name} — Click to inspect`}
              >
                {/* Glowing Pulse Ring */}
                <span className="absolute inline-flex h-7 w-7 animate-ping rounded-full bg-[#f0d060] opacity-40 group-hover:opacity-75" />
                {/* Marker Pin Icon */}
                <span className="relative flex h-5 w-5 items-center justify-center rounded-full border border-[#f0d060] bg-[#1a1005] shadow-[0_0_10px_rgba(240,208,96,0.8)] transition-transform group-hover:scale-125">
                  <MapPin className="h-3 w-3 text-[#f0d060]" />
                </span>
                {/* Tooltip on hover */}
                <span className="pointer-events-none absolute bottom-full mb-1.5 hidden whitespace-nowrap rounded bg-black/90 px-2 py-0.5 text-[10px] font-bold tracking-wider text-[#f0d060] border border-[#d4a843]/50 group-hover:block shadow-lg">
                  {inc.name} ({inc.itemsLogged} items)
                </span>
              </button>
            ))}
        </div>
      </div>

      {/* Island Detail Drawer Modal */}
      <AnimatePresence>
        {selectedIncident && (
          <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-xl border border-[#d4a843] bg-gradient-to-b from-[#141d2d] to-[#070e1b] p-5 shadow-2xl text-[#e2e8f0]">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#f0d060] tracking-widest block uppercase">
                  ISLAND SURVEY
                </span>
                <h3 className="font-[Cinzel] text-lg font-bold text-white">
                  {selectedIncident.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIncident(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              {selectedIncident.lore}
            </p>

            <div className="mt-3 rounded bg-black/50 p-2.5 text-[11px] border border-[#d4a843]/20 space-y-1">
              <div>
                <span className="text-slate-400">Jurisdiction: </span>
                <span className="text-[#f0d060] font-semibold">{selectedIncident.ruler}</span>
              </div>
              <div>
                <span className="text-slate-400">Key Incident: </span>
                <span className="text-amber-200">{selectedIncident.keyIncidents}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[#d4a843]/20 pt-3">
              <span className="text-xs text-slate-300">
                <strong className="text-[#f0d060]">{selectedIncident.itemsLogged}</strong> Lost & Found Logged
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose()
                  navigate(`/browse?location=${selectedIncident.id}`)
                }}
                className="rounded bg-gradient-to-r from-[#d4a843] to-[#b88a2e] px-3 py-1.5 text-xs font-bold text-black hover:brightness-110"
              >
                View Items
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
