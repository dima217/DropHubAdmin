import { AdminShell } from "@/widgets/admin-shell/ui/admin-shell";
import { requireAdminToken } from "@/shared/lib/auth-server";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await requireAdminToken();
  return <AdminShell>{children}</AdminShell>;
}
