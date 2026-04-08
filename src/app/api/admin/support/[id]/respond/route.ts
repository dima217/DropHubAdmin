import { adminApi } from "@/shared/api/admin-api";
import { getAuthToken } from "@/shared/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await getAuthToken();
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = (await req.json()) as { response: string };
  await adminApi.respondTicket(token, id, body.response);
  return NextResponse.json({ success: true });
}
