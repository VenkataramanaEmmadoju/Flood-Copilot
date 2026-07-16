import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Hammer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";

export function ComingSoon({
  icon: Icon = Hammer,
  title,
  description,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-7 w-7" />
      </div>
      <StatusBadge variant="info" className="mt-6">Coming soon</StatusBadge>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">{description}</p>
      <Button asChild variant="outline" className="mt-8 rounded-full">
        <Link to="/"><ArrowLeft className="mr-1 h-4 w-4" /> Back to home</Link>
      </Button>
    </div>
  );
}
