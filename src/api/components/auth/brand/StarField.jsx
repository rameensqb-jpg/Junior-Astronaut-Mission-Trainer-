const STARS = Array.from({ length: 120 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 100,
  size: i % 9 === 0 ? 3 : i % 4 === 0 ? 2 : 1.4,
  delay: ((i * 7) % 40) / 10,
  opacity: 0.25 + ((i * 13) % 60) / 100,
}));

export function StarField({ className = "" }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_0%,#1b2a63_0%,#101A35_45%,#0a1128_100%)]" />
      {STARS.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            opacity: s.opacity,
          }}
        />
      ))}
      <div className="animate-glow absolute -left-24 top-10 h-72 w-72 rounded-full bg-[hsl(var(--luna-purple))]/30 blur-3xl" />
      <div className="animate-glow absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-[hsl(var(--luna-cyan))]/15 blur-3xl" />
    </div>
  );
}

export default StarField;
