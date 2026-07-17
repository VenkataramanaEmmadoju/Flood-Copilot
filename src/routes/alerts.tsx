import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
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
  Loader2,
  RefreshCw,
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
import { api } from "@/lib/api";
import type { Alert, Severity, SourceType } from "@/lib/types";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Flood Alerts — Telugu Flood Copilot" },
      {
        name: "description",
        content:
          "Live flood bulletins from IMD, CWC, and Telangana district control rooms — filtered by district and severity.",
      },
    ],
  }),
  component: AlertsPage,
});

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
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs === 1 ? "" : "s"} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function formatFullTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
}

function sourceIcon(type: SourceType) {
  switch (type) {
    case "IMD": return CloudRain;
    case "CWC": return Waves;
    case "NDRF": return ShieldAlert;
    case "TSDMA": return AlertTriangle;
    default: return Building2;
  }
}

function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState<string>("all");
  const [severity, setSeverity] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await api.alerts();
      if (res.success) {
        setAlerts(res.data.alerts);
        setLastRefreshed(new Date());
      } else {
        setFetchError(res.error.message);
      }
    } catch {
      setFetchError("Could not load alerts. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const districts = useMemo(
    () => Array.from(new Set(alerts.map((a) => a.district))).sort(),
    [alerts],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return alerts
      .filter((a) => district === "all" || a.district === district)
      .filter((a) => severity === "all" || a.severity === severity)
      .filter((a) => {
        if (!q) return true;
        return (
          a.title.toLowerCase().includes(q) ||
          a.district.toLowerCase().includes(q) ||
          a.mandal.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q) ||
          (a.river ?? "").toLowerCase().includes(q)
        );
      })
      .sort(
        (a, b) =>
          SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity) ||
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      );
  }, [query, district, severity, alerts]);

  const counts = useMemo(() => {
    const c: Record<Severity, number> = { critical: 0, high: 0, moderate: 0, advisory: 0 };
    for (const a of alerts) c[a.severity]++;
    return c;
  }, [alerts]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading flood alerts…</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <Megaphone className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium text-foreground">{fetchError}</p>
          <Button onClick={load} variant="outline" className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
            <div key={sev} className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
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
                <SelectItem key={d} value={d}>{d}</SelectItem>
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
                <SelectItem key={s} value={s}>{SEVERITY_META[s].label}</SelectItem>
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
        <div className="flex items-center gap-3">
          <p className="text-xs text-muted-foreground">
            {lastRefreshed ? `Refreshed ${formatRelative(lastRefreshed.toISOString())}` : ""}
          </p>
          <Button variant="ghost" size="sm" onClick={load} className="gap-1.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>
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
          AI summary
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
          {open ? "Hide details" : "Show full bulletin"}
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </Button>
        <a href="tel:1077" className="text-xs font-medium text-muted-foreground hover:text-primary">
          District helpline · 1077
        </a>
      </div>
    </motion.article>
  );
}
