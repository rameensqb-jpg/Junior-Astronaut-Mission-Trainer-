import { useT } from "@/lib/i18n/LanguageProvider";
import { effectList } from "@/lib/sim/labels";

export default function EffectChips({ effects, className = "" }) {
  const t = useT();
  const list = effectList(effects);
  if (!list.length) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {list.map((e) => (
        <span
          key={e.key + e.value}
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
            e.positive ? "bg-[hsl(var(--luna-mint))]/15 text-[hsl(var(--luna-mint))]" : "bg-[hsl(var(--destructive))]/15 text-[hsl(var(--destructive))]"
          }`}
        >
          {t(e.key)} {e.value > 0 ? "+" : ""}
          {e.value}
          {e.unit ? ` ${e.unit}` : ""}
        </span>
      ))}
    </div>
  );
}
