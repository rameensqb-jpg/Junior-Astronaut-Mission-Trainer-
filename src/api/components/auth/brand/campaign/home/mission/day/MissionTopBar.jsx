import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Pause, Play, HelpCircle, ScrollText, Volume2, VolumeX, X } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { useSettings } from "@/lib/settings/SettingsProvider";
import Logo from "@/components/brand/Logo";

export default function MissionTopBar({ mission, title, paused, onTogglePause }) {
  const t = useT();
  const { sound, update } = useSettings();
  const [help, setHelp] = useState(false);
  const progress = Math.round(((mission.day - 1) / mission.totalDays) * 100);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0c1430]/92 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
        <Logo compact />
        <div className="me-auto min-w-0">
          <p className="truncate font-heading text-sm font-semibold text-[hsl(var(--luna-cream))]">{title || t("mis.title")}</p>
          <p className="truncate text-[11px] text-[hsl(var(--luna-lavender))]">
            {t("mis.dayOf", { day: mission.day, total: mission.totalDays })} · {t("mis.crew")}
          </p>
        </div>

        <div className="order-last w-full sm:order-none sm:w-40">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[hsl(var(--luna-cyan))] transition-all duration-500"
              style={{ width: `${Math.max(4, progress)}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-[hsl(var(--luna-lavender))]/80">
            {t("mis.progress", { pct: progress })}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => update({ sound: !sound })}
            className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-white/15 text-[hsl(var(--luna-lavender))] hover:bg-white/10"
            aria-label={sound ? t("com.mute") : t("com.unmute")}
            aria-pressed={sound}
          >
            {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onTogglePause}
            className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-white/15 text-[hsl(var(--luna-lavender))] hover:bg-white/10"
            aria-label={paused ? t("mis.resume") : t("mis.pause")}
          >
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => setHelp(true)}
            className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-white/15 text-[hsl(var(--luna-lavender))] hover:bg-white/10"
            aria-label={t("mis.help")}
          >
            <HelpCircle className="h-4 w-4" />
          </button>
          <Link
            to="/investigator"
            className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-white/15 text-[hsl(var(--luna-lavender))] hover:bg-white/10"
            aria-label={t("mis.log")}
          >
            <ScrollText className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {help && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-[#060b1c]/80 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" className="glass-strong w-full max-w-lg p-6">
            <div className="flex items-start justify-between gap-4">
              <h2 className="font-heading text-xl font-semibold">{t("help.title")}</h2>
              <button type="button" onClick={() => setHelp(false)} className="focus-ring rounded-full p-2 hover:bg-white/10" aria-label={t("common.close")}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <ol className="mt-4 space-y-3 text-sm text-[hsl(var(--luna-lavender))]">
              {["help.tip1", "help.tip2", "help.tip3", "help.tip4"].map((k) => (
                <li key={k} className="flex gap-3">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--luna-cyan))]" />
                  {t(k)}
                </li>
              ))}
            </ol>
            <button type="button" onClick={() => setHelp(false)} className="btn-primary mt-6 w-full">
              {t("common.close")}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
