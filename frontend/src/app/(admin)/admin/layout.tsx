"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const adminNavItems = [
  { href: "/admin", label: "Stats Overview", icon: "📊" },
  { href: "/admin/users", label: "Users Registry", icon: "👥" },
  { href: "/admin/kyc", label: "KYC Review Queue", icon: "🪪" },
  { href: "/admin/transactions", label: "Global Ledger", icon: "💸" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Auth protection for demo/prod: check if mock admin or Clerk admin
    const isAuth = localStorage.getItem("mock_auth");
    const role = localStorage.getItem("mock_user_role");
    const email = localStorage.getItem("mock_user_email");

    if (!isAuth || (role !== "ADMIN" && email !== "admin@waypay.in")) {
      router.push("/sign-in");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("mock_auth");
    localStorage.removeItem("mock_user_role");
    localStorage.removeItem("mock_user_email");
    router.push("/sign-in");
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-dark border-b border-surface-800 text-white">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-surface-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="font-bold font-[var(--font-heading)]">
              Way<span className="text-primary-400">Pay</span> Admin
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-danger-500 font-medium px-2 py-1 rounded border border-danger-500/20 hover:bg-danger-500/10"
          >
            Exit
          </button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-surface-950 border-r border-surface-800 text-white z-40 transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-surface-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary-500/20">
              <span className="text-white font-bold text-lg font-[var(--font-heading)]">W</span>
            </div>
            <div>
              <span className="text-xl font-bold font-[var(--font-heading)]">
                Way<span className="text-primary-400">Pay</span>
              </span>
              <span className="block text-[10px] text-primary-400 font-semibold tracking-wider uppercase mt-0.5">Admin Portal</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30"
                    : "text-surface-400 hover:bg-surface-900 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout Profile Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-surface-800 bg-surface-950/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-danger-500/20 text-danger-400 border border-danger-500/30 flex items-center justify-center">
                🛠️
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">Administrator</p>
                <p className="text-[10px] text-surface-400 truncate">admin@waypay.in</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-surface-400 hover:text-danger-500 transition-colors"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
