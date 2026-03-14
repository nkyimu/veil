export default function CredentialManagement() {
  const credentials = [
    { type: "Age", status: "stored", commitment: "0x3f8a...b2c1" },
    { type: "Credit Range", status: "stored", commitment: "0x7d2e...a4f9" },
    { type: "Location", status: "not set", commitment: null },
    { type: "Income", status: "not set", commitment: null },
  ];

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-2xl font-bold mb-2">Your Credentials</h2>
        <p className="text-gray-400 text-sm mb-6">
          Store your data as encrypted commitments. Only you and your agent can access the actual values.
        </p>

        <div className="flex flex-col gap-3">
          {credentials.map((cred) => (
            <div
              key={cred.type}
              className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold">{cred.type}</h3>
                {cred.commitment ? (
                  <span className="text-xs text-gray-500 font-mono">
                    Commitment: {cred.commitment}
                  </span>
                ) : (
                  <span className="text-xs text-gray-600">No data stored</span>
                )}
              </div>
              <div>
                {cred.status === "stored" ? (
                  <span className="text-xs bg-veil-900 text-veil-400 px-2 py-1 rounded">
                    Stored
                  </span>
                ) : (
                  <button className="text-xs bg-veil-600 hover:bg-veil-700 text-white px-3 py-1 rounded transition-colors">
                    Store
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h3 className="text-veil-500 font-semibold mb-3">How It Works</h3>
        <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside">
          <li>Store your credentials — your agent encrypts them locally</li>
          <li>Hashed commitments are published onchain (your data stays private)</li>
          <li>Services pay USDC to ask questions about your data</li>
          <li>Your agent answers YES/NO with a ZK proof — never exposing raw data</li>
          <li>You earn revenue from every query</li>
        </ol>
      </section>
    </div>
  );
}
