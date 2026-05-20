import { apiRequest } from "@/shared/api/http";
import {
  AdminStatistics,
  StorageFilter,
  SupportTicket,
  UserStoragesResponse,
  UsersListResponse,
} from "@/shared/types/admin";

export const adminApi = {
  getUsers(token: string, page = 1, limit = 20, email = "") {
    const q = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(email ? { email } : {}),
    });
    return apiRequest<UsersListResponse>(`/users/admin/list?${q}`, { token });
  },
  banUser(token: string, id: number, isBanned: boolean) {
    return apiRequest<{ success: boolean }>(`/users/admin/${id}/ban`, {
      method: "PATCH",
      token,
      body: { isBanned },
    });
  },
  getStatistics(token: string, days = 30, top = 10) {
    return apiRequest<AdminStatistics>(
      `/users/admin/statistics?days=${days}&top=${top}`,
      { token },
    );
  },
  getUserStorages(
    token: string,
    userId: string,
    opts: { page?: number; limit?: number; filter?: StorageFilter } = {},
  ) {
    const q = new URLSearchParams({
      page: String(opts.page ?? 1),
      limit: String(opts.limit ?? 50),
      filter: opts.filter ?? "all",
    });
    return apiRequest<UserStoragesResponse>(
      `/storage/admin/users/${userId}/storages?${q}`,
      { token },
    );
  },
  restoreDeletedStructure(
    token: string,
    body: { itemId: string; newParentId?: string | null },
  ) {
    return apiRequest<{ success: boolean }>(`/storage/admin/restore-deleted-structure`, {
      method: "POST",
      token,
      body,
    });
  },
  getSupportTickets(token: string) {
    return apiRequest<{ items: SupportTicket[] }>(`/support/admin?page=1&limit=20`, {
      token,
    });
  },
  respondTicket(token: string, id: string, response: string) {
    return apiRequest<{ success: boolean }>(`/support/admin/${id}/respond`, {
      method: "PATCH",
      token,
      body: { response, status: "in_progress" },
    });
  },
  setTicketStatus(token: string, id: string, status: "open" | "in_progress" | "resolved") {
    return apiRequest<{ success: boolean }>(`/support/admin/${id}/status`, {
      method: "PATCH",
      token,
      body: { status },
    });
  },
};
