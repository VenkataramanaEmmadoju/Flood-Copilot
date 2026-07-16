import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Megaphone,
  ChevronDown,
  AlertTriangle,
  Waves,
  CloudRain,
  ShieldAlert,
  Building2,
  Clock,
  Sparkles,
  ListChecks,
  MapPin,
} from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Flood Alerts — Telugu Flood Copilot" },
      {
        name: "description",
        content:
          "Live and mock flood bulletins from IMD, CWC, and Telangana district control rooms — filtered by district and severity.",
      },
    ],
  }),
  component: AlertsPage,
});

type Severity = "critical" | "high" | "moderate" | "advisory";

type Alert = {
  id: string;
  title: string;
  district: string;
  mandal: string;
  severity: Severity;
  source: string;
  sourceType: "IMD" | "CWC" | "District" | "NDRF" | "TSDMA";
  publishedAt: string; // ISO
  aiSummary: string;
  instructions: string[];
  details: string;
  river?: string;
};

const ALERTS: Alert[] = [
  {
    id: "AL-2026-0714-01",
    title: "Godavari river crosses second warning level near Bhadrachalam",
    district: "Bhadradri Kothagudem",
    mandal: "Bhadrachalam",
    severity: "critical",
    source: "Central Water Commission (CWC)",
    sourceType: "CWC",
    publishedAt: "2026-07-16T05:20:00+05:30",
    aiSummary:
      "Godavari at Bhadrachalam is at 51.2 ft, above the second warning mark (50 ft). Upstream inflows from Sabari and Pranahita continue to rise. Low-lying colonies in Bhadrachalam, Burgampadu, and Aswapuram face inundation within 6–10 hours.",
    instructions: [
      "Move immediately to designated relief camps or higher ground.",
      "Do not attempt to cross submerged roads or bridges.",
      "Keep phones charged and stay tuned to 1077 district helpline.",
      "Livestock owners should shift cattle to raised shelters.",
    ],
    details:
      "As per CWC bulletin issued at 05:20 IST, discharge at Perur upstream station reached 12.4 lakh cusecs. Godavari is expected to cross the third warning mark (53 ft) by evening if inflows sustain. NDRF teams have been deployed at Bhadrachalam, Dummugudem, and Cherla. All schools within 5 km of the river will remain closed.",
    river: "Godavari",
  },
  {
    id: "AL-2026-0714-02",
    title: "Very heavy rainfall warning for northern Telangana districts",
    district: "Adilabad",
    mandal: "Adilabad Urban",
    severity: "high",
    source: "India Meteorological Department (IMD) Hyderabad",
    sourceType: "IMD",
    publishedAt: "2026-07-16T04:00:00+05:30",
    aiSummary:
      "Adilabad, Kumurambheem Asifabad, Mancherial, and Nirmal likely to receive 115–204 mm rainfall in the next 24 hours. Localised flash floods and waterlogging expected in low-lying areas.",
    instructions: [
      "Avoid non-essential travel during nights and early morning.",
      "Farmers should not enter fields near streams and check dams.",
      "Fishermen along Kaddam and Sathnala reservoirs must stay off water.",
    ],
    details:
      "Nowcast indicates active monsoon trough with moisture feed from Bay of Bengal. Red colour warning is in effect till 08:30 IST tomorrow. Wind gusts of 40–50 kmph expected with intense spells of rain.",
    river: "Penganga",
  },
  {
    id: "AL-2026-0714-03",
    title: "Musi reservoir gates opened — downstream advisory",
    district: "Nalgonda",
    mandal: "Chityal",
    severity: "high",
    source: "Telangana State Disaster Management Authority (TSDMA)",
    sourceType: "TSDMA",
    publishedAt: "2026-07-16T03:15:00+05:30",
    aiSummary:
      "Six gates of Musi project lifted to 8 ft, releasing 42,000 cusecs. Villages along Musi in Chityal, Ramannapet, and Choutuppal mandals will see rising water in 4–6 hours.",
    instructions: [
      "Villagers within 500 m of Musi bank must evacuate to relief camps.",
      "Fisherfolk should not venture near the river until further notice.",
      "Panchayat secretaries to sound sirens every 30 minutes.",
    ],
    details:
      "Inflow to Musi has crossed 55,000 cusecs due to heavy rains in the catchment. Discharge will be regulated based on downstream conditions. Control room contact: 08682-232345.",
    river: "Musi",
  },
  {
    id: "AL-2026-0714-04",
    title: "Localised urban flooding warning for Hyderabad",
    district: "Hyderabad",
    mandal: "Hyderabad Central",
    severity: "moderate",
    source: "GHMC Enforcement Vigilance and Disaster Management (EVDM)",
    sourceType: "District",
    publishedAt: "2026-07-15T22:45:00+05:30",
    aiSummary:
      "Heavy showers expected in LB Nagar, Malakpet, Kukatpally, and Serilingampally zones between 06:00 and 12:00 IST. Waterlogging likely at 14 known hotspots.",
    instructions: [
      "Avoid Nagole–Uppal stretch and Balanagar underpass during peak rain.",
      "Two-wheeler riders should not enter waterlogged stretches.",
      "Report open manholes via GHMC 040-21111111.",
    ],
    details:
      "EVDM teams have been positioned at 62 hotspots with dewatering pumps. Metro Rail services remain normal. Citizens can track live updates on the GHMC Hyderabad app.",
  },
  {
    id: "AL-2026-0714-05",
    title: "Krishna river inflows rising at Srisailam",
    district: "Nagarkurnool",
    mandal: "Kollapur",
    severity: "moderate",
    source: "CWC Krishna Basin",
    sourceType: "CWC",
    publishedAt: "2026-07-15T20:10:00+05:30",
    aiSummary:
      "Srisailam reservoir inflows at 2.1 lakh cusecs. Water level at 878 ft against FRL 885 ft. No immediate downstream threat, but riverside villages should stay alert.",
    instructions: [
      "Boating and river crossings suspended in Kollapur and Amrabad.",
      "Tourists advised to avoid ghat road viewpoints.",
    ],
    details:
      "Upstream discharges from Almatti and Narayanpur are being monitored. Next bulletin at 08:00 IST.",
    river: "Krishna",
  },
  {
    id: "AL-2026-0714-06",
    title: "Flash flood advisory for Warangal rural streams",
    district: "Warangal",
    mandal: "Geesukonda",
    severity: "advisory",
    source: "IMD Nowcast",
    sourceType: "IMD",
    publishedAt: "2026-07-15T18:30:00+05:30",
    aiSummary:
      "Isolated thunderstorms with 50–70 mm rainfall likely in Geesukonda, Sangem, and Nekkonda mandals over next 3 hours. Small streams and vaagus may swell briefly.",
    instructions: [
      "Do not cross flowing streams on foot or by two-wheeler.",
      "Move parked vehicles away from stream beds and low bridges.",
    ],
    details:
      "Advisory issued based on Doppler radar returns from Shamshabad. Situation will be reassessed by 22:00 IST.",
  },
  {
    id: "AL-2026-0714-07",
    title: "NDRF pre-positioning in Mulugu and Bhupalpally",
    district: "Mulugu",
    mandal: "Eturnagaram",
    severity: "advisory",
    source: "NDRF 10th Battalion, Vijayawada",
    sourceType: "NDRF",
    publishedAt: "2026-07-15T16:00:00+05:30",
    aiSummary:
      "Two NDRF teams with inflatable boats and rescue gear stationed at Eturnagaram and Venkatapur as a precaution against Godavari tributary surges.",
    instructions: [
      "Village volunteers to coordinate with NDRF liaison officer.",
      "Keep list of vulnerable persons (elderly, PwD, pregnant women) ready.",
    ],
    details:
      "Teams equipped with satellite phones and medical kits. District Collector's office will coordinate any deployment requests.",
  },
];

const SEVERITY_META: Record<
  Severity,
  { label: string; badge: "danger" | "warning" | "info" | "muted"; ring: string; dot: string }
> = {
  critical: {
    label: "Critical",
    badge: "danger",
    ring: "ring-destructive/30 border-l-destructive",
    dot: "bg-destructive",
  },
  high: {
    label: "High",
    badge: "warning",
    ring: "ring-warning/30 border-l-warning",
    dot: "bg-warning",
  },
  moderate: {
    label: "Moderate",
    badge: "info",
    ring: "ring-info/30 border-l-info",
    dot: "bg-info",
  },
  advisory: {
    label: "Advisory",
    badge: "muted",
    ring: "ring-border border-l-muted-foreground/40",
    dot: "bg-muted-foreground",
  },
};

const SEVERITY_ORDER: Severity[] = ["critical", "high", "moderate", "advisory"];

function formatRelative(iso: string) {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function formatFullTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
}

function AlertsPage() {
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState<string>("all");
  const [severity, setSeverity] = useState<string>("all");

  const districts = useMemo(
    () => Array.from(new Set(ALERTS.map((a) => a.district))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALERTS.filter((a) => {
      if (district !== "all" && a.district !== district) return false;
      if (severity !== "all" && a.severity !== severity) return false;
      if (!q) return true;
      return (
        a.title.toLowerCase().includes(q) ||
        a.district.toLowerCase().includes(q) ||
        a.mandal.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q) ||
        (a.river ?? "").toLowerCase().includes(q)
      );
    }).sort(
      (a, b) =>
        SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity) ||
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }, [query, district, severity]);

  const counts = useMemo(() => {
    const c: Record<Severity, number> = { critical: 0, high: 0, moderate: 0, advisory: 0 };
    for (const a of ALERTS) c[a.severity]++;
    return c;
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Live bulletins"
        title="Flood Alerts"
        description="Consolidated warnings from IMD, CWC, TSDMA, NDRF and district control rooms across Telangana. Sorted by severity."
      />

      {/* Severity summary */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {SEVERITY_ORDER.map((sev) => {
          const meta = SEVERITY_META[sev];
          return (
            <div
              key={sev}
              className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", meta.dot)} />
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {meta.label}
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight">{counts[sev]}</p>
              <p className="text-xs text-muted-foreground">active bulletins</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, district, mandal, river or source…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select value={district} onValueChange={setDistrict}>
            <SelectTrigger className="w-full min-w-[10rem] md:w-48">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All districts</SelectItem>
              {districts.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="w-full min-w-[10rem] md:w-44">
              <AlertTriangle className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All severities</SelectItem>
              {SEVERITY_ORDER.map((s) => (
                <SelectItem key={s} value={s}>
                  {SEVERITY_META[s].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Alert list */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">
          {filtered.length} bulletin{filtered.length === 1 ? "" : "s"}
        </h2>
        <p className="text-xs text-muted-foreground">Last refreshed just now · Mock data</p>
      </div>

      <div className="mt-4 space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <Megaphone className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No bulletins match your filters. Try clearing the district or severity.
            </p>
          </div>
        ) : (
          filtered.map((alert, idx) => <AlertCard key={alert.id} alert={alert} index={idx} />)
        )}
      </div>
    </div>
  );
}

function sourceIcon(type: Alert["sourceType"]) {
  switch (type) {
    case "IMD":
      return CloudRain;
    case "CWC":
      return Waves;
    case "NDRF":
      return ShieldAlert;
    case "TSDMA":
      return AlertTriangle;
    default:
      return Building2;
  }
}

function AlertCard({ alert, index }: { alert: Alert; index: number }) {
  const [open, setOpen] = useState(false);
  const meta = SEVERITY_META[alert.severity];
  const SourceIcon = sourceIcon(alert.sourceType);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.2) }}
      className={cn(
        "rounded-2xl border border-l-4 border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:shadow-[var(--shadow-elegant)]",
        meta.ring,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge variant={meta.badge} pulse={alert.severity === "critical"}>
              {meta.label}
            </StatusBadge>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {alert.mandal}, {alert.district}
            </span>
            {alert.river && (
              <span className="inline-flex items-center gap-1 rounded-full bg-info/10 px-2.5 py-1 text-xs text-info">
                <Waves className="h-3 w-3" />
                {alert.river}
              </span>
            )}
          </div>
          <h3 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-foreground">
            {alert.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <SourceIcon className="h-3.5 w-3.5" />
              {alert.source}
            </span>
            <span className="inline-flex items-center gap-1.5" title={formatFullTime(alert.publishedAt)}>
              <Clock className="h-3.5 w-3.5" />
              {formatRelative(alert.publishedAt)} · {formatFullTime(alert.publishedAt)} IST
            </span>
          </div>
        </div>
      </div>

      {/* AI summary */}
      <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          AI summary (Telugu translation coming soon)
        </div>
        <p className="mt-2 text-sm leading-relaxed text-foreground">{alert.aiSummary}</p>
      </div>

      {/* Safety instructions */}
      <div className="mt-4">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <ListChecks className="h-3.5 w-3.5" />
          Safety instructions
        </div>
        <ul className="mt-2 space-y-1.5">
          {alert.instructions.map((ins) => (
            <li key={ins} className="flex items-start gap-2 text-sm text-foreground">
              <span className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", meta.dot)} />
              <span>{ins}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Expandable */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-xl border border-border bg-secondary/40 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Full bulletin
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">{alert.details}</p>
              <p className="mt-3 text-xs text-muted-foreground">Bulletin ID: {alert.id}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen((v) => !v)}
          className="gap-1.5 text-primary hover:text-primary"
        >
          {open ? "Hide details" : "Expandable details"}
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </Button>
        <a
          href="tel:1077"
          className="text-xs font-medium text-muted-foreground hover:text-primary"
        >
          District helpline · 1077
        </a>
      </div>
    </motion.article>
  );
}
