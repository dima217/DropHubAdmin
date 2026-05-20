import { env } from "@/shared/config/env";
import { NextRequest, NextResponse } from "next/server";

function pickToken(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";

  const root = payload as Record<string, unknown>;
  const direct = root.accessToken ?? root.token ?? root.access_token;
  if (typeof direct === "string" && direct.trim()) return direct;

  const nested = root.data;
  if (nested && typeof nested === "object") {
    const data = nested as Record<string, unknown>;
    const nestedToken = data.accessToken ?? data.token ?? data.access_token;
    if (typeof nestedToken === "string" && nestedToken.trim()) return nestedToken;
  }

  return "";
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { email: string; password: string };

  const upstream = await fetch(`${env.apiBaseUrl}${env.authLoginPath}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!upstream.ok) {
    const message = await upstream.text();
    return NextResponse.json({ message: message || "Login failed" }, { status: upstream.status });
  }

  const payload: unknown = await upstream.json();
  const token = pickToken(payload);
  if (!token) {
    return NextResponse.json({ message: "Token is missing in auth response" }, { status: 502 });
  }

  const res = NextResponse.json({ success: true });
  res.cookies.set("accessToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
