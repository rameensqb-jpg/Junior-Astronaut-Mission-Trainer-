import { Users, CalendarDays, MapPin, Activity } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";

export default function MissionStatusPanel() {
  const t = useT();
  const rows = [
    { icon: Users, label: t("home.status.crew"), value: t("home.status.crew") },
    { icon: CalendarDays, label: t("common.days"), value: t("home.status.days") },
    { icon: MapPin, label: t("home.status.place"), value: t("home.status.place") },
  ];

  return (
    <div className="glass-strong p-6 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <p className="label-caps">{t("home.status.title")}</p>
        <span className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--luna-mint))]/15 px-3 py-1 text-[11px] font-semibold text-[hsl(var(--luna-mint))]">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--luna-mint))]" />
          {t("home.status.ready")}
        </span>
      </div>
      <h3 className="mt-3 font-heading text-2xl font-semibold text-[hsl(var(--luna-cream))]">{t("home.status.name")}</h3>
      <div className="mt-5 space-y-3">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3 text-sm">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-[hsl(var(--luna-cyan))]">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-[hsl(var(--luna-lavender))]">{label}</span>
            <span className="ms-auto text-end font-medium text-[hsl(var(--luna-cream))]">{value}</span>
          </div>
        ))}
        <div className="flex items-center gap-3 border-t border-white/10 pt-3 text-sm">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-[hsl(var(--luna-orange))]">
            <Activity className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-[hsl(var(--luna-lavender))]">{t("home.status.focus")}</span>
        </div>
      </div>
    </div>
  );
}
