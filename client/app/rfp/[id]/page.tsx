"use client";

import { useState } from "react";

const dummyVendors = [
  { id: 1, name: "ABC Supplies", email: "abc@gmail.com" },
  { id: 2, name: "TechNova Distributors", email: "contact@technova.com" },
  { id: 3, name: "OfficeGear Plus", email: "sales@officegear.com" },
];

const dummyProposals = [
  {
    vendorName: "ABC Supplies",
    totalPrice: 48000,
    deliveryDays: 25,
    warranty: "1 year",
    notes: "Includes installation",
  },
  {
    vendorName: "TechNova Distributors",
    totalPrice: 49500,
    deliveryDays: 20,
    warranty: "2 years",
    notes: "Extended warranty included",
  },
];

export default function RfpDetailPage({ params }: { params: { id: string } }) {
  const [selectedVendorIds, setSelectedVendorIds] = useState<number[]>([]);

  const toggleVendor = (id: number) => {
    setSelectedVendorIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const allSelected = selectedVendorIds.length === dummyVendors.length;

  const toggleAll = () => {
    if (allSelected) {
      setSelectedVendorIds([]);
    } else {
      setSelectedVendorIds(dummyVendors.map((v) => v.id));
    }
  };

  return (
    <div className="min-h-screen bg-white text-black px-10 py-8">
      <h1 className="text-3xl font-semibold mb-4">
        RFP Details – {params.id}
      </h1>

      {/* RFP summary */}
      <div className="border rounded-lg p-5 mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Laptops & Monitors for New Office
        </h2>
        <p className="mb-1">
          <span className="font-medium">Budget:</span> $50,000
        </p>
        <p className="mb-1">
          <span className="font-medium">Delivery:</span> Within 30 days
        </p>
        <p className="mb-4">
          <span className="font-medium">Payment Terms:</span> Net 30
        </p>

        <h3 className="font-semibold mb-2">Line Items</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2 text-left">Item</th>
              <th className="p-2 text-left">Quantity</th>
              <th className="p-2 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">Laptop</td>
              <td className="p-2">20</td>
              <td className="p-2">16GB RAM</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">Monitor</td>
              <td className="p-2">15</td>
              <td className="p-2">27-inch</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Vendor selection */}
      <div className="border rounded-lg p-5 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Select Vendors</h2>
          <button
            onClick={toggleAll}
            className="px-3 py-1 border rounded-lg text-sm"
          >
            {allSelected ? "Clear All" : "Select All"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-2 text-left">Select</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {dummyVendors.map((vendor) => (
                <tr key={vendor.id} className="border-b">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedVendorIds.includes(vendor.id)}
                      onChange={() => toggleVendor(vendor.id)}
                    />
                  </td>
                  <td className="p-2">{vendor.name}</td>
                  <td className="p-2">{vendor.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
          Send RFP to Selected Vendors (UI only)
        </button>
      </div>

      {/* Proposals list */}
      <div className="border rounded-lg p-5">
        <h2 className="text-xl font-semibold mb-4">Vendor Proposals</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-2 text-left">Vendor</th>
                <th className="p-2 text-left">Total Price</th>
                <th className="p-2 text-left">Delivery (days)</th>
                <th className="p-2 text-left">Warranty</th>
                <th className="p-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              {dummyProposals.map((p, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-2">{p.vendorName}</td>
                  <td className="p-2">${p.totalPrice.toLocaleString()}</td>
                  <td className="p-2">{p.deliveryDays}</td>
                  <td className="p-2">{p.warranty}</td>
                  <td className="p-2">{p.notes}</td>
                </tr>
              ))}

              {dummyProposals.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-6">
                    No proposals received yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
