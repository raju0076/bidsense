"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type RFP = {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
  structured?: {
    budget?: number;
  };
};

export default function RfpListPage() {
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRfps = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/rfp/all");
        const data = await res.json();

        if (data.success) {
          setRfps(data.rfps);
        }
      } catch (err) {
        console.error("Failed to fetch RFPs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRfps();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 px-10 py-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight">RFPs</h1>

        <Link
          href="/"
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-sm transition"
        >
          + Create RFP
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl  border border-neutral-300 bg-white">
  <table className="w-full table-fixed">
    <thead>
      <tr className="bg-rose-600 text-white text-sm">
        <th className="p-4 font-semibold text-left w-[40%]">Title</th>
        <th className="p-4 font-semibold text-left w-[15%]">Budget</th>
        <th className="p-4 font-semibold text-left w-[15%]">Status</th>
        <th className="p-4 font-semibold text-left w-[15%]">Created</th>
        <th className="p-4 font-semibold text-center w-[15%]">Actions</th>
      </tr>
    </thead>

    <tbody>
      {rfps.map((rfp, index) => (
        <tr
          key={rfp._id}
          className={`border-b border-neutral-200 ${
            index % 2 === 1 ? "bg-neutral-50" : ""
          } hover:bg-rose-50 transition`}
        >
          <td className="p-4 text-left truncate">{rfp.title}</td>

          <td className="p-4 text-left">
            {rfp.structured?.budget
              ? `$${rfp.structured.budget.toLocaleString()}`
              : "—"}
          </td>

          <td className="p-4 capitalize text-left">{rfp.status}</td>

          <td className="p-4 text-left">
            {new Date(rfp.createdAt).toLocaleDateString()}
          </td>

          <td className="p-4 flex justify-center gap-3">
            <Link
              href={`/rfp/${rfp._id}`}
              className="px-3 py-1 bg-rose-500 text-white rounded-lg hover:bg-rose-400 text-sm"
            >
              View
            </Link>

            <Link
              href={`/compare/${rfp._id}`}
              className="px-3 py-1 border border-rose-500 text-rose-600 rounded-lg hover:bg-rose-100 text-sm"
            >
              Compare
            </Link>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div>
  );
}
