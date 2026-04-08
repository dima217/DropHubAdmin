"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AdminUser } from "@/shared/types/admin";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

type Props = { users: AdminUser[] };

export function UsersTable({ users }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const banMutation = useMutation({
    mutationFn: async (payload: { id: number; isBanned: boolean }) => {
      const res = await fetch(`/api/admin/users/${payload.id}/ban`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBanned: payload.isBanned }),
      });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.clear();
      router.refresh();
    },
  });

  return (
    <Card className="overflow-auto p-0">
      <table className="w-full text-left">
        <thead className="bg-slate-800/70 text-xs text-slate-400">
          <tr>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-slate-800 text-sm">
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.role}</td>
              <td className="px-4 py-3">{user.isBanned ? "Banned" : "Active"}</td>
              <td className="flex flex-wrap gap-2 px-4 py-3">
                <Button onClick={() => router.push(`/admin/users/${user.id}#storages`)} variant="primary">
                  Хранилища
                </Button>
                <Button
                  variant={user.isBanned ? "secondary" : "danger"}
                  onClick={() => banMutation.mutate({ id: user.id, isBanned: !user.isBanned })}
                >
                  {user.isBanned ? "Unban" : "Ban"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
