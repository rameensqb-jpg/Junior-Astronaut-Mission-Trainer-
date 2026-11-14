import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Trophy, AlertTriangle } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { useMissionArchive } from "@/lib/mission/useMissionArchive";
import { strategyCategory } from "@/lib/sim/achievements";

export const Route = createFileRoute("/_site/compare")({
  head: () => ({ meta: [{ title: "Mission comparison — LUNA" }] }),
  component: ComparePage,
});

const STRATEGY_TONE = {
  research: "bg-[hsl(var(--luna-lavender))]/15 text-[hsl(var(--luna-lavender))]",
  protection: "bg-[hsl(var(--luna-cyan))]/15 text-[hsl(var(--luna-cyan))]",
  resource: "bg-[hsl(var(--luna-mint))]/15 text-[hsl(var(--luna-mint))]",
  balanced: "bg-[hsl(var(--luna-orange))]/15 text-[hsl(var(--luna-orange))]",
};

function ComparePage() {
  const t = useT();
  const { missions, ready } = useMissionArchive();

  if (!ready) return <div className="p-14 text-center text-sm text-[hsl(var(--luna-lavender))]">{t("common.loading")}</div>;

  if (!missions.length) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[hsl(var(--luna-cyan))]/15 text-[hsl(var(--luna-cyan))]">
          <BarChart3 className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-heading text-2xl font-semibold">{t("cmp.empty.title")}</h1>
        <p className="mt-2 text-sm text-[hsl(var(--luna-lavender))]">{t("cmp.empty.text")}</p>
        <Link to="/briefing" className="btn-primary mt-6">{t("home.cta.start")}</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12">
      <h1 className="font-heading text-3xl font-semibold sm:text-4xl">{t("cmp.title")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-[hsl(var(--luna-lavender))]">{t("cmp.sub")}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {missions.map((mission, i) => {
          const success = mission.outcome?.type === "success";
          const category = strategyCategory(mission);
          const events = (mission.log || []).filter((e) => e.type === "choice").length;
          return (
            <article key={mission.id || i} className="card-surface">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-heading text-base font-semibold text-[hsl(var(--luna-cream))]">
                    {t("cmp.mission")} #{missions.length - i}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[hsl(var(--luna-lavender))]/70">
                    {mission.commander?.name || "Commander"} · {t("common.days")} {mission.outcome?.day || mission.day}
                  </p>
                </div>
                <span className={`grid h-8 w-8 place-items-center rounded-full ${success ? "bg-[hsl(var(--luna-mint))]/15 text-[hsl(var(--luna-mint))]" : "bg-[hsl(var(--luna-orange))]/15 text-[hsl(var(--luna-orange))]"}`}>
                  {success ? <Trophy className="h-4 w-4" aria-hidden="true" /> : <AlertTriangle className="h-4 w-4" aria-hidden="true" />}
                </span>
              </div>

              <span className={`mt-3 inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold ${STRATEGY_TONE[category]}`}>
                {t(`cmp.strategy.${category}`)}
              </span>

              <dl className="mt-3 space-y-1 text-[11px]">
                <div className="flex justify-between"><dt className="text-[hsl(var(--luna-lavender))]">{t("cmp.research")}</dt><dd>{Math.round(mission.research)}/100</dd></div>
                <div className="flex justify-between"><dt className="text-[hsl(var(--luna-lavender))]">{t("res.energy")}</dt><dd>{Math.round(mission.resources.energy)} kWh</dd></div>
                <div className="flex justify-between"><dt className="text-[hsl(var(--luna-lavender))]">{t("res.water")}</dt><dd>{Math.round(mission.resources.water)} L</dd></div>
                <div className="flex justify-between"><dt className="text-[hsl(var(--luna-lavender))]">{t("env.exposure")}</dt><dd>{mission.radiation.exposure.toFixed(2)}</dd></div>
                <div className="flex justify-between"><dt className="text-[hsl(var(--luna-lavender))]">{t("cmp.decisions")}</dt><dd>{events}</dd></div>
              </dl>

              <p className={`mt-3 text-xs font-semibold ${success ? "text-[hsl(var(--luna-mint))]" : "text-[hsl(var(--luna-orange))]"}`}>
                {success ? t("cmp.success") : t("cmp.failure")}
              </p>
            </article>
          );
        })}
      </div>

      <section className="mt-8 glass overflow-x-auto p-5">
        <table className="w-full min-w-[36rem] text-start text-[11px]">
          <thead>
            <tr className="text-[hsl(var(--luna-lavender))]">
              <th className="py-2 text-start font-semibold">{t("cmp.mission")}</th>
              <th className="py-2 text-start font-semibold">{t("cmp.outcome")}</th>
              <th className="py-2 text-start font-semibold">{t("cmp.days")}</th>
              <th className="py-2 text-start font-semibold">{t("cmp.research")}</th>
              <th className="py-2 text-start font-semibold">{t("res.energy")}</th>
              <th className="py-2 text-start font-semibold">{t("cmp.strategy")}</th>
            </tr>
          </thead>
          <tbody className="text-[hsl(var(--luna-cream))]">
            {missions.map((mission, i) => (
              <tr key={`r-${mission.id || i}`} className="border-t border-white/10">
                <td className="py-2">#{missions.length - i}</td>
                <td className="py-2">{mission.outcome?.type === "success" ? t("cmp.success") : t("cmp.failure")}</td>
                <td className="py-2">{mission.outcome?.day || mission.day}</td>
                <td className="py-2">{Math.round(mission.research)}</td>
                <td className="py-2">{Math.round(mission.resources.energy)}</td>
                <td className="py-2">{t(`cmp.strategy.${strategyCategory(mission)}`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="mt-4 text-[11px] leading-relaxed text-[hsl(var(--luna-lavender))]/70">{t("cmp.note")}</p>
    </div>
  );
}
