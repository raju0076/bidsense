'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BASE_URL } from "@/app/apiEndpoints";



export default function ProposalDetails() {
  const { id } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`${BASE_URL}api/proposals/single-proposal/${id}`)
      .then((res) => res.json())
      .then((json) => setProposal(json?.data || null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="p-10 text-gray-600">Loading proposal...</div>;
  }

  if (!proposal) {
    return <div className="p-10 text-red-500">Proposal not found</div>;
  }

  const {
    vendor = {},
    items = [],
    pricingSummary = {},
    commercialTerms = {},
    responseContent = {},
    status,
    rfpId,
  } = proposal;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Vendor Proposal
            </h1>
            <p className="text-gray-600">
              RFP ID: {rfpId || "N/A"}
            </p>
          </div>

          <span className="px-4 py-1 rounded-full bg-green-100 text-green-700 font-medium">
            {status || "UNKNOWN"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        {/* Vendor Info */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-lg mb-3 text-gray-800">
            Vendor Information
          </h2>
          <p className="text-gray-800">
            <strong>Name:</strong> {vendor?.name || "N/A"}
          </p>
          <p className="text-gray-800">
            <strong>Email:</strong> {vendor?.email || "N/A"}
          </p>
        </div>

        {/* Proposal Letter */}
        <div className="bg-white rounded-xl shadow-sm border p-6 flex justify-between items-center">
          <div>
            <h2 className="font-semibold text-lg text-gray-800">
              Vendor Proposal Letter
            </h2>
            <p className="text-gray-600 text-sm">
              View original proposal email sent by vendor
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            View Proposal Content
          </button>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-lg mb-4 text-gray-800">
            Item-wise Pricing
          </h2>

          <table className="w-full border text-gray-800">
            <thead className="bg-gray-50 text-gray-700">
              <tr>
                <th className="border p-3 text-left">Item</th>
                <th className="border p-3 text-center">Qty</th>
                <th className="border p-3 text-center">Unit Price</th>
                <th className="border p-3 text-center">Total</th>
              </tr>
            </thead>

            <tbody>
              {items.length > 0 ? (
                items.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="border p-3">{item?.name || "N/A"}</td>
                    <td className="border p-3 text-center">
                      {item?.quantityQuoted ?? "—"}
                    </td>
                    <td className="border p-3 text-center">
                      ₹{item?.pricing?.unitPrice?.toLocaleString?.() || "—"}
                    </td>
                    <td className="border p-3 font-semibold text-center">
                      ₹{item?.pricing?.total?.toLocaleString?.() || "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-center text-gray-500">
                    No item pricing available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pricing Summary */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-lg mb-3 text-gray-800">
            Pricing Summary
          </h2>
          <p className="text-gray-700">
            Subtotal: ₹{pricingSummary?.subTotal?.toLocaleString?.() || "N/A"}
          </p>
          <p className="text-xl font-bold text-green-700 mt-2">
            Grand Total: ₹{pricingSummary?.grandTotal?.toLocaleString?.() || "N/A"}
          </p>
        </div>

        {/* Commercial Terms */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold text-lg mb-3 text-gray-800">
            Commercial Terms
          </h2>
          <ul className="space-y-1 text-gray-700">
            <li>
              <strong>Payment:</strong> {commercialTerms?.paymentTerms || "N/A"}
            </li>
            <li>
              <strong>Warranty:</strong> {commercialTerms?.warranty || "N/A"}
            </li>
            <li>
              <strong>Validity:</strong> {commercialTerms?.quoteValidity || "N/A"}
            </li>
          </ul>
        </div>
      </div>

      {/* Proposal Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="font-semibold text-lg text-gray-800">
                Proposal Content
              </h3>
              <button
                onClick={() => setOpenModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh] text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
              {responseContent?.rawText || "No proposal content available"}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
