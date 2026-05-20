"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/shared/lib/cn";

type Props = { className?: string };

export function AdminLogoutButton({ className }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    await fetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
    setPending(false);
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm font-medium text-muted transition",
        "hover:border-rose-500/40 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30 dark:hover:text-rose-200",
        "disabled:opacity-50",
        className,
      )}
    >
      <svg className="size-4 shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      {pending ? "Выход…" : "Выйти"}
    </button>
  );
}
