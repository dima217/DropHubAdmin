"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  const variantClass = {
    primary: "bg-blue-500 hover:bg-blue-400 text-white",
    secondary: "bg-surface hover:bg-surface-hover text-foreground border border-border",
    danger: "bg-rose-600 hover:bg-rose-500 text-white",
  }[variant];

  return (
    <button
      className={cn(
        "rounded-xl px-4 py-2 text-sm font-medium transition disabled:opacity-60",
        variantClass,
        className,
      )}
      {...props}
    />
  );
}
