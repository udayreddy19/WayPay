"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { TransactionData } from "@/types";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionData[]>([
    { id: "1", fromWalletId: "w1", toWalletId: "w2", amount: 1500, currency: "INR", type: "TRANSFER_OUT", status: "COMPLETED", createdAt: "2026-07-08T14:20:00Z" },
    { id: "2", toWalletId: "w1", amount: 5000, currency: "INR", type: "ADD_MONEY", status: "COMPLETED", createdAt: "2026-07-08T15:30:00Z", paymentMethod: "UPI" },
    { id: "3", fromWalletId: "w3", toWalletId: "w2", amount: 800, currency: "INR", type: "TRANSFER_OUT", status: "FAILED", createdAt: "2026-07-08T16:10:00Z" },
  ]);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTxns() {
      try {
        const response = await api.getAdminTransactions();
        if (response.success && response.data.content) {
          setTransactions(response.data.content);
        }
      } catch (err) {
        console.warn("Failed to load live transactions logs, using mock logs:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTxns();
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    const matchType = typeFilter === "ALL" || t.type === typeFilter;
    const matchStatus = statusFilter === "ALL" || t.status === statusFilter;
    return matchType && matchStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-[var(--font-heading)] text-surface-900">
            Global Ledger 💸
          </h1>
          <p className="mt-1 text-sm text-surface-500">Audit system transactions logs and ledger entries</p>
        </div>
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white border border-surface-200 text-xs font-semibold text-surface-700 focus:border-primary-400 outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="ADD_MONEY">Add Money</option>
            <option value="TRANSFER_OUT">Transfer (Out)</option>
            <option value="TRANSFER_IN">Transfer (In)</option>
            <option value="WITHDRAWAL">Withdrawal</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-white border border-surface-200 text-xs font-semibold text-surface-700 focus:border-primary-400 outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-50 border-b border-surface-200 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Source Wallet</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Type</th>
                <th className="p-4">Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 text-sm text-surface-700">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-surface-50/50 transition-colors">
                    <td className="p-4 font-mono text-xs font-medium text-surface-900">
                      {txn.id.slice(0, 8)}...
                    </td>
                    <td className="p-4 font-mono text-xs">
                      {txn.fromWalletId ? `${txn.fromWalletId.slice(0, 8)}...` : "— (External)"}
                    </td>
                    <td className="p-4 font-mono text-xs">
                      {txn.toWalletId ? `${txn.toWalletId.slice(0, 8)}...` : "— (External)"}
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-medium px-2 py-1 rounded bg-surface-100 text-surface-700">
                        {txn.type}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-surface-400">
                      {new Date(txn.createdAt).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-4 font-semibold text-surface-950">
                      ₹{txn.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        txn.status === "COMPLETED"
                          ? "bg-success-50 text-success-600"
                          : txn.status === "PENDING"
                          ? "bg-warning-50 text-warning-500"
                          : "bg-danger-50 text-danger-600"
                      }`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-surface-400">
                    No transactions logs match selected filters.
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
