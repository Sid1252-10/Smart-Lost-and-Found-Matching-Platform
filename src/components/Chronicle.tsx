import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, X } from 'lucide-react'

export interface ChronicleStep {
  id: string
  title: string
  img: string
  description: string
  detailedGuide: string
}

export const CHRONICLE_STEPS: ChronicleStep[] = [
  {
    id: 'loss',
    title: 'YOUR LOSS',
    img: '/extracted/step_loss.jpg',
    description: 'Your item is lost to the vast sea.',
    detailedGuide: 'Whether swept overboard by the Knock Up Stream or misplaced at a bustling Grand Line tavern, your loss is logged into the global repository with coordinates, distinctive markings, and optional Berry bounty rewards.',
  },
  {
    id: 'found',
    title: 'SOMEONE FINDS IT',
    img: '/extracted/step_found.jpg',
    description: 'Someone discovers the item on a remote island.',
    detailedGuide: 'An islander, local merchant, or friendly pirate spots your belongings washed ashore or secured at an island outpost and brings it to the official town hall or portmaster station.',
  },
  {
    id: 'register',
    title: 'ISLAND REGISTRATION',
    img: '/extracted/step_register.jpg',
    description: "The item is registered in the island's local registry.",
    detailedGuide: "Local harbor masters stamp and log the artifact into the World Government & Pirate Haven shared ledger, encrypting its unique marks into the Transponder Snail network.",
  },
  {
    id: 'search',
    title: 'YOUR SEARCH BEGINS',
    img: '/extracted/step_search.jpg',
    description: 'You start a global search for your treasure here.',
    detailedGuide: 'You query the Treasury with keywords, island locations, or unique marks. Our transponder snail matching engine scans registries across all 4 Blues and the Grand Line in real-time.',
  },
  {
    id: 'reclaim',
    title: 'ITEM RECLAIMED',
    img: '/extracted/step_reclaim.jpg',
    description: 'You come to collect your item.',
    detailedGuide: 'Present your proof of ownership or verification passphrase. Collect your treasure at the designated port or request delivery via Karoo courier bird!',
  },
]

export function Chronicle() {
  const [activeStep, setActiveStep] = useState<ChronicleStep | null>(null)
  const [showLaughTale, setShowLaughTale] = useState(false)

  return (
    <section className="relative w-full py-8 px-4 md:px-8 bg-[#0a0604] border-t border-[#4a2e12]/40">
      <div className="mx-auto max-w-[1440px]">
        {/* Ornate Header with Laugh Tale badge on the right */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-8 md:w-24 bg-gradient-to-r from-transparent to-[#d4a843]/60" />
            <span className="text-[#d4a843] text-sm">⚓</span>
            <h2 className="font-pirate text-2xl md:text-3xl font-bold tracking-[0.2em] text-[#f0d060] uppercase drop-shadow-[0_2px_10px_rgba(212,168,67,0.3)]">
              THE CHRONICLE OF LOST & FOUND
            </h2>
            <span className="text-[#d4a843] text-sm">⚓</span>
            <div className="h-[1px] w-8 md:w-24 bg-gradient-to-l from-transparent to-[#d4a843]/60" />
          </div>

          {/* Laugh Tale Easter Egg Tag on top right */}
          <div
            onClick={() => setShowLaughTale(true)}
            className="hidden sm:flex absolute right-0 items-center gap-1 cursor-pointer rounded border border-[#8a602a]/60 bg-[#1c1208] px-2.5 py-1 text-[10px] font-bold tracking-widest text-[#e0b060] transition-all hover:border-[#f0d060] hover:scale-105"
            title="Laugh Tale Secret Lore"
          >
            <span>LAUGH TALE</span>
            <span className="text-amber-400">???</span>
          </div>
        </div>

        {/* 5 Chronicle Steps with connecting arrows */}
        <div className="flex flex-wrap lg:flex-nowrap items-center justify-center gap-2 md:gap-3">
          {CHRONICLE_STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              {/* Parchment Step Card */}
              <div
                onClick={() => setActiveStep(step)}
                className="group relative cursor-pointer overflow-hidden rounded-md border border-[#8a602a]/40 bg-[#e8d5a5] transition-all duration-300 hover:-translate-y-1 hover:border-[#f0d060] hover:shadow-[0_8px_20px_rgba(240,208,96,0.3)] w-[140px] sm:w-[155px] md:w-[170px]"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setActiveStep(step)
                }}
              >
                <div className="aspect-[102/100] w-full overflow-hidden bg-[#e0cc98]">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Arrow Connector between steps */}
              {idx < CHRONICLE_STEPS.length - 1 && (
                <div className="hidden sm:flex items-center justify-center px-1 text-[#d4a843] opacity-80">
                  <ChevronRight className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Detail Modal */}
      <AnimatePresence>
        {activeStep && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-xl border border-[#d4a843] bg-gradient-to-b from-[#1c140a] to-[#0c0905] p-6 text-left shadow-2xl text-[#f4e6c4]"
            >
              <button
                type="button"
                onClick={() => setActiveStep(null)}
                className="absolute top-4 right-4 text-amber-300 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex gap-4 items-center">
                <img
                  src={activeStep.img}
                  alt={activeStep.title}
                  className="w-20 rounded border border-[#a07830] object-cover"
                />
                <div>
                  <span className="text-[11px] font-semibold text-[#f0d060] tracking-widest block uppercase">
                    CHRONICLE STAGE
                  </span>
                  <h3 className="font-[Cinzel] text-xl font-bold text-white">
                    {activeStep.title}
                  </h3>
                </div>
              </div>

              <p className="mt-4 text-xs font-semibold text-amber-200">
                "{activeStep.description}"
              </p>

              <div className="mt-3 rounded border border-[#a07830]/30 bg-black/40 p-3 text-xs leading-relaxed text-[#d4c4a0]">
                {activeStep.detailedGuide}
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveStep(null)}
                  className="rounded bg-[#d4a843] px-4 py-1.5 text-xs font-bold text-black hover:bg-[#f0d060]"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Laugh Tale Easter Egg Modal */}
      <AnimatePresence>
        {showLaughTale && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg rounded-xl border-2 border-[#f0d060] bg-gradient-to-b from-[#1f1609] via-[#0d0903] to-black p-6 text-center shadow-[0_0_50px_rgba(240,208,96,0.4)] text-[#f4e6c4]"
            >
              <button
                type="button"
                onClick={() => setShowLaughTale(false)}
                className="absolute top-4 right-4 text-[#f0d060] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <span className="text-3xl">☠</span>
              <h3 className="font-[Cinzel_Decorative] text-2xl font-black text-[#f0d060] mt-2">
                LAUGH TALE ARCHIVE
              </h3>
              <p className="font-[Cinzel] text-xs tracking-widest text-amber-300 mt-1">
                COORDINATES LOCKED: 4 ROAD PONEGLYPHS REQUIRED
              </p>

              <div className="mt-4 rounded border border-[#d4a843]/30 bg-black/60 p-4 text-xs leading-relaxed text-[#e8d5a5]">
                <p>
                  "He laughed! The ultimate treasure left by Joy Boy on the final island. No lost item report can be accepted for the One Piece until the Great Age of Pirates concludes."
                </p>
                <p className="mt-2 text-slate-400 italic">
                  — Gol D. Roger, King of the Pirates
                </p>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowLaughTale(false)}
                  className="rounded bg-gradient-to-r from-[#d4a843] to-[#f0d060] px-6 py-2 text-xs font-bold text-black hover:brightness-110 shadow-lg"
                >
                  Return to Treasury
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
