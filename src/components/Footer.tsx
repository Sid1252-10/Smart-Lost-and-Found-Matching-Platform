import { Link } from 'react-router-dom'
import { Compass, Anchor, Shield, Scroll, Map, Newspaper, HelpCircle, Mail, Award, Lock } from 'lucide-react'

export interface FooterProps {
  onWorldClick?: () => void
}

export function Footer({ onWorldClick }: FooterProps) {
  return (
    <footer className="relative w-full border-t border-[#d4a843]/30 bg-gradient-to-b from-[#061224] via-[#040c1a] to-[#020712] text-slate-300 font-body select-none">
      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start pb-8 border-b border-[#d4a843]/20">
          
          {/* Brand & Lore Column */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d4a843]/15 border border-[#d4a843]/50">
                <Compass className="h-5 w-5 text-[#f0d060]" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm tracking-wider text-[#f0d060]">
                  SABAODY ARCHIPELAGO
                </h3>
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                  Lost &amp; Found Treasury
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The premier decentralized nautical registry for misplaced relics, log poses, and pirate bounties across the Paradise Section of the Grand Line.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 rounded bg-[#d4a843]/10 border border-[#d4a843]/30 px-2 py-0.5 text-[10px] font-bold text-[#f0d060]">
                <Anchor className="h-3 w-3" /> Grove 1–79 Active
              </span>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div>
            <h4 className="font-heading text-xs font-bold text-[#f0d060] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Scroll className="h-3.5 w-3.5 text-[#d4a843]" /> Ledger Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/report" className="hover:text-[#f0d060] transition-colors flex items-center gap-2 text-slate-300">
                  <span className="text-[#d4a843]/60">›</span> File Incident Report
                </Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-[#f0d060] transition-colors flex items-center gap-2 text-slate-300">
                  <span className="text-[#d4a843]/60">›</span> Browse All Lost &amp; Found
                </Link>
              </li>
              <li>
                <Link to="/treasury" className="hover:text-[#f0d060] transition-colors flex items-center gap-2 text-slate-300">
                  <span className="text-[#d4a843]/60">›</span> Smart Match Correlation
                </Link>
              </li>
              <li>
                <Link to="/claiming" className="hover:text-[#f0d060] transition-colors flex items-center gap-2 text-slate-300">
                  <span className="text-[#d4a843]/60">›</span> Ownership Claim Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Exploration & Information */}
          <div>
            <h4 className="font-heading text-xs font-bold text-[#f0d060] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Map className="h-3.5 w-3.5 text-[#d4a843]" /> Grand Line Dispatch
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                {onWorldClick ? (
                  <button
                    type="button"
                    onClick={onWorldClick}
                    className="hover:text-[#f0d060] transition-colors flex items-center gap-2 text-slate-300 text-left"
                  >
                    <span className="text-[#d4a843]/60">›</span> Grand Line World Map
                  </button>
                ) : (
                  <Link to="/world" className="hover:text-[#f0d060] transition-colors flex items-center gap-2 text-slate-300">
                    <span className="text-[#d4a843]/60">›</span> Grand Line World Map
                  </Link>
                )}
              </li>
              <li>
                <Link to="/news" className="hover:text-[#f0d060] transition-colors flex items-center gap-2 text-slate-300">
                  <span className="text-[#d4a843]/60">›</span> Economic News Gazettes
                </Link>
              </li>
              <li>
                <Link to="/archives" className="hover:text-[#f0d060] transition-colors flex items-center gap-2 text-slate-300">
                  <span className="text-[#d4a843]/60">›</span> Grand Archives &amp; Vaults
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#f0d060] transition-colors flex items-center gap-2 text-slate-300">
                  <span className="text-[#d4a843]/60">›</span> FAQ &amp; Courier Protocol
                </Link>
              </li>
            </ul>
          </div>

          {/* Admiralty & Admin Access */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold text-[#f0d060] uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-[#d4a843]" /> Treasury Oversight
            </h4>
            <p className="text-xs text-slate-400">
              Station 66 Marine Headquarters verification post for anti-fraud validation and reward claims.
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 rounded-lg border border-[#d4a843]/40 bg-[#d4a843]/15 px-3 py-1.5 text-xs font-semibold text-[#f0d060] hover:bg-[#d4a843]/25 transition"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Marine Admin Desk</span>
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition"
              >
                <Mail className="h-3.5 w-3.5 text-[#d4a843]" />
                <span>Contact Harbor Master</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-[#f0d060] font-bold">☠ WORLD OF ONE PIECE</span>
            <span>•</span>
            <span>Sabaody Archipelago Lost &amp; Found Platform</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} Grand Line Treasury Bureau. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

