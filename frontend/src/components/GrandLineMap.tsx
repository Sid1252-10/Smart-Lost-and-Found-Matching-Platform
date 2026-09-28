import { ISLANDS } from '../data/catalog'

type GrandLineMapProps = {
  selectedId: string
  onSelect: (id: string) => void
}

export function GrandLineMap({ selectedId, onSelect }: GrandLineMapProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#163a4a]" />
      <div className="starfield absolute inset-x-0 top-0 h-[38%]" />
      <div className="absolute inset-x-0 top-0 h-[42%] bg-[radial-gradient(ellipse_at_70%_0%,rgba(180,70,30,0.45),transparent_42%),radial-gradient(ellipse_at_40%_-10%,rgba(90,40,80,0.35),transparent_40%),linear-gradient(180deg,#071018_0%,#122433_55%,transparent_100%)]" />
      <svg viewBox="0 0 1600 900" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a6a7a" />
            <stop offset="45%" stopColor="#3d8b96" />
            <stop offset="100%" stopColor="#1d4d5c" />
          </linearGradient>
          <radialGradient id="islandSand" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#f3e0b0" />
            <stop offset="100%" stopColor="#c9a56a" />
          </radialGradient>
          <radialGradient id="islandGreen" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#8fbf6a" />
            <stop offset="100%" stopColor="#4d7a3a" />
          </radialGradient>
          <filter id="soft">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#082028" floodOpacity="0.35" />
          </filter>
        </defs>

        <rect x="0" y="180" width="1600" height="720" fill="url(#sea)" />
        <path d="M0 250 C 200 210, 380 280, 560 240 S 900 180, 1100 230 S 1400 300, 1600 250 V 0 H 0 Z" fill="#0d1a24" opacity="0.25" />

        <g fill="none" stroke="#d7efe8" strokeWidth="2" strokeDasharray="7 10" opacity="0.55">
          <path d="M250 180 C 360 220, 470 210, 760 250 C 900 270, 980 240, 1160 280" />
          <path d="M760 250 C 700 340, 620 390, 500 460 C 700 500, 780 470, 780 580 C 900 560, 1080 540, 1160 540" />
          <path d="M1160 280 C 1220 360, 1180 430, 1160 540 C 1280 620, 1360 640, 1430 680" />
          <path d="M500 460 C 430 520, 520 600, 600 660" />
        </g>

        <ellipse cx="180" cy="140" rx="150" ry="70" fill="#d8c089" filter="url(#soft)" />
        <path d="M80 140 C 120 40, 240 40, 280 145" fill="#c7ad74" />
        <path d="M150 70 L175 20 L200 70" fill="#8aa8b0" />
        <text x="70" y="88" fill="#dbe7ea" fontSize="13" letterSpacing="3" fontFamily="Outfit">REVERSE</text>
        <text x="70" y="108" fill="#dbe7ea" fontSize="13" letterSpacing="3" fontFamily="Outfit">MOUNTAIN</text>

        <g filter="url(#soft)">
          <ellipse cx="770" cy="250" rx="95" ry="58" fill="url(#islandSand)" />
          <rect x="730" y="198" width="78" height="58" rx="6" fill="#e8d9b0" />
          <polygon points="720,208 770,160 820,208" fill="#c9b48a" />
          <rect x="756" y="214" width="16" height="22" fill="#6b4a2a" />
          <circle cx="812" cy="228" r="10" fill="#7aa3c4" />
        </g>
        <g fill="#c9dbe3" fontFamily="Outfit" fontSize="13" letterSpacing="2">
          <text x="820" y="236">WATER 7</text>
        </g>

        <g filter="url(#soft)">
          <ellipse cx="1170" cy="285" rx="110" ry="62" fill="#6d9a55" />
          <path d="M1100 290 C 1110 230, 1140 220, 1155 275" fill="#4f7a3a" />
          <path d="M1150 292 C 1168 210, 1208 218, 1220 286" fill="#5b8a42" />
          <path d="M1218 290 C 1234 236, 1264 240, 1270 292" fill="#4a7236" />
          <circle cx="1148" cy="232" r="16" fill="#6ea24a" />
          <circle cx="1210" cy="226" r="18" fill="#5f933f" />
        </g>
        <text x="1238" y="252" fill="#d7e6ea" fontSize="12" letterSpacing="1.5" fontFamily="Outfit">SABAODY</text>
        <text x="1238" y="268" fill="#d7e6ea" fontSize="12" letterSpacing="1.5" fontFamily="Outfit">ARCHIPELAGO</text>

        <g filter="url(#soft)">
          <ellipse cx="500" cy="460" rx="120" ry="70" fill="#e2c37a" />
          <path d="M430 470 C 470 410, 560 400, 580 468" fill="#d4b162" />
          <circle cx="455" cy="445" r="10" fill="#c7a052" />
        </g>
        <text x="455" y="545" fill="#eef4f6" fontSize="14" letterSpacing="3" fontFamily="Outfit">ALABASTA</text>
        <path d="M430 430 C 450 390, 390 370, 410 340" fill="none" stroke="#8fb7c4" strokeWidth="3" />
        <polygon points="408,338 430,348 412,360" fill="#d9e4c8" />

        <g filter="url(#soft)">
          <ellipse cx="780" cy="585" rx="100" ry="62" fill="#d7c7a1" />
          <rect x="735" y="535" width="90" height="55" rx="4" fill="#efe6cf" />
          <polygon points="728,540 780,500 832,540" fill="#c9b48a" />
          <circle cx="820" cy="555" r="8" fill="#6a93b0" />
        </g>
        <text x="730" y="668" fill="#eef4f6" fontSize="14" letterSpacing="2.5" fontFamily="Outfit">MARINEFORD</text>

        <g filter="url(#soft)">
          <ellipse cx="1165" cy="535" rx="115" ry="68" fill="#8fbf6a" />
          <path d="M1090 540 C 1120 470, 1210 470, 1245 540" fill="#6d9a4d" />
        </g>
        <g fill="#f4b6c8">
          <circle cx="1110" cy="500" r="7" />
          <circle cx="1140" cy="486" r="9" />
          <circle cx="1186" cy="492" r="8" />
          <circle cx="1222" cy="508" r="7" />
          <circle cx="1160" cy="510" r="6" />
        </g>
        <text x="1138" y="620" fill="#eef4f6" fontSize="16" letterSpacing="4" fontFamily="Outfit">WANO</text>

        <g filter="url(#soft)">
          <ellipse cx="1430" cy="680" rx="85" ry="50" fill="#d9c48a" />
        </g>
        <text x="1388" y="750" fill="#f1f5f7" fontSize="13" letterSpacing="2" fontFamily="Outfit">LAUGH TALE</text>
        <text x="1478" y="668" fill="#f8fafc" fontSize="22" fontFamily="Outfit">? ? ?</text>

        <g filter="url(#soft)">
          <ellipse cx="610" cy="670" rx="70" ry="38" fill="#c9d6a8" />
          <path d="M570 670 h80" stroke="#7a9aa6" strokeWidth="6" />
        </g>

        <g transform="translate(980 160)">
          <ellipse cx="40" cy="48" rx="38" ry="22" fill="#4f8d78" />
          <path d="M10 40 C 30 0, 70 8, 78 42" fill="#67a38a" />
          <circle cx="70" cy="18" r="10" fill="#3e6d72" />
          <path d="M78 16 q 18 -16 28 6" fill="none" stroke="#2b4d52" strokeWidth="3" />
        </g>

        <g fill="#9fd0d8" opacity="0.7">
          <circle cx="260" cy="330" r="7" />
          <circle cx="300" cy="360" r="4" />
          <circle cx="900" cy="400" r="6" />
          <circle cx="1280" cy="430" r="5" />
          <circle cx="1040" cy="620" r="4" />
        </g>

        <g transform="translate(980 250)">
          <circle cx="0" cy="0" r="28" fill="#efe6c8" stroke="#b08948" strokeWidth="3" />
          <circle cx="0" cy="0" r="4" fill="#6b4a22" />
          <path d="M0 -20 L4 0 L0 20 L-4 0 Z" fill="#2d4a3a" />
          <path d="M-20 0 L0 4 L20 0 L0 -4 Z" fill="#8b3a2a" />
        </g>

        <g transform="translate(860 330)">
          <rect x="0" y="8" width="36" height="28" rx="6" fill="#6b4423" />
          <path d="M4 8 C 4 -4, 32 -4, 32 8" fill="none" stroke="#d7c7a4" strokeWidth="4" />
        </g>
        <g transform="translate(900 300)" fill="#c9b48a">
          <rect x="0" y="8" width="8" height="20" rx="2" />
          <path d="M-4 8 h16 v6 h-16 z" />
        </g>
        <g transform="translate(1280 360)">
          <circle cx="10" cy="18" r="10" fill="#d7c7a4" />
          <path d="M10 8 C 18 -6, 30 4, 22 16" fill="none" stroke="#c9b48a" strokeWidth="3" />
        </g>
        <path d="M240 500 C 280 470, 250 430, 290 400" fill="none" stroke="#8fb7c4" strokeWidth="4" />
        <ellipse cx="300" cy="392" rx="18" ry="10" fill="#7aa3c4" />
      </svg>
      <div className="map-vignette pointer-events-none absolute inset-0" />

      {ISLANDS.map((island) => {
        const active = selectedId === island.id
        return (
          <button
            key={island.id}
            type="button"
            onClick={() => onSelect(island.id)}
            style={{ left: `${island.x}%`, top: `${island.y}%` }}
            className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full transition ${
              active ? 'scale-110' : 'hover:scale-105'
            }`}
            aria-label={`Select ${island.name}`}
          >
            <span
              className={`block h-5 w-5 rounded-full border-2 ${
                active
                  ? 'border-emerald-300 bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.85)]'
                  : 'border-white/70 bg-white/30'
              }`}
            />
            {active && (
              <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-950/80 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                {island.name}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
