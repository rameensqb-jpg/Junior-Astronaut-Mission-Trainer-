import { createFileRoute } from "@tanstack/react-router";
import { Type, Waves, Volume2, Languages, Trash2 } from "lucide-react";
import { useLang, LANGS } from "@/lib/i18n/LanguageProvider";
import { useSettings } from "@/lib/settings/SettingsProvider";
import { store } from "@/lib/mission/store";

export const Route = createFileRoute("/_site/settings")({
  head: () => ({ meta: [{ title: "Settings — LUNA" }] }),
  component: SettingsPage,
});

function Options({ label, options, value, onChange, icon: Icon }) {
  return (
    <div className="glass p-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-[hsl(var(--luna-cream))]">
        {Icon ? <Icon className="h-4 w-4 text-[hsl(var(--luna-cyan))]" aria-hidden="true" /> : null}
        {label}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={value === opt.value}
            className={`focus-ring min-h-[44px] rounded-full px-4 py-2 text-xs font-semibold transition ${
              value === opt.value
                ? "bg-[hsl(var(--luna-cyan))] text-[#101A35]"
                : "border border-white/15 bg-white/[0.05] text-[hsl(var(--luna-lavender))] hover:bg-white/10"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SettingsPage() {
  const { t, lang, setLang } = useLang();
  const settings = useSettings();

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-14">
      <h1 className="font-heading text-3xl font-semibold">{t("nav.settings")}</h1>
      <p className="mt-2 text-sm text-[hsl(var(--luna-lavender))]">{t("set.sub")}</p>

      <div className="mt-8 space-y-4">
        <div className="glass p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-[hsl(var(--luna-cream))]">
            <Languages className="h-4 w-4 text-[hsl(var(--luna-cyan))]" aria-hidden="true" />
            {t("common.language")}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                aria-pressed={lang === l.code}
                dir={l.dir}
                className={`focus-ring min-h-[56px] rounded-2xl border px-4 py-3 text-start text-sm font-semibold transition ${
                  lang === l.code
                    ? "border-[hsl(var(--luna-cyan))] bg-[hsl(var(--luna-cyan))]/15 text-[hsl(var(--luna-cream))]"
                    : "border-white/15 bg-white/[0.04] text-[hsl(var(--luna-lavender))] hover:bg-white/10"
                }`}
              >
                {l.native}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-[hsl(var(--luna-lavender))]/70">{t("set.langHint")}</p>
        </div>

        <Options
          icon={Type}
          label={t("set.textSize")}
          value={settings.textSize}
          onChange={(v) => settings.update({ textSize: v })}
          options={[
            { value: "normal", label: t("set.size.normal") },
            { value: "large", label: t("set.size.large") },
            { value: "xlarge", label: t("set.size.xlarge") },
          ]}
        />

        <Options
          icon={Waves}
          label={t("set.motion")}
          value={settings.motion}
          onChange={(v) => settings.update({ motion: v })}
          options={[
            { value: "full", label: t("set.motion.full") },
            { value: "reduced", label: t("set.motion.reduced") },
          ]}
        />

        <Options
          icon={Volume2}
          label={t("set.sound")}
          value={settings.sound ? "on" : "off"}
          onChange={(v) => settings.update({ sound: v === "on" })}
          options={[
            { value: "on", label: t("set.on") },
            { value: "off", label: t("set.off") },
          ]}
        />

        <div className="glass p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-[hsl(var(--luna-cream))]">
            <Trash2 className="h-4 w-4 text-[hsl(var(--destructive))]" aria-hidden="true" />
            {t("set.data")}
          </p>
          <p className="mt-1.5 text-[11px] text-[hsl(var(--luna-lavender))]/80">{t("set.dataHint")}</p>
          <button
            type="button"
            onClick={() => {
              store.clearActive();
              store.setProfile(null);
            }}
            className="focus-ring mt-3 min-h-[44px] rounded-full border border-[hsl(var(--destructive))]/50 px-4 py-2 text-xs font-semibold text-[hsl(var(--destructive))]"
          >
            {t("set.clearMission")}
          </button>
        </div>
      </div>

      <p className="mt-8 text-[11px] leading-relaxed text-[hsl(var(--luna-lavender))]/70">{t("footer.disclaimer")}</p>
    </div>
  );
}
