import type { LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "muted";

export function EmergencyCard({
  icon: Icon,
  title,
  value,
  meta,
  badge,
  badgeVariant = "info",
  footer,
  accent = "primary",
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  meta?: string;
  badge?: string;
  badgeVariant?: BadgeVariant;
  footer?: React.ReactNode;
  accent?: "primary" | "emerald" | "amber" | "red" | "slate";
}) {
  const accents: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    emerald: "bg-success/15 text-success",
    amber: "bg-warning/20 text-warning-foreground dark:text-warning",
    red: "bg-destructive/15 text-destructive",
    slate: "bg-muted text-muted-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="flex h-full flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:border-primary/30 hover:shadow-[var(--shadow-elegant)]"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", accents[accent])}>
            <Icon className="h-5 w-5" />
          </div>
          {badge && <StatusBadge variant={badgeVariant}>{badge}</StatusBadge>}
        </div>
        <h3 className="mt-4 text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="mt-1 text-xl font-semibold tracking-tight text-foreground">{value}</p>
        {meta && <p className="mt-1 text-xs text-muted-foreground">{meta}</p>}
      </div>
      {footer && <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">{footer}</div>}
    </motion.div>
  );
}
