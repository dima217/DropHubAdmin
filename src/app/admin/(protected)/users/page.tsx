import { adminApi } from "@/shared/api/admin-api";
import { requireAdminToken } from "@/shared/lib/auth-server";
import { FadeIn } from "@/shared/ui/fade-in";
import { UsersTable } from "@/features/user-management/ui/users-table";

type Props = {
  searchParams: Promise<{ page?: string; email?: string }>;
};

export default async function UsersPage({ searchParams }: Props) {
  const token = await requireAdminToken();
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const email = params.email ?? "";

  const data = await adminApi.getUsers(token, page, 20, email);

  return (
    <FadeIn>
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold">Users</h1>
        <form className="max-w-md">
          <input
            name="email"
            defaultValue={email}
            placeholder="Search email..."
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 outline-none focus:border-blue-500"
          />
        </form>
        <UsersTable users={data.items} />
      </section>
    </FadeIn>
  );
}
