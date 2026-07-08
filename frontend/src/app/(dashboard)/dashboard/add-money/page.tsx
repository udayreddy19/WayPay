"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

const presetAmounts = [100, 500, 1000, 2000, 5000, 10000];

export default function AddMoneyPage() {
  const [activeTab, setActiveTab] = useState<"checkout" | "upi">("upi");
  const [amount, setAmount] = useState<string>("");
  const [vpa, setVpa] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // UPI payment response states
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [qrCodePng, setQrCodePng] = useState<string | null>(null);
  const [hostedInstructionsUrl, setHostedInstructionsUrl] = useState<string | null>(null);

  const handleCheckoutPayment = async () => {
    if (!amount || Number(amount) < 1) return;
    setLoading(true);

    try {
      const response = await api.addMoney(Number(amount));
      if (response.success && response.data.sessionUrl) {
        window.location.href = response.data.sessionUrl;
      } else {
        alert("Failed to initialize checkout session");
      }
    } catch (err: any) {
      alert(err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpiPayment = async () => {
    if (!amount || Number(amount) < 1 || !vpa) return;
    setLoading(true);

    try {
      const response = await api.addMoneyUpi(Number(amount), vpa);
      if (response.success) {
        const data = response.data;
        setPaymentStatus(data.status);
        if (data.qrCodeUrl) setQrCodeUrl(data.qrCodeUrl);
        if (data.qrCodePng) setQrCodePng(data.qrCodePng);
        if (data.hostedInstructionsUrl) setHostedInstructionsUrl(data.hostedInstructionsUrl);
      } else {
        alert("Failed to initiate UPI payment");
      }
    } catch (err: any) {
      alert(err.message || "UPI payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPaymentStatus(null);
    setQrCodeUrl(null);
    setQrCodePng(null);
    setHostedInstructionsUrl(null);
    setAmount("");
    setVpa("");
  };

  return (
    <div className="max-w-lg mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <Link href="/dashboard" className="text-sm text-surface-500 hover:text-primary-500 transition-colors">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold font-[var(--font-heading)] text-surface-900 mt-4">
          Add Money 💳
        </h1>
        <p className="mt-1 text-surface-500">Fund your wallet instantly using UPI or Card</p>
      </div>

      {paymentStatus ? (
        /* UPI Payment Status / QR View */
        <div className="bg-white rounded-2xl border border-surface-200 p-6 space-y-6 text-center animate-slide-up shadow-lg">
          <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center text-2xl mx-auto animate-pulse">
            ⚡
          </div>
          <div>
            <h2 className="text-xl font-bold font-[var(--font-heading)] text-surface-900">
              UPI Payment Initiated
            </h2>
            <p className="text-sm text-surface-500 mt-1">
              Please complete the transaction in your UPI app.
            </p>
          </div>

          <div className="p-4 bg-surface-50 rounded-xl space-y-2 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-surface-500">UPI ID</span>
              <span className="font-mono font-medium text-surface-900">{vpa}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Amount</span>
              <span className="font-bold text-surface-900">₹{Number(amount).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Status</span>
              <span className="font-semibold text-warning-500">{paymentStatus.toUpperCase()}</span>
            </div>
          </div>

          {qrCodePng ? (
            <div className="space-y-4">
              <p className="text-xs text-surface-500 font-medium">Or scan the QR code to pay:</p>
              <div className="inline-block p-4 bg-white border border-surface-200 rounded-2xl shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCodePng} alt="Payment QR Code" className="w-48 h-48 mx-auto" />
              </div>
            </div>
          ) : qrCodeUrl ? (
            <div className="space-y-3">
              <a
                href={qrCodeUrl}
                className="inline-block w-full py-3 rounded-xl gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-all shadow-md"
              >
                Pay via UPI App Link
              </a>
            </div>
          ) : null}

          {hostedInstructionsUrl && (
            <a
              href={hostedInstructionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-primary-600 hover:underline"
            >
              View detailed payment instructions →
            </a>
          )}

          <div className="border-t border-surface-100 pt-6 flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 py-3 rounded-xl border border-surface-200 text-surface-700 text-sm font-semibold hover:bg-surface-50 transition-all"
            >
              Done / Add More
            </button>
            <Link
              href="/dashboard"
              className="flex-1 py-3 rounded-xl gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-all text-center flex items-center justify-center"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      ) : (
        /* Standard Input Flow */
        <>
          {/* Method Selection Tabs */}
          <div className="flex rounded-xl bg-surface-100 p-1 border border-surface-200">
            <button
              onClick={() => setActiveTab("upi")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "upi"
                  ? "bg-white text-primary-700 shadow-sm"
                  : "text-surface-500 hover:text-surface-900"
              }`}
            >
              ⚡ UPI Direct (VPA / QR)
            </button>
            <button
              onClick={() => setActiveTab("checkout")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === "checkout"
                  ? "bg-white text-primary-700 shadow-sm"
                  : "text-surface-500 hover:text-surface-900"
              }`}
            >
              💳 Card / Checkout
            </button>
          </div>

          {/* Amount Input */}
          <div className="bg-white rounded-2xl border border-surface-200 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-3">
                Enter Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-surface-400">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  min="1"
                  className="w-full pl-12 pr-4 py-4 text-3xl font-bold font-[var(--font-heading)] text-surface-900 bg-surface-50 rounded-xl border border-surface-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Preset amounts */}
            <div className="grid grid-cols-3 gap-3">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(String(preset))}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-all ${
                    amount === String(preset)
                      ? "bg-primary-50 text-primary-700 border-2 border-primary-300"
                      : "bg-surface-50 text-surface-600 border border-surface-200 hover:border-primary-300"
                  }`}
                >
                  ₹{preset.toLocaleString("en-IN")}
                </button>
              ))}
            </div>

            {/* UPI ID (VPA) Input */}
            {activeTab === "upi" && (
              <div className="border-t border-surface-100 pt-6 animate-fade-in">
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Enter UPI ID (VPA)
                </label>
                <input
                  type="text"
                  value={vpa}
                  onChange={(e) => setVpa(e.target.value)}
                  placeholder="username@bank (e.g., success@upi)"
                  className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 placeholder:text-surface-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all font-mono"
                />
                <p className="text-[11px] text-surface-400 mt-1">
                  Use <code className="bg-surface-100 px-1 rounded">success@upi</code> or <code className="bg-surface-100 px-1 rounded">fail@upi</code> to simulate Stripe test flows.
                </p>
              </div>
            )}
          </div>

          {/* Payment Summary */}
          {amount && Number(amount) >= 1 && (
            <div className="bg-white rounded-2xl border border-surface-200 p-6 animate-slide-up">
              <h3 className="text-sm font-medium text-surface-500 mb-4">Payment Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600">Amount</span>
                  <span className="font-medium text-surface-900">₹{Number(amount).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-600">Processing Fee</span>
                  <span className="font-medium text-success-500">Free</span>
                </div>
                <div className="border-t border-surface-100 pt-3 flex justify-between">
                  <span className="font-semibold text-surface-900">Total</span>
                  <span className="font-bold text-lg text-surface-900">₹{Number(amount).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={activeTab === "upi" ? handleUpiPayment : handleCheckoutPayment}
            disabled={!amount || Number(amount) < 1 || (activeTab === "upi" && !vpa) || loading}
            className="w-full py-4 rounded-2xl gradient-primary text-white font-semibold text-base shadow-xl shadow-primary-500/25 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Processing...
              </span>
            ) : activeTab === "upi" ? (
              `Pay via UPI • ₹${amount ? Number(amount).toLocaleString("en-IN") : "0"}`
            ) : (
              `Proceed to Checkout • ₹${amount ? Number(amount).toLocaleString("en-IN") : "0"}`
            )}
          </button>

          {/* Security note */}
          <p className="text-xs text-center text-surface-400">
            🔒 Secured by Stripe. UPI payments are processed safely through standard banking gateways.
          </p>
        </>
      )}
    </div>
  );
}
