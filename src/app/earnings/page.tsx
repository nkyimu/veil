export default function EarningsDashboard() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-2xl font-bold mb-2">Earnings</h2>
        <p className="text-gray-400 text-sm">
          Your data, your revenue. Every query earns you USDC.
        </p>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
          <p className="text-3xl font-bold text-veil-400">$0.09</p>
          <p className="text-xs text-gray-500 mt-1">Pending Revenue</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
          <p className="text-3xl font-bold text-white">$1.24</p>
          <p className="text-xs text-gray-500 mt-1">Total Earned</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
          <p className="text-3xl font-bold text-white">47</p>
          <p className="text-xs text-gray-500 mt-1">Total Queries</p>
        </div>
      </div>

      {/* Withdraw */}
      <div className="bg-gray-900 border border-veil-700 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-400 mb-3">
          Withdraw your pending revenue to your wallet
        </p>
        <button className="bg-veil-600 hover:bg-veil-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
          Withdraw $0.09 USDC
        </button>
        <p className="text-xs text-gray-600 mt-2">Base Mainnet • Gas ~$0.004</p>
      </div>

      {/* Revenue breakdown */}
      <section>
        <h3 className="text-lg font-semibold mb-3">Revenue by Credential Type</h3>
        <div className="flex flex-col gap-2">
          {[
            { type: "Age", queries: 28, earned: "$0.56" },
            { type: "Credit Range", queries: 12, earned: "$0.60" },
            { type: "Location", queries: 7, earned: "$0.08" },
          ].map((item) => (
            <div
              key={item.type}
              className="bg-gray-900 border border-gray-800 rounded-lg p-3 flex items-center justify-between"
            >
              <span className="text-sm">{item.type}</span>
              <div className="flex gap-4 text-sm">
                <span className="text-gray-500">{item.queries} queries</span>
                <span className="text-veil-400 font-semibold">{item.earned}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
