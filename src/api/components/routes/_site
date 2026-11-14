import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import SiteHeader from "@/components/brand/SiteHeader";
import Logo from "@/components/brand/Logo";
import { useT } from "@/lib/i18n/LanguageProvider";

export const Route = createFileRoute("/_site")({
  component: SiteLayout,
});

function SiteLayout() {
  const t = useT();
  return (
    <div className="flex min-h-screen flex-col bg-[hsl(var(--background))]">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-white/10 bg-[#0a1128]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-[hsl(var(--luna-lavender))]/80">
              {t("footer.disclaimer")}
            </p>
          </div>
          <div className="text-sm">
            <p className="label-caps mb-3">{t("footer.sources")}</p>
            <ul className="space-y-2 text-[hsl(var(--luna-lavender))]">
              <li>
                <a className="hover:text-[hsl(var(--luna-cyan))]" href="https://api.nasa.gov/" target="_blank" rel="noreferrer">
                  NASA Open APIs
                </a>
              </li>
              <li>
                <a className="hover:text-[hsl(var(--luna-cyan))]" href="https://science.nasa.gov/moon/" target="_blank" rel="noreferrer">
                  NASA Moon Science
                </a>
              </li>
              <li>
                <a className="hover:text-[hsl(var(--luna-cyan))]" href="https://osdr.nasa.gov/" target="_blank" rel="noreferrer">
                  NASA Open Science Data Repository
                </a>
              </li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="label-caps mb-3">{t("nav.mission")}</p>
            <ul className="space-y-2 text-[hsl(var(--luna-lavender))]">
              <li>
                <Link to="/briefing" className="hover:text-[hsl(var(--luna-cyan))]">
                  {t("nav.start")}
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-[hsl(var(--luna-cyan))]">
                  {t("nav.compare")}
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-[hsl(var(--luna-cyan))]">
                  {t("nav.settings")}
                </Link>
              </li>
            </ul>
            <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[hsl(var(--luna-lavender))]/60">
              {t("footer.credit")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
