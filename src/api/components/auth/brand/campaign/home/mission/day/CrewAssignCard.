import { Users, Check } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { CREW, ACCENTS } from "@/lib/content/crew";
import EffectChips from "../EffectChips";
import StepCard from "./StepCard";

export default function CrewAssignCard({ day, assignments, onAssign, done, assignedCount }) {
  const t = useT();
  const takenBy = (taskId) => assignments[taskId] || null;

  return (
    <StepCard step={3} title={t("day.crew")} hint={`${assignedCount}/${day.tasks.length}`} done={done}>
      <p className="text-[11px] leading-relaxed text-[hsl(var(--luna-lavender))]">{t("day.crewHint")}</p>

      <div className="mt-3 space-y-2.5">
        {day.tasks.map((task) => {
          const assigned = takenBy(task.id);
          const match = assigned === task.role;
          return (
            <div key={task.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-[hsl(var(--luna-cream))]">{task.label}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.1em] text-[hsl(var(--luna-cyan))]">
                    {t("day.required")}: {t(`crew.role.${task.role}`)}
                  </p>
                </div>
                <EffectChips effects={task.effects} />
              </div>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {CREW.map((member) => {
                  const active = assigned === member.id;
                  return (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => onAssign(task.id, member.id)}
                      aria-pressed={active}
                      className={`focus-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-medium transition ${
                        active
                          ? "border-[hsl(var(--luna-cyan))]/70 bg-[hsl(var(--luna-cyan))]/15 text-[hsl(var(--luna-cream))]"
                          : "border-white/15 bg-white/[0.03] text-[hsl(var(--luna-lavender))] hover:bg-white/10"
                      }`}
                    >
                      <span className={`grid h-5 w-5 place-items-center rounded-full text-[9px] font-bold ring-1 ${ACCENTS[member.accent]}`}>
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                      {member.name.split(" ")[0]}
                    </button>
                  );
                })}
              </div>

              {assigned && (
                <p className={`mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold ${match ? "text-[hsl(var(--luna-mint))]" : "text-[hsl(var(--luna-orange))]"}`}>
                  {match && <Check className="h-3 w-3" aria-hidden="true" />}
                  {match ? t("day.match") : t("day.mismatch")}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] text-[hsl(var(--luna-lavender))]/70">
        <Users className="h-3 w-3" aria-hidden="true" />
        {t("day.crewRoster")}
      </p>
    </StepCard>
  );
}
