'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";


type AIComparisonRow = {
  vendorName?: string;
  strengths?: string[];
  risks?: string[];
  overallScore?: number;
};

type AICompareResponse = {
  recommendedVendor?: string;
  reason?: string;
  comparison?: AIComparisonRow[];
};


export default function ComparePage() {
  const params = useParams();
  const rfpId = params?.id as string | undefined;

  const [data, setData] = useState<AICompareResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!rfpId) {
      setLoading(false);
      return;
    }

    const fetchAIComparison = async () => {
      try {
        console.log("Fetching AI comparison for:", rfpId);

        const res = await axios.post(
          `http://localhost:3001/api/ai/compare-proposals/${rfpId}`,
          {},
          {
            headers: { "Content-Type": "application/json" },
            timeout: 60000, 
          }
        );

        setData(res?.data?.data ?? null);
      } catch (err) {
        console.error("AI comparison fetch failed:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAIComparison();
  }, [rfpId]);

if (loading) {
  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-900 px-10 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Compare Proposals</h1>
          <p className="text-gray-600 mt-1">
            AI-powered vendor comparison and recommendation
          </p>
        </div>

        <div className="flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-sm border p-10 w-full max-w-xl text-center">
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
            </div>

            <h2 className="text-lg font-semibold mb-2">
              AI is analyzing proposals…
            </h2>

            <p className="text-sm text-gray-600">
              Comparing pricing, delivery timelines, warranties,
              and potential risks to identify the best vendor.
            </p>

            <div className="mt-6 space-y-3">
              <div className="h-3 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6 mx-auto" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-4/6 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


  if (!rfpId) {
    return <div className="p-10 text-red-500">Invalid RFP ID</div>;
  }

  if (!data) {
    return <div className="p-10 text-red-500">No comparison data found</div>;
  }

  const comparison = data?.comparison ?? [];

  return (
   <div className="min-h-screen bg-gray-50 text-gray-900 px-10 py-8">
  {/* Header */}
  <div className="mb-8">
    <h1 className="text-3xl font-bold">
      Compare Proposals
    </h1>
    <p className="text-gray-600 mt-1">
      AI-powered vendor comparison and recommendation
    </p>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    {/* ===== Comparison Table Card ===== */}
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">
          Proposal Comparison
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-xs uppercase">
              <th className="p-4 text-left">Vendor</th>
              <th className="p-4 text-left">Strengths</th>
              <th className="p-4 text-left">Risks</th>
              <th className="p-4 text-center">Score</th>
            </tr>
          </thead>

          <tbody>
            {comparison.length > 0 ? (
              comparison.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-4 font-medium">
                    {row?.vendorName || "N/A"}
                  </td>

                  <td className="p-4">
                    <ul className="list-disc ml-4 space-y-1 text-gray-700">
                      {row?.strengths?.length
                        ? row.strengths.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))
                        : <span className="text-gray-400">—</span>}
                    </ul>
                  </td>

                  <td className="p-4">
                    <ul className="list-disc ml-4 space-y-1 text-red-600">
                      {row?.risks?.length
                        ? row.risks.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))
                        : <span className="text-gray-400">—</span>}
                    </ul>
                  </td>

                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      {row?.overallScore ?? "N/A"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-gray-500"
                >
                  No AI comparison available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* ===== AI Recommendation Card ===== */}
    <div className="bg-white rounded-xl shadow-sm border p-6 flex flex-col">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span className="text-green-600">✔</span>
        AI Recommendation
      </h2>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Recommended Vendor
        </p>
        <p className="text-xl font-bold text-blue-700">
          {data?.recommendedVendor || "N/A"}
        </p>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed flex-1">
        {data?.reason || "No AI explanation provided."}
      </p>

      <button className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
        Accept Recommendation
      </button>
    </div>
  </div>
</div>

  );
}
