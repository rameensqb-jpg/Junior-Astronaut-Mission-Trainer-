import { createFileRoute } from "@tanstack/react-router";
import { Shield, Sun, Waves, Wind, Droplet, Zap, Mountain, Radio, Home, Battery, Orbit } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { GLOSSARY } from "@/lib/content/training";

export const Route = createFileRoute("/_site/glossary")({
  head: () => ({ meta: [{ title: "Science glossary — LUNA" }] }),
  component: GlossaryPage,
});

const ICONS = { shield: Shield, sun: Sun, waves: Waves, wind: Wind, droplet: Droplet, zap: Zap, mountain: Mountain, radio: Radio, home: Home, battery: Battery, orbit: Orbit };

const TONES = [
  "bg-[hsl(var(--luna-cyan))]/15 text-[hsl(var(--luna-cyan))]",
  "bg-[hsl(var(--luna-orange))]/15 text-[hsl(var(--luna-orange))]",
  "bg-[hsl(var(--luna-lavender))]/15 text-[hsl(var(--luna-lavender))]",
  "bg-[hsl(var(--luna-mint))]/15 text-[hsl(var(--luna-mint))]",
];

function GlossaryPage() {
  const t = useT();
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14">
      <p className="pill text-[hsl(var(--luna-mint))]">{t("nav.glossary")}</p>
      <h1 className="mt-5 font-heading text-3xl font-semibold sm:text-4xl">{t("gl.title")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{t("gl.sub")}</p>

      <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {GLOSSARY.map((item, i) => {
          const Icon = ICONS[item.icon] || Shield;
          return (
            <article key={item.id} className="card-surface">
              <span className={`grid h-10 w-10 place-items-center rounded-2xl ${TONES[i % TONES.length]}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-3 font-heading text-base font-semibold text-[hsl(var(--luna-cream))]">{t(`gl.${item.id}.term`)}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{t(`gl.${item.id}.def`)}</p>
              <p className="mt-2.5 rounded-xl bg-white/[0.05] px-3 py-2 text-[11px] leading-relaxed text-[hsl(var(--luna-cyan))]">
                {t(`gl.${item.id}.example`)}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
