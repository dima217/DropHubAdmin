"use client";

import { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

export function Button({ className, variant = "primary", ...props }: Props) {
  const variantClass = {
    primary: "bg-blue-500 hover:bg-blue-400 text-white",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700",
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
