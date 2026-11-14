import { createFileRoute } from "@tanstack/react-router";
import { Rocket, GraduationCap, BookOpen, Telescope, Sparkles, ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import LunarScene from "@/components/brand/LunarScene";
import StarField from "@/components/brand/StarField";
import ActionLink from "@/components/brand/ActionLink";
import MissionStatusPanel from "@/components/home/MissionStatusPanel";

export const Route = createFileRoute("/_site/")({
  head: () => ({
    meta: [
      { title: "LUNA: Beyond Survival — Command a lunar outpost" },
      {
        name: "description",
        content:
          "Lead four astronauts through ten days on the Moon. Balance power, oxygen, water, food and radiation with real NASA open data.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const t = useT();
  const pillars = [
    { n: "1", title: t("home.pillar1.title"), text: t("home.pillar1.text"), accent: "text-[hsl(var(--luna-cyan))]" },
    { n: "2", title: t("home.pillar2.title"), text: t("home.pillar2.text"), accent: "text-[hsl(var(--luna-orange))]" },
    { n: "3", title: t("home.pillar3.title"), text: t("home.pillar3.text"), accent: "text-[hsl(var(--luna-mint))]" },
  ];

  return (
    <>
      <section className="relative overflow-hidden">
        <StarField />
        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 pb-16 pt-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:pb-24 lg:pt-20">
          <div className="animate-rise">
            <p className="pill text-[hsl(var(--luna-cyan))]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {t("home.eyebrow")}
            </p>
            <h1 className="mt-6 font-heading text-[2.35rem] font-semibold leading-[1.08] text-[hsl(var(--luna-cream))] sm:text-5xl lg:text-[3.6rem]">
              {t("home.headline")}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[hsl(var(--luna-lavender))] sm:text-lg">
              {t("home.sub")}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ActionLink to="/campaign" icon={Rocket} className="w-full sm:w-auto">
                {t("home.cta.start")}
              </ActionLink>
              <ActionLink to="/training" variant="ghost" icon={GraduationCap} className="w-full sm:w-auto">
                {t("home.cta.training")}
              </ActionLink>
              <ActionLink to="/how-to-play" variant="ghost" icon={BookOpen} className="w-full sm:w-auto">
                {t("home.cta.how")}
              </ActionLink>
              <ActionLink to="/observatory" variant="warm" icon={Telescope} className="w-full sm:w-auto">
                {t("home.cta.science")}
              </ActionLink>
            </div>

            <div className="mt-10 max-w-xl">
              <MissionStatusPanel />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-[hsl(var(--luna-cyan))]/10 blur-2xl" />
            <div className="overflow-hidden rounded-[2.25rem] border border-white/15 shadow-[0_40px_120px_-40px_rgba(78,219,232,0.45)]">
              <LunarScene className="h-auto w-full" />
            </div>
            <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[11px] text-[hsl(var(--luna-lavender))]">
              <span>{t("home.status.place")}</span>
              <span className="font-semibold text-[hsl(var(--luna-cyan))]">{t("home.status.ready")}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-y border-white/10 bg-[#0c1430] py-16 lg:py-20">
        <div className="mx-auto w-full max-w-7xl px-5">
          <p className="label-caps">{t("home.pillars.eyebrow")}</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {pillars.map((p) => (
              <article key={p.n} className="card-surface group transition hover:border-white/20 hover:bg-white/[0.07]">
                <span className={`font-heading text-3xl font-semibold ${p.accent}`}>{p.n}</span>
                <h3 className="mt-4 font-heading text-xl font-semibold text-[hsl(var(--luna-cream))]">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-20">
        <StarField />
        <div className="relative mx-auto w-full max-w-4xl px-5 text-center">
          <h2 className="font-heading text-3xl font-semibold text-[hsl(var(--luna-cream))] sm:text-4xl">
            {t("home.tagline")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[hsl(var(--luna-lavender))]">{t("home.tagline.sub")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ActionLink to="/briefing" icon={Rocket}>
              {t("home.cta.start")}
            </ActionLink>
            <ActionLink to="/demo" variant="ghost">
              60-second judge demo
              <ArrowRight className="ms-1 h-4 w-4" aria-hidden="true" />
            </ActionLink>
          </div>
        </div>
      </section>
    </>
  );
}
