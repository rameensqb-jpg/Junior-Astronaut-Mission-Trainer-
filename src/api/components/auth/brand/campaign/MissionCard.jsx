import { useNavigate } from "@tanstack/react-router";
import { Lock, Play, ArrowRight, CheckCircle2, RotateCcw } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { DAYS_PER_MISSION } from "@/lib/sim/campaignEngine";

const TONES = {
  completed: "border-[hsl(var(--luna-mint))]/45",
  active: "border-[hsl(var(--luna-cyan))]/60",
  available: "border-white/12",
  locked: "border-white/8 opacity-70",
};

const CHIPS = {
  completed: "bg-[hsl(var(--luna-mint))]/15 text-[hsl(var(--luna-mint))]",
  active: "bg-[hsl(var(--luna-cyan))]/15 text-[hsl(var(--luna-cyan))]",
  available: "bg-white/10 text-[hsl(var(--luna-lavender))]",
  locked: "bg-white/5 text-[hsl(var(--luna-lavender))]/70",
};

export default function MissionCard({ row }) {
  const t = useT();
  const navigate = useNavigate();
  const pct = Math.round((row.days / DAYS_PER_MISSION) * 100);

  const start = () => navigate({ to: "/briefing", search: { mission: row.index } });
  const resume = () => navigate({ to: "/mission" });

  return (
    <article className={`rounded-3xl border bg-white/[0.04] p-4 sm:p-5 ${TONES[row.status]}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[hsl(var(--luna-lavender))]/70">{t("camp.missionTitle", { n: row.index })}</p>
          <h3 className="mt-0.5 font-heading text-base font-semibold text-[hsl(var(--luna-cream))]">{row.title}</h3>
          <p className="mt-1 text-[11px] leading-relaxed text-[hsl(var(--luna-lavender))]">{row.subtitle}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${CHIPS[row.status]}`}>{t(`camp.status.${row.status}`)}</span>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[10px] text-[hsl(var(--luna-lavender))]/80">
          <span>
            {row.days}/{DAYS_PER_MISSION} {t("camp.daysShort")}
          </span>
          {row.score !== null && <span className="font-semibold text-[hsl(var(--luna-cream))]">{t("camp.score", { score: row.score })}</span>}
          {row.record?.outcome?.objectivesTotal ? (
            <span>
              {t("rev.objectives")}: {row.record.outcome.objectivesMet ?? 0}/{row.record.outcome.objectivesTotal}
            </span>
          ) : null}
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className={`h-full rounded-full transition-all duration-500 ${row.status === "completed" ? "bg-[hsl(var(--luna-mint))]" : "bg-[hsl(var(--luna-cyan))]"}`}
            style={{ width: `${Math.max(2, pct)}%` }}
          />
        </div>
      </div>

      <div className="mt-3">
        {row.status === "locked" ? (
          <p className="flex items-center gap-1.5 text-[11px] text-[hsl(var(--luna-lavender))]">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            {t("camp.lockedHint", { n: row.index - 1 })}
          </p>
        ) : row.status === "active" ? (
          <button type="button" onClick={resume} className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--luna-cyan))] px-3.5 py-1.5 text-[11px] font-bold text-[#101A35]">
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            {t("camp.resume")}
          </button>
        ) : row.status === "completed" ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[hsl(var(--luna-mint))]">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              {t("camp.status.completed")}
            </span>
            <button type="button" onClick={start} className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-[11px] font-semibold text-[hsl(var(--luna-lavender))] hover:bg-white/10">
              <RotateCcw className="h-3 w-3" aria-hidden="true" />
              {t("camp.replay")}
            </button>
          </div>
        ) : (
          <button type="button" onClick={start} className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--luna-cyan))] px-3.5 py-1.5 text-[11px] font-bold text-[#101A35]">
            {t("camp.start")}
            <ArrowRight className="flip-rtl h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    </article>
  );
}
