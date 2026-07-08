"use client";

import { useState } from "react";
import Link from "next/link";

export default function KycPage() {
  const [aadhaar, setAadhaar] = useState("");
  const [pan, setPan] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In production: await api.submitKyc({ aadhaar, pan, fullName, dateOfBirth: dob, address })
      setSubmitted(true);
    } catch {
      alert("KYC submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-success-50 flex items-center justify-center text-4xl mx-auto mb-6">
          ✅
        </div>
        <h1 className="text-3xl font-bold font-[var(--font-heading)] text-surface-900">
          KYC Submitted!
        </h1>
        <p className="mt-3 text-surface-500 max-w-md mx-auto">
          Your documents are being verified. This usually takes 24-48 hours. We&apos;ll notify you once done.
        </p>
        <Link
          href="/dashboard"
          className="inline-block mt-8 px-8 py-3 rounded-xl gradient-primary text-white font-medium hover:opacity-90 transition-opacity"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Link href="/dashboard" className="text-sm text-surface-500 hover:text-primary-500 transition-colors">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold font-[var(--font-heading)] text-surface-900 mt-4">
          KYC Verification 🪪
        </h1>
        <p className="mt-1 text-surface-500">Complete your identity verification to unlock all features</p>
      </div>

      {/* Info Banner */}
      <div className="p-4 rounded-xl bg-primary-50 border border-primary-200">
        <div className="flex gap-3">
          <span className="text-lg">ℹ️</span>
          <div>
            <p className="text-sm font-medium text-primary-800">Why KYC?</p>
            <p className="text-xs text-primary-600 mt-0.5">
              KYC verification is required by RBI regulations. Your data is encrypted and securely stored.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-surface-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Full Name (as on documents)</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Enter your full name"
            className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Aadhaar Number</label>
          <input
            type="text"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))}
            required
            placeholder="XXXX XXXX XXXX"
            maxLength={12}
            className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all font-mono tracking-wider"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">PAN Number</label>
          <input
            type="text"
            value={pan}
            onChange={(e) => setPan(e.target.value.toUpperCase().slice(0, 10))}
            required
            placeholder="ABCDE1234F"
            maxLength={10}
            className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all font-mono tracking-wider"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 mb-1.5">Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            placeholder="Enter your residential address"
            className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={!aadhaar || !pan || !fullName || aadhaar.length !== 12 || pan.length !== 10 || loading}
          className="w-full py-4 rounded-2xl gradient-primary text-white font-semibold text-base shadow-xl shadow-primary-500/25 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit KYC"}
        </button>
      </form>

      <p className="text-xs text-center text-surface-400">
        🔒 Your documents are encrypted with AES-256 and stored securely.
      </p>
    </div>
  );
}
