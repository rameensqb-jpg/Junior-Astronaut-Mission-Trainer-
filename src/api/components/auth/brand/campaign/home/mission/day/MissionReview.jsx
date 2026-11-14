import { Link } from "@tanstack/react-router";
import { Trophy, Search, FlaskConical, RotateCcw, ArrowRight, LayoutDashboard } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { getMission, DAYS_PER_MISSION, TOTAL_MISSIONS } from "@/lib/sim/campaignEngine";

const REASONS = {
  objectives: "rev.reason.objectives",
  research: "rev.reason.research",
  supply: "rev.reason.supply",
  resource: "rev.reason.resource",
  radiation: "rev.reason.radiation",
};

export default function MissionReview({ mission, onRetry }) {
  const t = useT();
  const success = mission.outcome?.type === "success";
  const def = getMission(mission.missionIndex);
  const next = mission.missionIndex < TOTAL_MISSIONS ? mission.missionIndex + 1 : null;
  const reasonKey = REASONS[mission.outcome?.reason] || null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-[#05091c]/93 p-4 backdrop-blur-md">
      <div className="animate-rise my-8 w-full max-w-2xl rounded-[2rem] border border-white/15 bg-[linear-gradient(150deg,rgba(81,70,165,0.4),rgba(12,20,48,0.96))] p-6 sm:p-7">
        <div className="text-center">
          <span
            className={`mx-auto grid h-16 w-16 place-items-center rounded-3xl ${
              success ? "bg-[hsl(var(--luna-mint))]/20 text-[hsl(var(--luna-mint))]" : "bg-[hsl(var(--luna-orange))]/20 text-[hsl(var(--luna-orange))]"
            }`}
          >
            {success ? <Trophy className="h-8 w-8" aria-hidden="true" /> : <Search className="h-8 w-8" aria-hidden="true" />}
          </span>
          <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--luna-lavender))]/75">
            {t("camp.missionTitle", { n: mission.missionIndex })} · {def.title}
          </p>
          <h1 className="mt-1 font-heading text-2xl font-semibold text-[hsl(var(--luna-cream))] sm:text-3xl">
            {t(success ? "rev.passed" : "rev.failed")}
          </h1>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">
            {t(success ? "rev.passedText" : "rev.failedText", { days: DAYS_PER_MISSION })}
          </p>
          {!success && reasonKey && (
            <p className="mt-3 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-[hsl(var(--luna-cream))]">{t(reasonKey)}</p>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2 text-start sm:grid-cols-4">
          {[
            { label: t("rev.score"), value: `${mission.outcome?.score ?? 0}/100` },
            { label: t("rev.objectives"), value: `${mission.outcome?.objectivesMet ?? 0}/${mission.outcome?.objectivesTotal ?? 0}` },
            { label: t("rev.research"), value: `${mission.outcome?.research ?? 0}/${mission.outcome?.requiredResearch ?? 0}` },
            { label: t("rev.days"), value: `${Math.min(mission.day, DAYS_PER_MISSION)}/${DAYS_PER_MISSION}` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.1em] text-[hsl(var(--luna-lavender))]/75">{stat.label}</p>
              <p className="mt-0.5 font-heading text-base font-semibold text-[hsl(var(--luna-cream))]">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          {success && next && (
            <Link to="/briefing" search={{ mission: next }} className="btn-primary">
              {t("rev.next")}
              <ArrowRight className="flip-rtl h-4 w-4" aria-hidden="true" />
            </Link>
          )}
          {!success && (
            <button type="button" onClick={onRetry} className="btn-primary">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {t("rev.retry")}
            </button>
          )}
          <Link to="/campaign" className="btn-ghost">
            <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            {t("rev.dashboard")}
          </Link>
          <Link to="/investigator" className="btn-ghost">
            <Search className="h-4 w-4" aria-hidden="true" />
            {t("end.investigate")}
          </Link>
          <Link to="/whatif" className="btn-ghost">
            <FlaskConical className="h-4 w-4" aria-hidden="true" />
            {t("end.whatif")}
          </Link>
        </div>
      </div>
    </div>
  );
}
