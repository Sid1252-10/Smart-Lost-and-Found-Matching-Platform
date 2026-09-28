// Footer v2 – Dark ocean theme, no background image
import { Link } from 'react-router-dom'

export interface FooterProps {
  onWorldClick?: () => void
}

export function Footer({ onWorldClick }: FooterProps) {
  return (
    <footer className="relative w-full overflow-hidden select-none border-t border-[#d4a843]/20"
      style={{
        background: 'linear-gradient(180deg, #040810 0%, #0a1628 20%, #0d1f38 50%, #0a1628 80%, #050d18 100%)',
      }}
    >
      {/* Subtle parchment-style top border glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4a843]/40 to-transparent" />

      <div className="relative mx-auto max-w-[1440px] px-6 py-10 md:py-14">
        {/* Decorative compass and anchor corners */}
        <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-[#d4a843]/15 text-5xl md:text-7xl select-none pointer-events-none">
          ⚓
        </div>
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-[#d4a843]/15 text-5xl md:text-7xl select-none pointer-events-none">
          🧭
        </div>

        {/* Main footer content grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-center md:text-left">
          {/* Left Column: Navigation Links */}
          <nav className="flex flex-col items-center md:items-start gap-2.5">
            <h3 className="font-pirate text-lg text-[#f0d060] tracking-widest mb-1 drop-shadow-[0_1px_6px_rgba(212,168,67,0.3)]">
              TREASURY
            </h3>
            <Link
              to="/report"
              className="text-[#c4a870] hover:text-[#f0d060] text-sm font-sub tracking-wider transition-colors duration-200"
            >
              MY REPORTS
            </Link>
            <Link
              to="/claiming"
              className="text-[#c4a870] hover:text-[#f0d060] text-sm font-sub tracking-wider transition-colors duration-200"
            >
              CLAIM PORTAL
            </Link>
            <Link
              to="/archives"
              className="text-[#c4a870] hover:text-[#f0d060] text-sm font-sub tracking-wider transition-colors duration-200"
            >
              ARCHIVES
            </Link>
            <Link
              to="/faq"
              className="text-[#c4a870] hover:text-[#f0d060] text-sm font-sub tracking-wider transition-colors duration-200"
            >
              FAQ
            </Link>
          </nav>

          {/* Center Column: Jolly Roger + Social Links */}
          <div className="flex flex-col items-center gap-4">
            {/* Jolly Roger Skull */}
            <div className="relative">
              <img
                src="/extracted/footer_skull.png"
                alt="Straw Hat Jolly Roger"
                className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_0_15px_rgba(212,168,67,0.3)]"
              />
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3">
              {['📋', '©', '🐌', '🐦', '📺'].map((icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="w-8 h-8 rounded-full border border-[#d4a843]/40 bg-[#0d1f38]/80 flex items-center justify-center text-xs text-[#d4a843] hover:border-[#f0d060] hover:bg-[#1a2d48] hover:text-[#f0d060] transition-all duration-200 hover:scale-110 hover:shadow-[0_0_10px_rgba(212,168,67,0.3)]"
                  title="Social Link"
                >
                  {icon}
                </button>
              ))}
            </div>

            {/* Copyright */}
            <p className="text-[10px] md:text-xs text-[#8a7a60] tracking-wider font-body mt-1">
              © 2024 WORLD OF ONE'S RCE. LOST & FOUND TREASURY. All rights reserved.
            </p>
          </div>

          {/* Right Column: More Links */}
          <nav className="flex flex-col items-center md:items-end gap-2.5">
            <h3 className="font-pirate text-lg text-[#f0d060] tracking-widest mb-1 drop-shadow-[0_1px_6px_rgba(212,168,67,0.3)]">
              NAVIGATE
            </h3>
            {onWorldClick ? (
              <button
                type="button"
                onClick={onWorldClick}
                className="text-[#c4a870] hover:text-[#f0d060] text-sm font-sub tracking-wider transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                WORLD
              </button>
            ) : (
              <Link
                to="/world"
                className="text-[#c4a870] hover:text-[#f0d060] text-sm font-sub tracking-wider transition-colors duration-200"
              >
                WORLD
              </Link>
            )}
            <Link
              to="/news"
              className="text-[#c4a870] hover:text-[#f0d060] text-sm font-sub tracking-wider transition-colors duration-200"
            >
              NEWS
            </Link>
            <Link
              to="/contact"
              className="text-[#c4a870] hover:text-[#f0d060] text-sm font-sub tracking-wider transition-colors duration-200"
            >
              CONTACT
            </Link>
            <Link
              to="/contact"
              className="text-[#c4a870] hover:text-[#f0d060] text-sm font-sub tracking-wider transition-colors duration-200"
            >
              CONTACT US
            </Link>
          </nav>
        </div>
      </div>

      {/* Bottom edge glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#d4a843]/20 to-transparent" />
    </footer>
  )
}
