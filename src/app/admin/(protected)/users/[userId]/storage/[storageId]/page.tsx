import { adminApi } from "@/shared/api/admin-api";
import { requireAdminToken } from "@/shared/lib/auth-server";
import { StorageFilter } from "@/shared/types/admin";
import { FadeIn } from "@/shared/ui/fade-in";
import { StorageTree } from "@/entities/storage/ui/storage-tree";

type Props = {
  params: Promise<{ userId: string; storageId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function parseFilter(v: unknown): StorageFilter {
  if (v === "deleted" || v === "pending") return v;
  return "all";
}

export default async function UserStoragePage({ params, searchParams }: Props) {
  const token = await requireAdminToken();
  const { userId, storageId } = await params;
  const sp = await searchParams;

  const filter = parseFilter(sp.filter);
  const page = Math.max(1, Number(sp.page) || 1);
  const limit = 50;

  const data = await adminApi.getUserStorages(token, userId, { page, limit, filter });
  const storage = data.storages.find((it) => it.id === storageId);

  return (
    <FadeIn>
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">Хранилище</h1>
        <p className="text-sm text-muted">
          Пользователь: <span className="text-foreground">{data.user.email}</span>
        </p>
        <StorageTree
          items={storage?.items ?? []}
          pagination={storage?.pagination ?? { total: 0, page, limit, totalPages: 1 }}
          filter={filter}
        />
      </section>
    </FadeIn>
  );
}
