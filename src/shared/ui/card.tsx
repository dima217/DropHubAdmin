import { PropsWithChildren } from "react";
import { cn } from "@/shared/lib/cn";

type Props = PropsWithChildren<{ className?: string }>;

export function Card({ className, children }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800/90 bg-slate-900/60 p-5 shadow-xl shadow-black/30 backdrop-blur-md",
        className,
      )}
    >
      {children}
    </div>
  );
}
