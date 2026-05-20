import { Card } from "@/shared/ui/card";
import { AdminLoginForm } from "@/features/auth/ui/admin-login-form";
import { LoginThemeBar } from "@/features/theme/ui/login-theme-bar";
import { getAuthToken } from "@/shared/lib/auth-server";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
  const token = await getAuthToken();
  if (token) redirect("/admin/dashboard");
  return (
    <div className="relative grid min-h-screen w-full lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
      <LoginThemeBar />

      <div className="relative hidden flex-col justify-between border-b border-border bg-surface p-8 sm:p-10 lg:flex lg:border-b-0 lg:border-r">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,var(--gradient-a)_0%,transparent_50%)]" />
        <div className="relative">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
              <span className="text-sm font-bold text-white">DH</span>
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-foreground">DropHub</p>
              <p className="text-sm text-muted">Панель администратора</p>
            </div>
          </div>
          <h1 className="max-w-md text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            Управление пользователями, хранилищами и поддержкой
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Единый интерфейс для команды: аналитика, модерация и ответы в support.
          </p>
        </div>
        <p className="relative text-xs text-muted">© DropHub</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-5 py-10 sm:px-8">
        <div className="mb-6 flex w-full max-w-md items-center gap-3 lg:hidden">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
            <span className="text-xs font-bold text-white">DH</span>
          </div>
          <div>
            <p className="font-semibold text-foreground">DropHub Admin</p>
            <p className="text-xs text-muted">Вход в панель</p>
          </div>
        </div>
        <Card className="w-full max-w-md space-y-6 shadow-2xl dark:shadow-black/40">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Вход</h2>
            <p className="mt-1 text-sm text-muted">Учётная запись с ролью admin</p>
          </div>
          <AdminLoginForm />
        </Card>
      </div>
    </div>
  );
}
