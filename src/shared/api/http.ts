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
  timeoutMs?: number;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const { timeoutMs = 8000 } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${env.apiBaseUrl}${path}`, {
      method: options.method ?? "GET",
      cache: options.cache ?? "no-store",
      signal: controller.signal,
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
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new ApiError(`Backend timeout (${timeoutMs}ms) — проверь NEXT_PUBLIC_API_BASE_URL в .env.local`, 504);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
