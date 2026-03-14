export default function QueryLog() {
  const queries = [
    {
      id: 1,
      requester: "0x1234...5678",
      question: "Is user over 18?",
      answer: true,
      payment: "$0.02",
      time: "2 min ago",
    },
    {
      id: 2,
      requester: "0xabcd...ef01",
      question: "Is credit score above 700?",
      answer: true,
      payment: "$0.05",
      time: "15 min ago",
    },
    {
      id: 3,
      requester: "0x9876...5432",
      question: "Is user in the US?",
      answer: false,
      payment: "$0.02",
      time: "1 hour ago",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="text-2xl font-bold mb-2">Query Log</h2>
        <p className="text-gray-400 text-sm mb-6">
          Every time a service asks about your data, it appears here.
          Your agent answers automatically.
        </p>
      </section>

      <div className="flex flex-col gap-3">
        {queries.map((q) => (
          <div
            key={q.id}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 font-mono">
                {q.requester}
              </span>
              <span className="text-xs text-gray-500">{q.time}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{q.question}</p>
                <span
                  className={`text-xs font-semibold ${
                    q.answer ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {q.answer ? "YES" : "NO"}
                </span>
              </div>
              <span className="text-veil-400 font-semibold">{q.payment}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
