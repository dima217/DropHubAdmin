"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/button";

export function AdminLoginForm() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsPending(true);

    try {
      const formData = new FormData(event.currentTarget);
      const email = String(formData.get("email") ?? "");
      const password = String(formData.get("password") ?? "");

      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "same-origin",
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { message?: string };
        setError(payload.message ?? "Ошибка входа");
        return;
      }

      window.location.assign("/admin/dashboard");
    } catch {
      setError("Что-то пошло не так. Попробуйте ещё раз.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} aria-busy={isPending}>
      <input
        name="email"
        type="email"
        required
        placeholder="Электронная почта"
        className="w-full rounded-xl border border-border bg-input px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      <input
        name="password"
        type="password"
        required
        placeholder="Пароль"
        className="w-full rounded-xl border border-border bg-input px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      {error && <p className="text-sm text-rose-400">{error}</p>}
      <Button type="submit" className="w-full" disabled={isPending} aria-busy={isPending}>
        {isPending ? "Вход..." : "Войти"}
      </Button>
    </form>
  );
}
