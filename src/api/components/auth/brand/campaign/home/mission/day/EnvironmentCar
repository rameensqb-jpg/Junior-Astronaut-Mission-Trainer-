import { Sun, Cloud, Radiation, ClipboardCheck } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import StepCard from "./StepCard";

export default function EnvironmentCard({ day, mission, observed, onObserve }) {
  const t = useT();

  return (
    <StepCard step={2} title={t("day.environment")} hint={t("day.environmentHint")} done={observed}>
      <div className="grid gap-2 sm:grid-cols-3">
        {[
          { icon: Sun, label: t("day.light"), value: day.env.light },
          { icon: Cloud, label: t("day.dust"), value: day.env.dust },
          { icon: Radiation, label: t("day.radiation"), value: `${mission.radiation.envIndex}/100` },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
            <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] text-[hsl(var(--luna-lavender))]/75">
              <Icon className="h-3 w-3" aria-hidden="true" />
              {label}
            </p>
            <p className="mt-1 text-sm font-semibold capitalize text-[hsl(var(--luna-cream))]">{value}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-[hsl(var(--luna-lavender))]">{day.env.note}</p>

      <div className="mt-3 rounded-2xl border border-[hsl(var(--luna-lavender))]/30 bg-[hsl(var(--luna-purple))]/15 p-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--luna-lavender))]">{t("day.observation")}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-[hsl(var(--luna-cream))]">{day.observation}</p>
        {observed ? (
          <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[hsl(var(--luna-mint))]">
            <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {t("day.recorded")}
          </p>
        ) : (
          <button type="button" onClick={onObserve} className="btn-ghost mt-2 !min-h-0 px-3 py-1.5 text-[11px]">
            {t("day.record")}
          </button>
        )}
      </div>
    </StepCard>
  );
}
