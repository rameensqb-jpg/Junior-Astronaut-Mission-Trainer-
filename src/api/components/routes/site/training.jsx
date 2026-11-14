import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Moon, Wind, Sun, Shield, Zap, Radio, Sprout, Droplet, Home, PlayCircle, BookOpen, Check } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { TRAINING } from "@/lib/content/training";
import ActionLink from "@/components/brand/ActionLink";

export const Route = createFileRoute("/_site/training")({
  head: () => ({ meta: [{ title: "Mission Training Academy — LUNA" }] }),
  component: TrainingPage,
});

const ICONS = { moon: Moon, wind: Wind, sun: Sun, shield: Shield, zap: Zap, radio: Radio, sprout: Sprout, droplet: Droplet, home: Home };

function Activity({ item }) {
  const t = useT();
  const [choice, setChoice] = useState(null);
  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-[#0d1637]/70 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[hsl(var(--luna-orange))]">{t("tr.activity")}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-[hsl(var(--luna-cream))]">{t(`tr.${item.id}.prompt`)}</p>
      <div className="mt-3 grid gap-1.5">
        {item.options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setChoice(opt)}
            aria-pressed={choice === opt}
            className={`focus-ring flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-start text-xs transition ${
              choice === opt
                ? "border-[hsl(var(--luna-cyan))] bg-[hsl(var(--luna-cyan))]/15 text-[hsl(var(--luna-cream))]"
                : "border-white/15 bg-white/[0.04] text-[hsl(var(--luna-lavender))] hover:bg-white/[0.08]"
            }`}
          >
            {t(`tr.${item.id}.opt.${opt}`)}
            {choice === opt && <Check className="h-3.5 w-3.5 text-[hsl(var(--luna-cyan))]" aria-hidden="true" />}
          </button>
        ))}
      </div>
      {choice && (
        <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.05] p-3">
          <p className="text-[11px] font-semibold text-[hsl(var(--luna-mint))]">{t("tr.principle")}</p>
          <p className="mt-1 text-xs leading-relaxed text-[hsl(var(--luna-lavender))]">{t(`tr.${item.id}.explain`)}</p>
        </div>
      )}
    </div>
  );
}

function TrainingPage() {
  const t = useT();
  const [open, setOpen] = useState(null);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14">
      <p className="pill text-[hsl(var(--luna-cyan))]">{t("tr.eyebrow")}</p>
      <h1 className="mt-5 font-heading text-3xl font-semibold sm:text-4xl">{t("tr.title")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{t("tr.sub")}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <ActionLink to="/briefing">{t("home.cta.start")}</ActionLink>
        <ActionLink to="/how-to-play" variant="ghost">
          {t("nav.howto")}
        </ActionLink>
      </div>

      <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TRAINING.map((item) => {
          const Icon = ICONS[item.icon] || BookOpen;
          const isOpen = open === item.id;
          return (
            <article key={item.id} className={`rounded-3xl border bg-white/[0.04] p-5 transition ${isOpen ? "border-[hsl(var(--luna-cyan))]/60 md:col-span-2 xl:col-span-3" : "border-white/10"}`}>
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[hsl(var(--luna-purple))]/30 text-[hsl(var(--luna-lavender))]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-heading text-base font-semibold text-[hsl(var(--luna-cream))]">{t(`tr.${item.id}.title`)}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-[hsl(var(--luna-lavender))]">{t(`tr.${item.id}.desc`)}</p>
                </div>
              </div>

              {isOpen && (
                <>
                  <p className="mt-3 rounded-xl bg-[hsl(var(--luna-mint))]/10 px-3 py-2 text-xs text-[hsl(var(--luna-mint))]">
                    {t("tr.learn")}: {t(`tr.${item.id}.learn`)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={item.nasaLink}
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3.5 py-2 text-[11px] font-semibold text-[hsl(var(--luna-cream))] hover:bg-white/10"
                    >
                      <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                      {t("tr.readNasa")}
                    </a>
                    <a
                      href={`https://www.youtube.com/@NASA/search?query=${encodeURIComponent(item.videoQuery)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-[hsl(var(--luna-orange))]/50 bg-[hsl(var(--luna-orange))]/10 px-3.5 py-2 text-[11px] font-semibold text-[hsl(var(--luna-orange))] hover:bg-[hsl(var(--luna-orange))]/20"
                    >
                      <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      {t("tr.watchNasa")}
                    </a>
                  </div>
                  <Activity item={item} />
                </>
              )}

              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : item.id)}
                className="focus-ring mt-3 text-[11px] font-semibold text-[hsl(var(--luna-cyan))]"
                aria-expanded={isOpen}
              >
                {isOpen ? t("common.close") : t("tr.open")}
              </button>
            </article>
          );
        })}
      </div>
      <p className="mt-8 text-[11px] leading-relaxed text-[hsl(var(--luna-lavender))]/70">{t("tr.disclaimer")}</p>
    </div>
  );
}
