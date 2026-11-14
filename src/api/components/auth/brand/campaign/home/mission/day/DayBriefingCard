import { Target } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import StepCard from "./StepCard";

export default function DayBriefingCard({ day, total }) {
  const t = useT();

  return (
    <StepCard step={1} title={t("day.briefing")} hint={t("day.dayOf", { day: day.day, total })} done>
      <p className="label-caps text-[hsl(var(--luna-cyan))]">{day.focus}</p>
      <p className="mt-1.5 font-heading text-lg font-semibold text-[hsl(var(--luna-cream))]">{day.goal}</p>
      <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{day.brief}</p>
      <p className="mt-3 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] leading-relaxed text-[hsl(var(--luna-lavender))]">
        <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[hsl(var(--luna-orange))]" aria-hidden="true" />
        {t("day.goalHint")}
      </p>
    </StepCard>
  );
}
