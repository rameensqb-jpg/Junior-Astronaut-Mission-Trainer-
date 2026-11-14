import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, AlertTriangle, Clock, ArrowLeft } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { useMissionArchive } from "@/lib/mission/useMissionArchive";
import { analyzeMission, timeline } from "@/lib/sim/investigator";
import { effectList } from "@/lib/sim/labels";
import { store } from "@/lib/mission/store";

export const Route = createFileRoute("/_site/investigator")({
  head: () => ({ meta: [{ title: "Mission Investigator — LUNA" }] }),
  component: InvestigatorPage,
});

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-white/5 py-1 text-[11px] last:border-0">
      <span className="text-[hsl(var(--luna-lavender))]">{label}</span>
      <span className="font-semibold text-[hsl(var(--luna-cream))]">{value}</span>
    </div>
  );
}

function InvestigatorPage() {
  const t = useT();
  const { latest, ready } = useMissionArchive();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (latest) store.unlock(["investigator"]);
  }, [latest]);

  const analysis = useMemo(() => (latest ? analyzeMission(latest) : null), [latest]);
  const events = useMemo(() => (latest ? timeline(latest) : []), [latest]);
  const detail = events.find((e) => e.id === selected) || null;

  if (!ready) return <div className="p-14 text-center text-sm text-[hsl(var(--luna-lavender))]">{t("common.loading")}</div>;

  if (!latest) {
    return (
      <div className="mx-auto max-w-lg px-5 py-20 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[hsl(var(--luna-cyan))]/15 text-[hsl(var(--luna-cyan))]">
          <Search className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-heading text-2xl font-semibold">{t("inv.empty.title")}</h1>
        <p className="mt-2 text-sm text-[hsl(var(--luna-lavender))]">{t("inv.empty.text")}</p>
        <Link to="/briefing" className="btn-primary mt-6">
          {t("home.cta.start")}
        </Link>
      </div>
    );
  }

  const success = latest.outcome?.type === "success";

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12">
      <Link to="/mission" className="focus-ring inline-flex items-center gap-2 text-xs font-semibold text-[hsl(var(--luna-lavender))] hover:text-[hsl(var(--luna-cream))]">
        <ArrowLeft className="flip-rtl h-3.5 w-3.5" aria-hidden="true" />
        {t("inv.back")}
      </Link>

      <p className="pill mt-4 text-[hsl(var(--luna-cyan))]">{t("inv.eyebrow")}</p>
      <h1 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">{t("inv.title")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-[hsl(var(--luna-lavender))]">{t("inv.sub")}</p>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <section className="glass p-6">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
            <Search className="h-4 w-4 text-[hsl(var(--luna-orange))]" aria-hidden="true" />
            {t("inv.rca")}
          </h2>
          <div className="mt-4 space-y-2.5 text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">
            {success ? (
              <p>{t("inv.summary.success", { days: analysis.failDay })}</p>
            ) : (
              <p className="text-[hsl(var(--luna-cream))]">
                {t("inv.summary", { day: analysis.failDay, resource: t(`res.${analysis.failResource}`) })}
              </p>
            )}

            {!success && analysis.firstWarning && (
              <p>{t("inv.firstWarning", { day: analysis.firstWarning.day, resource: t(`res.${analysis.firstWarning.resource === "power" ? "power" : analysis.firstWarning.resource}`) })}</p>
            )}
            {!success && !analysis.firstWarning && <p>{t("inv.noWarning")}</p>}

            {analysis.contributing.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[hsl(var(--luna-lavender))]/70">{t("inv.decisions")}</p>
                <ul className="mt-2 space-y-1.5">
                  {analysis.contributing.slice(0, 4).map((c) => (
                    <li key={`${c.day}-${c.choiceId}`} className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
                      {t("inv.decisionLine", { day: c.day, scenario: c.title || t(`sc.${c.scenarioId}.title`), choice: c.label || t(`sc.${c.scenarioId}.choice.${c.choiceId}`) })}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.aggravating.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[hsl(var(--luna-lavender))]/70">{t("inv.events")}</p>
                <ul className="mt-2 space-y-1.5">
                  {analysis.aggravating.map((a, i) => (
                    <li key={i} className="rounded-xl border border-[hsl(var(--luna-orange))]/30 bg-[hsl(var(--luna-orange))]/10 px-3 py-2">
                      {t("inv.eventLine", { day: a.day, event: t(a.noteKey) })}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.weakestSystem.length === 2 && (
              <p>
                {t("inv.systemLine", {
                  a: t(`sys.${analysis.weakestSystem[0].key}`),
                  b: t(`sys.${analysis.weakestSystem[1].key}`),
                })}
              </p>
            )}

            <p className="rounded-2xl border border-[hsl(var(--luna-mint))]/30 bg-[hsl(var(--luna-mint))]/10 px-4 py-3 text-[hsl(var(--luna-cream))]">
              {success ? t("inv.tip.success") : t(`inv.tip.${analysis.failResource || "default"}`)}
            </p>
          </div>
        </section>

        <section className="glass p-6">
          <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
            <Clock className="h-4 w-4 text-[hsl(var(--luna-cyan))]" aria-hidden="true" />
            {t("inv.timeline")}
          </h2>
          <ol className="mt-4 space-y-1.5">
            {events.map((e) => (
              <li key={e.id}>
                <button
                  type="button"
                  onClick={() => setSelected(e.id === selected ? null : e.id)}
                  aria-pressed={selected === e.id}
                  className={`focus-ring flex w-full items-start gap-3 rounded-xl border px-3 py-2 text-start text-[11px] transition ${
                    selected === e.id ? "border-[hsl(var(--luna-cyan))]/60 bg-[hsl(var(--luna-cyan))]/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
                  }`}
                >
                  <span className="mt-0.5 w-8 shrink-0 font-semibold text-[hsl(var(--luna-lavender))]/70">{t("common.day")} {e.day}</span>
                  <span className="flex-1 text-[hsl(var(--luna-cream))]">
                    {e.type === "choice" && (e.title || t(`sc.${e.scenarioId}.title`))}
                    {e.type === "delayed" && t(e.noteKey)}
                    {e.type === "warning" && `${t("rep.warnings")}: ${t(`res.${e.resource === "power" ? "power" : e.resource}`)}`}
                    {e.type === "report" && t("inv.cycle", { day: e.day })}
                  </span>
                  {e.type === "warning" && <AlertTriangle className="h-3 w-3 shrink-0 text-[hsl(var(--luna-orange))]" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {detail && (
        <section className="mt-5 glass p-6">
          <h3 className="font-heading text-lg font-semibold">
            {t("common.day")} {detail.day} · {detail.type === "choice" ? detail.title || t(`sc.${detail.scenarioId}.title`) : t("inv.detail")}
          </h3>

          {detail.type === "choice" && (
            <>
              <p className="mt-2 text-sm text-[hsl(var(--luna-cyan))]">{detail.label || t(`sc.${detail.scenarioId}.choice.${detail.choiceId}`)}</p>
              {!detail.title && (
                <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{t(`sc.${detail.scenarioId}.out.${detail.choiceId}`)}</p>
              )}
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="label-caps">{t("inv.before")}</p>
                  <div className="mt-1.5">
                    <Row label={t("res.energy")} value={`${detail.before.energy} kWh`} />
                    <Row label={t("res.water")} value={`${detail.before.water} L`} />
                    <Row label={t("res.oxygen")} value={`${detail.before.oxygen} kg`} />
                    <Row label={t("res.research")} value={detail.before.research} />
                  </div>
                </div>
                <div>
                  <p className="label-caps">{t("inv.after")}</p>
                  <div className="mt-1.5">
                    <Row label={t("res.energy")} value={`${detail.after.energy} kWh`} />
                    <Row label={t("res.water")} value={`${detail.after.water} L`} />
                    <Row label={t("res.oxygen")} value={`${detail.after.oxygen} kg`} />
                    <Row label={t("res.research")} value={detail.after.research} />
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {effectList(detail.impact).map((e) => (
                  <span key={e.key} className={`rounded-full px-2.5 py-1 text-[10px] ${e.positive ? "bg-[hsl(var(--luna-mint))]/15 text-[hsl(var(--luna-mint))]" : "bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive))]"}`}>
                    {t(e.key)} {e.value > 0 ? "+" : ""}{e.value}{e.unit ? ` ${e.unit}` : ""}
                  </span>
                ))}
              </div>
              {!detail.title && (
                <p className="mt-3 text-xs leading-relaxed text-[hsl(var(--luna-lavender))]">{t(`sc.${detail.scenarioId}.why`)}</p>
              )}
            </>
          )}

          {detail.type === "delayed" && (
            <>
              <p className="mt-2 text-sm text-[hsl(var(--luna-cream))]">{t(detail.noteKey)}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {effectList(detail.effects).map((e) => (
                  <span key={e.key} className="rounded-full bg-white/10 px-2.5 py-1 text-[10px]">
                    {t(e.key)} {e.value > 0 ? "+" : ""}{e.value}{e.unit ? ` ${e.unit}` : ""}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-[hsl(var(--luna-lavender))]">{t("inv.delayedNote")}</p>
            </>
          )}

          {detail.type === "report" && detail.flows && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Row label={t("label.generation")} value={`${detail.flows.solar} kWh`} />
              <Row label={t("label.consumption")} value={`${detail.flows.demand} kWh`} />
              <Row label={t("res.oxygen")} value={`${detail.flows.o2Prod} / ${detail.flows.o2Use} kg`} />
              <Row label={t("env.exposure")} value={`+${detail.flows.dose} mSv-eq`} />
            </div>
          )}

          {detail.type === "warning" && (
            <p className="mt-2 text-sm text-[hsl(var(--luna-lavender))]">{t("inv.warningNote", { resource: t(`res.${detail.resource === "power" ? "power" : detail.resource}`) })}</p>
          )}
        </section>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/whatif" className="btn-primary">{t("inv.openWhatIf")}</Link>
        <Link to="/compare" className="btn-ghost">{t("nav.compare")}</Link>
        <Link to="/briefing" className="btn-ghost">{t("end.again")}</Link>
      </div>
    </div>
  );
}
