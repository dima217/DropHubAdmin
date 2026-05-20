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

export type StorageUsageEntry = {
  userId: number;
  email: string;
  usedBytes: number;
};

export type UploadLeaderEntry = {
  userId: number;
  email: string;
  uploads: number;
};

export type SuspiciousTrafficEntry = {
  userId: number;
  email: string;
  requests: number;
  authErrors: number;
  forbiddens: number;
  uniqueIps: number;
  uniqueAgents: number;
  uniquePaths: number;
  peakRequestsPerMinute: number;
  suspiciousScore: number;
  signals: string[];
};

export type InactiveAccountEntry = {
  userId: number;
  email: string;
  lastActivityAt: string | null;
};

export type MostLoadedFolderEntry = {
  folderId?: string;
  folderName?: string;
  userId?: number;
  email?: string;
  count?: number;
  label?: string;
  value?: number;
};

export type AdminStatistics = {
  periodDays: number;
  generatedAt: string;
  storageUsageTop: StorageUsageEntry[];
  uploadLeaders: UploadLeaderEntry[];
  suspiciousTraffic: SuspiciousTrafficEntry[];
  mostLoadedFolders: MostLoadedFolderEntry[];
  inactiveAccounts: InactiveAccountEntry[];
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
