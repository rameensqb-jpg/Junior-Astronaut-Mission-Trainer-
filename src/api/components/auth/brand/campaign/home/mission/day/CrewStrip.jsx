import { useT } from "@/lib/i18n/LanguageProvider";
import { CREW, ACCENTS } from "@/lib/content/crew";

export default function CrewStrip({ mission }) {
  const t = useT();
  const oxygenPct = mission.resources.oxygen / 60;
  const status = oxygenPct <= 0.2 ? "critical" : mission.radiation.exposure > 10 ? "monitoring" : "nominal";

  return (
    <section className="glass px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="label-caps me-1">{t("crew.title")}</p>
        {CREW.map((member) => (
          <div key={member.id} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1.5">
            <span className={`grid h-7 w-7 place-items-center rounded-full ring-1 ${ACCENTS[member.accent]} font-heading text-[10px] font-bold`}>
              {member.name.split(" ").map((n) => n[0]).join("")}
            </span>
            <span className="text-start leading-tight">
              <span className="block text-[11px] font-semibold text-[hsl(var(--luna-cream))]">{member.name}</span>
              <span className="block text-[9px] uppercase tracking-[0.1em] text-[hsl(var(--luna-lavender))]/75">{t(member.roleKey)}</span>
            </span>
          </div>
        ))}
        <span
          className={`ms-auto rounded-full px-3 py-1 text-[10px] font-semibold ${
            status === "critical"
              ? "bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive))]"
              : status === "monitoring"
                ? "bg-[hsl(var(--luna-orange))]/15 text-[hsl(var(--luna-orange))]"
                : "bg-[hsl(var(--luna-mint))]/15 text-[hsl(var(--luna-mint))]"
          }`}
        >
          {t(`crew.status.${status}`)}
        </span>
      </div>
    </section>
  );
}
