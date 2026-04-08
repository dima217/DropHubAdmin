import { cn } from "@/shared/lib/cn";

type Props = {
  children: React.ReactNode;
  kind?: "active" | "deleted" | "warning";
};

export function Badge({ children, kind = "active" }: Props) {
  const classes = {
    active: "bg-emerald-500/20 text-emerald-300",
    deleted: "bg-slate-700 text-slate-300",
    warning: "bg-amber-500/20 text-amber-200",
  }[kind];

  return (
    <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", classes)}>
      {children}
    </span>
  );
}
