import { useNavigate } from 'react-router-dom'

export interface HeroProps {
  onBrowseClick?: () => void
  onReportClick?: () => void
  onStories?: () => void
}

export function Hero({ onBrowseClick, onReportClick }: HeroProps) {
  const navigate = useNavigate()

  const handleBrowse = () => {
    if (onBrowseClick) onBrowseClick()
    else navigate('/browse')
  }

  const handleReport = () => {
    if (onReportClick) onReportClick()
    else navigate('/report')
  }

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '88vh' }}>
      {/* ── Ocean ship background image ── */}
      <img
        src="/hero_ship.jpg"
        alt="Thousand Sunny sailing across the Grand Line"
        className="absolute inset-0 h-full w-full object-cover object-center select-none"
        style={{ zIndex: 0 }}
      />

      {/* ── Multi-layer overlay for depth & text readability ── */}
      {/* Left-side darker vignette so text pops */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            'linear-gradient(to right, rgba(2,12,26,0.82) 0%, rgba(2,12,26,0.55) 45%, rgba(2,12,26,0.1) 70%, transparent 100%)',
        }}
      />
      {/* Bottom fade into site background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            'linear-gradient(to top, rgba(2,12,26,0.95) 0%, rgba(2,12,26,0.4) 25%, transparent 60%)',
        }}
      />

      {/* ── Animated water shimmer on top of image ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background:
            'radial-gradient(ellipse at 60% 80%, rgba(0,120,220,0.12) 0%, transparent 60%)',
          animation: 'waterShift 10s ease-in-out infinite alternate',
        }}
      />

      {/* ── Hero Content ── */}
      <div
        className="relative flex flex-col justify-center"
        style={{
          zIndex: 10,
          minHeight: '88vh',
          padding: '0 clamp(1.5rem, 6vw, 7rem)',
          maxWidth: '680px',
        }}
      >
        {/* Badge */}
        <div
          className="mb-4 inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5"
          style={{
            background: 'rgba(212,168,67,0.15)',
            border: '1px solid rgba(212,168,67,0.45)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span style={{ fontSize: '0.7rem', letterSpacing: '0.18em', color: '#f0d060', fontFamily: 'Cinzel, serif', textTransform: 'uppercase' }}>
            ⚓ Grand Line Registry
          </span>
        </div>

        {/* Main Title */}
        <h1
          className="font-heading mb-3 leading-tight"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.6rem)',
            fontFamily: '"Cinzel Decorative", Cinzel, Georgia, serif',
            color: '#f0d060',
            textShadow: '0 0 40px rgba(212,168,67,0.5), 0 4px 24px rgba(0,0,0,0.9)',
            lineHeight: 1.15,
          }}
        >
          Treasury of the<br />
          <span style={{ color: '#ffffff' }}>Lost &amp; Found</span>
        </h1>

        {/* Subtitle */}
        <p
          className="mb-8"
          style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: 'clamp(0.9rem, 1.6vw, 1.1rem)',
            color: 'rgba(226,232,240,0.85)',
            maxWidth: '480px',
            lineHeight: 1.7,
            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
          }}
        >
          The Grand Line's most complete registry of lost treasures. Report
          missing items, browse found artifacts, and reunite with your most
          prized possessions across every sea.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4">
          {/* Primary — Browse Treasures */}
          <button
            id="hero-browse-btn"
            onClick={handleBrowse}
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.88rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 700,
              padding: '14px 34px',
              borderRadius: '6px',
              border: '2px solid #d4a843',
              background: 'linear-gradient(135deg, #d4a843 0%, #f0d060 50%, #b88a2e 100%)',
              color: '#0a0e1a',
              cursor: 'pointer',
              boxShadow: '0 0 24px rgba(212,168,67,0.45), 0 4px 16px rgba(0,0,0,0.5)',
              transition: 'all 0.25s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.transform = 'translateY(-3px) scale(1.03)'
              el.style.boxShadow = '0 0 36px rgba(240,208,96,0.6), 0 8px 24px rgba(0,0,0,0.6)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.transform = 'translateY(0) scale(1)'
              el.style.boxShadow = '0 0 24px rgba(212,168,67,0.45), 0 4px 16px rgba(0,0,0,0.5)'
            }}
          >
            🔍 Browse Treasures
          </button>

          {/* Secondary — Report Lost Item */}
          <button
            id="hero-report-btn"
            onClick={handleReport}
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.88rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 700,
              padding: '14px 34px',
              borderRadius: '6px',
              border: '2px solid rgba(226,232,240,0.45)',
              background: 'rgba(255,255,255,0.07)',
              color: '#e2e8f0',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget
              el.style.transform = 'translateY(-3px) scale(1.03)'
              el.style.background = 'rgba(255,255,255,0.14)'
              el.style.borderColor = 'rgba(226,232,240,0.8)'
              el.style.boxShadow = '0 8px 28px rgba(0,0,0,0.5)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget
              el.style.transform = 'translateY(0) scale(1)'
              el.style.background = 'rgba(255,255,255,0.07)'
              el.style.borderColor = 'rgba(226,232,240,0.45)'
              el.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)'
            }}
          >
            📜 Report Lost Item
          </button>
        </div>

        {/* Stats row */}
        <div className="mt-10 flex flex-wrap gap-6">
          {[
            { label: 'Items Reported', value: '2,400+' },
            { label: 'Items Reunited', value: '890+' },
            { label: 'Active Pirates', value: '1,200+' },
          ].map(s => (
            <div key={s.label}>
              <div
                style={{
                  fontFamily: '"Cinzel Decorative", Cinzel, serif',
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: '#f0d060',
                  textShadow: '0 0 16px rgba(212,168,67,0.5)',
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'rgba(226,232,240,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Animated floating bubbles inside hero ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
        {[
          { left: '62%', size: 18, delay: '0s', dur: '7s' },
          { left: '72%', size: 10, delay: '2s', dur: '9s' },
          { left: '80%', size: 26, delay: '1s', dur: '11s' },
          { left: '88%', size: 14, delay: '3.5s', dur: '8s' },
          { left: '55%', size: 32, delay: '5s', dur: '13s' },
        ].map((b, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              left: b.left,
              width: b.size,
              height: b.size,
              animationDelay: b.delay,
              animationDuration: b.dur,
            }}
          />
        ))}
      </div>
    </section>
  )
}
