import { redirect } from "next/navigation";
import { getAuthToken } from "@/shared/lib/auth-server";

export default async function Home() {
  const token = await getAuthToken();
  redirect(token ? "/admin/dashboard" : "/admin/login");
}
