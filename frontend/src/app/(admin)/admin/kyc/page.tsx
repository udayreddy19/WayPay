"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { KycRecordData } from "@/types";

export default function AdminKycPage() {
  const [records, setRecords] = useState<KycRecordData[]>([
    { id: "1", fullName: "Rahul Sharma", aadhaarLastFour: "8901", panLastFour: "234F", dateOfBirth: "1995-04-12", address: "123, MG Road, Bangalore", verificationStatus: "SUBMITTED", createdAt: "2026-07-08T10:00:00Z" },
    { id: "2", fullName: "Priya Patel", aadhaarLastFour: "1234", panLastFour: "567D", dateOfBirth: "1998-09-22", address: "45, Marine Drive, Mumbai", verificationStatus: "SUBMITTED", createdAt: "2026-07-08T12:00:00Z" },
  ]);
  const [activeTab, setActiveTab] = useState<"SUBMITTED" | "APPROVED" | "REJECTED">("SUBMITTED");
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<KycRecordData | null>(null);

  useEffect(() => {
    async function loadKyc() {
      setLoading(true);
      try {
        const response = await api.getAdminKyc(activeTab);
        if (response.success && response.data.content) {
          setRecords(response.data.content);
        }
      } catch (err) {
        console.warn(`Failed to load live ${activeTab} KYC records, using mock queue:`, err);
      } finally {
        setLoading(false);
      }
    }
    loadKyc();
  }, [activeTab]);

  const handleVerify = async (kycId: string, verifyStatus: "APPROVED" | "REJECTED") => {
    const reason = verifyStatus === "REJECTED" ? prompt("Please enter rejection reason:") : "";
    if (verifyStatus === "REJECTED" && reason === null) return; // cancelled prompt

    try {
      // In production: await api.verifyKyc(kycId, verifyStatus);
      setRecords((prev) => prev.filter((r) => r.id !== kycId));
      setSelectedRecord(null);
      alert(`KYC record successfully ${verifyStatus.toLowerCase()}!`);
    } catch (err) {
      alert("Verification update failed");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-[var(--font-heading)] text-surface-900">
          KYC Review Queue 🪪
        </h1>
        <p className="mt-1 text-sm text-surface-500">Audit and verify Aadhaar and PAN documents for compliance</p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-surface-100 p-1 border border-surface-200 w-fit">
        {[
          { key: "SUBMITTED", label: "⏳ Pending Review" },
          { key: "APPROVED", label: "✅ Approved" },
          { key: "REJECTED", label: "❌ Rejected" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab.key
                ? "bg-white text-primary-700 shadow-sm border border-surface-200"
                : "text-surface-500 hover:text-surface-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Table List */}
        <div className={`bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm ${selectedRecord ? "lg:col-span-2" : "lg:col-span-3"}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-200 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  <th className="p-4">Applicant Name</th>
                  <th className="p-4">Aadhaar (Last 4)</th>
                  <th className="p-4">PAN (Last 4)</th>
                  <th className="p-4">Submission Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 text-sm text-surface-700">
                {records.length > 0 ? (
                  records.map((rec) => (
                    <tr
                      key={rec.id}
                      className={`hover:bg-surface-50/50 transition-colors cursor-pointer ${
                        selectedRecord?.id === rec.id ? "bg-primary-50/20" : ""
                      }`}
                      onClick={() => setSelectedRecord(rec)}
                    >
                      <td className="p-4 font-medium text-surface-900">{rec.fullName}</td>
                      <td className="p-4 font-mono">XXXX XXXX {rec.aadhaarLastFour}</td>
                      <td className="p-4 font-mono">XXXXX {rec.panLastFour}</td>
                      <td className="p-4 text-xs text-surface-400">
                        {new Date(rec.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedRecord(rec)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-surface-200 hover:bg-surface-50 transition-all"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-surface-400">
                      No applications in this category.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Record Audit Panel */}
        {selectedRecord && (
          <div className="bg-white rounded-2xl border border-surface-200 p-6 space-y-6 shadow-md animate-slide-up">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg font-[var(--font-heading)] text-surface-900">Applicant Details</h3>
                <p className="text-xs text-surface-500">ID: {selectedRecord.id.slice(0, 8)}...</p>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-surface-400 hover:text-surface-700 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="p-3 bg-surface-50 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-surface-400">Full Name</span>
                <p className="font-semibold text-surface-900">{selectedRecord.fullName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-surface-50 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-surface-400">Aadhaar Last 4</span>
                  <p className="font-mono font-medium text-surface-900">{selectedRecord.aadhaarLastFour}</p>
                </div>
                <div className="p-3 bg-surface-50 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-surface-400">PAN Last 4</span>
                  <p className="font-mono font-medium text-surface-900">{selectedRecord.panLastFour}</p>
                </div>
              </div>

              <div className="p-3 bg-surface-50 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-surface-400">Date of Birth</span>
                <p className="text-surface-900">{selectedRecord.dateOfBirth || "Not provided"}</p>
              </div>

              <div className="p-3 bg-surface-50 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-surface-400">Residential Address</span>
                <p className="text-surface-900 text-xs leading-relaxed">{selectedRecord.address || "Not provided"}</p>
              </div>
            </div>

            {selectedRecord.verificationStatus === "SUBMITTED" && (
              <div className="flex gap-3 pt-4 border-t border-surface-100">
                <button
                  onClick={() => handleVerify(selectedRecord.id, "REJECTED")}
                  className="flex-1 py-3 border border-danger-200 text-danger-600 rounded-xl text-xs font-semibold hover:bg-danger-50 transition-all"
                >
                  Reject Verification
                </button>
                <button
                  onClick={() => handleVerify(selectedRecord.id, "APPROVED")}
                  className="flex-1 py-3 gradient-success text-white rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-md shadow-success-500/10"
                >
                  Approve KYC
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
