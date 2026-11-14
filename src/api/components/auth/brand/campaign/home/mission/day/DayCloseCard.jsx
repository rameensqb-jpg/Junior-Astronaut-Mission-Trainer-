import { ArrowRight, Check, Circle } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import StepCard from "./StepCard";

export default function DayCloseCard({ objectives, canClose, onClose }) {
  const t = useT();
  const doneCount = objectives.filter((o) => o.done).length;

  return (
    <StepCard step={8} title={t("day.objectives")} hint={`${doneCount}/${objectives.length}`} done={canClose}>
      <ul className="space-y-1.5">
        {objectives.map((objective) => (
          <li key={objective.id} className="flex items-start gap-2 text-xs">
            {objective.done ? (
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[hsl(var(--luna-mint))]" aria-hidden="true" />
            ) : (
              <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[hsl(var(--luna-lavender))]/50" aria-hidden="true" />
            )}
            <span className={objective.done ? "text-[hsl(var(--luna-lavender))]/80 line-through" : "text-[hsl(var(--luna-cream))]"}>
              {t(objective.key, objective.params)}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        data-testid="close-day"
        onClick={onClose}
        disabled={!canClose}
        className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-45"
      >
        {t("day.closeDay")}
        <ArrowRight className="flip-rtl h-4 w-4" aria-hidden="true" />
      </button>
      {!canClose && <p className="mt-2 text-center text-[11px] text-[hsl(var(--luna-orange))]">{t("day.closeHint")}</p>}
    </StepCard>
  );
}
