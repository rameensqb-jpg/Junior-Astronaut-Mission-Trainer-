import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import EffectChips from "../EffectChips";
import StepCard from "./StepCard";

export default function DayEventCard({ event, choiceId, onChoose }) {
  const t = useT();
  const chosen = event.choices.find((c) => c.id === choiceId);

  return (
    <StepCard step={6} title={t("day.event")} hint={chosen ? t("day.decided") : undefined} done={Boolean(chosen)}>
      <div className="rounded-2xl border border-[hsl(var(--luna-purple))]/50 bg-[linear-gradient(140deg,rgba(81,70,165,0.3),rgba(16,26,53,0.85))] p-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--luna-orange))]">{t("day.eventRandom")}</p>
        <p className="mt-1 font-heading text-base font-semibold text-[hsl(var(--luna-cream))]">{event.title}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-[hsl(var(--luna-lavender))]">{event.text}</p>
      </div>

      {chosen ? (
        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
          <p className="text-[10px] uppercase tracking-[0.1em] text-[hsl(var(--luna-lavender))]/75">{t("day.decided")}</p>
          <p className="mt-0.5 text-sm font-semibold text-[hsl(var(--luna-cyan))]">{chosen.label}</p>
          <EffectChips effects={chosen.effects || {}} className="mt-1.5" />
        </div>
      ) : (
        <div className="mt-3 grid gap-2">
          {event.choices.map((choice, index) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => onChoose(choice.id)}
              className="focus-ring group flex items-start gap-3 rounded-2xl border border-white/15 bg-[#111a3d]/70 p-3 text-start transition hover:border-[hsl(var(--luna-cyan))]/70 hover:bg-[#16204a]"
            >
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[hsl(var(--luna-cyan))]/15 text-[10px] font-bold text-[hsl(var(--luna-cyan))]">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1">
                <span className="block text-xs font-semibold text-[hsl(var(--luna-cream))]">{choice.label}</span>
                <EffectChips effects={choice.effects || {}} className="mt-1.5" />
              </span>
              <ArrowRight className="flip-rtl mt-1 h-3.5 w-3.5 shrink-0 text-[hsl(var(--luna-lavender))] group-hover:text-[hsl(var(--luna-cyan))]" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </StepCard>
  );
}
