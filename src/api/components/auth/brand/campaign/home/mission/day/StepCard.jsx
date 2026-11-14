import { Check } from "lucide-react";

export default function StepCard({ step, title, hint, done, children }) {
  return (
    <section className={`glass p-4 sm:p-5 ${done ? "border-[hsl(var(--luna-mint))]/35" : ""}`}>
      <div className="flex items-start gap-3">
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-[11px] font-bold ${
            done ? "bg-[hsl(var(--luna-mint))]/15 text-[hsl(var(--luna-mint))]" : "bg-white/10 text-[hsl(var(--luna-lavender))]"
          }`}
          aria-hidden="true"
        >
          {done ? <Check className="h-4 w-4" /> : step}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h2 className="font-heading text-sm font-semibold text-[hsl(var(--luna-cream))]">{title}</h2>
            {hint && <span className="text-[10px] uppercase tracking-[0.14em] text-[hsl(var(--luna-lavender))]/70">{hint}</span>}
          </div>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </section>
  );
}
