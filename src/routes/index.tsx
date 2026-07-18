import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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
import { useLanguage } from "@/lib/language-context";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const alertLevels = [
  { level: "Red", variant: "danger" as const, location: "Bhadrachalam, Bhadradri Kothagudem", titleKey: "godavari", timeNum: 12, timeUnit: "minAgo" },
  { level: "Orange", variant: "warning" as const, location: "Warangal, Hanamkonda", titleKey: "warangal", timeNum: 48, timeUnit: "minAgo" },
  { level: "Yellow", variant: "info" as const, location: "Khammam district", titleKey: "khammam", timeNum: 2, timeUnit: "hrAgo" },
];

const alertBodies: Record<string, Record<string, string>> = {
  en: {
    godavari: "Water level at 53.2 ft and rising. Evacuation ordered for low-lying colonies. Move to designated relief camps immediately.",
    warangal: "IMD predicts 12–20 cm rainfall. Urban flooding possible in low-lying areas. Avoid non-essential travel.",
    khammam: "Panchayat officials monitoring 4 villages. Livestock relocation underway. Volunteers requested at Palair mandal office.",
  },
  te: {
    godavari: "నీటి మట్టం 53.2 అడుగులు మరియు పెరుగుతోంది. పల్లపు ప్రాంత కాలనీలకు తరలింపు ఆదేశించబడింది. నిర్ణీత రిలీఫ్ క్యాంప్‌లకు వెంటనే వెళ్ళండి.",
    warangal: "IMD 12–20 సె.మీ. వర్షపాతం అంచనా వేస్తోంది. పల్లపు ప్రాంతాల్లో పట్టణ వరద సాధ్యం. అనవసర ప్రయాణాలు నివారించండి.",
    khammam: "పంచాయతీ అధికారులు 4 గ్రామాలను పర్యవేక్షిస్తున్నారు. పశువుల తరలింపు జరుగుతోంది. పైలారు మండల కార్యాలయంలో వలంటీర్లు అవసరం.",
  },
  hi: {
    godavari: "जल स्तर 53.2 फीट पर है और बढ़ रहा है। निचले इलाकों की कॉलोनियों में निकासी के आदेश जारी। निर्धारित राहत शिविरों में तुरंत जाएं।",
    warangal: "IMD 12–20 सेमी बारिश का अनुमान लगाता है। निचले इलाकों में शहरी बाढ़ संभव। गैर-जरूरी यात्रा से बचें।",
    khammam: "पंचायत अधिकारी 4 गांवों की निगरानी कर रहे हैं। पशुधन स्थानांतरण जारी। पैलेर मंडल कार्यालय में स्वयंसेवक चाहिए।",
  },
};

const alertTitles: Record<string, Record<string, string>> = {
  en: {
    godavari: "Godavari river breaches 3rd warning level",
    warangal: "Heavy rainfall likely for next 12 hours",
    khammam: "Local streams overflowing near Palair",
  },
  te: {
    godavari: "గోదావరి నది 3వ హెచ్చరిక స్థాయిని దాటింది",
    warangal: "తదుపరి 12 గంటలు భారీ వర్షపాతం అవకాశం",
    khammam: "పైలారు సమీపంలో స్థానిక వాగులు పొంగుతున్నాయి",
  },
  hi: {
    godavari: "गोदावरी नदी ने तीसरा चेतावनी स्तर पार किया",
    warangal: "अगले 12 घंटों में भारी वर्षा की संभावना",
    khammam: "पैलेर के पास स्थानीय नाले उफान पर",
  },
};

function HomePage() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: Mic,
      title: t("home.reportByVoice"),
      description: t("home.reportByVoiceDesc"),
      tone: "primary" as const,
    },
    {
      icon: MessageSquareText,
      title: t("home.reportByText"),
      description: t("home.reportByTextDesc"),
      tone: "emerald" as const,
    },
    {
      icon: Camera,
      title: t("home.uploadPhoto"),
      description: t("home.uploadPhotoDesc"),
      tone: "amber" as const,
    },
    {
      icon: Siren,
      title: t("common.generateSOS"),
      description: t("home.generateSOSDesc"),
      tone: "red" as const,
    },
  ];

  const emergencyInfo = [
    {
      icon: MapPin,
      title: t("home.nearestShelter"),
      value: "Zilla Parishad School",
      meta: `Warangal · 2.4 km ${t("home.away")} · 180 ${t("common.bedsFree")}`,
      badge: t("shelters.open"),
      badgeVariant: "success" as const,
      accent: "primary" as const,
      footer: `${t("home.lastUpdated")} 4 ${t("alerts.minAgo")}`,
    },
    {
      icon: Megaphone,
      title: t("home.currentAlert"),
      value: t("home.redAlertValue"),
      meta: t("home.imdRainfallMeta"),
      badge: t("alerts.critical"),
      badgeVariant: "danger" as const,
      accent: "red" as const,
      footer: `${t("home.issuedBy")} IMD Hyderabad · 06:12 AM`,
    },
    {
      icon: Phone,
      title: t("home.emergencyContacts"),
      value: "112 · 1077 · 108",
      meta: t("home.contactsMeta"),
      badge: "24/7",
      badgeVariant: "info" as const,
      accent: "emerald" as const,
      footer: t("home.tapToDial"),
    },
    {
      icon: WifiOff,
      title: t("home.offlineStatus"),
      value: `${t("home.ready")} · 42 MB ${t("home.cached")}`,
      meta: t("home.offlineMeta"),
      badge: t("settings.upToDate"),
      badgeVariant: "success" as const,
      accent: "slate" as const,
      footer: `${t("home.lastSync")}: 12 ${t("alerts.minAgo")}`,
    },
    {
      icon: ShieldAlert,
      title: t("home.floodSafetyTips"),
      value: t("home.moveHigherGround"),
      meta: t("home.avoidMovingWater"),
      badge: t("home.guide"),
      badgeVariant: "info" as const,
      accent: "amber" as const,
      footer: t("home.safetyCardsOffline"),
    },
  ];

  const titles = alertTitles[lang] ?? alertTitles.en;
  const bodies = alertBodies[lang] ?? alertBodies.en;

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
                {t("home.redAlert")}
              </StatusBadge>
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              {t("home.title").split(" ").slice(0, -1).join(" ")}{" "}
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                {t("home.title").split(" ").slice(-1)[0]}
              </span>
            </h1>
            <p className="mt-4 text-lg font-medium text-foreground/80 sm:text-xl">
              {t("home.subtitle")}
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
              {t("home.description")}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" asChild className="rounded-full shadow-[var(--shadow-elegant)]">
                <Link to="/report">
                  <Siren className="mr-1 h-4 w-4" />
                  {t("home.reportEmergency")}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="rounded-full">
                <Link to="/shelters">
                  <Navigation className="mr-1 h-4 w-4" />
                  {t("home.findShelter")}
                </Link>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <WifiOff className="h-3.5 w-3.5" /> {t("home.worksOffline")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Waves className="h-3.5 w-3.5" /> {t("home.imdAlerts")}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> {t("home.oneTap112")}
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
                <QuickActionCard {...a} onClick={() => navigate({ to: "/report" })} />
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
              eyebrow={t("home.liveOverviewEyebrow")}
              title={t("home.liveOverviewTitle")}
              description={t("home.liveOverviewDesc")}
            />
            <Button variant="ghost" asChild className="rounded-full">
              <Link to="/alerts">
                {t("home.viewAllAlerts")} <ArrowRight className="ml-1 h-4 w-4" />
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
            eyebrow={t("home.latestAlertsEyebrow")}
            title={t("home.latestAlertsTitle")}
            description={t("home.latestAlertsDesc")}
          />
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {alertLevels.map((a, i) => (
              <motion.article
                key={a.titleKey}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-all hover:border-primary/30 hover:shadow-[var(--shadow-elegant)]"
              >
                <div className="flex items-center justify-between">
                  <StatusBadge variant={a.variant} pulse={a.variant === "danger"}>
                    {a.level} {t("home.alert")}
                  </StatusBadge>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {a.timeNum} {t(`alerts.${a.timeUnit}`)}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold leading-snug text-foreground">
                  {titles[a.titleKey]}
                </h3>
                <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {a.location}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{bodies[a.titleKey]}</p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <Link
                    to="/alerts"
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-glow"
                  >
                    {t("home.readBulletin")} <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <a
                    href="tel:112"
                    className="text-xs font-medium text-muted-foreground hover:text-destructive"
                  >
                    {t("home.dial112")}
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
