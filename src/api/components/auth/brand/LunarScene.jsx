export default function LunarScene({ className = "" }) {
  return (
    <svg
      viewBox="0 0 800 560"
      className={className}
      role="img"
      aria-label="Illustration of Lunar Outpost Alpha: a glowing research habitat, solar panels, a rover and four astronauts on the Moon with Earth in the sky"
    >
      <defs>
        <linearGradient id="lunaSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a1130" />
          <stop offset="55%" stopColor="#1b2352" />
          <stop offset="100%" stopColor="#3a2f72" />
        </linearGradient>
        <radialGradient id="lunaHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4EDBE8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#4EDBE8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lunaGround" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e2dcf3" />
          <stop offset="40%" stopColor="#b9b1d8" />
          <stop offset="100%" stopColor="#6d6795" />
        </linearGradient>
        <linearGradient id="lunaDome" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF7E9" />
          <stop offset="70%" stopColor="#dcd3f8" />
          <stop offset="100%" stopColor="#b8a8ff" />
        </linearGradient>
        <linearGradient id="lunaPanel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2f6bb5" />
          <stop offset="100%" stopColor="#123a70" />
        </linearGradient>
        <linearGradient id="lunaEarth" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7fd7ff" />
          <stop offset="55%" stopColor="#3f8fd8" />
          <stop offset="100%" stopColor="#245fa8" />
        </linearGradient>
        <radialGradient id="lunaWindow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe6b8" />
          <stop offset="100%" stopColor="#ffad55" />
        </radialGradient>
      </defs>

      {/* sky */}
      <rect width="800" height="560" fill="url(#lunaSky)" />
      <circle cx="250" cy="120" r="170" fill="url(#lunaHalo)" />

      {/* stars */}
      {[
        [60, 60, 2], [140, 40, 1.6], [210, 96, 2.4], [300, 46, 1.6], [360, 108, 2],
        [430, 58, 1.6], [500, 96, 2.2], [560, 44, 1.6], [640, 88, 2], [710, 52, 1.6],
        [760, 118, 2.2], [100, 170, 1.6], [470, 168, 1.6], [660, 176, 1.8], [40, 240, 1.4],
      ].map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="#FFF7E9" opacity={0.35 + (i % 5) * 0.12} />
      ))}

      {/* Earth */}
      <g className="animate-drift">
        <circle cx="612" cy="140" r="66" fill="url(#lunaEarth)" />
        <path d="M572 118c16 8 30 2 42 10 10 6 4 18-8 20-14 3-24-4-34-10-8-6-8-16 0-20z" fill="#83D9B2" opacity="0.85" />
        <path d="M600 168c14-6 26 0 34 8 6 7-2 14-12 14-12 0-26-4-28-12-1-4 2-8 6-10z" fill="#83D9B2" opacity="0.7" />
        <path d="M566 148c10-4 18 2 20 8s-6 10-14 8-14-12-6-16z" fill="#ffffff" opacity="0.5" />
        <circle cx="612" cy="140" r="66" fill="none" stroke="#bdeaff" strokeOpacity="0.55" strokeWidth="2" />
      </g>

      {/* distant mountains */}
      <path d="M0 372 L120 322 L210 366 L300 316 L410 372 L520 330 L620 372 L720 336 L800 372 L800 400 L0 400 Z" fill="#8d86b8" opacity="0.45" />

      {/* lunar surface */}
      <path d="M0 400 Q200 356 420 396 Q620 432 800 388 L800 560 L0 560 Z" fill="url(#lunaGround)" />
      <ellipse cx="150" cy="470" rx="70" ry="18" fill="#a49cc6" opacity="0.55" />
      <ellipse cx="660" cy="500" rx="92" ry="22" fill="#a49cc6" opacity="0.45" />
      <ellipse cx="390" cy="520" rx="60" ry="16" fill="#a49cc6" opacity="0.4" />

      {/* solar array */}
      <g>
        <rect x="86" y="404" width="7" height="76" rx="3" fill="#5b5680" />
        <rect x="150" y="414" width="7" height="70" rx="3" fill="#5b5680" />
        <g>
          <rect x="52" y="356" width="120" height="52" rx="8" fill="url(#lunaPanel)" stroke="#9fd8ff" strokeOpacity="0.6" strokeWidth="2" transform="rotate(-6 112 382)" />
          {[0, 1, 2, 3].map((r) => (
            <line key={r} x1="60" y1={368 + r * 12} x2="166" y2={362 + r * 12} stroke="#9fd8ff" strokeOpacity="0.5" strokeWidth="1.6" transform="rotate(-6 112 382)" />
          ))}
          {[0, 1, 2, 3].map((c) => (
            <line key={c} x1={74 + c * 26} y1="356" x2={70 + c * 26} y2="408" stroke="#9fd8ff" strokeOpacity="0.4" strokeWidth="1.4" transform="rotate(-6 112 382)" />
          ))}
        </g>
      </g>

      {/* habitat domes */}
      <g>
        <ellipse cx="352" cy="452" rx="150" ry="26" fill="#7a739f" opacity="0.45" />
        <path d="M228 442a124 108 0 0 1 248 0z" fill="url(#lunaDome)" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="3" />
        <path d="M300 442a52 52 0 0 1 104 0z" fill="#5d55a0" opacity="0.85" />
        <circle cx="352" cy="424" r="14" fill="url(#lunaWindow)" />
        <rect x="286" y="434" width="30" height="18" rx="9" fill="url(#lunaWindow)" opacity="0.9" />
        <rect x="388" y="434" width="30" height="18" rx="9" fill="url(#lunaWindow)" opacity="0.9" />
        <rect x="196" y="436" width="58" height="24" rx="12" fill="#e9e2fb" opacity="0.95" />
        <rect x="450" y="436" width="58" height="24" rx="12" fill="#e9e2fb" opacity="0.95" />
        <circle cx="352" cy="330" r="8" fill="#4EDBE8" />
        <line x1="352" y1="332" x2="352" y2="352" stroke="#4EDBE8" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* antenna */}
      <g>
        <rect x="536" y="404" width="6" height="62" rx="3" fill="#5b5680" />
        <path d="M498 396a64 44 0 0 1 82 0" fill="none" stroke="#FFF7E9" strokeWidth="6" strokeLinecap="round" />
        <line x1="539" y1="404" x2="539" y2="386" stroke="#FFF7E9" strokeWidth="4" />
        <circle cx="539" cy="382" r="6" fill="#FFAD55" />
      </g>

      {/* rover */}
      <g>
        <rect x="612" y="430" width="96" height="34" rx="12" fill="#FFF7E9" />
        <rect x="628" y="408" width="52" height="26" rx="9" fill="#b8a8ff" />
        <circle cx="632" cy="470" r="12" fill="#4a4670" stroke="#FFF7E9" strokeWidth="3" />
        <circle cx="690" cy="470" r="12" fill="#4a4670" stroke="#FFF7E9" strokeWidth="3" />
        <rect x="700" y="414" width="4" height="18" fill="#FFF7E9" />
        <circle cx="702" cy="410" r="5" fill="#4EDBE8" />
      </g>

      {/* crew */}
      {[
        { x: 262, y: 486, c: "#FFAD55" },
        { x: 300, y: 498, c: "#4EDBE8" },
        { x: 462, y: 492, c: "#83D9B2" },
        { x: 498, y: 502, c: "#B8A8FF" },
      ].map((a, i) => (
        <g key={i}>
          <ellipse cx={a.x} cy={a.y + 34} rx="14" ry="4" fill="#6d6795" opacity="0.5" />
          <rect x={a.x - 10} y={a.y + 6} width="20" height="26" rx="9" fill="#f4f0ff" />
          <rect x={a.x - 8} y={a.y - 4} width="16" height="8" rx="4" fill={a.c} opacity="0.9" />
          <circle cx={a.x} cy={a.y - 12} r="13" fill="#f4f0ff" />
          <circle cx={a.x} cy={a.y - 12} r="13" fill="none" stroke={a.c} strokeWidth="2.5" opacity="0.85" />
          <rect x={a.x - 7} y={a.y - 16} width="14" height="7" rx="3.5" fill="#22305c" opacity="0.85" />
        </g>
      ))}
    </svg>
  );
}
