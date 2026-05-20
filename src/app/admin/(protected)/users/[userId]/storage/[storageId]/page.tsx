import { adminApi } from "@/shared/api/admin-api";
import { requireAdminToken } from "@/shared/lib/auth-server";
import { StorageTree } from "@/entities/storage/ui/storage-tree";
import { FadeIn } from "@/shared/ui/fade-in";

type Props = { params: Promise<{ userId: string; storageId: string }> };

export default async function UserStoragePage({ params }: Props) {
  const token = await requireAdminToken();
  const { userId, storageId } = await params;
  const data = await adminApi.getUserStorages(token, userId);
  const storage = data.storages.find((it) => it.id === storageId);

  return (
    <FadeIn>
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold">Storage tree</h1>
        <p className="text-sm text-muted">User: {data.user.email}</p>
        <StorageTree items={storage?.items ?? []} />
      </section>
    </FadeIn>
  );
}
