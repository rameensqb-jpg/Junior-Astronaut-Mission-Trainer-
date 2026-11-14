import { Link } from "@tanstack/react-router";
import { Trophy, Search, FlaskConical, RotateCcw } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";

export default function MissionEnd({ mission }) {
  const t = useT();
  const success = mission.outcome?.type === "success";

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-[#05091c]/92 p-4 backdrop-blur-md">
      <div className="animate-rise my-8 w-full max-w-2xl rounded-[2rem] border border-white/15 bg-[linear-gradient(150deg,rgba(81,70,165,0.4),rgba(12,20,48,0.96))] p-7 text-center">
        <span
          className={`mx-auto grid h-16 w-16 place-items-center rounded-3xl ${
            success ? "bg-[hsl(var(--luna-mint))]/20 text-[hsl(var(--luna-mint))]" : "bg-[hsl(var(--luna-orange))]/20 text-[hsl(var(--luna-orange))]"
          }`}
        >
          {success ? <Trophy className="h-8 w-8" aria-hidden="true" /> : <Search className="h-8 w-8" aria-hidden="true" />}
        </span>

        <h1 className="mt-5 font-heading text-2xl font-semibold text-[hsl(var(--luna-cream))] sm:text-3xl">
          {t(success ? "end.success.title" : "end.fail.title")}
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">
          {t(success ? "end.success.text" : "end.fail.text", { day: mission.outcome?.day || mission.day, days: mission.totalDays })}
        </p>

        {!success && mission.outcome?.resource && (
          <p className="mt-4 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-[hsl(var(--luna-cream))]">
            {t("end.cause")}: {t(`res.${mission.outcome.resource}`)}
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-2 text-start sm:grid-cols-4">
          {[
            { label: t("common.days"), value: mission.outcome?.day || mission.day },
            { label: t("res.research"), value: `${Math.round(mission.research)}/100` },
            { label: t("res.energy"), value: `${Math.round(mission.resources.energy)} kWh` },
            { label: t("env.exposure"), value: `${mission.radiation.exposure.toFixed(2)}` },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-[0.1em] text-[hsl(var(--luna-lavender))]/75">{s.label}</p>
              <p className="mt-0.5 font-heading text-base font-semibold text-[hsl(var(--luna-cream))]">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <Link to="/investigator" className="btn-primary">
            <Search className="h-4 w-4" aria-hidden="true" />
            {t("end.investigate")}
          </Link>
          <Link to="/whatif" className="btn-ghost">
            <FlaskConical className="h-4 w-4" aria-hidden="true" />
            {t("end.whatif")}
          </Link>
          <Link to="/briefing" className="btn-ghost">
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {t("end.again")}
          </Link>
        </div>
      </div>
    </div>
  );
}
