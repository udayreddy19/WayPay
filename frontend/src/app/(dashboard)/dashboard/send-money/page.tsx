"use client";

import { useState } from "react";
import Link from "next/link";

export default function SendMoneyPage() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "confirm">("form");

  const handleSend = async () => {
    setLoading(true);
    try {
      // In production: await api.transfer(recipient, Number(amount), note)
      alert(`Would send ₹${amount} to ${recipient}`);
      setStep("form");
      setRecipient("");
      setAmount("");
      setNote("");
    } catch {
      alert("Transfer failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Link href="/dashboard" className="text-sm text-surface-500 hover:text-primary-500 transition-colors">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold font-[var(--font-heading)] text-surface-900 mt-4">
          Send Money 💸
        </h1>
        <p className="mt-1 text-surface-500">Transfer money to another WayPay user</p>
      </div>

      {step === "form" ? (
        <>
          {/* Recipient */}
          <div className="bg-white rounded-2xl border border-surface-200 p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Recipient Email or Phone
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="email@example.com or +91 XXXXX XXXXX"
                className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-surface-400">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  min="1"
                  className="w-full pl-10 pr-4 py-3 text-xl font-bold font-[var(--font-heading)] rounded-xl bg-surface-50 border border-surface-200 text-surface-900 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">
                Note (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What's this for?"
                className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
              />
            </div>
          </div>

          <button
            onClick={() => setStep("confirm")}
            disabled={!recipient || !amount || Number(amount) < 1}
            className="w-full py-4 rounded-2xl gradient-primary text-white font-semibold text-base shadow-xl shadow-primary-500/25 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Review Transfer
          </button>
        </>
      ) : (
        /* Confirmation Step */
        <div className="space-y-6 animate-slide-up">
          <div className="bg-white rounded-2xl border border-surface-200 p-6">
            <h3 className="text-sm font-medium text-surface-500 mb-4">Transfer Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-surface-600">To</span>
                <span className="font-medium text-surface-900">{recipient}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-600">Amount</span>
                <span className="font-bold text-xl text-surface-900">₹{Number(amount).toLocaleString("en-IN")}</span>
              </div>
              {note && (
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600">Note</span>
                  <span className="font-medium text-surface-900">{note}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep("form")}
              className="flex-1 py-4 rounded-2xl border border-surface-200 text-surface-700 font-semibold hover:bg-surface-50 transition-all"
            >
              Back
            </button>
            <button
              onClick={handleSend}
              disabled={loading}
              className="flex-1 py-4 rounded-2xl gradient-primary text-white font-semibold shadow-xl shadow-primary-500/25 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Sending..." : "Confirm & Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
