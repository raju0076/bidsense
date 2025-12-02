"use client";

import Link from "next/link";

const dummyRfps = [
  {
    id: "rfp-101",
    title: "Laptops & Monitors for New Office",
    budget: 50000,
    status: "Draft",
    createdAt: "2025-12-02",
  },
  {
    id: "rfp-102",
    title: "Office Chairs & Desks",
    budget: 30000,
    status: "Sent",
    createdAt: "2025-12-01",
  },
];

export default function RfpListPage() {
  return (
    <div className="min-h-screen bg-white text-black px-10 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">RFPs</h1>

        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
        >
          + Create RFP
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="p-4">Title</th>
              <th className="p-4">Budget</th>
              <th className="p-4">Status</th>
              <th className="p-4">Created At</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dummyRfps.map((rfp) => (
              <tr key={rfp.id} className="border-b hover:bg-blue-50 transition">
                <td className="p-4 font-medium">{rfp.title}</td>
                <td className="p-4">${rfp.budget.toLocaleString()}</td>
                <td className="p-4">{rfp.status}</td>
                <td className="p-4">{rfp.createdAt}</td>
                <td className="p-4 flex gap-3">
                  <Link
                    href={`/rfp/${rfp.id}`}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400 text-sm"
                  >
                    View
                  </Link>
                  <Link
                    href={`/compare/${rfp.id}`}
                    className="px-3 py-1 border border-blue-500 text-blue-600 rounded hover:bg-blue-50 text-sm"
                  >
                    Compare
                  </Link>
                </td>
              </tr>
            ))}

            {dummyRfps.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-6">
                  No RFPs created yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
