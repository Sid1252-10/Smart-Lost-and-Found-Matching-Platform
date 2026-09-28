import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Sparkles, RotateCcw } from 'lucide-react'

interface CalendarDatePickerProps {
  value?: string
  defaultValue?: string
  onChange?: (date: string) => void
  name?: string
  label?: string
  className?: string
  disabledFuture?: boolean
}

function formatYYYYMMDD(d: Date): string {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseYYYYMMDD(str: string): Date {
  if (!str) return new Date()
  const [y, m, d] = str.split('-').map(Number)
  if (!y || !m || !d) return new Date()
  return new Date(y, m - 1, d)
}

function getRelativeDescription(dateStr: string): string | null {
  if (!dateStr) return null
  const target = parseYYYYMMDD(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  target.setHours(0, 0, 0, 0)

  const diffTime = today.getTime() - target.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays === -1) return 'Tomorrow'
  if (diffDays > 1 && diffDays <= 7) return `${diffDays} days ago`
  if (diffDays > 7 && diffDays <= 30) return `${Math.floor(diffDays / 7)}w ago`
  if (diffDays > 30) return `${Math.floor(diffDays / 30)}mo ago`
  return null
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function CalendarDatePicker({
  value,
  defaultValue = formatYYYYMMDD(new Date()),
  onChange,
  name = 'date',
  label = 'Date of Incident',
  className = '',
  disabledFuture = false,
}: CalendarDatePickerProps) {
  const [internalDate, setInternalDate] = useState<string>(value || defaultValue)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentDate = value !== undefined ? value : internalDate
  const parsedCurrent = useMemo(() => parseYYYYMMDD(currentDate), [currentDate])

  const [viewYear, setViewYear] = useState<number>(parsedCurrent.getFullYear())
  const [viewMonth, setViewMonth] = useState<number>(parsedCurrent.getMonth())

  useEffect(() => {
    if (value !== undefined) {
      setInternalDate(value)
      const p = parseYYYYMMDD(value)
      setViewYear(p.getFullYear())
      setViewMonth(p.getMonth())
    }
  }, [value])

  // Click outside listener to close popup
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  function handleSelectDate(dStr: string) {
    if (value === undefined) {
      setInternalDate(dStr)
    }
    onChange?.(dStr)
    setIsOpen(false)
  }

  function handlePrevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((prev) => prev - 1)
    } else {
      setViewMonth((prev) => prev - 1)
    }
  }

  function handleNextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((prev) => prev + 1)
    } else {
      setViewMonth((prev) => prev + 1)
    }
  }

  // Generate calendar grid matrix
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay()
    const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

    const days: Array<{
      dateStr: string
      dayNum: number
      isCurrentMonth: boolean
      isToday: boolean
      isSelected: boolean
      isFuture: boolean
    }> = []

    const todayStr = formatYYYYMMDD(new Date())

    // Trailing days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dNum = daysInPrevMonth - i
      const prevM = viewMonth === 0 ? 11 : viewMonth - 1
      const prevY = viewMonth === 0 ? viewYear - 1 : viewYear
      const dStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`
      days.push({
        dateStr: dStr,
        dayNum: dNum,
        isCurrentMonth: false,
        isToday: dStr === todayStr,
        isSelected: dStr === currentDate,
        isFuture: disabledFuture && dStr > todayStr,
      })
    }

    // Days in current month
    for (let day = 1; day <= daysInCurrentMonth; day++) {
      const dStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      days.push({
        dateStr: dStr,
        dayNum: day,
        isCurrentMonth: true,
        isToday: dStr === todayStr,
        isSelected: dStr === currentDate,
        isFuture: disabledFuture && dStr > todayStr,
      })
    }

    // Leading days from next month to fill grid (total multiples of 7, up to 42 cells)
    const remaining = (7 - (days.length % 7)) % 7
    for (let day = 1; day <= remaining; day++) {
      const nextM = viewMonth === 11 ? 0 : viewMonth + 1
      const nextY = viewMonth === 11 ? viewYear + 1 : viewYear
      const dStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      days.push({
        dateStr: dStr,
        dayNum: day,
        isCurrentMonth: false,
        isToday: dStr === todayStr,
        isSelected: dStr === currentDate,
        isFuture: disabledFuture && dStr > todayStr,
      })
    }

    return days
  }, [viewYear, viewMonth, currentDate, disabledFuture])

  // Presets
  const presets = useMemo(() => {
    const now = new Date()
    const today = formatYYYYMMDD(now)
    const yesterday = formatYYYYMMDD(new Date(now.getTime() - 86400000))
    const threeDays = formatYYYYMMDD(new Date(now.getTime() - 3 * 86400000))
    const oneWeek = formatYYYYMMDD(new Date(now.getTime() - 7 * 86400000))

    return [
      { label: 'Today', value: today, icon: Sparkles },
      { label: 'Yesterday', value: yesterday },
      { label: '3 Days Ago', value: threeDays },
      { label: '1 Week Ago', value: oneWeek },
    ]
  }, [])

  const relativeText = getRelativeDescription(currentDate)

  // Formatted date string for button display
  const displayFormatted = useMemo(() => {
    if (!currentDate) return 'Select date'
    const d = parseYYYYMMDD(currentDate)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }, [currentDate])

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold text-slate-300">
            {label}
          </label>
          {relativeText && (
            <span className="text-[10px] font-medium text-[#f0d060] bg-[#f0d060]/10 px-1.5 py-0.5 rounded border border-[#f0d060]/30 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {relativeText}
            </span>
          )}
        </div>
      )}

      {/* Hidden input for FormData compatibility */}
      <input type="hidden" name={name} value={currentDate} />

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev)
          const p = parseYYYYMMDD(currentDate)
          setViewYear(p.getFullYear())
          setViewMonth(p.getMonth())
        }}
        className={`w-full flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs transition-all duration-200 text-left ${
          isOpen
            ? 'border-[#f0d060] bg-slate-900 shadow-md shadow-[#f0d060]/10'
            : 'border-slate-700 bg-slate-950/70 hover:border-slate-600 hover:bg-slate-900/80 text-white'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <CalendarIcon className={`w-4 h-4 shrink-0 transition-colors ${isOpen ? 'text-[#f0d060]' : 'text-slate-400'}`} />
          <span className="font-medium text-slate-100 truncate">{displayFormatted}</span>
        </div>

        <span className="text-[10px] text-slate-400 tracking-wider uppercase font-mono px-1 py-0.5 rounded bg-slate-800 border border-slate-700">
          {currentDate}
        </span>
      </button>

      {/* Popover Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 z-50 mt-2 w-72 sm:w-80 rounded-xl border border-amber-500/30 bg-[#0c1322] p-3 text-slate-100 shadow-2xl shadow-black/80 backdrop-blur-md"
          >
            {/* Header: Month / Year with Navigation */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous Month"
                className="p-1 rounded-lg border border-slate-700/60 bg-slate-900 hover:border-amber-400/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                <span className="font-heading font-semibold text-sm text-[#f0d060] tracking-wide">
                  {MONTH_NAMES[viewMonth]}
                </span>
                <span className="font-mono text-xs text-slate-400">
                  {viewYear}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next Month"
                className="p-1 rounded-lg border border-slate-700/60 bg-slate-900 hover:border-amber-400/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Presets Row */}
            <div className="grid grid-cols-4 gap-1 mb-2 pb-2 border-b border-slate-800/80">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleSelectDate(preset.value)}
                  className={`px-1.5 py-1 text-[10px] rounded font-medium transition-all ${
                    currentDate === preset.value
                      ? 'bg-[#f0d060] text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Day of Week Labels */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {DAYS_OF_WEEK.map((d) => (
                <span key={d} className="text-[11px] font-semibold text-[#f0d060]/70 py-0.5">
                  {d}
                </span>
              ))}
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {calendarDays.map((day) => {
                const isCurrent = day.isCurrentMonth
                const isSelected = day.isSelected
                const isToday = day.isToday
                const isFuture = day.isFuture

                return (
                  <button
                    key={day.dateStr}
                    type="button"
                    disabled={isFuture}
                    onClick={() => handleSelectDate(day.dateStr)}
                    className={`h-8 w-full rounded-md text-xs font-medium flex items-center justify-center relative transition-all duration-150 ${
                      isFuture
                        ? 'opacity-30 cursor-not-allowed text-slate-600'
                        : isSelected
                        ? 'bg-gradient-to-br from-[#f0d060] to-[#ca8a04] text-slate-950 font-bold shadow-md shadow-amber-500/30 ring-1 ring-amber-300'
                        : isToday
                        ? 'bg-amber-500/10 text-[#f0d060] border border-[#f0d060]/50 hover:bg-[#f0d060]/20'
                        : isCurrent
                        ? 'text-slate-200 hover:bg-slate-800 hover:text-white'
                        : 'text-slate-600 hover:bg-slate-900/60 hover:text-slate-400'
                    }`}
                  >
                    {day.dayNum}
                    {isToday && !isSelected && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#f0d060]" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Footer with Reset to Today */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800 text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                Log date: <strong className="text-slate-200">{currentDate}</strong>
              </span>

              <button
                type="button"
                onClick={() => {
                  const today = formatYYYYMMDD(new Date())
                  handleSelectDate(today)
                }}
                className="flex items-center gap-1 text-[#f0d060] hover:text-[#fae588] transition-colors font-medium px-2 py-0.5 rounded hover:bg-[#f0d060]/10"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Today
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
