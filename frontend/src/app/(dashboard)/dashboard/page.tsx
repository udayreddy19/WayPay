import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-[var(--font-heading)] text-surface-900">
          Good Evening 👋
        </h1>
        <p className="mt-1 text-surface-500">Here&apos;s your wallet overview</p>
      </div>

      {/* Wallet Card */}
      <div className="relative">
        <div className="absolute -inset-2 bg-gradient-to-r from-primary-500/15 to-purple-500/15 rounded-3xl blur-xl" />
        <div className="relative gradient-primary rounded-2xl p-8 text-white shadow-xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium opacity-70">Available Balance</p>
              <p className="text-4xl font-bold font-[var(--font-heading)] mt-2">₹0.00</p>
              <p className="text-xs opacity-50 mt-1">INR • Indian Rupee</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-2xl font-bold font-[var(--font-heading)]">₹</span>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Link
              href="/dashboard/add-money"
              className="flex-1 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-sm font-medium text-center hover:bg-white/30 transition-all"
            >
              + Add Money
            </Link>
            <Link
              href="/dashboard/send-money"
              className="flex-1 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-sm font-medium text-center hover:bg-white/30 transition-all"
            >
              Send Money
            </Link>
            <button className="flex-1 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-sm font-medium hover:bg-white/30 transition-all">
              Scan QR
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Added", value: "₹0", icon: "💳", color: "bg-primary-50 text-primary-600" },
          { label: "Total Sent", value: "₹0", icon: "↗️", color: "bg-danger-50 text-danger-600" },
          { label: "Total Received", value: "₹0", icon: "↙️", color: "bg-success-50 text-success-600" },
          { label: "Transactions", value: "0", icon: "📊", color: "bg-warning-50 text-warning-500" },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-white border border-surface-200 hover:shadow-md transition-all duration-300"
          >
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-lg mb-3`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold font-[var(--font-heading)] text-surface-900">{stat.value}</p>
            <p className="text-xs text-surface-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-surface-100">
          <h2 className="text-lg font-semibold font-[var(--font-heading)] text-surface-900">
            Recent Transactions
          </h2>
          <Link
            href="/dashboard/transactions"
            className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors"
          >
            View All →
          </Link>
        </div>

        <div className="p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center text-3xl mx-auto mb-4">
            📭
          </div>
          <p className="text-surface-500 font-medium">No transactions yet</p>
          <p className="text-sm text-surface-400 mt-1">Add money to get started</p>
          <Link
            href="/dashboard/add-money"
            className="inline-block mt-4 px-6 py-2.5 text-sm font-medium text-white rounded-xl gradient-primary hover:opacity-90 transition-opacity"
          >
            Add Money
          </Link>
        </div>
      </div>
    </div>
  );
}
