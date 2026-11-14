import { CalendarDays, Flag, Trophy } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";

function Metric({ icon: Icon, label, value, total, accent }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="card-surface">
      <div className="flex items-center gap-2">
        <span className={`grid h-8 w-8 place-items-center rounded-xl bg-white/10 ${accent}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="text-[10px] uppercase tracking-[0.14em] text-[hsl(var(--luna-lavender))]/75">{label}</p>
      </div>
      <p className="mt-3 font-heading text-2xl font-semibold text-[hsl(var(--luna-cream))]">
        {value}
        <span className="ms-1 text-xs font-normal text-[hsl(var(--luna-lavender))]">/ {total}</span>
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[hsl(var(--luna-cyan))] transition-all duration-500" style={{ width: `${Math.max(2, pct)}%` }} />
      </div>
    </div>
  );
}

export default function CampaignProgress({ progress }) {
  const t = useT();
  const current = progress.current;

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <Metric icon={CalendarDays} label={t("camp.days")} value={progress.daysCompleted} total={progress.daysTotal} accent="text-[hsl(var(--luna-cyan))]" />
        <Metric icon={Trophy} label={t("camp.missions")} value={progress.missionsCompleted} total={progress.missionsTotal} accent="text-[hsl(var(--luna-mint))]" />
        <div className="card-surface">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 text-[hsl(var(--luna-orange))]">
              <Flag className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="text-[10px] uppercase tracking-[0.14em] text-[hsl(var(--luna-lavender))]/75">{t("camp.current")}</p>
          </div>
          {current ? (
            <>
              <p className="mt-3 font-heading text-base font-semibold text-[hsl(var(--luna-cream))]">
                {t("camp.missionTitle", { n: current.index })} · {current.title}
              </p>
              <p className="mt-1 text-xs text-[hsl(var(--luna-lavender))]">
                {progress.currentDay ? t("camp.dayLabel", { day: progress.currentDay, total: 10 }) : t("camp.completedDays", { days: current.days })}
              </p>
            </>
          ) : (
            <p className="mt-3 text-xs text-[hsl(var(--luna-lavender))]">{t("camp.currentNone")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
