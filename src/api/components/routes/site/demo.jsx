import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RotateCcw, FlaskConical, Timer, ExternalLink } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { createMission, resolveChoice } from "@/lib/sim/engine";
import { getScenario } from "@/lib/sim/scenarios";
import { effectList } from "@/lib/sim/labels";
import { ARCHIVED_EVENTS } from "@/lib/sim/nasaArchive";

export const Route = createFileRoute("/_site/demo")({
  head: () => ({ meta: [{ title: "Judge demo mode — LUNA" }] }),
  component: DemoPage,
});

function buildDemo() {
  const base = createMission({ seed: 4242, commander: { name: "Judge" } });
  return {
    ...base,
    day: 6,
    resources: { energy: 168, oxygen: 21.4, water: 126, food: 39 },
    radiation: { exposure: 2.41, shield: 38, envIndex: 64 },
    systems: { panels: 78, lifeSupport: 90, recycler: 81, greenhouse: 77, comms: 86, rover: 74 },
    research: 34,
    activeScenario: "solar_storm",
    nasaEvent: ARCHIVED_EVENTS[1],
  };
}

function Chips({ effects }) {
  const t = useT();
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {effectList(effects).map((e) => (
        <span
          key={e.key + e.value}
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${e.positive ? "bg-[hsl(var(--luna-mint))]/15 text-[hsl(var(--luna-mint))]" : "bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive))]"}`}
        >
          {t(e.key)} {e.value > 0 ? "+" : ""}{e.value}{e.unit ? ` ${e.unit}` : ""}
        </span>
      ))}
    </div>
  );
}

function DemoPage() {
  const t = useT();
  const [state, setState] = useState(buildDemo);
  const scenario = useMemo(() => getScenario("solar_storm"), []);
  const chosen = state.decisions[0] || null;
  const consequence = chosen ? state.pending.find((p) => p.scenarioId === "solar_storm") : null;

  const choose = (choiceId) => {
    setState((prev) => resolveChoice(prev, choiceId));
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="pill text-[hsl(var(--luna-orange))]">
          <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
          {t("demo.badge")}
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold text-[hsl(var(--luna-lavender))]">
          <Timer className="h-3 w-3" aria-hidden="true" />
          {t("demo.time")}
        </span>
      </div>

      <h1 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">{t("demo.title")}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{t("demo.sub")}</p>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { label: t("res.energy"), value: `${Math.round(state.resources.energy)} kWh` },
          { label: t("res.oxygen"), value: `${state.resources.oxygen.toFixed(1)} kg` },
          { label: t("res.water"), value: `${Math.round(state.resources.water)} L` },
          { label: t("env.exposure"), value: `${state.radiation.exposure.toFixed(2)} mSv-eq` },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5">
            <p className="text-[10px] uppercase tracking-[0.1em] text-[hsl(var(--luna-lavender))]/75">{s.label}</p>
            <p className="mt-0.5 font-heading text-sm font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-3xl border border-[hsl(var(--luna-purple))]/50 bg-[linear-gradient(140deg,rgba(81,70,165,0.35),rgba(16,26,53,0.9))] p-6">
        <p className="label-caps text-[hsl(var(--luna-cyan))]">{t("demo.scenario")} · {t("common.day")} 6</p>
        <h2 className="mt-2 font-heading text-xl font-semibold">{t(`sc.${scenario.id}.title`)}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{t(`sc.${scenario.id}.text`)}</p>

        <div className="mt-3 rounded-2xl border border-white/10 bg-[#0d1637]/70 p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[hsl(var(--luna-orange))]">{t("common.realData")}</p>
          <p className="mt-1 text-[11px] text-[hsl(var(--luna-lavender))]">
            {state.nasaEvent.classType} · {state.nasaEvent.beginTime?.slice(0, 10)} · {state.nasaEvent.sourceLocation}
          </p>
          <a
            href={state.nasaEvent.link}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[hsl(var(--luna-cyan))] underline"
          >
            {t("obs.readSource")}
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
          <p className="mt-1.5 text-[10px] italic text-[hsl(var(--luna-lavender))]/70">{t("demo.realNote")}</p>
        </div>

        <div className="mt-4 grid gap-2">
          {scenario.choices.map((choice, i) => (
            <button
              key={choice.id}
              type="button"
              onClick={() => choose(choice.id)}
              disabled={Boolean(chosen)}
              className="focus-ring flex items-start gap-3 rounded-2xl border border-white/15 bg-[#111a3d]/70 p-3.5 text-start transition hover:border-[hsl(var(--luna-cyan))]/70 disabled:opacity-45"
            >
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[hsl(var(--luna-cyan))]/15 text-[11px] font-bold text-[hsl(var(--luna-cyan))]">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-[hsl(var(--luna-cream))]">{t(`sc.${scenario.id}.choice.${choice.id}`)}</span>
                <Chips effects={choice.effects} />
              </span>
            </button>
          ))}
        </div>
      </div>

      {chosen && (
        <div className="mt-5 space-y-3">
          <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--luna-cyan))]">{t("demo.immediate")}</p>
            <p className="mt-1 text-sm leading-relaxed text-[hsl(var(--luna-cream))]">{t(`sc.solar_storm.out.${chosen.choiceId}`)}</p>
          </div>

          {consequence && (
            <div className="rounded-2xl border border-[hsl(var(--luna-orange))]/40 bg-[hsl(var(--luna-orange))]/10 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--luna-orange))]">
                {t("demo.delayed")} · {t("common.day")} {consequence.dueDay}
              </p>
              <p className="mt-1 text-sm text-[hsl(var(--luna-cream))]">{t(consequence.noteKey)}</p>
              <Chips effects={consequence.effects} />
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[hsl(var(--luna-lavender))]">{t("scn.science")}</p>
            <p className="mt-1 text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{t(`sc.${scenario.id}.why`)}</p>
            <p className="mt-2 text-[11px] text-[hsl(var(--luna-lavender))]/70">{t("scn.source")}: {scenario.source}</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button type="button" onClick={() => setState(buildDemo())} className="btn-ghost">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {t("demo.reset")}
            </button>
            <Link to="/briefing" className="btn-primary">{t("demo.full")}</Link>
          </div>
          <p className="text-[11px] leading-relaxed text-[hsl(var(--luna-lavender))]/70">{t("demo.disclaimer")}</p>
        </div>
      )}
    </div>
  );
}
