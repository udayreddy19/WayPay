"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("user@waypay.in");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate instant mock sign in
    setTimeout(() => {
      localStorage.setItem("mock_auth", "true");
      localStorage.setItem("mock_user_email", email);
      router.push("/dashboard");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-surface-200 p-8 space-y-6 shadow-xl shadow-surface-200/50 animate-fade-in">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg font-[var(--font-heading)]">W</span>
            </div>
            <span className="text-2xl font-bold font-[var(--font-heading)] text-surface-900">
              Way<span className="text-primary-500">Pay</span>
            </span>
          </Link>
          <h2 className="text-2xl font-bold font-[var(--font-heading)] text-surface-900 mt-6">
            Welcome Back
          </h2>
          <p className="text-sm text-surface-500 mt-1">Sign in to manage your wallet</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-surface-50 border border-surface-200 text-surface-900 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-surface-600">
              <input type="checkbox" defaultChecked className="rounded border-surface-300 text-primary-600 focus:ring-primary-500" />
              Remember me
            </label>
            <a href="#" className="text-primary-600 hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl gradient-primary text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-center text-surface-600">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="text-primary-600 font-semibold hover:underline">
            Sign up
          </Link>
        </p>

        {/* Demo Tip */}
        <div className="p-4 rounded-xl bg-primary-50 border border-primary-100 text-xs text-primary-700 leading-relaxed text-center">
          💡 <strong>Demo Mode:</strong> Click <strong>Sign In</strong> to log in with a pre-configured test account instantly.
        </div>
      </div>
    </div>
  );
}
