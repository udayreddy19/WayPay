import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg font-[var(--font-heading)]">W</span>
            </div>
            <span className="text-xl font-bold font-[var(--font-heading)] text-surface-900">
              Way<span className="text-primary-500">Pay</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-surface-700 hover:text-primary-500 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-surface-700 hover:text-primary-500 transition-colors">How It Works</a>
            <a href="#security" className="text-sm text-surface-700 hover:text-primary-500 transition-colors">Security</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm font-medium text-surface-700 hover:text-primary-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-5 py-2.5 text-sm font-medium text-white rounded-xl gradient-primary hover:opacity-90 transition-opacity shadow-lg shadow-primary-500/25"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden gradient-mesh min-h-[90vh] flex items-center">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-200 mb-6">
                <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
                <span className="text-xs font-medium text-primary-700">Now Available in India</span>
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold font-[var(--font-heading)] leading-tight text-surface-900">
                Your Money,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-500">
                  Your Way
                </span>
              </h1>

              <p className="mt-6 text-lg text-surface-700 leading-relaxed max-w-lg">
                Send, receive, and manage payments instantly. WayPay makes digital transactions
                effortless with bank-grade security and zero hassle.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/sign-up"
                  className="px-8 py-4 text-base font-semibold text-white rounded-2xl gradient-primary hover:opacity-90 transition-all shadow-xl shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-0.5 text-center"
                >
                  Create Free Account
                </Link>
                <a
                  href="#how-it-works"
                  className="px-8 py-4 text-base font-semibold text-surface-700 rounded-2xl border border-surface-200 hover:border-primary-300 hover:text-primary-600 transition-all text-center"
                >
                  Learn More →
                </a>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 flex items-center gap-8">
                <div>
                  <p className="text-2xl font-bold font-[var(--font-heading)] text-surface-900">10K+</p>
                  <p className="text-xs text-surface-500">Active Users</p>
                </div>
                <div className="w-px h-10 bg-surface-200" />
                <div>
                  <p className="text-2xl font-bold font-[var(--font-heading)] text-surface-900">₹5Cr+</p>
                  <p className="text-xs text-surface-500">Processed</p>
                </div>
                <div className="w-px h-10 bg-surface-200" />
                <div>
                  <p className="text-2xl font-bold font-[var(--font-heading)] text-surface-900">99.9%</p>
                  <p className="text-xs text-surface-500">Uptime</p>
                </div>
              </div>
            </div>

            {/* Right Content — Wallet Card */}
            <div className="animate-slide-up hidden lg:block">
              <div className="relative">
                {/* Glow effect behind card */}
                <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 to-purple-500/20 rounded-3xl blur-2xl" />

                {/* Main card */}
                <div className="relative gradient-primary rounded-3xl p-8 text-white shadow-2xl">
                  <div className="flex justify-between items-start mb-12">
                    <div>
                      <p className="text-sm opacity-70">Available Balance</p>
                      <p className="text-4xl font-bold font-[var(--font-heading)] mt-1">₹24,500.00</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <span className="text-2xl font-bold font-[var(--font-heading)]">W</span>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-8">
                    <button className="flex-1 py-3 rounded-xl bg-white/20 backdrop-blur text-sm font-medium hover:bg-white/30 transition-colors">
                      + Add Money
                    </button>
                    <button className="flex-1 py-3 rounded-xl bg-white/20 backdrop-blur text-sm font-medium hover:bg-white/30 transition-colors">
                      Send Money
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-success-500/30 flex items-center justify-center text-xs">↓</div>
                        <div>
                          <p className="text-sm font-medium">Received from Rahul</p>
                          <p className="text-xs opacity-60">Today, 2:30 PM</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-success-500">+₹2,500</p>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-danger-500/30 flex items-center justify-center text-xs">↑</div>
                        <div>
                          <p className="text-sm font-medium">Sent to Priya</p>
                          <p className="text-xs opacity-60">Yesterday, 6:15 PM</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-danger-500">-₹1,200</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-surface-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold font-[var(--font-heading)] text-surface-900">
              Everything You Need
            </h2>
            <p className="mt-4 text-lg text-surface-600 max-w-2xl mx-auto">
              A complete digital wallet experience designed for the way India pays.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: "💳",
                title: "Add Money Instantly",
                desc: "Add funds via cards, net banking, or UPI. Powered by Stripe for maximum security."
              },
              {
                icon: "⚡",
                title: "Instant Transfers",
                desc: "Send money to anyone in seconds. No delays, no complicated processes."
              },
              {
                icon: "📊",
                title: "Smart Analytics",
                desc: "Track your spending patterns with beautiful visualizations and insights."
              },
              {
                icon: "🔒",
                title: "Bank-Grade Security",
                desc: "256-bit encryption, 2FA, and real-time fraud detection to keep your money safe."
              },
              {
                icon: "📱",
                title: "QR Payments",
                desc: "Generate and scan QR codes for seamless person-to-person payments."
              },
              {
                icon: "📄",
                title: "Transaction History",
                desc: "Detailed records of every transaction with downloadable statements."
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-white border border-surface-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold font-[var(--font-heading)] text-surface-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-surface-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold font-[var(--font-heading)] text-surface-900">
              Get Started in 3 Steps
            </h2>
            <p className="mt-4 text-lg text-surface-600">
              It takes less than 2 minutes to start using WayPay.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Account", desc: "Sign up with your email or phone number. Quick and free." },
              { step: "02", title: "Add Money", desc: "Fund your wallet via card, net banking, or UPI." },
              { step: "03", title: "Start Paying", desc: "Send money, scan QR codes, or pay merchants instantly." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-2xl gradient-primary text-white font-bold text-xl font-[var(--font-heading)] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/25">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold font-[var(--font-heading)] text-surface-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-surface-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto gradient-primary rounded-3xl p-12 lg:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl" />

          <div className="relative">
            <h2 className="text-4xl lg:text-5xl font-bold font-[var(--font-heading)] mb-6">
              Ready to Start?
            </h2>
            <p className="text-lg opacity-80 mb-8 max-w-lg mx-auto">
              Join thousands of users who trust WayPay for their daily payments.
            </p>
            <Link
              href="/sign-up"
              className="inline-block px-10 py-4 text-base font-semibold text-primary-600 bg-white rounded-2xl hover:bg-primary-50 transition-colors shadow-xl"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-surface-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="font-bold font-[var(--font-heading)] text-surface-900">
              Way<span className="text-primary-500">Pay</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-surface-500">
            <a href="#" className="hover:text-primary-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-primary-500 transition-colors">Support</a>
            <a href="#" className="hover:text-primary-500 transition-colors">Contact</a>
          </div>

          <p className="text-sm text-surface-400">
            © 2026 WayPay. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
