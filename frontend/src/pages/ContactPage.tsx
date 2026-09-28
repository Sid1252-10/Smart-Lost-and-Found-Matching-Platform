import { useState, type FormEvent } from 'react'
import { GrandLineMap } from '../components/GrandLineMap'
import { Navbar } from '../components/Navbar'
import { AuthModal } from '../components/AuthModal'

export function ContactPage() {
  const [authOpen, setAuthOpen] = useState(false)
  const [sent, setSent] = useState(false)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
    event.currentTarget.reset()
  }

  return (
    <div className="relative min-h-screen">
      <GrandLineMap variant="background" selectedId="sabaody" onSelect={() => undefined} />
      <div className="relative z-20">
        <Navbar onAuthClick={() => setAuthOpen(true)} />
        <form onSubmit={onSubmit} className="glass-panel mx-4 mb-10 max-w-xl rounded-2xl p-6 md:mx-8">
          <h1 className="font-serif text-4xl text-white">Contact Us</h1>
          <p className="mb-4 text-sm text-slate-300">Reach the Wanderlust registry keepers via Den Den Mushi.</p>
          <div className="space-y-3">
            <input required name="name" placeholder="Your name" className="w-full rounded-lg border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-sm" />
            <input required type="email" name="email" placeholder="Transponder snail / email" className="w-full rounded-lg border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-sm" />
            <textarea required name="message" rows={5} placeholder="How can the crew help?" className="w-full rounded-lg border border-slate-600 bg-slate-950/50 px-3 py-2.5 text-sm" />
            <button type="submit" className="w-full rounded-full bg-emerald-500 py-3 text-sm font-semibold text-slate-950">
              Send Transmission
            </button>
            {sent && <p className="text-sm text-emerald-300">Message logged. A registrar will reply on the next tide.</p>}
          </div>
        </form>
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}
