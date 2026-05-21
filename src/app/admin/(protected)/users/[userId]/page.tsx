import Link from "next/link";
import { adminApi } from "@/shared/api/admin-api";
import { requireAdminToken } from "@/shared/lib/auth-server";
import { cn } from "@/shared/lib/cn";
import { formatBytes } from "@/shared/lib/format-bytes";
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
            className="text-sm font-medium text-muted hover:text-blue-500"
          >
            ← К списку пользователей
          </Link>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">{data.user.email}</h1>
        <Card>
          <p className="text-foreground">
            <span className="text-muted">Роль:</span> {data.user.role}
          </p>
          <p className="mt-1 text-foreground">
            <span className="text-muted">Статус:</span>{" "}
            {data.user.isBanned ? "Заблокирован" : "Активен"}
          </p>
        </Card>

        <div id="storages" className="scroll-mt-6 space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Хранилища</h2>
          <p className="text-sm text-muted">
            Откройте дерево файлов и папок (включая удалённые) для выбранного storage.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {data.storages.length === 0 ? (
              <Card>
                <p className="text-sm text-muted">У пользователя нет storage в ответе API.</p>
              </Card>
            ) : (
              data.storages.map((storage) => (
                <Card key={storage.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">Хранилище</p>
                    <p className="mt-0.5 truncate font-mono text-xs text-muted">{storage.id}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted">
                      <span>
                        Использовано:{" "}
                        <span className="font-medium text-foreground">{formatBytes(storage.usedBytes ?? 0)}</span>
                      </span>
                      <span>
                        Лимит:{" "}
                        <span className="font-medium text-foreground">{formatBytes(storage.maxBytes)}</span>
                      </span>
                      {storage.pagination ? (
                        <span>
                          Элементов:{" "}
                          <span className="font-medium text-foreground">{storage.pagination.total}</span>
                        </span>
                      ) : null}
                    </div>
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
