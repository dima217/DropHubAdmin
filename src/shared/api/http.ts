import { env } from "@/shared/config/env";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

type Method = "GET" | "POST" | "PATCH";

type RequestOptions = {
  method?: Method;
  token?: string;
  body?: unknown;
  cache?: RequestCache;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    method: options.method ?? "GET",
    cache: options.cache ?? "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new ApiError(text || "API request failed", res.status);
  }

  return (await res.json()) as T;
}
