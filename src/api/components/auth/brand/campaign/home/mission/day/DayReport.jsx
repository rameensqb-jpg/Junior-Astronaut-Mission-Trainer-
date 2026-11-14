import { Sunrise, AlertTriangle, Clock, X, Check, Circle } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { effectList, RESOURCE_LABEL } from "@/lib/sim/labels";
import { DAYS_PER_MISSION } from "@/lib/sim/campaignEngine";

export default function DayReport({ report, onClose }) {
  const t = useT();
  if (!report) return null;
  const { flows, delayed = [], warnings = [], objectives = [], activities = [], event } = report;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center overflow-y-auto bg-[#060b1c]/85 p-4 backdrop-blur-sm">
      <div role="dialog" aria-modal="true" aria-label={t("rep.title", { day: report.day })} className="glass-strong my-8 w-full max-w-xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[hsl(var(--luna-orange))]/15 text-[hsl(var(--luna-orange))]">
              <Sunrise className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-heading text-lg font-semibold">{t("rep.title", { day: report.day })}</h2>
              <p className="text-[11px] text-[hsl(var(--luna-lavender))]">{t("rep.sub")}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="focus-ring rounded-full p-2 hover:bg-white/10" aria-label={t("common.close")}>
            <X className="h-4 w-4" />
          </button>
        </div>

        {activities.length > 0 && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--luna-cyan))]">{t("day.activities")}</p>
            <ul className="mt-1.5 space-y-1">
              {activities.map((activity) => (
                <li key={activity.taskId} className="flex flex-wrap items-center justify-between gap-2 text-xs text-[hsl(var(--luna-cream))]">
                  <span>{activity.label}</span>
                  <span className={activity.match ? "text-[hsl(var(--luna-mint))]" : "text-[hsl(var(--luna-orange))]"}>
                    {activity.match ? t("day.match") : t("day.mismatch")}
                  </span>
                </li>
              ))}
            </ul>
            {event?.label && (
              <p className="mt-2 border-t border-white/10 pt-2 text-[11px] text-[hsl(var(--luna-lavender))]">
                {event.title}: <span className="text-[hsl(var(--luna-cyan))]">{event.label}</span>
              </p>
            )}
          </div>
        )}

        {objectives.length > 0 && (
          <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--luna-orange))]">{t("day.objectives")}</p>
            <ul className="mt-1.5 grid gap-1 sm:grid-cols-2">
              {objectives.map((objective) => (
                <li key={objective.key} className="flex items-start gap-1.5 text-[11px] text-[hsl(var(--luna-lavender))]">
                  {objective.done ? (
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-[hsl(var(--luna-mint))]" aria-hidden="true" />
                  ) : (
                    <Circle className="mt-0.5 h-3 w-3 shrink-0 opacity-50" aria-hidden="true" />
                  )}
                  {t(objective.key, objective.params)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          {[
            { label: t("label.generation"), value: `${flows.solar} ${t("unit.kwh")}` },
            { label: t("label.consumption"), value: `${flows.demand} ${t("unit.kwh")}` },
            { label: t("res.oxygen"), value: `${flows.o2Prod} / ${flows.o2Use} ${t("unit.kg")}` },
            { label: t("res.water"), value: `+${flows.waterIn} / -${flows.waterOut} ${t("unit.l")}` },
            { label: t("res.food"), value: `+${flows.foodIn} / -${flows.foodOut} ${t("unit.kg")}` },
            { label: t("env.exposure"), value: `+${flows.dose} ${t("unit.msv")}` },
          ].map((row) => (
            <div key={row.label} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
              <p className="text-[10px] uppercase tracking-[0.1em] text-[hsl(var(--luna-lavender))]/75">{row.label}</p>
              <p className="mt-0.5 font-medium text-[hsl(var(--luna-cream))]">{row.value}</p>
            </div>
          ))}
        </div>

        {delayed.length > 0 && (
          <div className="mt-4 rounded-2xl border border-[hsl(var(--luna-orange))]/40 bg-[hsl(var(--luna-orange))]/10 p-4">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--luna-orange))]">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {t("rep.delayed")}
            </p>
            {delayed.map((d, i) => (
              <div key={i} className="mt-2">
                <p className="text-sm text-[hsl(var(--luna-cream))]">{t(d.noteKey)}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {effectList(d.effects).map((e) => (
                    <span key={e.key} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-[hsl(var(--luna-cream))]">
                      {t(e.key)} {e.value > 0 ? "+" : ""}
                      {e.value}
                      {e.unit ? ` ${e.unit}` : ""}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {warnings.length > 0 && (
          <div className="mt-4 rounded-2xl border border-[hsl(var(--destructive))]/40 bg-[hsl(var(--destructive))]/10 p-4">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--destructive))]">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              {t("rep.warnings")}
            </p>
            <ul className="mt-2 space-y-1.5 text-sm">
              {warnings.map((w, i) => (
                <li key={i} className="text-[hsl(var(--luna-cream))]">
                  {t(RESOURCE_LABEL[w.resource] || `sys.${w.resource}`)} · {t(`status.${w.level}`)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="button" onClick={onClose} className="btn-primary mt-6 w-full">
          {report.day < DAYS_PER_MISSION ? t("day.nextDay", { day: report.day + 1 }) : t("rep.continue")}
        </button>
      </div>
    </div>
  );
}
