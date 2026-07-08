import Link from "next/link";

export default function TransactionsPage() {
  // In production, use TanStack Query to fetch from api.getTransactions()
  const transactions: Array<{
    id: string;
    type: string;
    description: string;
    amount: number;
    status: string;
    createdAt: string;
  }> = [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-[var(--font-heading)] text-surface-900">
            Transactions 📊
          </h1>
          <p className="mt-1 text-surface-500">Your complete payment history</p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 rounded-xl bg-white border border-surface-200 text-sm text-surface-700 focus:border-primary-400 outline-none">
            <option>All Types</option>
            <option>Add Money</option>
            <option>Sent</option>
            <option>Received</option>
            <option>Refund</option>
          </select>
          <select className="px-4 py-2 rounded-xl bg-white border border-surface-200 text-sm text-surface-700 focus:border-primary-400 outline-none">
            <option>All Status</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
        {transactions.length > 0 ? (
          <div className="divide-y divide-surface-100">
            {transactions.map((txn) => (
              <div
                key={txn.id}
                className="flex items-center justify-between p-5 hover:bg-surface-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                    txn.type === 'ADD_MONEY' || txn.type === 'TRANSFER_IN'
                      ? 'bg-success-50'
                      : 'bg-danger-50'
                  }`}>
                    {txn.type === 'ADD_MONEY' || txn.type === 'TRANSFER_IN' ? '↓' : '↑'}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-surface-900">{txn.description}</p>
                    <p className="text-xs text-surface-400">{txn.createdAt}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    txn.type === 'ADD_MONEY' || txn.type === 'TRANSFER_IN'
                      ? 'text-success-500'
                      : 'text-danger-500'
                  }`}>
                    {txn.type === 'ADD_MONEY' || txn.type === 'TRANSFER_IN' ? '+' : '-'}₹{txn.amount.toLocaleString("en-IN")}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    txn.status === 'COMPLETED'
                      ? 'bg-success-50 text-success-600'
                      : txn.status === 'PENDING'
                      ? 'bg-warning-50 text-warning-500'
                      : 'bg-danger-50 text-danger-500'
                  }`}>
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center text-3xl mx-auto mb-4">
              📭
            </div>
            <p className="text-surface-500 font-medium">No transactions found</p>
            <p className="text-sm text-surface-400 mt-1">Your transaction history will appear here</p>
            <Link
              href="/dashboard/add-money"
              className="inline-block mt-4 px-6 py-2.5 text-sm font-medium text-white rounded-xl gradient-primary hover:opacity-90 transition-opacity"
            >
              Make Your First Transaction
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
