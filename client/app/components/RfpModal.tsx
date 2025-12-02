"use client";

import { useEffect, useState } from "react";

type Vendor = {
  id: number;
  name: string;
  email: string;
  category: string;
};

export default function RfpModal({
  text,
  onClose,
}: {
  text: string;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(true);

  const [structuredRfp, setStructuredRfp] = useState<any>(null);

  const [vendors, setVendors] = useState<Vendor[]>([
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
    if (selectedIds.length === vendors.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(vendors.map((v) => v.id));
    }
  };

  // Simulate AI structured generation
  useEffect(() => {
    setTimeout(() => {
      setStructuredRfp({
        title: "Generated RFP",
        items: [
          { name: "Laptop", qty: 20, details: "16GB RAM" },
          { name: "Monitor", qty: 15, details: "27-inch" },
        ],
        budget: 50000,
        deliveryDays: 30,
        paymentTerms: "Net 30",
        warranty: "1 year",
        originalText: text,
      });
      setLoading(false);
    }, 1200); // fake loading
  }, [text]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      {/* Modal box */}
      <div className="bg-white text-black w-full max-w-4xl rounded-xl shadow-xl p-6 relative overflow-y-auto max-h-[90vh]">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black hover:text-red-500 text-xl font-bold"
        >
          ✕
        </button>

        <h1 className="text-2xl font-bold mb-4">Generated RFP</h1>

        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 font-medium">Analyzing procurement request...</p>
          </div>
        ) : (
          <>
            {/* Structured RFP */}
            <div className="border rounded-lg p-4 bg-blue-50 mb-8">
              <h2 className="text-xl font-semibold mb-3">Structured RFP</h2>

              <p className="mb-1"><b>Budget:</b> ${structuredRfp.budget.toLocaleString()}</p>
              <p className="mb-1"><b>Delivery:</b> {structuredRfp.deliveryDays} days</p>
              <p className="mb-1"><b>Payment Terms:</b> {structuredRfp.paymentTerms}</p>
              <p className="mb-3"><b>Warranty:</b> {structuredRfp.warranty}</p>

              <h3 className="font-semibold mb-1">Line Items</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-2 text-left">Item</th>
                    <th className="p-2 text-left">Qty</th>
                    <th className="p-2 text-left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {structuredRfp.items.map((item: any, idx: number) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2">{item.qty}</td>
                      <td className="p-2">{item.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vendor selection */}
            <div className="border rounded-lg p-4 mb-8">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold">Select Vendors</h2>

                <button
                  onClick={toggleAll}
                  className="px-3 py-1 border rounded-md text-sm hover:bg-blue-50"
                >
                  {selectedIds.length === vendors.length ? "Clear All" : "Select All"}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="p-2 text-left">Select</th>
                      <th className="p-2 text-left">Vendor</th>
                      <th className="p-2 text-left">Email</th>
                      <th className="p-2 text-left">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map((v) => (
                      <tr key={v.id} className="border-b">
                        <td className="p-2">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(v.id)}
                            onChange={() => toggleVendor(v.id)}
                          />
                        </td>
                        <td className="p-2 font-medium">{v.name}</td>
                        <td className="p-2">{v.email}</td>
                        <td className="p-2">{v.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Send button */}
            <button
              onClick={() => alert("Sending RFP to vendors... (UI only)")}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 text-lg font-medium"
            >
              Send RFP to Selected Vendors
            </button>
          </>
        )}
      </div>
    </div>
  );
}
