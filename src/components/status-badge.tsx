import { cn } from "@/lib/utils";

type Variant = "success" | "warning" | "danger" | "info" | "muted";

const styles: Record<Variant, string> = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning-foreground border-warning/40 dark:text-warning",
  danger: "bg-destructive/15 text-destructive border-destructive/30",
  info: "bg-info/15 text-info border-info/30",
  muted: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({
  variant = "info",
  children,
  pulse,
  className,
}: {
  variant?: Variant;
  children: React.ReactNode;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        styles[variant],
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full bg-current",
          pulse && "animate-pulse",
        )}
      />
      {children}
    </span>
  );
}
