import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value ?? "";
}

export async function requireAdminToken() {
  const token = await getAuthToken();
  if (!token) redirect("/admin/login");
  return token;
}
