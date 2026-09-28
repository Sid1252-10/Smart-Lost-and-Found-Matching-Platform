import { CalendarCheck, Headphones, Lock, Shield } from 'lucide-react'

const features = [
  { icon: Shield, label: 'Lost Reporting' },
  { icon: Headphones, label: 'Claiming Support' },
  { icon: CalendarCheck, label: 'Tracking' },
  { icon: Lock, label: 'Secure Verification' },
]

export function FeatureStats() {
  return (
    <div className="relative z-20 space-y-5">
      <div className="glass-panel grid grid-cols-4 gap-2 rounded-2xl p-3 md:p-4">
        {features.map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 py-2 text-center">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600/60 bg-slate-950/40 text-slate-200">
              <Icon className="h-4 w-4" />
            </span>
            <span className="text-[10px] leading-tight text-slate-300 md:text-[11px]">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-right text-[10px] tracking-[0.22em] text-slate-400">DESIGNED BY WANDERLUST CREATIVE</p>
    </div>
  )
}

export function StatsRow() {
  const stats = [
    { value: '500+', label: 'Items Reported' },
    { value: '15k+', label: 'Successfully Claimed' },
    { value: '200+', label: 'Verified Records' },
  ]

  return (
    <div className="relative z-20 mt-4 grid grid-cols-2 gap-6 px-2 pb-3 text-white md:grid-cols-4 md:px-6">
      {stats.map((stat) => (
        <div key={stat.label}>
          <p className="font-serif text-3xl md:text-4xl">{stat.value}</p>
          <p className="text-xs text-slate-400">{stat.label}</p>
        </div>
      ))}
      <div>
        <p className="font-serif text-3xl md:text-4xl">4.9+</p>
        <p className="text-xs text-slate-400">Success Rating</p>
        <p className="mt-1 text-amber-300">★★★★★</p>
      </div>
    </div>
  )
}
