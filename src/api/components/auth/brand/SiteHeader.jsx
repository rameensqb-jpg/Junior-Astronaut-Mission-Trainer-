import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Rocket, X, Globe } from "lucide-react";
import Logo from "@/components/brand/Logo";
import { useT, useLang } from "@/lib/i18n/LanguageProvider";

const NAV = [
  { key: "camp.title", to: "/campaign" },
  { key: "nav.training", to: "/training" },
  { key: "nav.howto", to: "/how-to-play" },
  { key: "nav.observatory", to: "/observatory" },
  { key: "nav.glossary", to: "/glossary" },
  { key: "nav.achievements", to: "/achievements" },
  { key: "nav.classroom", to: "/classroom" },
];

export default function SiteHeader() {
  const t = useT();
  const { setLang, lang } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0d1533]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between gap-4 px-5">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="focus-ring rounded-full px-3.5 py-2 text-sm font-medium text-[hsl(var(--luna-lavender))] transition hover:bg-white/10 hover:text-[hsl(var(--luna-cream))]"
              activeProps={{ className: "bg-white/10 text-[hsl(var(--luna-cream))]" }}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/settings"
            className="focus-ring hidden h-11 w-11 place-items-center rounded-full border border-white/15 text-[hsl(var(--luna-lavender))] transition hover:bg-white/10 sm:grid"
            aria-label={t("nav.settings")}
          >
            <Globe className="h-4 w-4" />
          </Link>
          <Link to="/briefing" className="btn-primary hidden !min-h-[44px] !px-5 !py-2.5 sm:inline-flex">
            <Rocket className="h-4 w-4" />
            {t("nav.start")}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="focus-ring grid h-11 w-11 place-items-center rounded-full border border-white/15 text-[hsl(var(--luna-cream))] lg:hidden"
            aria-expanded={open}
            aria-label={open ? t("common.close") : "Menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#0d1533] px-5 pb-6 pt-3 lg:hidden">
          <nav aria-label="Mobile" className="grid gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-2xl px-4 py-3 text-sm font-medium text-[hsl(var(--luna-lavender))] hover:bg-white/10 hover:text-[hsl(var(--luna-cream))]"
              >
                {t(item.key)}
              </Link>
            ))}
            <Link
              to="/settings"
              onClick={() => setOpen(false)}
              className="focus-ring rounded-2xl px-4 py-3 text-sm font-medium text-[hsl(var(--luna-lavender))] hover:bg-white/10"
            >
              {t("nav.settings")}
            </Link>
          </nav>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {["en", "ar", "ur", "es"].map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={`focus-ring rounded-xl border px-2 py-2 text-xs font-semibold uppercase transition ${
                  lang === code
                    ? "border-[hsl(var(--luna-cyan))] bg-[hsl(var(--luna-cyan))]/15 text-[hsl(var(--luna-cream))]"
                    : "border-white/15 text-[hsl(var(--luna-lavender))]"
                }`}
              >
                {code}
              </button>
            ))}
          </div>
          <Link to="/briefing" onClick={() => setOpen(false)} className="btn-primary mt-4 w-full">
            <Rocket className="h-4 w-4" />
            {t("nav.start")}
          </Link>
        </div>
      )}
    </header>
  );
}
