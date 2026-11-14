import { createFileRoute } from "@tanstack/react-router";
import { Rocket, MousePointerClick, Lightbulb, ShieldCheck } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import ActionLink from "@/components/brand/ActionLink";

export const Route = createFileRoute("/_site/how-to-play")({
  head: () => ({ meta: [{ title: "How to play — LUNA" }] }),
  component: HowToPlay,
});

function HowToPlay() {
  const t = useT();
  const steps = [
    { icon: Rocket, title: t("how.step1.title"), text: t("how.step1.text") },
    { icon: MousePointerClick, title: t("how.step2.title"), text: t("how.step2.text") },
    { icon: Lightbulb, title: t("how.step3.title"), text: t("how.step3.text") },
    { icon: ShieldCheck, title: t("how.step4.title"), text: t("how.step4.text") },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-14">
      <p className="pill text-[hsl(var(--luna-cyan))]">{t("nav.howto")}</p>
      <h1 className="mt-5 font-heading text-3xl font-semibold sm:text-4xl">{t("how.title")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{t("how.sub")}</p>

      <div className="mt-9 grid gap-4 sm:grid-cols-2">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <article key={title} className="card-surface">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[hsl(var(--luna-cyan))]/15 text-[hsl(var(--luna-cyan))]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-heading text-xs font-semibold text-[hsl(var(--luna-lavender))]/70">0{i + 1}</span>
            </div>
            <h2 className="mt-3 font-heading text-lg font-semibold">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{text}</p>
          </article>
        ))}
      </div>

      <section className="mt-10 glass p-6">
        <h2 className="font-heading text-lg font-semibold">{t("how.resources.title")}</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {["energy", "oxygen", "water", "food", "radiation", "comms"].map((key) => (
            <div key={key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <dt className="text-sm font-semibold text-[hsl(var(--luna-cream))]">{t(`res.${key}`)}</dt>
              <dd className="mt-1 text-xs leading-relaxed text-[hsl(var(--luna-lavender))]">{t(`how.res.${key}`)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-6 rounded-3xl border border-[hsl(var(--luna-purple))]/50 bg-[hsl(var(--luna-purple))]/15 p-6">
        <h2 className="font-heading text-lg font-semibold">{t("how.access.title")}</h2>
        <ul className="mt-3 grid gap-2 text-sm text-[hsl(var(--luna-lavender))] sm:grid-cols-2">
          {["how.access.1", "how.access.2", "how.access.3", "how.access.4"].map((k) => (
            <li key={k} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--luna-mint))]" />
              {t(k)}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-9 flex flex-wrap gap-3">
        <ActionLink to="/briefing" icon={Rocket}>
          {t("home.cta.start")}
        </ActionLink>
        <ActionLink to="/training" variant="ghost">
          {t("nav.training")}
        </ActionLink>
      </div>
    </div>
  );
}
