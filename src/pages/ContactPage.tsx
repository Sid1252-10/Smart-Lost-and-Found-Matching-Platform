import { useState, type FormEvent, type CSSProperties } from 'react'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Send, Radio, CheckCircle2 } from 'lucide-react'
import { AuthModal } from '../components/AuthModal'

export function ContactPage() {
  const [authOpen, setAuthOpen] = useState(false)
  const [sent, setSent] = useState(false)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
    event.currentTarget.reset()
  }

  const inputStyle: CSSProperties = {
    width: '100%',
    borderRadius: '8px',
    border: '1px solid rgba(212,168,67,0.3)',
    background: 'rgba(5,15,35,0.6)',
    backdropFilter: 'blur(8px)',
    padding: '10px 14px',
    fontSize: '0.875rem',
    color: '#e2e8f0',
    outline: 'none',
    fontFamily: 'Outfit, sans-serif',
    transition: 'border-color 0.2s',
  }

  return (
    <div className="min-h-screen text-[#e2e8f0] flex flex-col">
      <Navbar onAuthClick={() => setAuthOpen(true)} />

      <main className="flex-1 px-4 py-10 md:px-8 max-w-[680px] mx-auto w-full">

        {/* Page Header */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4"
            style={{ background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.5)' }}
          >
            <Radio className="h-6 w-6 text-[#f0d060] animate-pulse" />
          </div>
          <h1
            className="text-3xl md:text-5xl font-bold"
            style={{ fontFamily: '"Cinzel Decorative", Cinzel, serif', color: '#f0d060', textShadow: '0 0 30px rgba(212,168,67,0.4)' }}
          >
            Den Den Mushi
          </h1>
          <p className="mt-3 text-sm text-slate-400 max-w-md mx-auto" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Reach the Wanderlust Registry keepers via Transponder Snail. Our crew monitors all transmissions across the Grand Line.
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(212,168,67,0.5))' }} />
          <span className="text-[#d4a843] text-xs tracking-[0.25em] uppercase" style={{ fontFamily: 'Cinzel, serif' }}>⚓ Contact Registry ⚓</span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(212,168,67,0.5))' }} />
        </div>

        {/* Contact Form Card */}
        <div
          className="rounded-2xl p-6 md:p-8"
          style={{ background: 'rgba(5,15,35,0.55)', border: '1px solid rgba(212,168,67,0.25)', backdropFilter: 'blur(14px)', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}
        >
          {sent ? (
            <div className="text-center py-8">
              <CheckCircle2 className="h-12 w-12 text-[#f0d060] mx-auto mb-4" />
              <h2 className="text-xl font-bold text-[#f0d060] mb-2" style={{ fontFamily: 'Cinzel, serif' }}>
                Transmission Sent!
              </h2>
              <p className="text-sm text-slate-300" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Message logged. A registry keeper will reply on the next tide. ⚓
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-6 rounded-lg px-6 py-2.5 text-sm font-bold text-[#0a0e1a] hover:brightness-110 transition-all"
                style={{ background: 'linear-gradient(135deg, #d4a843, #f0d060)', fontFamily: 'Outfit, sans-serif' }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#f0d060] mb-1.5 tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                  Your Name / Pirate Alias
                </label>
                <input
                  required
                  name="name"
                  placeholder="e.g. Monkey D. Luffy"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'rgba(212,168,67,0.7)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(212,168,67,0.3)')}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#f0d060] mb-1.5 tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                  Transponder Snail / Email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="captain@thousandsunny.sea"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'rgba(212,168,67,0.7)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(212,168,67,0.3)')}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#f0d060] mb-1.5 tracking-wider uppercase" style={{ fontFamily: 'Cinzel, serif' }}>
                  Message to the Registry
                </label>
                <textarea
                  required
                  name="message"
                  rows={5}
                  placeholder="Describe your inquiry, lost item situation, or feedback..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(212,168,67,0.7)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(212,168,67,0.3)')}
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold text-[#0a0e1a] hover:brightness-110 transition-all"
                style={{ background: 'linear-gradient(135deg, #d4a843 0%, #f0d060 50%, #b88a2e 100%)', fontFamily: 'Outfit, sans-serif', boxShadow: '0 0 20px rgba(212,168,67,0.3)' }}
              >
                <Send className="h-4 w-4" />
                Send Transmission
              </button>
            </form>
          )}
        </div>

        {/* Info row */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: '🐌', label: 'Response Time', value: 'Within 1 Tide' },
            { icon: '⚓', label: 'Registry Port', value: 'Sabaody Arch.' },
            { icon: '☠️', label: 'Crew Status', value: 'Active & Sailing' },
          ].map(item => (
            <div
              key={item.label}
              className="rounded-xl py-4 px-2"
              style={{ background: 'rgba(5,15,35,0.45)', border: '1px solid rgba(212,168,67,0.15)', backdropFilter: 'blur(8px)' }}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5" style={{ fontFamily: 'Cinzel, serif' }}>{item.label}</div>
              <div className="text-xs font-semibold text-[#f0d060]" style={{ fontFamily: 'Outfit, sans-serif' }}>{item.value}</div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  )
}
