import { adminApi } from "@/shared/api/admin-api";
import { requireAdminToken } from "@/shared/lib/auth-server";
import { FadeIn } from "@/shared/ui/fade-in";
import { SupportList } from "@/features/support-queue/ui/support-list";

export default async function AdminSupportPage() {
  const token = await requireAdminToken();
  const data = await adminApi.getSupportTickets(token).catch(() => ({ items: [] }));

  return (
    <FadeIn>
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold">Support queue</h1>
        <SupportList tickets={data.items} />
      </section>
    </FadeIn>
  );
}
