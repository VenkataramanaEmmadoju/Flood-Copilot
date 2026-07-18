import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  MapPin,
  Search,
  Navigation,
  Phone,
  Users,
  Home,
  Compass,
  Layers,
  Plus,
  Minus,
  Crosshair,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { api } from "@/lib/api";
import type { Shelter } from "@/lib/types";

export const Route = createFileRoute("/shelters")({
  head: () => ({
    meta: [
      { title: "Shelter Finder — Flood Copilot" },
      {
        name: "description",
        content:
          "Find the nearest relief camps, schools, and community halls in rural Telangana with real-time capacity and directions.",
      },
      { property: "og:title", content: "Shelter Finder — Flood Copilot" },
      {
        property: "og:description",
        content:
          "Locate nearby flood shelters across Telangana districts with capacity, distance, and one-tap call.",
      },
    ],
  }),
  component: SheltersPage,
});

function statusBadge(status: Shelter["status"]) {
  if (status === "open") return { label: "Open", variant: "success" as const };
  if (status === "filling") return { label: "Filling Up", variant: "warning" as const };
  return { label: "Full", variant: "danger" as const };
}

function SheltersPage() {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [query, setQuery] = useState("");
  const [district, setDistrict] = useState<string>("all");
  const [village, setVillage] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string>("");

  const load = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await api.shelters();
      if (res.success) {
        setShelters(res.data.shelters);
        if (res.data.shelters.length > 0) setSelectedId(res.data.shelters[0].id);
      } else {
        setFetchError(res.error.message);
      }
    } catch {
      setFetchError("Could not load shelters. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const districts = useMemo(
    () => Array.from(new Set(shelters.map((s) => s.district))).sort(),
    [shelters],
  );
  const villages = useMemo(() => {
    const pool = district === "all" ? shelters : shelters.filter((s) => s.district === district);
    return Array.from(new Set(pool.map((s) => s.village))).sort();
  }, [district, shelters]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return shelters
      .filter((s) => district === "all" || s.district === district)
      .filter((s) => village === "all" || s.village === village)
      .filter(
        (s) =>
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.village.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q) ||
          s.type.toLowerCase().includes(q),
      )
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [query, district, village, shelters]);

  const summary = useMemo(() => {
    const available = filtered.filter((s) => s.status !== "full");
    const totalCap = filtered.reduce((sum, s) => sum + s.capacity, 0);
    const totalOccupied = filtered.reduce((sum, s) => sum + s.occupied, 0);
    return {
      availableCount: available.length,
      totalCap,
      totalOccupied,
      utilization: totalCap ? Math.round((totalOccupied / totalCap) * 100) : 0,
      nearest: filtered[0],
    };
  }, [filtered]);

  const selected = filtered.find((s) => s.id === selectedId) ?? filtered[0];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading shelters…</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
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
    <div className="relative overflow-x-hidden">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-subtle)" }} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <SectionHeader
          eyebrow="Nearby Relief"
          title="Shelter Finder"
          description="Offline-first directory of relief camps, schools, and community halls across rural Telangana."
        />

        {/* Summary cards */}
        <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={Home}
            label="Available Shelters"
            value={`${summary.availableCount}`}
            hint={`${filtered.length} total in view`}
            tone="emerald"
          />
          <SummaryCard
            icon={Users}
            label="Current Capacity"
            value={`${summary.totalOccupied.toLocaleString()} / ${summary.totalCap.toLocaleString()}`}
            hint={`${summary.utilization}% occupied`}
            tone="primary"
            progress={summary.utilization}
          />
          <SummaryCard
            icon={Compass}
            label="Nearest Shelter"
            value={summary.nearest?.name ?? "—"}
            hint={
              summary.nearest
                ? `${summary.nearest.village} · ${summary.nearest.distanceKm} km`
                : "No shelters match your filters"
            }
            tone="amber"
          />
        </div>

        {/* Filters */}
        <div className="mt-4 grid gap-3 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-soft)] sm:mt-6 sm:p-4 sm:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by shelter, village, or district"
              className="pl-9"
            />
          </div>
          <Select
            value={district}
            onValueChange={(v) => { setDistrict(v); setVillage("all"); }}
          >
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="All districts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All districts</SelectItem>
              {districts.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={village} onValueChange={setVillage}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="All villages" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All villages</SelectItem>
              {villages.map((v) => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Map + list — single column on every viewport */}
        <div className="mt-4 sm:mt-6">
          <MapPlaceholder
            shelters={filtered}
            selectedId={selected?.id}
            onSelect={setSelectedId}
          />

          <div className="mt-4 sm:mt-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-lg font-semibold text-foreground">Nearest Shelters</h2>
              <span className="text-xs text-muted-foreground">
                {filtered.length} result{filtered.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {filtered.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center sm:p-8">
                  <MapPin className="mx-auto h-6 w-6 text-muted-foreground" />
                  <p className="mt-2 text-sm font-medium text-foreground">
                    No shelters match your filters
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Try clearing the search or picking a different district.
                  </p>
                </div>
              )}
              {filtered.map((s, i) => (
                <ShelterCard
                  key={s.id}
                  shelter={s}
                  index={i}
                  isSelected={selected?.id === s.id}
                  onSelect={() => setSelectedId(s.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
  progress,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
  tone: "primary" | "emerald" | "amber";
  progress?: number;
}) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      : tone === "amber"
        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
        : "bg-primary/10 text-primary";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 truncate text-lg font-semibold text-foreground sm:text-xl">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <span className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {typeof progress === "number" && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary sm:mt-4">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-all"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      )}
    </motion.div>
  );
}

function MapPlaceholder({
  shelters,
  selectedId,
  onSelect,
}: {
  shelters: Shelter[];
  selectedId?: string;
  onSelect: (id: string) => void;
}) {
  const pins = shelters.slice(0, 9).map((s, i) => ({
    shelter: s,
    left: 12 + ((i * 73) % 76),
    top: 15 + ((i * 41) % 68),
  }));

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
      <div
        aria-hidden
        className="relative h-[260px] w-full sm:h-[420px] lg:h-[560px]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, oklch(0.85 0.09 200 / 0.35), transparent 45%)," +
            "radial-gradient(circle at 80% 70%, oklch(0.88 0.12 150 / 0.35), transparent 45%)," +
            "linear-gradient(180deg, oklch(0.97 0.02 220), oklch(0.94 0.03 200))",
        }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, oklch(0.7 0.02 220 / 0.25) 1px, transparent 1px)," +
              "linear-gradient(to bottom, oklch(0.7 0.02 220 / 0.25) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 400" preserveAspectRatio="none">
          <path d="M -20 260 Q 80 200, 160 240 T 340 200 T 460 220" fill="none" stroke="oklch(0.7 0.11 230)" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
          <path d="M 60 -20 Q 100 120, 180 180 T 260 340 T 300 460" fill="none" stroke="oklch(0.72 0.1 230)" strokeWidth="4" strokeLinecap="round" opacity="0.45" />
        </svg>

        {pins.map(({ shelter, left, top }) => {
          const active = shelter.id === selectedId;
          const color =
            shelter.status === "full"
              ? "bg-destructive text-destructive-foreground"
              : shelter.status === "filling"
                ? "bg-amber-500 text-white"
                : "bg-emerald-500 text-white";
          return (
            <button
              key={shelter.id}
              type="button"
              onClick={() => onSelect(shelter.id)}
              className="group absolute -translate-x-1/2 -translate-y-full"
              style={{ left: `${left}%`, top: `${top}%` }}
              aria-label={`${shelter.name}, ${shelter.village}`}
            >
              <span className={`relative flex h-9 w-9 items-center justify-center rounded-full shadow-lg ring-2 ring-white transition-transform ${color} ${active ? "scale-125" : "group-hover:scale-110"}`}>
                <MapPin className="h-4 w-4" />
                {active && <span className="absolute -inset-1 animate-ping rounded-full bg-current opacity-30" />}
              </span>
            </button>
          );
        })}

        {selectedId && (
          <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-border bg-card/95 p-3 shadow-[var(--shadow-elegant)] backdrop-blur sm:right-auto sm:max-w-xs">
            {(() => {
              const sel = shelters.find((s) => s.id === selectedId);
              if (!sel) return null;
              const badge = statusBadge(sel.status);
              return (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">{sel.name}</p>
                    <StatusBadge variant={badge.variant}>{badge.label}</StatusBadge>
                  </div>
                  <p className="mt-1 flex min-w-0 items-center gap-1 overflow-hidden text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{sel.village}, {sel.district}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {sel.distanceKm} km away · {Math.max(0, sel.capacity - sel.occupied)} beds free
                  </p>
                </>
              );
            })()}
          </div>
        )}

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <MapChromeButton icon={Plus} label="Zoom in" />
          <MapChromeButton icon={Minus} label="Zoom out" />
          <MapChromeButton icon={Crosshair} label="Recenter" />
          <MapChromeButton icon={Layers} label="Layers" />
        </div>

        <div className="absolute left-3 top-3 rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Offline map preview
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-border bg-card/60 px-4 py-3 text-xs text-muted-foreground">
        <LegendDot color="bg-emerald-500" label="Open" />
        <LegendDot color="bg-amber-500" label="Filling up" />
        <LegendDot color="bg-destructive" label="Full" />
        <span className="ml-auto hidden sm:inline">Tap a pin to view details</span>
      </div>
    </div>
  );
}

function MapChromeButton({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <button type="button" aria-label={label} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/95 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-secondary">
      <Icon className="h-4 w-4" />
    </button>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}

function ShelterCard({
  shelter,
  index,
  isSelected,
  onSelect,
}: {
  shelter: Shelter;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const badge = statusBadge(shelter.status);
  const free = Math.max(0, shelter.capacity - shelter.occupied);
  const utilization = Math.round((shelter.occupied / shelter.capacity) * 100);

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      onClick={onSelect}
      className={`group cursor-pointer overflow-hidden rounded-2xl border bg-card p-4 shadow-[var(--shadow-soft)] transition-all hover:border-primary/40 hover:shadow-[var(--shadow-elegant)] sm:p-5 ${
        isSelected ? "border-primary/60 ring-2 ring-primary/20" : "border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-foreground">{shelter.name}</h3>
          <p className="mt-1 flex min-w-0 items-center gap-1 overflow-hidden text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{shelter.village}, {shelter.district}</span>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">{shelter.type}</p>
        </div>
        <StatusBadge variant={badge.variant} className="shrink-0 whitespace-nowrap">{badge.label}</StatusBadge>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-sm sm:mt-4 sm:gap-3">
        <Stat icon={Navigation} label="Distance" value={`${shelter.distanceKm} km`} />
        <Stat icon={Users} label="Capacity" value={`${free} / ${shelter.capacity}`} sub="beds free" />
        <Stat icon={Phone} label="Contact" value={shelter.phone} mono />
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary sm:mt-4">
        <div
          className={`h-full rounded-full transition-all ${
            shelter.status === "full" ? "bg-destructive" : shelter.status === "filling" ? "bg-amber-500" : "bg-emerald-500"
          }`}
          style={{ width: `${Math.min(100, utilization)}%` }}
        />
      </div>

      <div className="mt-3 flex gap-2 sm:mt-4">
        <Button asChild variant="outline" className="flex-1 rounded-full" onClick={(e) => e.stopPropagation()}>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
              `${shelter.name}, ${shelter.village}, ${shelter.district}, Telangana`,
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            <Navigation className="mr-1 h-4 w-4" />
            Directions
          </a>
        </Button>
        <Button asChild className="flex-1 rounded-full" onClick={(e) => e.stopPropagation()}>
          <a href={`tel:${shelter.phone.replace(/\s+/g, "")}`}>
            <Phone className="mr-1 h-4 w-4" />
            Call
          </a>
        </Button>
      </div>
    </motion.article>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  mono?: boolean;
}) {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg bg-secondary/50 p-2 sm:p-2.5">
      <p className="flex min-w-0 items-center gap-1 overflow-hidden text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3 shrink-0" />
        <span className="truncate">{label}</span>
      </p>
      <p className={`mt-1 truncate text-sm font-semibold text-foreground ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </p>
      {sub && <p className="truncate text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}
