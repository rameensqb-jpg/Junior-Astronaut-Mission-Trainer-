import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap, MessageCircle, MonitorPlay, FileText } from "lucide-react";
import { useT } from "@/lib/i18n/LanguageProvider";

export const Route = createFileRoute("/_site/classroom")({
  head: () => ({ meta: [{ title: "Classroom mode — LUNA" }] }),
  component: ClassroomPage,
});

function ClassroomPage() {
  const t = useT();
  const steps = [
    { icon: MonitorPlay, title: t("cls.step1.title"), text: t("cls.step1.text") },
    { icon: MessageCircle, title: t("cls.step2.title"), text: t("cls.step2.text") },
    { icon: GraduationCap, title: t("cls.step3.title"), text: t("cls.step3.text") },
    { icon: FileText, title: t("cls.step4.title"), text: t("cls.step4.text") },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-14">
      <p className="pill text-[hsl(var(--luna-lavender))]">{t("cls.eyebrow")}</p>
      <h1 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">{t("cls.title")}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{t("cls.sub")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {steps.map(({ icon: Icon, title, text }) => (
          <article key={title} className="card-surface">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[hsl(var(--luna-purple))]/30 text-[hsl(var(--luna-lavender))]">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-3 font-heading text-base font-semibold">{title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[hsl(var(--luna-lavender))]">{text}</p>
          </article>
        ))}
      </div>

      <section className="mt-8 glass p-6">
        <h2 className="font-heading text-lg font-semibold">{t("cls.prompts.title")}</h2>
        <ul className="mt-3 space-y-2 text-sm text-[hsl(var(--luna-lavender))]">
          {["cls.prompt.1", "cls.prompt.2", "cls.prompt.3", "cls.prompt.4"].map((k) => (
            <li key={k} className="flex gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--luna-cyan))]" />
              {t(k)}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-7 flex flex-wrap gap-3">
        <Link to="/demo" className="btn-primary">{t("cls.startDemo")}</Link>
        <Link to="/compare" className="btn-ghost">{t("cls.reports")}</Link>
        <Link to="/observatory" className="btn-ghost">{t("nav.observatory")}</Link>
      </div>
      <p className="mt-5 text-[11px] text-[hsl(var(--luna-lavender))]/70">{t("cls.note")}</p>
    </div>
  );
}
