import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useRegistry } from '../context/RegistryContext'
import type { MatchResult, RegistryItem } from '../types'
import { ItemThumb, StatusTag } from './ItemArt'

type MatchResultsModalProps = {
  open: boolean
  matches: MatchResult[]
  onClose: () => void
  onOpenItem: (item: RegistryItem) => void
}

export function MatchResultsModal({ open, matches, onClose, onOpenItem }: MatchResultsModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            className="relative max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-amber-200/20 bg-[#f4e6c4] p-6 text-slate-900 shadow-2xl"
          >
            <button type="button" onClick={onClose} className="absolute right-4 top-4 text-slate-700">
              <X className="h-5 w-5" />
            </button>
            <p className="text-[11px] tracking-[0.28em] text-emerald-800">OBSERVATION HAKI MATCH ENGINE</p>
            <h3 className="font-serif text-4xl">Registry Matches</h3>
            <p className="mb-5 text-sm text-slate-700">
              High-confidence pairings across category, location, date, and keywords.
            </p>
            <div className="space-y-3">
              {matches.length === 0 && (
                <p className="rounded-xl bg-white/50 p-4 text-sm">No strong matches yet. Widen your filters or report the item.</p>
              )}
              {matches.map((match) => (
                <button
                  key={match.item.id}
                  type="button"
                  onClick={() => onOpenItem(match.item)}
                  className="flex w-full gap-3 rounded-xl bg-[#fff8e8] p-3 text-left shadow-sm"
                >
                  <div className="h-20 w-20 overflow-hidden rounded-lg">
                    <ItemThumb title={match.item.title} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{match.item.title}</p>
                      <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                        {match.score}% Match Score
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {match.item.location} · {match.item.category}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-700">{match.item.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

type ItemDetailModalProps = {
  item: RegistryItem | null
  onClose: () => void
}

export function ItemDetailModal({ item, onClose }: ItemDetailModalProps) {
  const { user } = useAuth()
  const { items, claimItem, recoverItem } = useRegistry()
  const live = (item && items.find((entry) => entry.id === item.id)) || item

  return (
    <AnimatePresence>
      {live && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="glass-panel w-full max-w-lg rounded-2xl p-5"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <StatusTag status={live.status} />
                <h3 className="mt-2 font-pirate text-3xl text-white">{live.title}</h3>
                <p className="text-xs text-slate-400 font-body">
                  {live.location} {live.groveNumber ? `• Grove ${live.groveNumber}` : ''}
                </p>
              </div>
              <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 h-48 overflow-hidden rounded-xl bg-black/60 border border-[#d4a843]/30 flex items-center justify-center">
              {live.imageUrl ? (
                <img src={live.imageUrl} alt={live.title} className="h-full w-full object-cover" />
              ) : (
                <ItemThumb title={live.title} />
              )}
            </div>

            <p className="text-xs leading-relaxed text-slate-200 font-body">{live.description}</p>

            <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-300 font-body border-t border-slate-800 pt-3">
              <div><strong className="text-slate-400">Category:</strong> {live.category}</div>
              <div><strong className="text-slate-400">Type:</strong> {live.kind.toUpperCase()}</div>
              <div><strong className="text-slate-400">Colour:</strong> {live.colour || 'N/A'}</div>
              <div><strong className="text-slate-400">Marks:</strong> {live.uniqueMarks || 'None'}</div>
              <div><strong className="text-slate-400">Grove:</strong> Grove {live.groveNumber || 41}</div>
              <div><strong className="text-slate-400">Date:</strong> {live.incidentDate || live.dateLost || live.dateFound || 'Recent'}</div>
            </dl>

            <div className="mt-5 flex flex-wrap gap-2 font-heading">
              {live.status !== 'CLAIMED' && live.status !== 'RECOVERED' && (
                <button
                  type="button"
                  onClick={() => claimItem(live.id, user?.name || 'Anonymous Captain')}
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#d4a843] to-[#b88a2e] py-2 text-xs font-bold text-black hover:brightness-110"
                >
                  File a Claim
                </button>
              )}
              {live.status !== 'RECOVERED' && (
                <button
                  type="button"
                  onClick={() => recoverItem(live.id)}
                  className="flex-1 rounded-xl border border-emerald-500/50 bg-emerald-500/20 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30"
                >
                  Mark Recovered
                </button>
              )}
            </div>
            {live.claimedBy && <p className="mt-3 text-xs text-emerald-300 font-body">Claim filed by {live.claimedBy}</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const stories = [
  { title: 'The Straw Hat Brim', body: 'A Marineford steward logged a woven brim. Observation Haki matched it to a lost report in hours.' },
  { title: 'Dockyard Slingshot', body: 'Galley-La found a red slingshot under a keel. The owner was reunited before the tide turned.' },
  { title: 'Mangrove Luggage', body: 'A black chest with a Grove sticker surfaced at Sabaody. The registry paired colour, marks, and date.' },
]

type StoriesModalProps = {
  open: boolean
  onClose: () => void
}

export function StoriesModal({ open, onClose }: StoriesModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div className="glass-panel w-full max-w-2xl rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-serif text-3xl text-white">Watch Our Stories</h3>
              <button type="button" onClick={onClose} className="text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-4 text-sm text-slate-300">See Wanderlust in action across the Grand Line.</p>
            <div className="space-y-3">
              {stories.map((story) => (
                <div key={story.title} className="rounded-xl border border-slate-700/70 bg-slate-950/40 p-4">
                  <p className="text-sm font-medium text-emerald-300">{story.title}</p>
                  <p className="mt-1 text-sm text-slate-300">{story.body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
