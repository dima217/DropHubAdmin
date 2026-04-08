import { Card } from "@/shared/ui/card";
import { AdminLoginForm } from "@/features/auth/ui/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
      <div className="relative hidden flex-col justify-between border-b border-slate-800/80 p-8 sm:p-10 lg:flex lg:border-b-0 lg:border-r">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(59,130,246,0.12)_0%,transparent_50%)]" />
        <div className="relative">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
              <span className="text-sm font-bold text-white">DH</span>
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-white">DropHub</p>
              <p className="text-sm text-slate-500">Панель администратора</p>
            </div>
          </div>
          <h1 className="max-w-md text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
            Управление пользователями, хранилищами и поддержкой
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            Единый интерфейс для команды: аналитика, модерация и ответы в support.
          </p>
        </div>
        <p className="relative text-xs text-slate-600">© DropHub</p>
      </div>

      <div className="flex w-full flex-col items-center justify-center px-5 py-10 sm:px-8">
        <div className="mb-6 flex w-full max-w-md items-center gap-3 lg:hidden">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
            <span className="text-xs font-bold text-white">DH</span>
          </div>
          <div>
            <p className="font-semibold text-white">DropHub Admin</p>
            <p className="text-xs text-slate-500">Вход в панель</p>
          </div>
        </div>
        <Card className="w-full max-w-md space-y-6 border-slate-800/90 shadow-2xl shadow-black/40">
          <div>
            <h2 className="text-xl font-semibold text-white">Вход</h2>
            <p className="mt-1 text-sm text-slate-400">Учётная запись с ролью admin</p>
          </div>
          <AdminLoginForm />
        </Card>
      </div>
    </div>
  );
}
