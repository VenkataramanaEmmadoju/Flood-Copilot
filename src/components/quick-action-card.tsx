import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function QuickActionCard({
  icon: Icon,
  title,
  description,
  tone = "primary",
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: "primary" | "emerald" | "amber" | "red";
  onClick?: () => void;
}) {
  const tones: Record<string, string> = {
    primary: "from-primary/15 to-primary/0 text-primary",
    emerald: "from-success/15 to-success/0 text-success",
    amber: "from-warning/20 to-warning/0 text-warning-foreground dark:text-warning",
    red: "from-destructive/15 to-destructive/0 text-destructive",
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex h-full w-full flex-col items-start gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5 text-left shadow-[var(--shadow-soft)] transition-colors hover:border-primary/40"
    >
      <div className={cn("absolute inset-0 -z-10 bg-gradient-to-br opacity-60", tones[tone])} />
      <div className="flex w-full items-start justify-between">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl bg-background/70 backdrop-blur",
            tones[tone].split(" ").slice(-1)[0],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.button>
  );
}
