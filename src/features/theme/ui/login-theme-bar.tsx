"use client";

import { ThemeToggle } from "@/features/theme/ui/theme-toggle";

export function LoginThemeBar() {
  return (
    <div className="absolute right-4 top-4 z-10 w-full max-w-[220px] sm:right-6 sm:top-6">
      <ThemeToggle />
    </div>
  );
}
