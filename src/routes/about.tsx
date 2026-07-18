import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Waves,
  Target,
  AlertTriangle,
  Workflow,
  Cpu,
  Users,
  Mail,
  Phone,
  MapPin,
  Github,
  Mic,
  Camera,
  Brain,
  Radio,
  ShieldCheck,
  Database,
  Cloud,
  Smartphone,
  Languages,
  Send,
  ArrowRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Flood Copilot" },
      {
        name: "description",
        content:
          "Mission, technology, and team behind Flood Copilot — an offline-first AI decision support system for flood response in rural Telangana.",
      },
      { property: "og:title", content: "About Flood Copilot" },
      {
        property: "og:description",
        content: "How the offline AI copilot works, the stack it runs on, and the team behind it.",
      },
    ],
  }),
  component: AboutPage,
});

const STACK: { groupKey: string; icon: LucideIcon; items: string[] }[] = [
  {
    groupKey: "Frontend",
    icon: Smartphone,
    items: ["React 19", "TanStack Start", "Tailwind CSS v4", "Framer Motion", "Vite 7"],
  },
  {
    groupKey: "AI / ML",
    icon: Brain,
    items: ["Whisper (Telugu ASR)", "Gemini vision", "Lovable AI Gateway", "IndicTrans2", "On-device TFLite"],
  },
  {
    groupKey: "Backend",
    icon: Cloud,
    items: ["Cloudflare Workers", "TanStack Server Functions", "Lovable Cloud (Postgres)", "Edge KV cache"],
  },
  {
    groupKey: "Data & Sources",
    icon: Database,
    items: ["IMD nowcast API", "CWC river gauges", "TSDMA bulletins", "OpenStreetMap tiles"],
  },
  {
    groupKey: "Comms fallback",
    icon: Radio,
    items: ["112 SMS gateway", "USSD keypad flow", "Bluetooth mesh relay", "FM broadcast alerts"],
  },
  {
    groupKey: "Accessibility",
    icon: Languages,
    items: ["Telugu-first UI", "Voice-only mode", "High-contrast theme", "Low-bandwidth PWA"],
  },
];

const TEAM = [
  {
    name: "Venkataramana Emmadoju",
    roleKey: "about.founderRole",
    initials: "VE",
    tone: "from-primary to-primary-glow",
  },
];

function AboutPage() {
  const { t } = useLanguage();

  const HOW_IT_WORKS = [
    {
      step: "01",
      title: t("about.step1Title"),
      description: t("about.step1Desc"),
      icon: Mic,
      tone: "bg-primary/10 text-primary",
    },
    {
      step: "02",
      title: t("about.step2Title"),
      description: t("about.step2Desc"),
      icon: Brain,
      tone: "bg-info/15 text-info",
    },
    {
      step: "03",
      title: t("about.step3Title"),
      description: t("about.step3Desc"),
      icon: Sparkles,
      tone: "bg-warning/15 text-warning-foreground dark:text-warning",
    },
    {
      step: "04",
      title: t("about.step4Title"),
      description: t("about.step4Desc"),
      icon: Send,
      tone: "bg-success/15 text-success",
    },
    {
      step: "05",
      title: t("about.step5Title"),
      description: t("about.step5Desc"),
      icon: ShieldCheck,
      tone: "bg-destructive/10 text-destructive",
    },
  ];

  const AI_WORKFLOW = [
    { label: t("report.voice"), icon: Mic, note: "Telugu speech" },
    { label: t("report.photo"), icon: Camera, note: "Flood photo" },
    { label: "AI Copilot", icon: Brain, note: "On-device + Gateway" },
    { label: t("report.aiSummary"), icon: Sparkles, note: "Structured report" },
    { label: "112 / Shelter", icon: ShieldCheck, note: "Responder action" },
  ];

  const PROBLEMS = [
    { title: t("about.problem1Title"), body: t("about.problem1Body") },
    { title: t("about.problem2Title"), body: t("about.problem2Body") },
    { title: t("about.problem3Title"), body: t("about.problem3Body") },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-background to-background p-6 shadow-[var(--shadow-soft)] sm:p-10"
      >
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge variant="info" pulse>
            <Waves className="h-3 w-3" />
            {t("about.publicInterest")}
          </StatusBadge>
          <StatusBadge variant="success">{t("about.openSource")}</StatusBadge>
        </div>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {t("about.heroTitle")}
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          {t("about.heroDesc")}
        </p>
      </motion.div>

      {/* Mission */}
      <Section eyebrow={t("about.missionEyebrow")} title={t("about.missionTitle")} icon={Target}>
        <div className="grid gap-4 md:grid-cols-2">
          <p className="text-base leading-relaxed text-foreground">{t("about.missionP1")}</p>
          <p className="text-base leading-relaxed text-muted-foreground">{t("about.missionP2")}</p>
        </div>
      </Section>

      {/* Problem */}
      <Section eyebrow={t("about.problemEyebrow")} title={t("about.problemTitle")} icon={AlertTriangle}>
        <div className="grid gap-4 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5"
            >
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h3 className="mt-3 text-base font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* How it works — timeline */}
      <Section eyebrow={t("about.howItWorksEyebrow")} title={t("about.howItWorksTitle")} icon={Workflow}>
        <ol className="relative space-y-6 border-l-2 border-dashed border-border pl-6">
          {HOW_IT_WORKS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.li
                key={s.step}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="relative"
              >
                <span
                  className={cn(
                    "absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full border-4 border-background",
                    s.tone,
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("about.step")} {s.step}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </Section>

      {/* AI workflow diagram */}
      <Section eyebrow={t("about.aiWorkflowEyebrow")} title={t("about.aiWorkflowTitle")} icon={Brain}>
        <div className="rounded-3xl border border-border bg-gradient-to-br from-secondary/40 to-background p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <div className="grid grid-cols-3 gap-4 md:flex md:flex-wrap md:items-center md:justify-between">
            {AI_WORKFLOW.map((n, i) => {
              const Icon = n.icon;
              const isHub = n.label === "AI Copilot";
              return (
                <div key={n.label} className="flex items-start gap-2 md:items-center md:flex-1 md:min-w-[8rem]">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div
                      className={cn(
                        "flex h-16 w-16 items-center justify-center rounded-2xl border shadow-[var(--shadow-soft)]",
                        isHub
                          ? "border-primary/40 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground"
                          : "border-border bg-card text-primary",
                      )}
                    >
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{n.label}</p>
                      <p className="text-xs text-muted-foreground">{n.note}</p>
                    </div>
                  </div>
                  {i < AI_WORKFLOW.length - 1 && (
                    <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted-foreground md:block" />
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            {t("about.aiWorkflowNote")}
          </p>
        </div>
      </Section>

      {/* Technology stack */}
      <Section eyebrow={t("about.techEyebrow")} title={t("about.techTitle")} icon={Cpu}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {STACK.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.groupKey}
                className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold">{s.groupKey}</h3>
                </div>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {s.items.map((it) => (
                    <li
                      key={it}
                      className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-xs text-foreground"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Founder */}
      <Section eyebrow={t("about.founderEyebrow")} title={t("about.founderTitle")} icon={Users}>
        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
          {TEAM.map((m) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]"
            >
              <div
                className={cn(
                  "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-bold text-primary-foreground",
                  m.tone,
                )}
              >
                {m.initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-foreground">{m.name}</p>
                <p className="text-sm text-muted-foreground">{t(m.roleKey)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Contact */}
      <Section eyebrow={t("about.contactEyebrow")} title={t("about.contactTitle")} icon={Mail}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Mail, labelKey: "about.email", value: "hello@telugufloodcopilot.in", href: "mailto:hello@telugufloodcopilot.in" },
            { icon: Phone, labelKey: "about.phone", value: "+91 40 4000 1077", href: "tel:+914040001077" },
            { icon: MapPin, labelKey: "about.office", value: "T-Hub, Hyderabad, Telangana", href: "https://maps.google.com" },
            { icon: Github, labelKey: "about.sourceCode", value: "github.com/VenkataramanaEmmadoju", href: "https://github.com/VenkataramanaEmmadoju/Telugu-Flood-Copilot" },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <a
                key={c.labelKey}
                href={c.href}
                className="group flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] transition-all hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{t(c.labelKey)}</p>
                  <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
                    {c.value}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-12">
      <SectionHeader eyebrow={eyebrow} title={title} />
      <div className="mt-6">{children}</div>
      <div aria-hidden className="sr-only">
        {icon.displayName}
      </div>
    </section>
  );
}
