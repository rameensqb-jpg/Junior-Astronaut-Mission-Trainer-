import { LANGS, useLang } from "@/lib/i18n/LanguageProvider";

const DESCRIPTIONS = {
  en: "Explore the Moon in English",
  ar: "استكشف القمر بالعربية",
  ur: "چاند کو اردو میں دریافت کریں",
  es: "Explora la Luna en español",
};

export function LanguageGate() {
  const { hasChosen, ready, setLang, t, lang } = useLang();

  if (!ready || hasChosen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("lang.title")}
      className="fixed inset-0 z-[100] overflow-y-auto bg-[#0a1128]/95 backdrop-blur-xl"
    >
      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col justify-center px-5 py-12">
        <div className="mb-10 text-center">
          <p className="pill mx-auto mb-5 text-[hsl(var(--luna-cyan))]">LUNA · Beyond Survival</p>
          <h1 className="font-heading text-3xl font-semibold text-[hsl(var(--luna-cream))] sm:text-4xl">
            {t("lang.title")}
          </h1>
          <p className="mt-3 text-sm text-[hsl(var(--luna-lavender))]">{t("lang.subtitle")}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLang(l.code)}
              aria-current={lang === l.code}
              className="focus-ring group flex min-h-[132px] flex-col items-start justify-between rounded-3xl border border-white/15 bg-white/[0.06] p-6 text-start transition hover:-translate-y-0.5 hover:border-[hsl(var(--luna-cyan))]/70 hover:bg-white/[0.1]"
            >
              <span className="font-heading text-2xl font-semibold text-[hsl(var(--luna-cream))]" dir={l.dir}>
                {l.native}
              </span>
              <span className="mt-4 text-xs text-[hsl(var(--luna-lavender))]" dir={l.dir}>
                {DESCRIPTIONS[l.code]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LanguageGate;
