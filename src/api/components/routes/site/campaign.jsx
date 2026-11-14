import { createFileRoute } from "@tanstack/react-router";
import { Rocket, ListChecks } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { useCampaign } from "@/lib/mission/useCampaign";
import { StarField } from "@/components/brand/StarField";
import CampaignProgress from "@/components/campaign/CampaignProgress";
import MissionCard from "@/components/campaign/MissionCard";

export const Route = createFileRoute("/_site/campaign")({
  head: () => ({
    meta: [
      { title: "Campaign — LUNA: Beyond Survival" },
      { name: "description", content: "Seven campaign missions, ten lunar days each: 70 playable mission days of lunar outpost operations." },
    ],
  }),
  component: CampaignPage,
});

function CampaignPage() {
  const t = useT();
  const { progress, ready } = useCampaign();

  return (
    <div className="relative">
      <StarField />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-12">
        <p className="pill text-[hsl(var(--luna-cyan))]">
          <Rocket className="h-3.5 w-3.5" aria-hidden="true" />
          {t("camp.eyebrow")}
        </p>
        <h1 className="mt-5 font-heading text-3xl font-semibold text-[hsl(var(--luna-cream))] sm:text-4xl">{t("camp.title")}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{t("camp.sub")}</p>

        {ready ? (
          <>
            <div className="mt-8">
              <CampaignProgress progress={progress} />
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-2">
              {progress.rows.map((row) => (
                <MissionCard key={row.index} row={row} />
              ))}
            </div>

            <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="flex items-center gap-2 font-heading text-sm font-semibold">
                <ListChecks className="h-4 w-4 text-[hsl(var(--luna-orange))]" aria-hidden="true" />
                {t("camp.loop")}
              </h2>
              <p className="mt-2 text-[11px] leading-relaxed text-[hsl(var(--luna-lavender))]">{t("camp.loopHint")}</p>
              <ol className="mt-4 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
                  <li key={n} className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] text-[hsl(var(--luna-lavender))]">
                    <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[hsl(var(--luna-cyan))]/15 text-[9px] font-bold text-[hsl(var(--luna-cyan))]">
                      {n}
                    </span>
                    {t(`loop.${n}`)}
                  </li>
                ))}
              </ol>
            </section>
          </>
        ) : (
          <p className="mt-8 text-sm text-[hsl(var(--luna-lavender))]">{t("common.loading")}</p>
        )}
      </div>
    </div>
  );
}
