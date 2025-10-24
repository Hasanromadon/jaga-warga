"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";

// Dual-tone SVG icons (restored from original design)
const DualToneDashboard = ({ active }: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={active ? "#3973C4" : "#E0EDFF"} />
    <rect
      x="7"
      y="7"
      width="10"
      height="6"
      rx="1"
      fill={active ? "#fff" : "#3973C4"}
    />
    <rect
      x="9"
      y="9"
      width="2"
      height="2"
      rx="1"
      fill={active ? "#3973C4" : "#E0EDFF"}
    />
    <rect
      x="13"
      y="9"
      width="2"
      height="2"
      rx="1"
      fill={active ? "#3973C4" : "#E0EDFF"}
    />
  </svg>
);
const DualToneBadgeCheck = ({ active }: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={active ? "#3973C4" : "#E0EDFF"} />
    <path
      d="M8 12.5l2.5 2.5 5-5"
      stroke={active ? "#fff" : "#3973C4"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const DualToneClock = ({ active }: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={active ? "#3973C4" : "#E0EDFF"} />
    <rect
      x="11"
      y="7"
      width="2"
      height="6"
      rx="1"
      fill={active ? "#fff" : "#3973C4"}
    />
    <rect
      x="11"
      y="12"
      width="5"
      height="2"
      rx="1"
      fill={active ? "#fff" : "#3973C4"}
    />
  </svg>
);
const DualToneUser = ({ active }: { active?: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill={active ? "#3973C4" : "#E0EDFF"} />
    <circle cx="12" cy="10" r="3" fill={active ? "#fff" : "#3973C4"} />
    <path
      d="M6 20c0-3.5 2.7-6.5 6-6.5s6 3 6 6.5"
      stroke={active ? "#fff" : "#3973C4"}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    {
      key: "dashboard",
      label: "Dashboard",
      to: "/dashboard",
      icon: DualToneDashboard,
    },
    {
      key: "konfirmasi",
      label: "Konfirmasi",
      to: "/dashboard/konfirmasi",
      icon: DualToneBadgeCheck,
    },
    {
      key: "laporan",
      label: "Laporan",
      to: "/dashboard/laporan",
      icon: DualToneClock,
    },
    {
      key: "profil",
      label: "Profil",
      to: "/dashboard/profil",
      icon: DualToneUser,
    },
  ];

  return (
    <RequireAuth allowedRoles={["admin"]}>
      <main className="min-h-screen flex flex-col items-center pb-10">
        <div className="w-full max-w-sm bg-gradient-to-b from-blue-100 to-white p-4 min-h-screen sm:border sm:rounded-md">
          <div className="w-full">
            <div className="min-h-[200px]">{children}</div>
          </div>

          <nav
            className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-2"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
          >
            <div className="flex justify-between bg-white/95 shadow-xl rounded-xl border border-blue-100 overflow-hidden backdrop-blur supports-[backdrop-filter]:bg-white/80 animate-fade-in">
              {tabs.map((t) => {
                const isActive =
                  t.key === "dashboard"
                    ? pathname === "/dashboard"
                    : pathname?.endsWith(`/${t.key}`);

                return (
                  <Link
                    key={t.key}
                    href={t.to}
                    className={`group flex-1 flex flex-col items-center py-1.5 px-1 transition-all duration-200 border-b-2 ${
                      isActive
                        ? "text-blue-700 border-blue-600 font-bold bg-blue-50/60"
                        : "text-blue-900 border-transparent hover:bg-blue-50/40"
                    }`}
                    style={{ minWidth: 0 }}
                  >
                    <span className="relative">
                      {t.icon ? (
                        // icon is a dual-tone component that accepts `active` prop
                        (() => {
                          const Icon = t.icon as React.ComponentType<{
                            active?: boolean;
                          }>;
                          return <Icon active={!!isActive} />;
                        })()
                      ) : (
                        <span className="w-6 h-6 inline-block" />
                      )}
                    </span>
                    <span className="text-xs leading-tight">{t.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </main>
    </RequireAuth>
  );
}
