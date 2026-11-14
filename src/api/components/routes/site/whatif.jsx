import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FlaskConical, ArrowLeft, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { useMissionArchive } from "@/lib/mission/useMissionArchive";
import { simulateAlternative, originalSummary } from "@/lib/sim/whatif";
import { getScenario } from "@/lib/sim/scenarios";

export const Route = createFileRoute("/_site/whatif")({
  head: () => ({ meta: [{ title: "What-If Laboratory — LUNA" }] }),
  component: WhatIfPage,
});

function OutcomeCard({ title, data, tone }) {
  const t = useT();
  return (
    <div className={`rounded-2xl border p-4 ${tone}`}>
      <p className="text-[10px] uppercase tracking-[0.12em] opacity-80">{title}</p>
      <p className="mt-1 font-heading text-base font-semibold">
        {data.outcome?.type === "success" ? t("cmp.success") : t("cmp.failure")}
      </p>
      <dl className="mt-2 space-y-1 text-[11px]">
        <div className="flex justify-between"><dt>{t("cmp.days")}</dt><dd>{data.days}</dd></div>
        <div className="flex justify-between"><dt>{t("cmp.research")}</dt><dd>{data.research}</dd></div>
        <div className="flex justify-between"><dt>{t("res.energy")}</dt><dd>{data.resources.energy} kWh</dd></div>
        <div className="flex justify-between"><dt>{t("res.water")}</dt><dd>{data.resources.water} L</dd></div>
        <div className="flex justify-between"><dt>{t("env.exposure")}</dt><dd>{data.exposure}</dd></div>
      </dl>
    </div>
  );
}

function WhatIfPage() {
  const t = useT();
  const { latest, ready } = useMissionArchive();
  const decisions = latest?.decisions || [];
  const [index, setIndex] = useState(0);

  const decision = decisions[index];
  const scenario = decision ? getScenario(decision.scenarioId) : null;
  const original = useMemo(() => (latest ? originalSummary(latest) : null), [latest]);
  const alternatives = useMemo(() => {
    if (!latest || !decision || !scenario) return [];
    return scenario.choices
      .filter((c) => c.id !== decision.choiceId)
      .map((c) => ({ choice: c, result: simulateAlternative(latest, index, c.id) }));
  }, [latest, decision, scenario, index]);

  if (!ready) return <div className="p-14 text-center text-sm text-[hsl(var(--luna-lavender))]">{t("common.loading")}</div>;

  if (!latest || !decisions.length) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[hsl(var(--luna-lavender))]/15 text-[hsl(var(--luna-lavender))]">
          <FlaskConical className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-heading text-2xl font-semibold">{t("wi.empty.title")}</h1>
        <p className="mt-2 text-sm text-[hsl(var(--luna-lavender))]">{t("wi.empty.text")}</p>
        <Link to="/briefing" className="btn-primary mt-6">{t("home.cta.start")}</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-12">
      <Link to="/investigator" className="focus-ring inline-flex items-center gap-2 text-xs font-semibold text-[hsl(var(--luna-lavender))] hover:text-[hsl(var(--luna-cream))]">
        <ArrowLeft className="flip-rtl h-3.5 w-3.5" aria-hidden="true" />
        {t("inv.back")}
      </Link>

      <p className="pill mt-4 text-[hsl(var(--luna-lavender))]">{t("wi.eyebrow")}</p>
      <h1 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">{t("wi.title")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-[hsl(var(--luna-lavender))]">{t("wi.sub")}</p>

      <div className="mt-6">
        <p className="label-caps">{t("wi.pick")}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {decisions.map((d, i) => (
            <button
              key={`${d.day}-${d.choiceId}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-pressed={index === i}
              className={`focus-ring rounded-full px-3.5 py-2 text-[11px] font-semibold transition ${
                index === i ? "bg-[hsl(var(--luna-cyan))] text-[#101A35]" : "border border-white/15 bg-white/5 text-[hsl(var(--luna-lavender))] hover:bg-white/10"
              }`}
            >
              {t("common.day")} {d.day} · {d.title || t(`sc.${d.scenarioId}.title`)}
            </button>
          ))}
        </div>
      </div>

      {decision && !scenario && (
        <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs leading-relaxed text-[hsl(var(--luna-lavender))]">
          {t("wi.noBranch")}
        </p>
      )}

      {scenario && (
        <>
          <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm font-semibold text-[hsl(var(--luna-cream))]">{t(`sc.${scenario.id}.title`)}</p>
            <p className="mt-1 text-xs text-[hsl(var(--luna-cyan))]">
              {t("wi.youChose")}: {t(`sc.${scenario.id}.choice.${decision.choiceId}`)}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-[hsl(var(--luna-lavender))]">{t(`sc.${scenario.id}.text`)}</p>
            <p className="mt-3 text-[11px] text-[hsl(var(--luna-lavender))]/70">{t("wi.source")}: {scenario.source}</p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <OutcomeCard title={t("wi.original")} data={original} tone="border-white/15 bg-white/[0.04]" />
            {alternatives.slice(0, 1).map(({ choice, result }) => (
              <div key={choice.id}>
                <p className="mb-1.5 text-[11px] font-semibold text-[hsl(var(--luna-orange))]">
                  {t("wi.alternative")}: {t(`sc.${scenario.id}.choice.${choice.id}`)}
                </p>
                <OutcomeCard
                  title={t("wi.simulated")}
                  data={result}
                  tone="border-[hsl(var(--luna-orange))]/40 bg-[hsl(var(--luna-orange))]/10"
                />
              </div>
            ))}
          </div>

          {alternatives.map(({ choice }) => (
            <p key={choice.id} className="mt-2 text-[11px] text-[hsl(var(--luna-lavender))]/70">
              {t("wi.altLine", { choice: t(`sc.${scenario.id}.choice.${choice.id}`) })}
            </p>
          ))}

          <div className="mt-5 rounded-2xl border border-[hsl(var(--luna-lavender))]/30 bg-[hsl(var(--luna-lavender))]/10 p-4">
            <p className="flex items-center gap-2 text-xs font-semibold text-[hsl(var(--luna-cream))]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {t("wi.note.title")}
            </p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-[hsl(var(--luna-lavender))]">{t("wi.note.text")}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/compare" className="btn-ghost">{t("nav.compare")}</Link>
            <Link to="/briefing" className="btn-primary">{t("end.again")}</Link>
          </div>
        </>
      )}
    </div>
  );
}
