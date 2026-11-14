import { CalendarDays } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";

export default function MissionLog({ history = [] }) {
  const t = useT();

  return (
    <section className="glass p-4 sm:p-5">
      <h2 className="flex items-center gap-2 font-heading text-sm font-semibold">
        <CalendarDays className="h-4 w-4 text-[hsl(var(--luna-cyan))]" aria-hidden="true" />
        {t("day.missionLog")}
      </h2>
      {history.length === 0 ? (
        <p className="mt-2 text-[11px] text-[hsl(var(--luna-lavender))]">{t("day.logEmpty")}</p>
      ) : (
        <ol className="mt-3 space-y-1.5">
          {history.map((entry) => (
            <li key={entry.day} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-[11px] font-semibold text-[hsl(var(--luna-cream))]">
                  {t("common.day")} {entry.day} · {entry.focus}
                </p>
                <span className="text-[10px] text-[hsl(var(--luna-mint))]">
                  {entry.objectivesDone}/{entry.objectivesTotal}
                </span>
              </div>
              {entry.event?.label && (
                <p className="mt-0.5 text-[10px] leading-relaxed text-[hsl(var(--luna-lavender))]">
                  {entry.event.title}: <span className="text-[hsl(var(--luna-cyan))]">{entry.event.label}</span>
                </p>
              )}
              {entry.before && entry.after && (
                <p className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-[hsl(var(--luna-lavender))]/70">
                  <span>
                    {t("res.energy")} {entry.before.energy}→{entry.after.energy}
                  </span>
                  <span>
                    {t("res.water")} {entry.before.water}→{entry.after.water}
                  </span>
                  <span>
                    {t("res.oxygen")} {entry.before.oxygen}→{entry.after.oxygen}
                  </span>
                </p>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
