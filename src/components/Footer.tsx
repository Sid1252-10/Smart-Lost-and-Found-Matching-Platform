import { Link } from 'react-router-dom'

export interface FooterProps {
  onWorldClick?: () => void
}

export function Footer({ onWorldClick }: FooterProps) {
  return (
    <footer className="relative w-full overflow-hidden bg-[#2b190d] text-[#2c1b0c] select-none border-t border-[#6d451b]/60">
      {/* Background container maintaining landscape parchment aspect ratio */}
      <div className="relative mx-auto max-w-[1440px] aspect-[682/136] w-full min-h-[140px] sm:min-h-[160px] md:min-h-[180px] overflow-hidden">
        {/* Exact Footer Artwork */}
        <img
          src="/extracted/footer_bg.jpg"
          alt="Treasury Footer Nautical Chart"
          className="h-full w-full object-cover pointer-events-none"
          style={{ objectPosition: '20% center' }}
        />

        {/* Interactive Clickable Hotspots overlay matching the text in the image */}
        {/* Left Column Links: MY REPORTS, CLAIM PORTAL, ARCHIVES, FAQ */}
        <div
          style={{
            position: 'absolute',
            left: '23.5%',
            top: '22%',
            width: '13%',
            height: '52%',
          }}
          className="flex flex-col justify-between"
        >
          <Link
            to="/report"
            className="h-[22%] w-full rounded hover:bg-black/10 focus:ring-1 focus:ring-amber-800 transition-colors"
            title="My Reports"
          />
          <Link
            to="/claiming"
            className="h-[22%] w-full rounded hover:bg-black/10 focus:ring-1 focus:ring-amber-800 transition-colors"
            title="Claim Portal"
          />
          <Link
            to="/archives"
            className="h-[22%] w-full rounded hover:bg-black/10 focus:ring-1 focus:ring-amber-800 transition-colors"
            title="Treasury Archives"
          />
          <Link
            to="/faq"
            className="h-[22%] w-full rounded hover:bg-black/10 focus:ring-1 focus:ring-amber-800 transition-colors"
            title="Frequently Asked Questions"
          />
        </div>

        {/* Center Jolly Roger Skull & Social Crests */}
        <div
          style={{
            position: 'absolute',
            left: '44%',
            top: '15%',
            width: '12%',
            height: '62%',
          }}
          className="group cursor-pointer flex flex-col items-center justify-end"
          title="Straw Hat Grand Fleet Treasury"
        >
          <div className="w-full h-full rounded hover:bg-amber-900/10 transition-colors" />
        </div>

        {/* Right Column Links: WORLD, NEWS, CONTACT, CONTACT US */}
        <div
          style={{
            position: 'absolute',
            left: '63.5%',
            top: '22%',
            width: '13%',
            height: '52%',
          }}
          className="flex flex-col justify-between"
        >
          {onWorldClick ? (
            <button
              type="button"
              onClick={onWorldClick}
              className="h-[22%] w-full text-left rounded hover:bg-black/10 focus:ring-1 focus:ring-amber-800 transition-colors"
              title="World Grand Line Map"
            />
          ) : (
            <Link
              to="/world"
              className="h-[22%] w-full rounded hover:bg-black/10 focus:ring-1 focus:ring-amber-800 transition-colors"
              title="World Grand Line Map"
            />
          )}
          <Link
            to="/news"
            className="h-[22%] w-full rounded hover:bg-black/10 focus:ring-1 focus:ring-amber-800 transition-colors"
            title="World Economic News"
          />
          <Link
            to="/contact"
            className="h-[22%] w-full rounded hover:bg-black/10 focus:ring-1 focus:ring-amber-800 transition-colors"
            title="Contact Treasury"
          />
          <Link
            to="/contact"
            className="h-[22%] w-full rounded hover:bg-black/10 focus:ring-1 focus:ring-amber-800 transition-colors"
            title="Contact Us"
          />
        </div>
      </div>
    </footer>
  )
}
