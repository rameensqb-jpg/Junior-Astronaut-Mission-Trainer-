import { useState } from "react";
import { Home, Sun, FlaskConical, Sprout, RadioTower, Truck, ShieldCheck } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";

const AREAS = [
  { id: "habitat", icon: Home, x: 42, y: 52, system: "lifeSupport" },
  { id: "solar", icon: Sun, x: 12, y: 44, system: "panels" },
  { id: "lab", icon: FlaskConical, x: 63, y: 40, system: "comms" },
  { id: "greenhouse", icon: Sprout, x: 27, y: 76, system: "greenhouse" },
  { id: "antenna", icon: RadioTower, x: 77, y: 26, system: "comms" },
  { id: "rover", icon: Truck, x: 84, y: 68, system: "rover" },
  { id: "shelter", icon: ShieldCheck, x: 58, y: 80, system: "lifeSupport" },
];

export default function OutpostMap({ mission }) {
  const t = useT();
  const [selected, setSelected] = useState("habitat");
  const area = AREAS.find((a) => a.id === selected);
  const condition = Math.round(mission.systems[area.system]);
  const Icon = area.icon;

  return (
    <section className="glass overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="font-heading text-base font-semibold">{t("map.title")}</h2>
          <p className="text-[11px] text-[hsl(var(--luna-lavender))]/80">{t("map.hint")}</p>
        </div>
        <span className="pill text-[hsl(var(--luna-cyan))]">{t("map.simulated")}</span>
      </div>

      <div className="relative aspect-[16/9] w-full bg-[radial-gradient(120%_100%_at_50%_0%,#1d2a5e_0%,#101a35_60%,#0b1330_100%)]">
        <svg viewBox="0 0 100 56" className="absolute inset-0 h-full w-full" aria-hidden="true" preserveAspectRatio="none">
          <path d="M0 40 Q25 34 50 39 Q75 44 100 37 L100 56 L0 56 Z" fill="#2a335f" opacity="0.85" />
          <path d="M0 40 Q25 34 50 39 Q75 44 100 37" fill="none" stroke="#6f7bb5" strokeWidth="0.4" opacity="0.7" />
          {[[14, 47], [70, 49], [40, 51], [88, 45]].map(([cx, cy], i) => (
            <ellipse key={i} cx={cx} cy={cy} rx={4 - i * 0.4} ry={1.1} fill="#1a2247" opacity="0.8" />
          ))}
          <g stroke="#8f9bd8" strokeWidth="0.35" fill="none" opacity="0.6">
            <path d="M42 46 L27 50" />
            <path d="M42 46 L12 44" />
            <path d="M42 46 L63 40" />
            <path d="M42 46 L77 38" />
          </g>
        </svg>

        {AREAS.map((a) => {
          const A = a.icon;
          const active = a.id === selected;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelected(a.id)}
              aria-pressed={active}
              className={`focus-ring absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10px] font-semibold transition sm:px-3 sm:text-xs ${
                active
                  ? "border-[hsl(var(--luna-cyan))] bg-[hsl(var(--luna-cyan))]/20 text-[hsl(var(--luna-cream))] shadow-[0_0_24px_-6px_rgba(78,219,232,0.9)]"
                  : "border-white/20 bg-[#0f1838]/85 text-[hsl(var(--luna-lavender))] hover:border-white/45"
              }`}
              style={{ left: `${a.x}%`, top: `${a.y}%` }}
            >
              <A className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{t(`area.${a.id}.name`)}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 border-t border-white/10 p-5 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[hsl(var(--luna-cyan))]/15 text-[hsl(var(--luna-cyan))]">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <h3 className="font-heading text-base font-semibold">{t(`area.${area.id}.name`)}</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{t(`area.${area.id}.fn`)}</p>
          <p className="mt-3 text-xs leading-relaxed text-[hsl(var(--luna-orange))]">{t(`area.${area.id}.risk`)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <p className="label-caps">{t("map.condition")}</p>
          <p className="mt-2 font-heading text-2xl font-semibold">{condition}%</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full bg-[hsl(var(--luna-mint))]" style={{ width: `${Math.max(3, condition)}%` }} />
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-[hsl(var(--luna-lavender))]/85">{t(`area.${area.id}.learn`)}</p>
        </div>
      </div>
    </section>
  );
}
