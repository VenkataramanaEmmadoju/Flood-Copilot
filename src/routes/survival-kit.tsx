import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Phone,
  LifeBuoy,
  Radio,
  Shield,
  HeartPulse,
  Droplets,
  Backpack,
  FileDown,
  WifiOff,
  CheckCircle2,
  CircleDot,
  BookOpen,
  Flame,
  Bandage,
  Zap,
  AlertTriangle,
  Waves,
  Users,
  Database,
  MapPinned,
  Languages,
  ShieldAlert,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/survival-kit")({
  head: () => ({
    meta: [
      { title: "Offline Survival Kit — Telugu Flood Copilot" },
      {
        name: "description",
        content:
          "Emergency contacts, first aid, flood safety checklists, go-bag list and downloaded advisories that work without any network.",
      },
    ],
  }),
  component: SurvivalKitPage,
});

// ---------- Data ----------

const EMERGENCY_CONTACTS: {
  label: string;
  number: string;
  hint: string;
  icon: LucideIcon;
  tone: "primary" | "red" | "amber" | "emerald" | "info";
}[] = [
  { label: "All-in-one Emergency", number: "112", hint: "Police · Fire · Ambulance", icon: Phone, tone: "red" },
  { label: "Disaster Helpline", number: "1077", hint: "District control room", icon: LifeBuoy, tone: "amber" },
  { label: "Ambulance", number: "108", hint: "Free 24×7 service", icon: HeartPulse, tone: "emerald" },
  { label: "Police", number: "100", hint: "Non-emergency law & order", icon: Shield, tone: "primary" },
  { label: "Fire & Rescue", number: "101", hint: "Fire, gas leaks, rescue", icon: Flame, tone: "red" },
  { label: "NDRF Control Room", number: "011-24363260", hint: "National Disaster Response Force", icon: ShieldAlert, tone: "info" },
  { label: "Women Helpline", number: "181", hint: "Women in distress", icon: Users, tone: "primary" },
  { label: "Child Helpline", number: "1098", hint: "Children in need of care", icon: Users, tone: "emerald" },
];

const TONE_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  primary: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/30" },
  red: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30" },
  amber: { bg: "bg-warning/15", text: "text-warning-foreground dark:text-warning", border: "border-warning/40" },
  emerald: { bg: "bg-success/15", text: "text-success", border: "border-success/30" },
  info: { bg: "bg-info/15", text: "text-info", border: "border-info/30" },
};

const FIRST_AID: {
  title: string;
  icon: LucideIcon;
  tone: keyof typeof TONE_STYLES;
  steps: string[];
}[] = [
  {
    title: "Drowning / near-drowning",
    icon: Waves,
    tone: "info",
    steps: [
      "Move the person to a safe, dry surface. Do not risk a rescue you cannot make.",
      "Check breathing. If absent, begin CPR — 30 chest compressions, 2 rescue breaths.",
      "Turn the person on their side once they breathe to let water drain.",
      "Keep them warm and call 108 immediately.",
    ],
  },
  {
    title: "Bleeding wounds",
    icon: Bandage,
    tone: "red",
    steps: [
      "Wash hands or use clean cloth to avoid infection.",
      "Apply firm pressure with a clean cloth for at least 10 minutes.",
      "Raise the injured limb above the heart if possible.",
      "Do not remove embedded objects — pad around them and seek help.",
    ],
  },
  {
    title: "Electric shock",
    icon: Zap,
    tone: "amber",
    steps: [
      "Do NOT touch the person until power is switched off.",
      "Use a dry wooden stick to move live wires away.",
      "Check breathing and pulse. Start CPR if needed.",
      "Cover burns with a clean, dry cloth and call 108.",
    ],
  },
  {
    title: "Snake bite (common in floodwaters)",
    icon: AlertTriangle,
    tone: "emerald",
    steps: [
      "Keep the person calm and still — movement spreads venom.",
      "Immobilise the bitten limb below heart level.",
      "Remove rings, watches, tight clothing near the bite.",
      "Do NOT cut, suck or apply tourniquet. Rush to the nearest PHC.",
    ],
  },
];

const FLOOD_SAFETY: { do: string[]; dont: string[] } = {
  do: [
    "Move to the highest floor or designated shelter as soon as sirens sound.",
    "Switch off electricity and gas at the main before leaving.",
    "Drink only boiled or chlorine-tablet treated water.",
    "Keep children, elderly and PwD members with a designated adult at all times.",
    "Tie important documents in a waterproof cover around your waist.",
  ],
  dont: [
    "Do not walk or drive through moving water — 15 cm can knock you down.",
    "Do not touch electrical switches with wet hands or standing in water.",
    "Do not eat food that has been in contact with floodwater.",
    "Do not return home until authorities declare it safe.",
    "Do not spread unverified messages on WhatsApp — check 1077 first.",
  ],
};

const GO_BAG: { category: string; icon: LucideIcon; items: string[] }[] = [
  {
    category: "Documents",
    icon: BookOpen,
    items: [
      "Aadhaar, ration card, voter ID (photocopies in waterproof pouch)",
      "Insurance and land records",
      "List of family emergency contacts",
    ],
  },
  {
    category: "Water & food (3 days)",
    icon: Droplets,
    items: [
      "4 litres of drinking water per person per day",
      "Ready-to-eat food: biscuits, murukku, jaggery, dry poha",
      "Chlorine tablets or filter cloth",
    ],
  },
  {
    category: "Health",
    icon: HeartPulse,
    items: [
      "Personal medicines for 7 days",
      "First aid box, ORS sachets, paracetamol",
      "Sanitary pads, soap, hand sanitiser",
    ],
  },
  {
    category: "Tools & light",
    icon: Backpack,
    items: [
      "Torch with spare batteries",
      "Whistle, matchbox in waterproof cover",
      "Multi-tool or sturdy knife, 5 m of rope",
    ],
  },
  {
    category: "Communication",
    icon: Radio,
    items: [
      "Fully charged phone + 10,000 mAh power bank",
      "Battery-powered FM radio (tunes to All India Radio 101.9 MHz)",
      "Cash in small denominations (₹2,000 minimum)",
    ],
  },
  {
    category: "For children & elders",
    icon: Users,
    items: [
      "Baby food, diapers, comfort toy",
      "Spectacles, hearing aid batteries",
      "Blanket, warm clothing, spare footwear",
    ],
  },
];

const DOWNLOADED_ADVISORIES: {
  title: string;
  source: string;
  size: string;
  updated: string;
  status: "ready" | "updating";
}[] = [
  { title: "Godavari basin evacuation routes (Bhadradri Kothagudem)", source: "TSDMA · PDF", size: "3.4 MB", updated: "2 hrs ago", status: "ready" },
  { title: "IMD 5-day rainfall outlook — Telangana", source: "IMD Hyderabad · PDF", size: "1.1 MB", updated: "6 hrs ago", status: "ready" },
  { title: "Do's and Don'ts during floods (Telugu)", source: "NDMA · Booklet", size: "5.8 MB", updated: "yesterday", status: "ready" },
  { title: "Musi reservoir gate operation notice", source: "TSDMA · Circular", size: "420 KB", updated: "just now", status: "updating" },
  { title: "First responder handbook (English + Telugu)", source: "NDRF · PDF", size: "8.2 MB", updated: "3 days ago", status: "ready" },
];

const OFFLINE_STATUS: {
  label: string;
  icon: LucideIcon;
  state: "ready" | "partial" | "pending";
  detail: string;
}[] = [
  { label: "Offline maps (Telangana)", icon: MapPinned, state: "ready", detail: "324 MB · 33 districts cached" },
  { label: "Telugu language pack", icon: Languages, state: "ready", detail: "Voice + text translation available offline" },
  { label: "AI decision model", icon: Database, state: "partial", detail: "Core model ready · Vision pack downloading (68%)" },
  { label: "Emergency SMS gateway", icon: Radio, state: "ready", detail: "SMS fallback to 112 configured" },
  { label: "Shelter directory", icon: Shield, state: "ready", detail: "1,842 shelters synced" },
  { label: "Weather nowcast cache", icon: Clock, state: "pending", detail: "Last synced 14 hrs ago · reconnect to refresh" },
];

// ---------- Page ----------

function SurvivalKitPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge variant="success" pulse>
            <WifiOff className="h-3 w-3" />
            Works offline
          </StatusBadge>
          <StatusBadge variant="info">Last synced 12 min ago</StatusBadge>
        </div>
        <SectionHeader
          eyebrow="Survival kit"
          title="Everything you need when the network is down"
          description="Emergency numbers, first aid, checklists and government advisories — cached on your device and available in Telugu."
          className="!gap-3"
        />
      </div>

      {/* Emergency contacts */}
      <Section title="Emergency contacts" description="Tap any number to dial directly." icon={Phone}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {EMERGENCY_CONTACTS.map((c, i) => {
            const t = TONE_STYLES[c.tone];
            const Icon = c.icon;
            return (
              <motion.a
                key={c.label}
                href={`tel:${c.number.replace(/[^\d+]/g, "")}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.2) }}
                className={cn(
                  "group flex flex-col rounded-2xl border bg-card p-4 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]",
                  t.border,
                )}
              >
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", t.bg, t.text)}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{c.label}</p>
                <p className="text-2xl font-bold tracking-tight text-foreground">{c.number}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.hint}</p>
              </motion.a>
            );
          })}
        </div>
      </Section>

      {/* First aid */}
      <Section
        title="First aid guide"
        description="Quick, illustrated steps for the most common flood-related emergencies."
        icon={HeartPulse}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {FIRST_AID.map((g) => {
            const t = TONE_STYLES[g.tone];
            const Icon = g.icon;
            return (
              <div
                key={g.title}
                className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", t.bg, t.text)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight">{g.title}</h3>
                </div>
                <ol className="mt-4 space-y-2">
                  {g.steps.map((s, i) => (
                    <li key={s} className="flex gap-3 text-sm text-foreground">
                      <span
                        className={cn(
                          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                          t.bg,
                          t.text,
                        )}
                      >
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Flood safety checklist */}
      <Section
        title="Flood safety checklist"
        description="What to do and what to avoid when floodwaters begin rising."
        icon={ShieldAlert}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-success/30 bg-success/5 p-5">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle2 className="h-5 w-5" />
              <h3 className="text-base font-semibold">Do</h3>
            </div>
            <ul className="mt-3 space-y-2">
              {FLOOD_SAFETY.do.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-base font-semibold">Don't</h3>
            </div>
            <ul className="mt-3 space-y-2">
              {FLOOD_SAFETY.dont.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-foreground">
                  <CircleDot className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Emergency bag */}
      <Section
        title="Emergency bag checklist"
        description="Pack these items in a waterproof bag — one per household."
        icon={Backpack}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {GO_BAG.map((g) => {
            const Icon = g.icon;
            return (
              <div
                key={g.category}
                className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight">{g.category}</h3>
                </div>
                <ul className="mt-4 space-y-2">
                  {g.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm text-foreground">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 shrink-0 rounded border-border accent-primary"
                        aria-label={it}
                      />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Downloaded advisories */}
      <Section
        title="Downloaded advisories"
        description="Government bulletins already on your device — readable without any network."
        icon={FileDown}
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <ul className="divide-y divide-border">
            {DOWNLOADED_ADVISORIES.map((a) => (
              <li key={a.title} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-info/10 text-info">
                    <FileDown className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{a.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {a.source} · {a.size} · updated {a.updated}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:justify-end">
                  {a.status === "ready" ? (
                    <StatusBadge variant="success">
                      <CheckCircle2 className="h-3 w-3" />
                      Ready offline
                    </StatusBadge>
                  ) : (
                    <StatusBadge variant="warning" pulse>
                      Updating
                    </StatusBadge>
                  )}
                  <button
                    type="button"
                    className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    Open
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Offline resource status */}
      <Section
        title="Offline resource status"
        description="What's cached on this device right now."
        icon={WifiOff}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {OFFLINE_STATUS.map((r) => {
            const Icon = r.icon;
            const map = {
              ready: { badge: "success" as const, label: "Ready" },
              partial: { badge: "warning" as const, label: "In progress" },
              pending: { badge: "muted" as const, label: "Needs sync" },
            }[r.state];
            return (
              <div
                key={r.label}
                className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{r.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{r.detail}</p>
                  </div>
                </div>
                <StatusBadge variant={map.badge} pulse={r.state === "partial"}>
                  {map.label}
                </StatusBadge>
              </div>
            );
          })}
        </div>
      </Section>

      <p className="mt-10 text-center text-xs text-muted-foreground">
        Tip: bookmark this page. In an emergency, always dial{" "}
        <span className="font-semibold text-foreground">112</span>.
      </p>
    </div>
  );
}

function Section({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h2>
          <p className="text-xs text-muted-foreground sm:text-sm">{description}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
