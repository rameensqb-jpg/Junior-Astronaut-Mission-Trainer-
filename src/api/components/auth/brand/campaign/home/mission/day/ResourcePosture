import { BatteryCharging, Check } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";
import { POSTURES } from "@/lib/sim/campaignEngine";
import EffectChips from "../EffectChips";
import StepCard from "./StepCard";

export default function ResourcePostureCard({ posture, onChoose }) {
  const t = useT();
  const chosen = Boolean(posture);

  return (
    <StepCard step={4} title={t("day.resources")} hint={chosen ? t("day.postureChosen") : undefined} done={chosen}>
      <p className="text-[11px] leading-relaxed text-[hsl(var(--luna-lavender))]">{t("day.postureHint")}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {POSTURES.map((option) => {
          const active = posture === option.id;
          return (
            <button
              key={option.id}
              type="button"
              disabled={chosen}
              aria-pressed={active}
              onClick={() => onChoose(option.id)}
              className={`focus-ring rounded-2xl border p-3 text-start transition ${
                active
                  ? "border-[hsl(var(--luna-cyan))]/70 bg-[hsl(var(--luna-cyan))]/12"
                  : "border-white/12 bg-white/[0.03] hover:bg-white/[0.07] disabled:opacity-45"
              }`}
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--luna-cream))]">
                {active ? <Check className="h-3.5 w-3.5 text-[hsl(var(--luna-mint))]" aria-hidden="true" /> : <BatteryCharging className="h-3.5 w-3.5 text-[hsl(var(--luna-cyan))]" aria-hidden="true" />}
                {t(`posture.${option.id}`)}
              </span>
              <span className="mt-1 block text-[11px] leading-relaxed text-[hsl(var(--luna-lavender))]">{t(`posture.${option.id}.desc`)}</span>
              <EffectChips effects={option.effects} className="mt-2" />
            </button>
          );
        })}
      </div>
    </StepCard>
  );
}
