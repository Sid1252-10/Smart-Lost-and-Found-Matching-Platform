import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export interface HeroProps {
  onBrowseClick?: () => void
  onReportClick?: () => void
  onStories?: () => void
}

export function Hero({ onBrowseClick, onReportClick }: HeroProps) {
  const navigate = useNavigate()
  const [hoverBtn1, setHoverBtn1] = useState(false)
  const [hoverBtn2, setHoverBtn2] = useState(false)

  const handleBtn1 = () => {
    if (onBrowseClick) {
      onBrowseClick()
    } else {
      navigate('/browse')
    }
  }

  const handleBtn2 = () => {
    if (onReportClick) {
      onReportClick()
    } else {
      navigate('/report')
    }
  }

  return (
    <section className="relative w-full bg-[#050b14] overflow-hidden">
      {/* Background container maintaining landscape aspect ratio of the hero artwork */}
      <div className="relative mx-auto max-w-[1440px] aspect-[1376/768] w-full max-h-[700px] overflow-hidden shadow-2xl">
        {/* Exact Hero Artwork */}
        <img
          src="/extracted/hero_bg.jpg"
          alt="Treasury of the Lost & Found — Thousand Sunny"
          className="h-full w-full object-cover object-center select-none"
        />

        {/* Ambient golden dust particles & subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050b14]/70 via-transparent to-[#050b14]/30 pointer-events-none" />

        {/* Interactive Button 1 overlay (Top Button: Search / Browse) */}
        <div
          style={{
            position: 'absolute',
            left: '5.2%',
            top: '53%',
            width: '34%',
            height: '7.5%',
          }}
          className="group cursor-pointer"
          onClick={handleBtn1}
          onMouseEnter={() => setHoverBtn1(true)}
          onMouseLeave={() => setHoverBtn1(false)}
          title="Browse Found Treasures"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleBtn1()
          }}
        >
          {/* Subtle golden highlight sheen on hover */}
          <div
            className={`w-full h-full rounded transition-all duration-300 pointer-events-none ${
              hoverBtn1
                ? 'ring-2 ring-[#f0d060] bg-[#f0d060]/15 shadow-[0_0_20px_rgba(240,208,96,0.5)]'
                : 'hover:ring-1 hover:ring-[#d4a843]/50'
            }`}
          />
        </div>

        {/* Interactive Button 2 overlay (Bottom Button: Report Lost Item) */}
        <div
          style={{
            position: 'absolute',
            left: '5.2%',
            top: '66%',
            width: '34%',
            height: '7.5%',
          }}
          className="group cursor-pointer"
          onClick={handleBtn2}
          onMouseEnter={() => setHoverBtn2(true)}
          onMouseLeave={() => setHoverBtn2(false)}
          title="Report Your Lost Treasure"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleBtn2()
          }}
        >
          {/* Subtle golden highlight sheen on hover */}
          <div
            className={`w-full h-full rounded transition-all duration-300 pointer-events-none ${
              hoverBtn2
                ? 'ring-2 ring-[#f0d060] bg-[#f0d060]/15 shadow-[0_0_20px_rgba(240,208,96,0.5)]'
                : 'hover:ring-1 hover:ring-[#d4a843]/50'
            }`}
          />
        </div>
      </div>
    </section>
  )
}
