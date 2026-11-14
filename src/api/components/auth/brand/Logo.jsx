import { Link } from "@tanstack/react-router";

export default function Logo({ compact = false, to = "/" }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-3 focus-ring rounded-2xl" aria-label="LUNA: Beyond Survival home">
      <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-[hsl(var(--luna-purple))]/60 ring-1 ring-white/25">
        <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
          <path
            d="M20.5 4.2a12 12 0 1 0 7.3 19.4A10 10 0 1 1 20.5 4.2z"
            fill="#4EDBE8"
          />
          <circle cx="24.5" cy="8.5" r="2.2" fill="#FFAD55" />
        </svg>
        <span className="absolute -inset-1 -z-10 rounded-2xl bg-[hsl(var(--luna-cyan))]/20 blur-md transition group-hover:bg-[hsl(var(--luna-cyan))]/35" />
      </span>
      <span className="leading-none">
        <span className="block font-heading text-xl font-semibold tracking-[0.22em] text-[hsl(var(--luna-cream))]">
          LUNA
        </span>
        {!compact && (
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.32em] text-[hsl(var(--luna-lavender))]/80">
            Beyond Survival
          </span>
        )}
      </span>
    </Link>
  );
}
