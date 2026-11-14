import { Play, Check } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { CREW } from "@/lib/content/crew";
import EffectChips from "../EffectChips";
import StepCard from "./StepCard";

const crewName = (id) => CREW.find((c) => c.id === id)?.name || id;

export default function DayActivitiesCard({ day, assignments, results, ran, onRun, crewDone }) {
  const t = useT();
  const lines = ran && results.length ? results : [];

  return (
    <StepCard step={5} title={t("day.activities")} hint={ran ? t("day.ran") : undefined} done={ran}>
      <div className="space-y-2">
        {day.tasks.map((task) => {
          const assigned = assignments[task.id];
          const result = lines.find((r) => r.taskId === task.id);
          return (
            <div key={task.id} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[hsl(var(--luna-cream))]">{task.label}</p>
                <span className="text-[10px] text-[hsl(var(--luna-lavender))]">{assigned ? crewName(assigned) : t("day.unassigned")}</span>
              </div>
              {result && <EffectChips effects={result.effects} className="mt-1.5" />}
            </div>
          );
        })}
      </div>

      {ran ? (
        <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[hsl(var(--luna-mint))]">
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          {t("day.activitiesDone")}
        </p>
      ) : (
        <button
          type="button"
          onClick={onRun}
          disabled={!crewDone}
          className="btn-primary mt-3 w-full !min-h-0 py-2.5 text-xs disabled:cursor-not-allowed disabled:opacity-45"
        >
          <Play className="h-3.5 w-3.5" aria-hidden="true" />
          {t("day.run")}
        </button>
      )}
    </StepCard>
  );
}
