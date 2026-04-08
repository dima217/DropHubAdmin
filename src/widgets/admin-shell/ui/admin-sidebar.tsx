"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminLogoutButton } from "@/features/auth/ui/admin-logout-button";
import { cn } from "@/shared/lib/cn";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: IconChart },
  { href: "/admin/users", label: "Users", icon: IconUsers },
  { href: "/admin/support", label: "Support", icon: IconLifebuoy },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-auto w-full shrink-0 flex-col border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl md:h-screen md:max-h-screen md:border-b-0 md:border-r md:w-[260px] md:sticky md:top-0">
      <div className="border-b border-slate-800/80 px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
            <span className="text-sm font-bold text-white">DH</span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-white">DropHub</p>
            <p className="text-xs text-slate-500">Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-blue-500/15 text-white ring-1 ring-blue-500/30"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100",
              )}
            >
              <Icon className={cn("size-5 shrink-0", active ? "text-blue-400" : "text-slate-500")} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800/80 p-3">
        <AdminLogoutButton />
      </div>
    </aside>
  );
}

function IconChart({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function IconUsers({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function IconLifebuoy({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}
