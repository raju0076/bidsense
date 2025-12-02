const dummyComparison = [
  {
    vendorName: "ABC Supplies",
    totalPrice: 48000,
    deliveryDays: 25,
    warranty: "1 year",
    score: 8.4,
  },
  {
    vendorName: "TechNova Distributors",
    totalPrice: 49500,
    deliveryDays: 20,
    warranty: "2 years",
    score: 9.1,
  },
];

export default function ComparePage({
  params,
}: {
  params: { rfpId: string };
}) {
  return (
    <div className="min-h-screen bg-white text-black px-10 py-8">
      <h1 className="text-3xl font-semibold mb-4">
        Compare Proposals – {params.rfpId}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 border rounded-lg p-5">
          <h2 className="text-xl font-semibold mb-4">Proposal Comparison</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="p-2 text-left">Vendor</th>
                  <th className="p-2 text-left">Total Price</th>
                  <th className="p-2 text-left">Delivery (days)</th>
                  <th className="p-2 text-left">Warranty</th>
                  <th className="p-2 text-left">Score</th>
                </tr>
              </thead>
              <tbody>
                {dummyComparison.map((row, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{row.vendorName}</td>
                    <td className="p-2">${row.totalPrice.toLocaleString()}</td>
                    <td className="p-2">{row.deliveryDays}</td>
                    <td className="p-2">{row.warranty}</td>
                    <td className="p-2 font-semibold">{row.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI recommendation panel */}
        <div className="border rounded-lg p-5 bg-blue-50">
          <h2 className="text-xl font-semibold mb-3">AI Recommendation</h2>
          <p className="mb-3">
            <span className="font-medium">Recommended Vendor:</span>{" "}
            TechNova Distributors
          </p>
          <p className="text-sm leading-relaxed">
            TechNova offers a slightly higher price than ABC Supplies, but
            provides faster delivery (20 days vs 25 days) and a longer warranty
            period of 2 years. Based on the combination of cost, delivery time,
            and risk reduction through extended warranty, TechNova achieves the
            highest overall score.
          </p>

          <button className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 w-full">
            Accept Recommendation (UI only)
          </button>
        </div>
      </div>
    </div>
  );
}
