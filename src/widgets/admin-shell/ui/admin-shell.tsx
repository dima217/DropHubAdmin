import { PropsWithChildren } from "react";
import { AdminSidebar } from "@/widgets/admin-shell/ui/admin-sidebar";

export function AdminShell({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      <AdminSidebar />
      <main className="min-h-0 min-w-0 flex-1 overflow-auto">
        <div className="w-full px-5 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
          {children}
        </div>
      </main>
    </div>
  );
}
