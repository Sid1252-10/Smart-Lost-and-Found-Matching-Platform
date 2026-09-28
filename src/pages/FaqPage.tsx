import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { ChevronDown, Anchor } from 'lucide-react'
import { AuthModal } from '../components/AuthModal'

const faqs = [
  {
    q: 'How does Observation Haki matching work?',
    a: 'The engine scores category (25%), keyword/description overlap (40%), island proximity (20%), and date closeness (15%). Results of 48%+ appear as parchment match cards.',
  },
  {
    q: 'Can I click the map instead of using dropdowns?',
    a: 'Yes. Selecting Reverse Mountain, Water 7, Sabaody, Alabasta, Marineford, Wano, Laugh Tale, or Punk Hazard writes that island into Location Lost/Found.',
  },
  {
    q: 'How do claims work?',
    a: 'Open any treasure card and file a claim. Crew identity is attached from your login. Owners can also mark an item recovered once it is back in hand.',
  },
  {
    q: 'Is this connected to a live backend?',
    a: 'This hackathon UI runs the matching client-side so judges can explore the full Grand Line experience immediately. The architecture is ready to plug into FastAPI + MongoDB.',
  },
  {
    q: 'How long does item registration last?',
    a: 'Each registered item stays active in the Grand Line Registry for 6 full tides (months). After that, the Portmaster will archive it in the Laugh Tale vault unless renewed.',
  },
  {
    q: 'Can I report an item on behalf of another pirate?',
    a: "Yes, any registered crew member can submit a report on behalf of their captain or crewmate. Simply enter the rightful owner's name in the Owner field when reporting.",
  },
]

export function FaqPage() {
  const [authOpen, setAuthOpen] = useState(false)
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="min-h-screen text-[#e2e8f0] flex flex-col">
      <Navbar onAuthClick={() => setAuthOpen(true)} />

      <main className="flex-1 px-4 py-10 md:px-8 max-w-[860px] mx-auto w-full">

        {/* Page Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.5)' }}
          >
            <Anchor className="h-6 w-6 text-[#f0d060]" />
          </div>
          <h1
            className="font-heading text-3xl md:text-5xl font-bold"
            style={{ fontFamily: '"Cinzel Decorative", Cinzel, serif', color: '#f0d060', textShadow: '0 0 30px rgba(212,168,67,0.4)' }}
          >
            Sailor's Codex
          </h1>
          <p className="mt-3 text-sm text-slate-400 max-w-lg mx-auto" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Frequently asked questions from pirates across the four seas.
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(212,168,67,0.5))' }} />
          <span className="text-[#d4a843] text-xs tracking-[0.25em] uppercase" style={{ fontFamily: 'Cinzel, serif' }}>⚓ Grand Line Registry FAQ ⚓</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(212,168,67,0.5))' }} />
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={faq.q}
              className="rounded-xl overflow-hidden transition-all duration-300"
              style={{
                border: open === index ? '1px solid rgba(212,168,67,0.6)' : '1px solid rgba(212,168,67,0.2)',
                background: open === index ? 'rgba(212,168,67,0.07)' : 'rgba(5,15,30,0.55)',
                backdropFilter: 'blur(12px)',
                boxShadow: open === index ? '0 0 24px rgba(212,168,67,0.12)' : 'none',
              }}
            >
              <button
                type="button"
                onClick={() => setOpen(open === index ? null : index)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span
                  className="text-sm font-semibold pr-4 transition-colors duration-200"
                  style={{ fontFamily: 'Cinzel, serif', color: open === index ? '#f0d060' : '#e2e8f0' }}
                >
                  {faq.q}
                </span>
                <ChevronDown
                  className="h-4 w-4 flex-shrink-0 text-[#d4a843] transition-transform duration-300"
                  style={{ transform: open === index ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </button>
              {open === index && (
                <div
                  className="px-5 pb-5 text-sm leading-relaxed"
                  style={{ fontFamily: 'Outfit, sans-serif', color: 'rgba(226,232,240,0.8)', borderTop: '1px solid rgba(212,168,67,0.15)' }}
                >
                  <p className="pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="mt-10 text-center rounded-2xl py-8 px-6"
          style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.2)', backdropFilter: 'blur(8px)' }}
        >
          <p className="text-sm text-slate-400 mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Still lost at sea? Send us a transmission and our registry keepers will respond within the next tide.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-bold text-[#0a0e1a] transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #d4a843, #f0d060)', fontFamily: 'Outfit, sans-serif' }}
          >
            ⚓ Contact the Registry
          </a>
        </div>
      </main>

      <Footer />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}
