import { Link } from "@tanstack/react-router";
import { Phone, LifeBuoy, Radio, Shield } from "lucide-react";

const emergencyNumbers = [
  { label: "Emergency", number: "112", icon: Phone },
  { label: "Disaster Helpline", number: "1077", icon: LifeBuoy },
  { label: "Ambulance", number: "108", icon: Radio },
  { label: "Police", number: "100", icon: Shield },
];

const linkGroups = [
  {
    title: "Resources",
    items: [
      { label: "Report Emergency", to: "/report" },
      { label: "Find Shelter", to: "/shelters" },
      { label: "Flood Alerts", to: "/alerts" },
      { label: "Survival Kit", to: "/survival-kit" },
    ],
  },
  {
    title: "About",
    items: [
      { label: "Our Mission", to: "/about" },
      { label: "Settings", to: "/settings" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-gradient-to-b from-background to-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 font-semibold">
              <span className="text-2xl" aria-hidden>🌊</span>
              <span>Telugu Flood Copilot</span>
            </div>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              An offline-first AI decision support system helping rural Telangana communicate
              faster with 112 and local responders during floods.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {emergencyNumbers.map((n) => {
                const Icon = n.icon;
                return (
                  <a
                    key={n.label}
                    href={`tel:${n.number}`}
                    className="group flex flex-col rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-soft)]"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="mt-2 text-xs text-muted-foreground">{n.label}</span>
                    <span className="text-lg font-bold tracking-tight">{n.number}</span>
                  </a>
                );
              })}
            </div>
          </div>

          {linkGroups.map((g) => (
            <div key={g.title}>
              <h4 className="text-sm font-semibold">{g.title}</h4>
              <ul className="mt-4 space-y-2">
                {g.items.map((it) => (
                  <li key={it.to}>
                    <Link
                      to={it.to}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {it.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Telugu Flood Copilot · Built for Telangana communities.</p>
          <p>In an emergency, always dial <span className="font-semibold text-foreground">112</span>.</p>
        </div>
      </div>
    </footer>
  );
}
