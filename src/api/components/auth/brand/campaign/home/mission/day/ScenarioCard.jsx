import { ArrowRight, Lightbulb, BookOpen } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { getScenario } from "@/lib/sim/scenarios";
import { effectList } from "@/lib/sim/labels";

function EffectChips({ effects }) {
  const t = useT();
  const list = effectList(effects);
  if (!list.length) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {list.map((e) => (
        <span
          key={e.key + e.value}
          className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
            e.positive
              ? "bg-[hsl(var(--luna-mint))]/15 text-[hsl(var(--luna-mint))]"
              : "bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive))]"
          }`}
        >
          {t(e.key)} {e.value > 0 ? "+" : ""}
          {e.value}
          {e.unit ? ` ${e.unit}` : ""}
        </span>
      ))}
    </div>
  );
}

export default function ScenarioCard({ mission, onChoose, disabled }) {
  const t = useT();
  const scenario = getScenario(mission.activeScenario);
  const last = mission.lastChoice;
  const lastScenario = last ? getScenario(last.scenarioId) : null;

  if (!scenario && !lastScenario) return null;

  const active = scenario || null;

  return (
    <section
      data-testid="scenario"
      className="overflow-hidden rounded-3xl border border-[hsl(var(--luna-purple))]/60 bg-[linear-gradient(140deg,rgba(81,70,165,0.35),rgba(16,26,53,0.9))] p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="label-caps text-[hsl(var(--luna-cyan))]">
          {t("scn.situation")} · {t("common.day")} {active ? mission.day : last?.day}
        </p>
        <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold text-[hsl(var(--luna-lavender))]">
          {t("scn.env", { index: mission.radiation.envIndex })}
        </span>
      </div>

      {active ? (
        <>
          <h2 className="mt-3 font-heading text-xl font-semibold text-[hsl(var(--luna-cream))] sm:text-2xl">
            {t(`sc.${active.id}.title`)}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{t(`sc.${active.id}.text`)}</p>

          <div className="mt-5 grid gap-2.5">
            {active.choices.map((choice, index) => (
              <button
                key={choice.id}
                type="button"
                data-testid="choice"
                disabled={disabled}
                onClick={() => onChoose(choice.id)}
                className="focus-ring group flex items-start gap-3 rounded-2xl border border-white/15 bg-[#111a3d]/70 p-4 text-start transition hover:border-[hsl(var(--luna-cyan))]/70 hover:bg-[#16204a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[hsl(var(--luna-cyan))]/15 font-heading text-xs font-semibold text-[hsl(var(--luna-cyan))]">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-semibold text-[hsl(var(--luna-cream))]">{t(`sc.${active.id}.choice.${choice.id}`)}</span>
                  <EffectChips effects={choice.effects} />
                </span>
                <ArrowRight className="flip-rtl mt-1 h-4 w-4 shrink-0 text-[hsl(var(--luna-lavender))] transition group-hover:text-[hsl(var(--luna-cyan))]" aria-hidden="true" />
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-3">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[hsl(var(--luna-lavender))]/70">{t("scn.decided")}</p>
          <h2 className="mt-1 font-heading text-lg font-semibold text-[hsl(var(--luna-cream))]">{t(`sc.${lastScenario.id}.title`)}</h2>
          <p className="mt-1 text-sm font-medium text-[hsl(var(--luna-cyan))]">{t(`sc.${lastScenario.id}.choice.${last.choiceId}`)}</p>
          <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{t(`sc.${lastScenario.id}.out.${last.choiceId}`)}</p>

          <div className="mt-4 rounded-2xl border border-white/10 bg-[#0e1737]/80 p-4">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--luna-orange))]">
              <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
              {t("scn.science")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{t(`sc.${lastScenario.id}.why`)}</p>
            <p className="mt-3 flex items-start gap-2 text-[11px] text-[hsl(var(--luna-lavender))]/70">
              <BookOpen className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
              <span>
                {t("scn.source")}: {lastScenario.source}
              </span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
