import { adminApi } from "@/shared/api/admin-api";
import { getAuthToken } from "@/shared/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = await getAuthToken();
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as { itemId: string; newParentId?: string | null };
  await adminApi.restoreDeletedStructure(token, body);
  return NextResponse.json({ success: true });
}
