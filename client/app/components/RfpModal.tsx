"use client";

import { useEffect, useState } from "react";

type Vendor = {
  id: number;
  name: string;
  email: string;
  category: string;
};

type StructuredRfp = {
  title: string;
  items: { name: string; quantity: number; specs: string }[];
  budget: number;
  deliveryDays: number;
  paymentTerms: string;
  warranty: string;
  originalText: string;
};

export default function RfpModal({
  rfp,
  onClose,
}: {
  rfp: any; 
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [structuredRfp, setStructuredRfp] = useState<StructuredRfp | null>(null);

  const [vendors] = useState<Vendor[]>([
    { id: 1, name: "ABC Supplies", email: "abc@gmail.com", category: "IT Hardware" },
    { id: 2, name: "TechNova Distributors", email: "contact@technova.com", category: "Electronics" },
    { id: 3, name: "OfficeGear Plus", email: "sales@officegear.com", category: "Office Furniture" },
  ]);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleVendor = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelectedIds((prev) =>
      prev.length === vendors.length ? [] : vendors.map((v) => v.id)
    );
  };

  useEffect(() => {
    if (rfp?.structured) {
      setStructuredRfp(rfp.structured);
      setLoading(false);
    }
  }, [rfp]);

  return (
<div className="fixed inset-0 bg-gradient-to-b from-black via-neutral-900 to-neutral-800 backdrop-blur-md flex items-center justify-center z-[999] px-6 animate-fadeIn">
  <div className="bg-neutral-100 text-gray-900 w-full max-w-5xl rounded-2xl shadow-2xl p-8 relative overflow-y-auto max-h-[90vh]">

    <button
      onClick={onClose}
      className="absolute top-5 right-5 text-gray-700 hover:text-rose-600 text-2xl font-extrabold transition"
      aria-label="Close modal"
    >
      ✕
    </button>

    <h1 className="text-3xl font-extrabold mb-6 border-b border-neutral-300 pb-2">
      Generated RFP
    </h1>

    {loading ? (
      <div className="text-center py-16">
        <div className="animate-spin h-12 w-12 border-4 border-rose-500 border-t-transparent rounded-full mx-auto" />
        <p className="mt-6 font-semibold text-lg text-gray-700">Analyzing procurement request...</p>
      </div>
    ) : (
      <>
        {/* STRUCTURED RFP CARD */}
        <div className="border rounded-lg p-6 bg-neutral-50 mb-10 shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-rose-700">Structured RFP</h2>

          <p className="mb-2"><b>Title:</b> {structuredRfp?.title}</p>
          <p className="mb-2"><b>Budget:</b> ${structuredRfp?.budget.toLocaleString()}</p>
          <p className="mb-2"><b>Delivery:</b> {structuredRfp?.deliveryDays} days</p>
          <p className="mb-2"><b>Payment Terms:</b> {structuredRfp?.paymentTerms}</p>
          <p className="mb-6"><b>Warranty:</b> {structuredRfp?.warranty}</p>

          <h3 className="font-semibold mb-3">Line Items</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-rose-700 text-white rounded-t-lg">
                <th className="p-3 text-left">Item</th>
                <th className="p-3 text-center">Quantity</th>
                <th className="p-3 text-left">Specifications</th>
              </tr>
            </thead>
            <tbody>
              {structuredRfp?.items.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-300 hover:bg-rose-100 transition"
                >
                  <td className="p-3">{item.name}</td>
                  <td className="p-3 text-center">{item.quantity}</td>
                  <td className="p-3">{item.specs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* VENDOR SELECTION */}
        <div className="border rounded-lg p-6 mb-10 shadow-md">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-semibold text-gray-800">Select Vendors</h2>
            <button
              onClick={toggleAll}
              className="px-4 py-2 border border-rose-600 text-rose-700 rounded-lg text-sm font-medium hover:bg-rose-100 transition"
              type="button"
            >
              {selectedIds.length === vendors.length ? "Clear All" : "Select All"}
            </button>
          </div>

          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-rose-700 text-white rounded-t-lg">
                <th className="p-3 text-center">Select</th>
                <th className="p-3 text-left">Vendor</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Category</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr
                  key={v.id}
                  className={`border-b border-gray-300 hover:bg-rose-100 transition ${
                    selectedIds.includes(v.id) ? 'bg-rose-100' : ''
                  }`}
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(v.id)}
                      onChange={() => toggleVendor(v.id)}
                      className="w-5 h-5 cursor-pointer"
                    />
                  </td>
                  <td className="p-3 font-medium">{v.name}</td>
                  <td className="p-3">{v.email}</td>
                  <td className="p-3">{v.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SEND BUTTON */}
        <button
          onClick={() => alert("Sending RFP to vendors...")}
          className="w-full py-4 bg-rose-700 text-white rounded-xl hover:bg-rose-600 text-xl font-semibold transition shadow-lg"
          type="button"
        >
          Send RFP to Selected Vendors
        </button>
      </>
    )}
  </div>
</div>



  );
}
