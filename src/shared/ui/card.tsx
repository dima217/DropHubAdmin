import { PropsWithChildren } from "react";
import { cn } from "@/shared/lib/cn";

type Props = PropsWithChildren<{ className?: string }>;

export function Card({ className, children }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-5 shadow-sm backdrop-blur-md dark:shadow-xl dark:shadow-black/30",
        className,
      )}
    >
      {children}
    </div>
  );
}
