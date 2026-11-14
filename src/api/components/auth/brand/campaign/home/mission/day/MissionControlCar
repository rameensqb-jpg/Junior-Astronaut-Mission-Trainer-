import { Radio } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import StepCard from "./StepCard";

export default function MissionControlCard({ day, mission }) {
  const t = useT();
  const latest = [...(mission.messages || [])].reverse().find((m) => m.from === "control" && m.text);
  const pending = (mission.messages || []).filter((m) => m.from === "control" && !m.answered).length;

  return (
    <StepCard step={7} title={t("day.control")} hint={pending ? `${pending} ${t("com.new")}` : undefined} done={false}>
      <div className="rounded-2xl border border-[hsl(var(--luna-cyan))]/35 bg-[hsl(var(--luna-cyan))]/8 p-3.5">
        <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[hsl(var(--luna-cyan))]">
          <Radio className="h-3 w-3" aria-hidden="true" />
          {t("com.control")}
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-[hsl(var(--luna-cream))]">{day.control}</p>
        {latest && latest.text !== day.control && (
          <p className="mt-2 border-t border-white/10 pt-2 text-[11px] leading-relaxed text-[hsl(var(--luna-lavender))]">{latest.text}</p>
        )}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-[hsl(var(--luna-lavender))]/80">{t("day.commsHint")}</p>
    </StepCard>
  );
}
