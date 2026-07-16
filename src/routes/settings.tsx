import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Languages,
  Palette,
  WifiOff,
  Bell,
  Info,
  Sun,
  Moon,
  Monitor,
  CheckCircle2,
  Waves,
  Github,
  Mail,
  Database,
  MapPinned,
  RefreshCw,
  ShieldCheck,
  Volume2,
  Vibrate,
  MessageSquare,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/section-header";
import { StatusBadge } from "@/components/status-badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Telugu Flood Copilot" },
      {
        name: "description",
        content:
          "Language, theme, offline cache, notifications and app information for Telugu Flood Copilot.",
      },
    ],
  }),
  component: SettingsPage,
});

type ThemeChoice = "light" | "dark" | "system";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
];

function SettingsPage() {
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState<ThemeChoice>("system");

  // Notifications
  const [criticalAlerts, setCriticalAlerts] = useState(true);
  const [dailyBulletin, setDailyBulletin] = useState(true);
  const [shelterUpdates, setShelterUpdates] = useState(false);
  const [voiceAnnouncements, setVoiceAnnouncements] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [smsFallback, setSmsFallback] = useState(true);

  // Load persisted settings
  useEffect(() => {
    if (typeof window === "undefined") return;
    const l = localStorage.getItem("tfc.language");
    if (l) setLanguage(l);
    const t = localStorage.getItem("tfc.theme") as ThemeChoice | null;
    if (t) setTheme(t);
  }, []);

  // Persist + apply theme
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("tfc.theme", theme);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = theme === "dark" || (theme === "system" && prefersDark);
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("tfc.language", language);
  }, [language]);

  const currentLang = useMemo(
    () => LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0],
    [language],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Preferences"
        title="Settings"
        description="Personalise language, appearance, offline cache and alert channels. Everything is stored on this device."
      />

      {/* Language */}
      <SettingsSection icon={Languages} title="Language" description="Choose your preferred language for the app and voice prompts.">
        <div className="grid gap-3 sm:grid-cols-3">
          {LANGUAGES.map((l) => {
            const active = l.code === language;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-all",
                  active
                    ? "border-primary bg-primary/5 shadow-[var(--shadow-soft)]"
                    : "border-border bg-card hover:border-primary/40",
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-semibold">{l.label}</span>
                  {active && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </div>
                <span className="text-lg font-medium text-foreground">{l.native}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Currently displaying in <span className="font-medium text-foreground">{currentLang.native}</span>. UI translation for Telugu/Hindi coming soon.
        </p>
      </SettingsSection>

      {/* Theme */}
      <SettingsSection icon={Palette} title="Theme" description="Match the app to your environment. System follows your device setting.">
        <div className="grid gap-3 sm:grid-cols-3">
          {([
            { key: "light", label: "Light", icon: Sun, hint: "Bright and clear" },
            { key: "dark", label: "Dark", icon: Moon, hint: "Easier at night" },
            { key: "system", label: "System", icon: Monitor, hint: "Follow device" },
          ] as { key: ThemeChoice; label: string; icon: LucideIcon; hint: string }[]).map((t) => {
            const Icon = t.icon;
            const active = theme === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTheme(t.key)}
                className={cn(
                  "flex items-start gap-3 rounded-2xl border p-4 text-left transition-all",
                  active
                    ? "border-primary bg-primary/5 shadow-[var(--shadow-soft)]"
                    : "border-border bg-card hover:border-primary/40",
                )}
              >
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{t.label}</span>
                    {active && <CheckCircle2 className="h-4 w-4 text-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{t.hint}</p>
                </div>
              </button>
            );
          })}
        </div>
      </SettingsSection>

      {/* Offline status */}
      <SettingsSection icon={WifiOff} title="Offline status" description="What's cached on this device and ready to work without network.">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/15 text-success">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">Ready for offline emergencies</p>
                <p className="text-xs text-muted-foreground">Last synced 12 minutes ago</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Sync now
            </Button>
          </div>

          <div className="mt-5 space-y-4">
            <StorageRow icon={MapPinned} label="Offline maps (Telangana)" used={324} total={512} unit="MB" />
            <StorageRow icon={Languages} label="Telugu language pack" used={82} total={82} unit="MB" done />
            <StorageRow icon={Database} label="AI decision model" used={210} total={310} unit="MB" />
            <StorageRow icon={Waves} label="Shelter & advisory database" used={44} total={44} unit="MB" done />
          </div>
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection icon={Bell} title="Notification preferences" description="Choose which alerts you receive and how they're delivered.">
        <div className="divide-y divide-border rounded-2xl border border-border bg-card shadow-[var(--shadow-soft)]">
          <ToggleRow
            icon={AlertTriangle}
            title="Critical flood alerts"
            description="Life-threatening bulletins from IMD, CWC, and district control rooms. Recommended."
            tone="danger"
            checked={criticalAlerts}
            onCheckedChange={setCriticalAlerts}
          />
          <ToggleRow
            icon={Bell}
            title="Daily weather bulletin"
            description="One summary each morning covering the next 24 hours."
            checked={dailyBulletin}
            onCheckedChange={setDailyBulletin}
          />
          <ToggleRow
            icon={MapPinned}
            title="Nearby shelter updates"
            description="Notify when shelters near you open, fill up, or close."
            checked={shelterUpdates}
            onCheckedChange={setShelterUpdates}
          />
          <div className="p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Delivery
            </p>
            <div className="mt-2 divide-y divide-border rounded-xl border border-border">
              <ToggleRow
                icon={Volume2}
                title="Voice announcements"
                description="Read alerts aloud in Telugu when the phone is idle."
                checked={voiceAnnouncements}
                onCheckedChange={setVoiceAnnouncements}
                compact
              />
              <ToggleRow
                icon={Vibrate}
                title="Vibration"
                description="Vibrate for critical alerts even in silent mode."
                checked={vibration}
                onCheckedChange={setVibration}
                compact
              />
              <ToggleRow
                icon={MessageSquare}
                title="SMS fallback"
                description="Send alerts by SMS when the device is offline."
                checked={smsFallback}
                onCheckedChange={setSmsFallback}
                compact
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="text-sm font-semibold">Quiet hours</p>
              <p className="text-xs text-muted-foreground">
                Non-critical alerts are silenced during this window. Critical alerts always ring.
              </p>
            </div>
            <Select defaultValue="none">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Off</SelectItem>
                <SelectItem value="night">22:00 – 06:00</SelectItem>
                <SelectItem value="work">09:00 – 17:00</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SettingsSection>

      {/* Application version */}
      <SettingsSection icon={Info} title="Application version" description="Build and update information for this installation.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoTile label="Version" value="1.4.0" />
          <InfoTile label="Build" value="2026.07.16" />
          <InfoTile label="Channel" value="Stable" />
          <InfoTile label="Data pack" value="TS-Monsoon 2026.2" />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <StatusBadge variant="success">
              <CheckCircle2 className="h-3 w-3" />
              Up to date
            </StatusBadge>
            <span className="text-xs text-muted-foreground">Last checked just now</span>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Check for updates
          </Button>
        </div>
      </SettingsSection>

      {/* About */}
      <SettingsSection icon={Waves} title="About the app" description="Telugu Flood Copilot is an offline-first AI decision support system for rural Telangana.">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-background p-5 shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-xl">
              <p className="text-sm text-foreground">
                Built with citizens, volunteers, and district responders. Free to use, open source,
                and designed to work when the network doesn't.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                © {new Date().getFullYear()} Telugu Flood Copilot · MIT Licensed
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:border-primary/40 hover:text-primary"
              >
                <Info className="h-4 w-4" />
                Learn more
              </a>
              <a
                href="https://github.com/VenkataramanaEmmadoju/Telugu-Flood-Copilot"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:border-primary/40 hover:text-primary"
              >
                <Github className="h-4 w-4" />
                GitHub
              </a>
              <a
                href="mailto:hello@telugufloodcopilot.in"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium hover:border-primary/40 hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                Contact
              </a>
            </div>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
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
      <div className="mt-4">{children}</div>
    </section>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  onCheckedChange,
  tone,
  compact,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  tone?: "danger";
  compact?: boolean;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", compact ? "p-3" : "p-4")}>
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl",
            tone === "danger" ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)]">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}

function StorageRow({
  icon: Icon,
  label,
  used,
  total,
  unit,
  done,
}: {
  icon: LucideIcon;
  label: string;
  used: number;
  total: number;
  unit: string;
  done?: boolean;
}) {
  const pct = Math.min(100, Math.round((used / total) * 100));
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {used} / {total} {unit} {done && "· complete"}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", done ? "bg-success" : "bg-primary")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
