import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Telescope, ExternalLink, RefreshCw, ChevronDown, Info } from "lucide-react";
import { useEffect } from "react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { getSpaceWeather } from "@/lib/server-fns";
import { NASA_DATASETS } from "@/lib/sim/nasaArchive";

export const Route = createFileRoute("/_site/observatory")({
  head: () => ({ meta: [{ title: "NASA Data Observatory — LUNA" }] }),
  component: ObservatoryPage,
});

function ObservatoryPage() {
  const t = useT();
  const fetchWeather = useServerFn(getSpaceWeather);
  const [mounted, setMounted] = useState(false);
  const [openDataset, setOpenDataset] = useState(null);

  useEffect(() => setMounted(true), []);

  const { data, isFetching, refetch, isError } = useQuery({
    queryKey: ["space-weather-observatory"],
    queryFn: () => fetchWeather(),
    enabled: mounted,
    staleTime: 1000 * 60 * 15,
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14">
      <p className="pill text-[hsl(var(--luna-orange))]">
        <Telescope className="h-3.5 w-3.5" aria-hidden="true" />
        {t("obs.eyebrow")}
      </p>
      <h1 className="mt-5 font-heading text-3xl font-semibold sm:text-4xl">{t("obs.title")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{t("obs.sub")}</p>

      <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="label-caps">{t("obs.spaceweather")}</p>
            <p className="mt-1 font-heading text-lg font-semibold">{data?.dataset || "NASA DONKI"}</p>
          </div>
          <div className="flex items-center gap-2">
            {data && (
              <span
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${
                  data.status === "live"
                    ? "bg-[hsl(var(--luna-mint))]/15 text-[hsl(var(--luna-mint))]"
                    : "bg-[hsl(var(--luna-orange))]/15 text-[hsl(var(--luna-orange))]"
                }`}
              >
                {data.status === "live" ? t("obs.live") : t("obs.archived")}
              </span>
            )}
            <button
              type="button"
              onClick={() => refetch()}
              className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-[11px] font-semibold text-[hsl(var(--luna-lavender))] hover:bg-white/10"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} aria-hidden="true" />
              {t("obs.refresh")}
            </button>
          </div>
        </div>

        {isFetching && <p className="mt-4 text-sm text-[hsl(var(--luna-lavender))]">{t("common.loading")}</p>}
        {isError && <p className="mt-4 text-sm text-[hsl(var(--luna-orange))]">{t("obs.error")}</p>}

        {data && !isFetching && (
          <>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[34rem] text-start text-[11px]">
                <thead className="text-[hsl(var(--luna-lavender))]">
                  <tr>
                    <th className="py-2 text-start font-semibold">{t("obs.col.date")}</th>
                    <th className="py-2 text-start font-semibold">{t("obs.col.class")}</th>
                    <th className="py-2 text-start font-semibold">{t("obs.col.location")}</th>
                    <th className="py-2 text-start font-semibold">{t("obs.col.link")}</th>
                  </tr>
                </thead>
                <tbody className="text-[hsl(var(--luna-cream))]">
                  {data.events.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-3 text-[hsl(var(--luna-lavender))]">{t("obs.noEvents")}</td>
                    </tr>
                  )}
                  {data.events.map((event) => (
                    <tr key={event.id} className="border-t border-white/10">
                      <td className="py-2">{event.beginTime ? new Date(event.beginTime).toISOString().slice(0, 16).replace("T", " ") : "—"}</td>
                      <td className="py-2 font-semibold">{event.classType || "—"}</td>
                      <td className="py-2">{event.sourceLocation || "—"}</td>
                      <td className="py-2">
                        <a href={event.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[hsl(var(--luna-cyan))] underline">
                          {t("common.source")}
                          <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-4 flex items-start gap-2 rounded-2xl bg-[hsl(var(--luna-orange))]/10 px-4 py-3 text-[11px] leading-relaxed text-[hsl(var(--luna-orange))]">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {data.note}
            </p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.1em] text-[hsl(var(--luna-lavender))]/60">
              {t("obs.retrieved", { date: new Date(data.retrievedAt).toISOString().slice(0, 10) })} · {data.source}
            </p>
          </>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-xl font-semibold">{t("obs.datasets")}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {NASA_DATASETS.map((ds) => (
            <article key={ds.id} className="card-surface">
              <p className="font-heading text-sm font-semibold text-[hsl(var(--luna-cream))]">{ds.name}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[hsl(var(--luna-lavender))]/70">{ds.source}</p>
              <dl className="mt-3 space-y-2 text-[11px]">
                <div>
                  <dt className="font-semibold text-[hsl(var(--luna-cyan))]">{t("obs.measures")}</dt>
                  <dd className="text-[hsl(var(--luna-lavender))]">{ds.measures}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[hsl(var(--luna-orange))]">{t("obs.gameplay")}</dt>
                  <dd className="text-[hsl(var(--luna-lavender))]">{ds.gameplay}</dd>
                </div>
              </dl>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={ds.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5 text-[10px] font-semibold hover:bg-white/10">
                  {t("obs.openSource")}
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
                <a href={ds.docs} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5 text-[10px] font-semibold hover:bg-white/10">
                  {t("obs.docs")}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 glass overflow-hidden">
        <button
          type="button"
          onClick={() => setOpenDataset(openDataset === "how" ? null : "how")}
          aria-expanded={openDataset === "how"}
          className="focus-ring flex w-full items-center justify-between gap-3 px-6 py-5 text-start"
        >
          <span className="font-heading text-lg font-semibold">{t("obs.how.title")}</span>
          <ChevronDown className={`h-4 w-4 shrink-0 transition ${openDataset === "how" ? "rotate-180" : ""}`} aria-hidden="true" />
        </button>
        {openDataset === "how" && (
          <div className="space-y-3 border-t border-white/10 px-6 py-5 text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">
            <p>{t("obs.how.donki")}</p>
            <p>{t("obs.how.osdr")}</p>
            <p>{t("obs.how.moon")}</p>
            <p className="rounded-2xl bg-white/[0.05] px-4 py-3 text-[11px]">{t("obs.disclaimer")}</p>
          </div>
        )}
      </section>
    </div>
  );
}
