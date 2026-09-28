import { useState } from 'react'
import { GrandLineMap } from '../components/GrandLineMap'
import { Navbar } from '../components/Navbar'
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
]

export function FaqPage() {
  const [authOpen, setAuthOpen] = useState(false)
  const [open, setOpen] = useState(0)

  return (
    <div className="relative min-h-screen">
      <GrandLineMap variant="background" selectedId="water-7" onSelect={() => undefined} />
      <div className="relative z-20">
        <Navbar onAuthClick={() => setAuthOpen(true)} />
        <div className="glass-panel mx-4 mb-10 max-w-3xl rounded-2xl p-6 md:mx-8">
          <h1 className="font-serif text-4xl text-white">FAQ</h1>
          <div className="mt-4 divide-y divide-slate-700/80">
            {faqs.map((faq, index) => (
              <button
                key={faq.q}
                type="button"
                onClick={() => setOpen(index)}
                className="block w-full py-4 text-left"
              >
                <p className="text-sm font-medium text-emerald-300">{faq.q}</p>
                {open === index && <p className="mt-2 text-sm text-slate-300">{faq.a}</p>}
              </button>
            ))}
          </div>
        </div>
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}
