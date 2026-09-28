import { useState, useRef, useEffect, type MouseEvent, type WheelEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn, ZoomOut, RotateCcw, Move, MapPin, Calendar, Tag } from 'lucide-react'

export interface ImageZoomModalProps {
  isOpen: boolean
  imageUrl: string
  title: string
  location?: string
  groveNumber?: number
  category?: string
  incidentDate?: string
  onClose: () => void
}

export function ImageZoomModal({
  isOpen,
  imageUrl,
  title,
  location,
  groveNumber,
  category,
  incidentDate,
  onClose,
}: ImageZoomModalProps) {
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })

  // Reset zoom & pan on open
  useEffect(() => {
    if (isOpen) {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    }
  }, [isOpen, imageUrl])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.5, 4))
  const handleZoomOut = () => {
    setScale((s) => {
      const next = Math.max(s - 0.5, 1)
      if (next === 1) setPosition({ x: 0, y: 0 })
      return next
    })
  }
  const handleReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      setScale((s) => Math.min(s + 0.25, 4))
    } else {
      setScale((s) => {
        const next = Math.max(s - 0.25, 1)
        if (next === 1) setPosition({ x: 0, y: 0 })
        return next
      })
    }
  }

  const handleMouseDown = (e: MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y }
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      })
    }
  }

  const handleMouseUp = () => setIsDragging(false)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black/90 backdrop-blur-md p-4 select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          {/* Top Control Bar */}
          <div className="w-full max-w-5xl flex items-center justify-between z-10 py-2 border-b border-[#d4a843]/20">
            <div className="flex items-center gap-3">
              <span className="rounded bg-[#d4a843]/20 border border-[#d4a843]/60 px-2 py-0.5 text-[11px] font-bold text-[#f0d060] uppercase font-heading tracking-wider">
                INSPECTION LIGHTBOX
              </span>
              <h3 className="font-heading text-base font-bold text-white truncate max-w-sm sm:max-w-md">
                {title}
              </h3>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-900/90 rounded-lg border border-[#d4a843]/40 p-1 shadow-lg">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={scale <= 1}
                  className="rounded p-1.5 text-slate-300 hover:text-[#f0d060] hover:bg-slate-800 disabled:opacity-30 transition"
                  title="Zoom Out (-)"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="px-2 text-xs font-mono text-[#f0d060] font-bold">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={scale >= 4}
                  className="rounded p-1.5 text-slate-300 hover:text-[#f0d060] hover:bg-slate-800 disabled:opacity-30 transition"
                  title="Zoom In (+)"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <div className="h-4 w-[1px] bg-slate-700 mx-1" />
                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded p-1.5 text-slate-300 hover:text-[#f0d060] hover:bg-slate-800 transition"
                  title="Reset Zoom (100%)"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-slate-800/80 border border-slate-700 p-2 text-slate-300 hover:text-white hover:bg-red-950/80 hover:border-red-500/60 transition"
                title="Close (Esc)"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Image Inspection Area */}
          <div
            className="flex-1 w-full max-w-5xl flex items-center justify-center overflow-hidden my-3 relative rounded-xl border border-[#d4a843]/20 bg-slate-950/60"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
            onClick={() => {
              if (scale === 1) setScale(2)
            }}
          >
            <motion.img
              src={imageUrl}
              alt={title}
              className="max-h-[72vh] max-w-full object-contain pointer-events-none transition-transform duration-75"
              style={{
                transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
              }}
            />

            {scale > 1 && (
              <div className="absolute bottom-3 right-3 bg-black/75 border border-[#d4a843]/30 px-3 py-1 rounded-full text-[10px] text-slate-300 flex items-center gap-1.5 pointer-events-none">
                <Move className="h-3 w-3 text-[#f0d060]" />
                <span>Drag to pan canvas</span>
              </div>
            )}
          </div>

          {/* Bottom Information Footer */}
          <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-3 py-2 border-t border-[#d4a843]/20 text-xs text-slate-400">
            <div className="flex flex-wrap items-center gap-4">
              {location && (
                <span className="flex items-center gap-1 text-slate-300">
                  <MapPin className="h-3.5 w-3.5 text-[#f0d060]" />
                  <span>{location} {groveNumber ? `(Grove ${groveNumber})` : ''}</span>
                </span>
              )}
              {category && (
                <span className="flex items-center gap-1 text-slate-300">
                  <Tag className="h-3.5 w-3.5 text-sky-400" />
                  <span>{category}</span>
                </span>
              )}
              {incidentDate && (
                <span className="flex items-center gap-1 text-slate-300">
                  <Calendar className="h-3.5 w-3.5 text-amber-400" />
                  <span>{incidentDate}</span>
                </span>
              )}
            </div>

            <span className="text-[11px] text-slate-500">
              Double-click or scroll wheel to zoom • Press Esc to close
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
