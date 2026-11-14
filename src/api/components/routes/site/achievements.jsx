import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BatteryCharging, Sun, Microscope, Radio, Leaf, Search, Lock, Trophy } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { ACHIEVEMENTS } from "@/lib/sim/achievements";
import { store } from "@/lib/mission/store";

export const Route = createFileRoute("/_site/achievements")({
  head: () => ({ meta: [{ title: "Achievements — LUNA" }] }),
  component: AchievementsPage,
});

const ICONS = { battery: BatteryCharging, sun: Sun, microscope: Microscope, radio: Radio, leaf: Leaf, search: Search };

function AchievementsPage() {
  const t = useT();
  const [earned, setEarned] = useState({});

  useEffect(() => setEarned(store.getAchievements()), []);

  const count = ACHIEVEMENTS.filter((a) => earned[a.id]).length;

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="pill text-[hsl(var(--luna-orange))]">
            <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
            {t("ach.eyebrow")}
          </p>
          <h1 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">{t("ach.title")}</h1>
          <p className="mt-2 max-w-xl text-sm text-[hsl(var(--luna-lavender))]">{t("ach.sub")}</p>
        </div>
        <p className="font-heading text-2xl font-semibold text-[hsl(var(--luna-cyan))]">
          {count}/{ACHIEVEMENTS.length}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((achievement) => {
          const Icon = ICONS[achievement.icon] || Trophy;
          const unlocked = Boolean(earned[achievement.id]);
          return (
            <article
              key={achievement.id}
              className={`rounded-3xl border p-5 transition ${
                unlocked ? "border-[hsl(var(--luna-mint))]/45 bg-[hsl(var(--luna-mint))]/10" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`grid h-11 w-11 place-items-center rounded-2xl ${unlocked ? "bg-[hsl(var(--luna-mint))]/20 text-[hsl(var(--luna-mint))]" : "bg-white/10 text-[hsl(var(--luna-lavender))]/60"}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                {!unlocked && <Lock className="h-3.5 w-3.5 text-[hsl(var(--luna-lavender))]/50" aria-hidden="true" />}
              </div>
              <h2 className="mt-3 font-heading text-base font-semibold text-[hsl(var(--luna-cream))]">{t(`ach.${achievement.id}.name`)}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-[hsl(var(--luna-lavender))]">{t(`ach.${achievement.id}.desc`)}</p>
              <p className={`mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] ${unlocked ? "text-[hsl(var(--luna-mint))]" : "text-[hsl(var(--luna-lavender))]/50"}`}>
                {unlocked ? t("ach.earned") : t("ach.locked")}
              </p>
            </article>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/briefing" className="btn-primary">{t("home.cta.start")}</Link>
        <Link to="/investigator" className="btn-ghost">{t("nav.achievements")}</Link>
      </div>
    </div>
  );
}
