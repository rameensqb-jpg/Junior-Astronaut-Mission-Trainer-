import { Zap, Wind, Apple, ShieldAlert, Radio } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { forecast } from "@/lib/sim/engine";
import { RESOURCES } from "@/lib/sim/config";
import { statusOf } from "@/lib/sim/labels";

const TONES = {
  stable: {
    ring: "border-white/10",
    chip: "bg-[hsl(var(--luna-mint))]/15 text-[hsl(var(--luna-mint))]",
  },
  caution: {
    ring: "border-[hsl(var(--luna-orange))]/45",
    chip: "bg-[hsl(var(--luna-orange))]/15 text-[hsl(var(--luna-orange))]",
  },
  critical: {
    ring: "border-[hsl(var(--destructive))]/55",
    chip: "bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive))]",
  },
};

function Bar({ ratio, status }) {
  const colors = {
    stable: "bg-[hsl(var(--luna-mint))]",
    caution: "bg-[hsl(var(--luna-orange))]",
    critical: "bg-[hsl(var(--destructive))]",
  };
  return (
    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
      <div className={`h-full rounded-full ${colors[status]} transition-all duration-500`} style={{ width: `${Math.min(100, Math.max(2, ratio * 100))}%` }} />
    </div>
  );
}

function Card({ icon: Icon, title, value, unit, ratio, status, rows, testId }) {
  const t = useT();
  const tone = TONES[status];
  return (
    <article data-testid={testId} className={`rounded-3xl border bg-white/[0.045] p-5 ${tone.ring}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
          <h3 className="font-heading text-sm font-semibold text-[hsl(var(--luna-cream))]">{title}</h3>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${tone.chip}`}>{t(`status.${status}`)}</span>
      </div>

      <p className="mt-4 font-heading text-2xl font-semibold text-[hsl(var(--luna-cream))]">
        {value}
        <span className="ms-1 text-xs font-normal text-[hsl(var(--luna-lavender))]">{unit}</span>
      </p>
      <Bar ratio={ratio} status={status} />

      <dl className="mt-4 space-y-1.5 text-[11px]">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-2">
            <dt className="text-[hsl(var(--luna-lavender))]/80">{row.label}</dt>
            <dd className="font-medium text-[hsl(var(--luna-cream))]">{row.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export default function ResourceGrid({ mission }) {
  const t = useT();
  const flows = forecast(mission);
  const r = mission.resources;
  const rad = mission.radiation;
  const unread = mission.messages.filter((m) => m.from === "control" && !m.answered).length;

  const pct = (key) => r[key] / RESOURCES[key].max;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <Card
        testId="card-power"
        icon={Zap}
        title={t("res.power")}
        value={Math.round(r.energy)}
        unit={t("unit.kwh")}
        ratio={pct("energy")}
        status={statusOf(pct("energy"))}
        rows={[
          { label: t("label.generation"), value: `${flows.solar} ${t("unit.kwh")}` },
          { label: t("label.consumption"), value: `${flows.demand} ${t("unit.kwh")}` },
          { label: t("sys.panels"), value: `${Math.round(mission.systems.panels)}%` },
        ]}
      />
      <Card
        testId="card-life"
        icon={Wind}
        title={t("res.lifeSupport")}
        value={Math.round(r.oxygen * 10) / 10}
        unit={t("unit.kg")}
        ratio={pct("oxygen")}
        status={statusOf(pct("oxygen"))}
        rows={[
          { label: t("res.water"), value: `${Math.round(r.water)} ${t("unit.l")}` },
          { label: t("label.recovery"), value: `${Math.round(mission.systems.recycler)}%` },
          { label: t("sys.lifeSupport"), value: `${Math.round(mission.systems.lifeSupport)}%` },
        ]}
      />
      <Card
        testId="card-food"
        icon={Apple}
        title={t("res.food")}
        value={Math.round(r.food * 10) / 10}
        unit={t("unit.kg")}
        ratio={pct("food")}
        status={statusOf(pct("food"))}
        rows={[
          { label: t("label.production"), value: `${flows.foodIn} ${t("unit.kg")}/${t("unit.day")}` },
          { label: t("label.consumption"), value: `${flows.foodOut} ${t("unit.kg")}/${t("unit.day")}` },
          { label: t("sys.greenhouse"), value: `${Math.round(mission.systems.greenhouse)}%` },
        ]}
      />
      <Card
        testId="card-radiation"
        icon={ShieldAlert}
        title={t("res.radiation")}
        value={rad.exposure.toFixed(2)}
        unit={t("unit.msv")}
        ratio={Math.min(1, rad.exposure / 20)}
        status={rad.exposure > 12 ? "critical" : rad.envIndex > 55 ? "caution" : "stable"}
        rows={[
          { label: t("label.environment"), value: `${rad.envIndex}/100` },
          { label: t("label.shield"), value: `${Math.round(rad.shield)}%` },
          { label: t("label.doseRate"), value: `${flows.dose} ${t("unit.msv")}/${t("unit.day")}` },
        ]}
      />
      <Card
        testId="card-comms"
        icon={Radio}
        title={t("res.comms")}
        value={Math.round(mission.systems.comms)}
        unit="%"
        ratio={mission.systems.comms / 100}
        status={statusOf(mission.systems.comms / 100)}
        rows={[
          { label: t("label.delay"), value: t("com.delayValue") },
          { label: t("label.pending"), value: String(unread) },
          { label: t("label.consumption"), value: `${4} ${t("unit.kwh")}` },
        ]}
      />
      <article className="rounded-3xl border border-[hsl(var(--luna-purple))]/45 bg-[hsl(var(--luna-purple))]/15 p-5">
        <h3 className="font-heading text-sm font-semibold text-[hsl(var(--luna-cream))]">{t("res.research")}</h3>
        <p className="mt-4 font-heading text-2xl font-semibold text-[hsl(var(--luna-cream))]">
          {Math.round(mission.research)}
          <span className="ms-1 text-xs font-normal text-[hsl(var(--luna-lavender))]">/ 100</span>
        </p>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-[hsl(var(--luna-lavender))] transition-all duration-500" style={{ width: `${Math.max(2, mission.research)}%` }} />
        </div>
        <p className="mt-4 text-[11px] leading-relaxed text-[hsl(var(--luna-lavender))]/85">{t("res.research.hint")}</p>
      </article>
    </div>
  );
}
