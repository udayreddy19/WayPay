"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { UserData } from "@/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([
    { id: "1", name: "Rahul Sharma", email: "rahul@gmail.com", phone: "+91 9876543210", status: "ACTIVE", kycStatus: "APPROVED", createdAt: "2026-07-01T10:00:00Z" },
    { id: "2", name: "Priya Patel", email: "priya@gmail.com", phone: "+91 9999988888", status: "ACTIVE", kycStatus: "PENDING", createdAt: "2026-07-02T12:30:00Z" },
    { id: "3", name: "Aarav Singh", email: "aarav@gmail.com", phone: "+91 9888877777", status: "SUSPENDED", kycStatus: "REJECTED", createdAt: "2026-07-03T15:15:00Z" },
  ]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await api.getAdminUsers();
        if (response.success && response.data.content) {
          setUsers(response.data.content);
        }
      } catch (err) {
        console.warn("Failed to load live users list, using mock registry:", err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const confirmed = window.confirm(`Are you sure you want to change user status to ${nextStatus}?`);
    if (!confirmed) return;

    try {
      // In production: await api.updateUserStatus(userId, nextStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-[var(--font-heading)] text-surface-900">
            Users Registry 👥
          </h1>
          <p className="mt-1 text-sm text-surface-500">Search and manage platform customer accounts</p>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">🔍</span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-80 pl-9 pr-4 py-2.5 rounded-xl border border-surface-200 bg-white text-sm text-surface-900 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-50 border-b border-surface-200 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Registration</th>
                <th className="p-4">KYC Status</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 text-sm text-surface-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-50/50 transition-colors">
                    <td className="p-4 font-medium text-surface-900">{user.name}</td>
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="text-xs text-surface-400">{user.phone || "No phone"}</p>
                        <p className="font-mono text-xs">{user.email}</p>
                      </div>
                    </td>
                    <td className="p-4 text-xs text-surface-500">
                      {new Date(user.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.kycStatus === "APPROVED"
                          ? "bg-success-50 text-success-600"
                          : user.kycStatus === "PENDING" || user.kycStatus === "SUBMITTED"
                          ? "bg-warning-50 text-warning-500 animate-pulse"
                          : "bg-danger-50 text-danger-600"
                      }`}>
                        {user.kycStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.status === "ACTIVE"
                          ? "bg-success-50 text-success-600"
                          : "bg-danger-50 text-danger-600"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          user.status === "ACTIVE"
                            ? "border-danger-200 text-danger-600 hover:bg-danger-50"
                            : "border-success-200 text-success-600 hover:bg-success-50"
                        }`}
                      >
                        {user.status === "ACTIVE" ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-surface-400">
                    No customers found matching search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
