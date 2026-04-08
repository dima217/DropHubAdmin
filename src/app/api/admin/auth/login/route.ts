import { env } from "@/shared/config/env";
import { NextRequest, NextResponse } from "next/server";

type LoginResponse = {
  accessToken?: string;
  token?: string;
  access_token?: string;
};

function pickToken(payload: LoginResponse) {
  return payload.accessToken ?? payload.token ?? payload.access_token ?? "";
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

  const payload = (await upstream.json()) as LoginResponse;
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
