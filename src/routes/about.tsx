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
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Telugu Flood Copilot" },
      {
        name: "description",
        content:
          "Mission, technology, and team behind Telugu Flood Copilot — an offline-first AI decision support system for flood response in rural Telangana.",
      },
      { property: "og:title", content: "About Telugu Flood Copilot" },
      {
        property: "og:description",
        content: "How the offline AI copilot works, the stack it runs on, and the team behind it.",
      },
    ],
  }),
  component: AboutPage,
});

const HOW_IT_WORKS: {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: string;
}[] = [
  {
    step: "01",
    title: "Citizen raises an alert",
    description:
      "A villager taps the app or holds the emergency button. Voice, photo, and location are captured — no typing needed.",
    icon: Mic,
    tone: "bg-primary/10 text-primary",
  },
  {
    step: "02",
    title: "On-device AI understands the situation",
    description:
      "Telugu speech is transcribed offline. A vision model reads the flood photo and classifies severity, water level, and road condition.",
    icon: Brain,
    tone: "bg-info/15 text-info",
  },
  {
    step: "03",
    title: "Copilot drafts the 112 report",
    description:
      "Structured JSON — village, mandal, GPS, number of people trapped, medical needs — is auto-drafted in English for responders and read back in Telugu.",
    icon: Sparkles,
    tone: "bg-warning/15 text-warning-foreground dark:text-warning",
  },
  {
    step: "04",
    title: "Delivered via best available channel",
    description:
      "The report is sent over 4G. If offline, it falls back to SMS or a mesh relay through nearby volunteers.",
    icon: Send,
    tone: "bg-success/15 text-success",
  },
  {
    step: "05",
    title: "Feedback loop closes",
    description:
      "The responder acknowledges receipt. The citizen sees the ETA, shelter directions, and safety instructions in Telugu.",
    icon: ShieldCheck,
    tone: "bg-destructive/10 text-destructive",
  },
];

const STACK: { group: string; icon: LucideIcon; items: string[] }[] = [
  {
    group: "Frontend",
    icon: Smartphone,
    items: ["React 19", "TanStack Start", "Tailwind CSS v4", "Framer Motion", "Vite 7"],
  },
  {
    group: "AI / ML",
    icon: Brain,
    items: ["Whisper (Telugu ASR)", "Gemini vision", "Lovable AI Gateway", "IndicTrans2", "On-device TFLite"],
  },
  {
    group: "Backend",
    icon: Cloud,
    items: ["Cloudflare Workers", "TanStack Server Functions", "Lovable Cloud (Postgres)", "Edge KV cache"],
  },
  {
    group: "Data & Sources",
    icon: Database,
    items: ["IMD nowcast API", "CWC river gauges", "TSDMA bulletins", "OpenStreetMap tiles"],
  },
  {
    group: "Comms fallback",
    icon: Radio,
    items: ["112 SMS gateway", "USSD keypad flow", "Bluetooth mesh relay", "FM broadcast alerts"],
  },
  {
    group: "Accessibility",
    icon: Languages,
    items: ["Telugu-first UI", "Voice-only mode", "High-contrast theme", "Low-bandwidth PWA"],
  },
];

const AI_WORKFLOW: { label: string; icon: LucideIcon; note: string }[] = [
  { label: "Voice", icon: Mic, note: "Telugu speech" },
  { label: "Image", icon: Camera, note: "Flood photo" },
  { label: "AI Copilot", icon: Brain, note: "On-device + Gateway" },
  { label: "Decision", icon: Sparkles, note: "Structured report" },
  { label: "112 / Shelter", icon: ShieldCheck, note: "Responder action" },
];

const TEAM: { name: string; role: string; initials: string; tone: string }[] = [
  {
    name: "Venkataramana Emmadoju",
    role: "Founder & AI Engineer",
    initials: "VE",
    tone: "from-primary to-primary-glow",
  },
];

function AboutPage() {
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
            Public interest project
          </StatusBadge>
          <StatusBadge variant="success">Open source</StatusBadge>
        </div>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          An offline-first AI copilot for flood response in rural Telangana.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
          Telugu Flood Copilot helps citizens reach 112, locate shelters, and understand government
          advisories in Telugu — even when the network is down.
        </p>
      </motion.div>

      {/* Mission */}
      <Section eyebrow="Mission" title="Save minutes. Save lives." icon={Target}>
        <div className="grid gap-4 md:grid-cols-2">
          <p className="text-base leading-relaxed text-foreground">
            When the Godavari or Musi rises, the difference between rescue and tragedy is often a
            single phone call. Our mission is to shrink that call to under 60 seconds — regardless
            of the caller's literacy, language, or signal strength.
          </p>
          <p className="text-base leading-relaxed text-muted-foreground">
            We build for the villager who speaks Telugu, holds an entry-level Android, and lives 40
            km from the nearest disaster response unit. Every design decision starts from there.
          </p>
        </div>
      </Section>

      {/* Problem */}
      <Section eyebrow="Problem" title="Why floods still cost lives" icon={AlertTriangle}>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Language barrier",
              body: "112 dispatch runs in English/Hindi. Panicked Telugu callers lose 3–5 minutes explaining location.",
            },
            {
              title: "Zero connectivity",
              body: "Flood cells knock out towers first. Existing apps assume 4G and go dark exactly when needed most.",
            },
            {
              title: "Fragmented advisories",
              body: "IMD, CWC, TSDMA and district WhatsApp groups issue overlapping bulletins with no single source of truth.",
            },
          ].map((p) => (
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
      <Section eyebrow="How it works" title="From distress signal to responder in five steps" icon={Workflow}>
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
                    Step {s.step}
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
      <Section eyebrow="AI workflow" title="Multimodal inputs → structured action" icon={Brain}>
        <div className="rounded-3xl border border-border bg-gradient-to-br from-secondary/40 to-background p-6 shadow-[var(--shadow-soft)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {AI_WORKFLOW.map((n, i) => {
              const Icon = n.icon;
              const isHub = n.label === "AI Copilot";
              return (
                <div key={n.label} className="flex flex-1 items-center gap-2 min-w-[8rem]">
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
            {/* TODO: replace with animated live diagram once agent graph is wired */}
            Placeholder diagram — a live agent graph will replace this once the on-device model is deployed.
          </p>
        </div>
      </Section>

      {/* Technology stack */}
      <Section eyebrow="Technology" title="Built on open, edge-first infrastructure" icon={Cpu}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {STACK.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.group}
                className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold">{s.group}</h3>
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
      <Section eyebrow="Founder" title="Meet the person behind the copilot" icon={Users}>
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
                <p className="text-sm text-muted-foreground">{m.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Contact */}
      <Section eyebrow="Contact" title="Get in touch" icon={Mail}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Mail, label: "Email", value: "hello@telugufloodcopilot.in", href: "mailto:hello@telugufloodcopilot.in" },
            { icon: Phone, label: "Phone", value: "+91 40 4000 1077", href: "tel:+914040001077" },
            { icon: MapPin, label: "Office", value: "T-Hub, Hyderabad, Telangana", href: "https://maps.google.com" },
            { icon: Github, label: "Source code", value: "github.com/VenkataramanaEmmadoju", href: "https://github.com/VenkataramanaEmmadoju/Telugu-Flood-Copilot" },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <a
                key={c.label}
                href={c.href}
                className="group flex items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] transition-all hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
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
        {/* icon rendered inside section header eyebrow visually; keep for aria */}
        {icon.displayName}
      </div>
    </section>
  );
}
