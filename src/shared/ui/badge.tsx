import { cn } from "@/shared/lib/cn";

type Props = {
  children: React.ReactNode;
  kind?: "active" | "deleted" | "warning";
};

export function Badge({ children, kind = "active" }: Props) {
  const classes = {
    active: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    deleted: "bg-surface-hover text-muted",
    warning: "bg-amber-500/15 text-amber-800 dark:text-amber-200",
  }[kind];

  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", classes)}>
      {children}
    </span>
  );
}
