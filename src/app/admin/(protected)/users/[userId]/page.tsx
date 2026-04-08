import Link from "next/link";
import { adminApi } from "@/shared/api/admin-api";
import { requireAdminToken } from "@/shared/lib/auth-server";
import { cn } from "@/shared/lib/cn";
import { Card } from "@/shared/ui/card";
import { FadeIn } from "@/shared/ui/fade-in";

type Props = { params: Promise<{ userId: string }> };

export default async function UserDetailsPage({ params }: Props) {
  const token = await requireAdminToken();
  const { userId } = await params;
  const data = await adminApi.getUserStorages(token, userId);

  return (
    <FadeIn>
      <section className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/users"
            className="text-sm font-medium text-slate-400 hover:text-blue-400"
          >
            ← К списку пользователей
          </Link>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-white">{data.user.email}</h1>
        <Card>
          <p className="text-slate-300">
            <span className="text-slate-500">Роль:</span> {data.user.role}
          </p>
          <p className="mt-1 text-slate-300">
            <span className="text-slate-500">Статус:</span>{" "}
            {data.user.isBanned ? "Заблокирован" : "Активен"}
          </p>
        </Card>

        <div id="storages" className="scroll-mt-6 space-y-3">
          <h2 className="text-lg font-semibold text-white">Хранилища</h2>
          <p className="text-sm text-slate-500">
            Откройте дерево файлов и папок (включая удалённые) для выбранного storage.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {data.storages.length === 0 ? (
              <Card>
                <p className="text-sm text-slate-400">У пользователя нет storage в ответе API.</p>
              </Card>
            ) : (
              data.storages.map((storage) => (
                <Card key={storage.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-100">Storage</p>
                    <p className="mt-0.5 truncate font-mono text-xs text-slate-500">{storage.id}</p>
                    <p className="mt-2 text-sm text-slate-400">{storage.items.length} элементов</p>
                  </div>
                  <Link
                    href={`/admin/users/${userId}/storage/${storage.id}`}
                    className={cn(
                      "inline-flex shrink-0 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition",
                      "bg-blue-500 text-white hover:bg-blue-400",
                    )}
                  >
                    Открыть дерево
                  </Link>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
    </FadeIn>
  );
}
