export type AdminUser = {
  id: number;
  uuid: string;
  email: string;
  role: "admin" | "user";
  isBanned: boolean;
  isOAuthUser?: boolean;
  profile?: { id: number; firstName: string; avatarUrl: string | null };
};

export type UsersListResponse = {
  items: AdminUser[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type StorageItem = {
  id: string;
  name: string;
  isDirectory: boolean;
  parentId: string | null;
  deletedAt: string | null;
  permanentDeleteAt: string | null;
  childrenCount: number;
  filesCount: number;
  foldersCount: number;
};

export type UserStorage = {
  id: string;
  createdAt: string;
  maxBytes: number;
  userRole: string;
  items: StorageItem[];
};

export type UserStoragesResponse = {
  user: AdminUser;
  storages: UserStorage[];
};

export type AdminStatistics = {
  periodDays: number;
  generatedAt: string;
  storageUsageTop: { label: string; value: number }[];
  uploadLeaders: { label: string; value: number }[];
  suspiciousTraffic: { label: string; value: number }[];
  mostLoadedFolders: { label: string; value: number }[];
  inactiveAccounts: { label: string; value: number }[];
};

export type SupportTicket = {
  id: string;
  title: string;
  details: string;
  status: "open" | "in_progress" | "resolved";
  response: string | null;
  createdAt: string;
  updatedAt: string;
  user?: { email?: string };
};
