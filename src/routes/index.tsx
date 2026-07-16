import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Mic,
  MessageSquareText,
  Camera,
  Siren,
  MapPin,
  Megaphone,
  Phone,
  WifiOff,
  ShieldAlert,
  AlertTriangle,
  ArrowRight,
  Waves,
  Clock,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuickActionCard } from "@/components/quick-action-card";
import { EmergencyCard } from "@/components/emergency-card";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const quickActions = [
  {
    icon: Mic,
    title: "Report by Voice",
    description: "Speak in Telugu, English, or Hindi. We'll structure the report for 112.",
    tone: "primary" as const,
  },
  {
    icon: MessageSquareText,
    title: "Report by Text",
    description: "Type a short message. Works fully offline and syncs when back online.",
    tone: "emerald" as const,
  },
  {
    icon: Camera,
    title: "Upload Flood Photo",
    description: "Attach a photo of water levels — auto-tagged with location and time.",
    tone: "amber" as const,
  },
  {
    icon: Siren,
    title: "Generate SOS",
    description: "One-tap distress signal with your location for responders.",
    tone: "red" as const,
  },
];

const emergencyInfo = [
  {
    icon: MapPin,
    title: "Nearest Shelter",
    value: "Zilla Parishad School",
    meta: "Warangal · 2.4 km away · 180 beds free",
    badge: "Open",
    badgeVariant: "success" as const,
    accent: "primary" as const,
    footer: "Last updated 4 min ago",
  },
  {
    icon: Megaphone,
    title: "Current Government Alert",
    value: "Red Alert — Godavari Basin",
    meta: "IMD warns of heavy rainfall for next 24 hours",
    badge: "Critical",
    badgeVariant: "danger" as const,
    accent: "red" as const,
    footer: "Issued by IMD Hyderabad · 06:12 AM",
  },
  {
    icon: Phone,
    title: "Emergency Contacts",
    value: "112 · 1077 · 108",
    meta: "Unified helpline, disaster desk & ambulance",
    badge: "24/7",
    badgeVariant: "info" as const,
    accent: "emerald" as const,
    footer: "Tap footer to dial instantly",
  },
  {
    icon: WifiOff,
    title: "Offline Mode Status",
    value: "Ready · 42 MB cached",
    meta: "Maps, translations & shelter list available offline",
    badge: "Enabled",
    badgeVariant: "success" as const,
    accent: "slate" as const,
    footer: "Last sync: 12 min ago",
  },
  {
    icon: ShieldAlert,
    title: "Flood Safety Tips",
    value: "Move to higher ground",
    meta: "Avoid walking through moving water · Turn off electricity",
    badge: "Guide",
    badgeVariant: "info" as const,
    accent: "amber" as const,
    footer: "8 illustrated cards available offline",
  },
];

const alerts = [
  {
    level: "Red",
    variant: "danger" as const,
    location: "Bhadrachalam, Bhadradri Kothagudem",
    title: "Godavari river breaches 3rd warning level",
    time: "12 min ago",
    body: "Water level at 53.2 ft and rising. Evacuation ordered for low-lying colonies. Move to designated relief camps immediately.",
  },
  {
    level: "Orange",
    variant: "warning" as const,
    location: "Warangal, Hanamkonda",
    title: "Heavy rainfall likely for next 12 hours",
    time: "48 min ago",
    body: "IMD predicts 12–20 cm rainfall. Urban flooding possible in low-lying areas. Avoid non-essential travel.",
  },
  {
    level: "Yellow",
    variant: "info" as const,
    location: "Khammam district",
    title: "Local streams overflowing near Palair",
    time: "2 hr ago",
    body: "Panchayat officials monitoring 4 villages. Livestock relocation underway. Volunteers requested at Palair mandal office.",
  },
];

function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-subtle)" }}
        />
        <div
          className="absolute -top-40 left-1/2 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="mx-auto max-w-7xl px-4 pb-20 pt-14 sm:px-6 sm:pt-20 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="flex justify-center">
              <StatusBadge variant="danger" pulse>
                <AlertTriangle className="h-3 w-3" />
                Red alert active in 2 districts
              </StatusBadge>
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Telugu Flood{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Copilot
              </span>
            </h1>
            <p className="mt-4 text-lg font-medium text-foreground/80 sm:text-xl">
              Offline AI Decision Support for Rural Telangana
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Helping citizens communicate faster with 112 and local responders using voice,
              text, and images — even in low-connectivity environments.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild className="rounded-full shadow-[var(--shadow-elegant)]">
                <Link to="/report">
                  <Siren className="mr-1 h-4 w-4" />
                  Report Emergency
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full">
                <Link to="/shelters">
                  <Navigation className="mr-1 h-4 w-4" />
                  Find Nearby Shelter
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <WifiOff className="h-3.5 w-3.5" /> Works offline
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Waves className="h-3.5 w-3.5" /> IMD-linked alerts
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> One-tap 112 relay
              </span>
            </div>
          </motion.div>

          {/* Quick actions */}
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
              >
                <QuickActionCard {...a} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Info */}
      <section className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader
              eyebrow="Live Overview"
              title="Emergency Information"
              description="Everything you need to make a fast decision — pulled from official sources and cached for offline use."
            />
            <Button variant="ghost" asChild className="rounded-full">
              <Link to="/alerts">
                View all alerts <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {emergencyInfo.map((c) => (
              <EmergencyCard key={c.title} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Flood Alerts */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="IMD & District Control Rooms"
            title="Latest Flood Alerts"
            description="Real-time bulletins from Telangana State Disaster Response Force and India Meteorological Department."
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {alerts.map((a, i) => (
              <motion.article
                key={a.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-all hover:border-primary/30 hover:shadow-[var(--shadow-elegant)]"
              >
                <div className="flex items-center justify-between">
                  <StatusBadge variant={a.variant} pulse={a.variant === "danger"}>
                    {a.level} Alert
                  </StatusBadge>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {a.time}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-snug text-foreground">
                  {a.title}
                </h3>
                <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {a.location}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <Link
                    to="/alerts"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-glow"
                  >
                    Read bulletin <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <a
                    href="tel:112"
                    className="text-xs font-medium text-muted-foreground hover:text-destructive"
                  >
                    Dial 112
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
