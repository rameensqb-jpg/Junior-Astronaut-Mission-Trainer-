import { useState } from "react";
import { Radio, Send, Inbox, ChevronDown } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";

const PRIORITY_STYLES = {
  critical: "border-[hsl(var(--destructive))]/50 bg-[hsl(var(--destructive))]/10",
  warning: "border-[hsl(var(--luna-orange))]/45 bg-[hsl(var(--luna-orange))]/10",
  info: "border-white/10 bg-white/[0.04]",
};

const REQUESTS = ["resources", "equipment", "environment", "science", "status"];

export default function CommsPanel({ mission, onRespond, onAsk }) {
  const t = useT();
  const [tab, setTab] = useState("inbox");
  const [openArchive, setOpenArchive] = useState(false);

  const messageText = (m) =>
    m.text ||
    t(m.key, {
      ...(m.params || {}),
      resource: m.params?.resource ? t(`res.${m.params.resource}`) : "",
      note: m.params?.note ? t(m.params.note) : "",
    });

  const all = mission.messages;
  const inbox = all.slice(-6).reverse();
  const unread = all.filter((m) => m.from === "control" && !m.answered).length;

  return (
    <section className="glass flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[hsl(var(--luna-cyan))]/15 text-[hsl(var(--luna-cyan))]">
            <Radio className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-heading text-sm font-semibold">{t("com.title")}</h2>
            <p className="text-[10px] text-[hsl(var(--luna-lavender))]/80">{t("com.delay")}</p>
          </div>
        </div>
        {unread > 0 && (
          <span className="rounded-full bg-[hsl(var(--luna-cyan))] px-2 py-0.5 text-[10px] font-bold text-[#101A35]">
            {unread}
          </span>
        )}
      </div>

      <div className="flex gap-1 border-b border-white/10 px-3 py-2">
        {[
          { id: "inbox", label: t("com.inbox"), icon: Inbox },
          { id: "request", label: t("com.requestTab"), icon: Send },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            aria-pressed={tab === item.id}
            className={`focus-ring inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${
              tab === item.id ? "bg-white/10 text-[hsl(var(--luna-cream))]" : "text-[hsl(var(--luna-lavender))] hover:bg-white/5"
            }`}
          >
            <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="max-h-[30rem] flex-1 space-y-2.5 overflow-y-auto p-4">
        {tab === "inbox" &&
          inbox.map((m) => {
            const player = m.from === "player";
            return (
              <article
                key={m.id}
                className={`rounded-2xl border p-3.5 ${player ? "border-[hsl(var(--luna-mint))]/40 bg-[hsl(var(--luna-mint))]/10" : PRIORITY_STYLES[m.priority] || PRIORITY_STYLES.info}`}
              >
                <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.1em]">
                  <span className={player ? "font-semibold text-[hsl(var(--luna-mint))]" : "font-semibold text-[hsl(var(--luna-cyan))]"}>
                    {player ? t("com.you") : t("com.control")}
                  </span>
                  <span className="text-[hsl(var(--luna-lavender))]/70">
                    {t("common.day")} {m.day}
                    {m.delay ? ` · ${m.delay}s ${t("com.lag")}` : ""}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-[hsl(var(--luna-cream))]">{messageText(m)}</p>
                {m.details?.length > 0 && (
                  <dl className="mt-2 grid grid-cols-2 gap-1 text-[11px]">
                    {m.details.map((d) => (
                      <div key={d.k} className="flex justify-between gap-2 rounded-lg bg-white/5 px-2 py-1">
                        <dt className="text-[hsl(var(--luna-lavender))]">{t(d.k)}</dt>
                        <dd className="font-medium text-[hsl(var(--luna-cream))]">{d.v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {m.from === "control" && m.options?.length > 0 && !m.answered && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {m.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => onRespond(m.id, opt)}
                        className="focus-ring rounded-full border border-[hsl(var(--luna-cyan))]/50 bg-[hsl(var(--luna-cyan))]/10 px-3 py-1.5 text-[11px] font-semibold text-[hsl(var(--luna-cyan))] transition hover:bg-[hsl(var(--luna-cyan))]/20"
                      >
                        {t(`com.opt.${opt}`)}
                      </button>
                    ))}
                  </div>
                )}
                {m.answered && m.from === "control" && (
                  <p className="mt-2 text-[10px] italic text-[hsl(var(--luna-lavender))]/70">{t("com.answered")}</p>
                )}
              </article>
            );
          })}

        {tab === "request" && (
          <div className="space-y-2">
            <p className="text-xs text-[hsl(var(--luna-lavender))]">{t("com.requestHint")}</p>
            {REQUESTS.map((kind) => (
              <button
                key={kind}
                type="button"
                onClick={() => onAsk(kind)}
                className="focus-ring flex w-full items-center justify-between gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-3.5 py-2.5 text-start text-xs font-medium text-[hsl(var(--luna-cream))] transition hover:border-[hsl(var(--luna-cyan))]/60 hover:bg-white/[0.08]"
              >
                {t(`com.request.${kind}`)}
                <Send className="h-3.5 w-3.5 text-[hsl(var(--luna-cyan))]" aria-hidden="true" />
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setOpenArchive((v) => !v)}
        className="focus-ring flex items-center justify-between border-t border-white/10 px-5 py-3 text-[11px] font-semibold text-[hsl(var(--luna-lavender))] hover:bg-white/5"
        aria-expanded={openArchive}
      >
        {t("com.archive", { count: all.length })}
        <ChevronDown className={`h-3.5 w-3.5 transition ${openArchive ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {openArchive && (
        <ol className="max-h-56 space-y-1.5 overflow-y-auto border-t border-white/10 bg-[#0b1330] p-4 text-[11px]">
          {all.map((m) => (
            <li key={`a-${m.id}`} className="flex gap-2 text-[hsl(var(--luna-lavender))]">
              <span className="w-10 shrink-0 text-[hsl(var(--luna-lavender))]/60">D{m.day}</span>
              <span className={m.from === "player" ? "text-[hsl(var(--luna-mint))]" : ""}>
                {m.from === "player" ? t("com.you") : t("com.control")}:
              </span>
              <span className="text-[hsl(var(--luna-cream))]/85">{messageText(m)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
