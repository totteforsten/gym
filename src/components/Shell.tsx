"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Dumbbell,
  ListChecks,
  LineChart,
  User,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/library", label: "Exercises", icon: Dumbbell },
  { href: "/programs", label: "Programs", icon: ListChecks },
  { href: "/progress", label: "Progress", icon: LineChart },
  { href: "/profile", label: "Profile", icon: User },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1500px]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[var(--color-border)] px-4 py-6 lg:flex">
        <Brand />
        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "text-white"
                    : "text-[var(--color-muted)] hover:text-white"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl border border-[rgba(139,92,246,0.35)] bg-[rgba(139,92,246,0.12)]"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <item.icon className="relative z-10 h-[18px] w-[18px]" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="card mt-4 p-4">
          <p className="text-xs font-medium text-[var(--color-muted)]">
            Focus program
          </p>
          <p className="mt-1 text-sm font-semibold">Hip Rehab Foundations</p>
          <Link
            href="/programs"
            className="mt-3 inline-flex text-xs font-semibold text-[var(--color-brand)] hover:underline"
          >
            View programs →
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col pb-24 lg:pb-0">
        {children}
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[rgba(8,9,13,0.9)] backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-md items-stretch justify-around px-1.5 py-1.5">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-semibold transition-colors ${
                  active ? "text-[var(--color-brand)]" : "text-[var(--color-muted)]"
                }`}
              >
                <span
                  className={`grid h-8 w-full max-w-[3.5rem] place-items-center rounded-xl transition-colors ${
                    active ? "bg-[rgba(139,92,246,0.14)]" : ""
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2.5 px-1">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-2)] shadow-lg shadow-[rgba(139,92,246,0.4)]">
        <Activity className="h-5 w-5 text-white" />
      </span>
      <div className="leading-tight">
        <p className="text-[15px] font-extrabold tracking-tight">Atlas</p>
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Rehab & Train
        </p>
      </div>
    </Link>
  );
}
