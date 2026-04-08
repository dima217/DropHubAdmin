import Link from "next/link";
import { AdminUser } from "@/shared/types/admin";
import { Card } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

type Props = { users: AdminUser[] };

export function DashboardStorageSection({ users }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-blue-500/20 bg-slate-900/40">
        <h2 className="text-lg font-semibold text-white">Хранилища и корзина</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          По API <code className="rounded bg-slate-950 px-1.5 py-0.5 text-xs text-slate-300">GET /storage/admin/users/:userId/storages</code>{" "}
          загружаются все элементы, в том числе с{" "}
          <Badge kind="deleted">Deleted</Badge> и{" "}
          <Badge kind="warning">Pending delete</Badge>.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          <li className="flex gap-2">
            <span className="text-slate-500">•</span>
            <span>
              <strong className="text-slate-200">deletedAt ≠ null</strong> — в корзине / скрыто для клиента.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-slate-500">•</span>
            <span>
              <strong className="text-slate-200">permanentDeleteAt</strong> — запланировано окончательное удаление по retention.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-slate-500">•</span>
            <span>
              Восстановление:{" "}
              <code className="rounded bg-slate-950 px-1.5 py-0.5 text-xs">POST /storage/admin/restore-deleted-structure</code> с{" "}
              <code className="text-xs text-blue-300">itemId</code> и опционально{" "}
              <code className="text-xs text-blue-300">newParentId</code> (null — в root, не передан — в исходного родителя).
            </span>
          </li>
        </ul>
        <Link
          href="/admin/users"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300"
        >
          Перейти к пользователям →
        </Link>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-white">Быстрый доступ к storages</h2>
        <p className="mt-1 text-xs text-slate-500">Первая страница списка пользователей (из API list)</p>
        <ul className="mt-4 divide-y divide-slate-800/80">
          {users.length === 0 ? (
            <li className="py-6 text-center text-sm text-slate-500">Нет пользователей или ошибка загрузки списка.</li>
          ) : (
            users.map((u) => (
              <li key={u.id} className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-100">{u.email}</p>
                  <p className="text-xs text-slate-500">id {u.id}</p>
                </div>
                <Link
                  href={`/admin/users/${u.id}`}
                  className="shrink-0 rounded-lg border border-slate-600 bg-slate-800/50 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-blue-500/50 hover:bg-slate-800"
                >
                  Storages & restore
                </Link>
              </li>
            ))
          )}
        </ul>
      </Card>
    </div>
  );
}
