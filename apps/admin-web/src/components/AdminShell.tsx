"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getStoredRefreshToken, setUnauthenticated } from "@/store/authSlice";
import { useLogoutMutation } from "@/store/api";
import {
  BottleIcon,
  CogIcon,
  DropletMark,
  GridIcon,
  LogoutIcon,
  SlideIcon,
  TagIcon,
  UserIcon,
} from "./icons";

const NAV = [
  { label: "Dashboard", href: "/dashboard", icon: GridIcon },
  { label: "Categories", href: "/categories", icon: TagIcon },
  { label: "Products", href: "/products", icon: BottleIcon },
  { label: "Hero Content", href: "/content/hero", icon: SlideIcon },
  { label: "CEO Message", href: "/content/ceo", icon: UserIcon },
  { label: "Site Settings", href: "/settings", icon: CogIcon },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const admin = useAppSelector((s) => s.auth.admin);
  const [logout] = useLogoutMutation();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    const refreshToken = getStoredRefreshToken();
    if (refreshToken) {
      try {
        await logout({ refreshToken }).unwrap();
      } catch {
        // ignore network errors; we revoke locally regardless
      }
    }
    dispatch(setUnauthenticated());
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-ink/10 bg-white transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-ink/10 px-5">
          <DropletMark className="h-10 w-10" />
          <div className="leading-none">
            <p className="text-base font-bold tracking-tight text-ink">
              ALSAYED
            </p>
            <p className="text-[0.55rem] font-semibold uppercase tracking-[0.24em] text-brand-600">
              Admin
            </p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active =
              pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-brand-600 text-white"
                    : "text-ink-soft hover:bg-brand-50 hover:text-brand-700"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ink/10 bg-white/90 px-4 backdrop-blur lg:px-8">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink/10 lg:hidden"
          >
            <span className="text-lg">☰</span>
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-ink">
                {admin?.username ?? "Admin"}
              </p>
              <p className="text-xs text-muted">{admin?.email}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-ink/15 px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-red-300 hover:text-red-600"
            >
              <LogoutIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
