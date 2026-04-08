import { adminApi } from "@/shared/api/admin-api";
import { getAuthToken } from "@/shared/lib/auth-server";
import { NextResponse } from "next/server";

export async function GET() {
  const token = await getAuthToken();
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const data = await adminApi.getSupportTickets(token);
  return NextResponse.json(data);
}
