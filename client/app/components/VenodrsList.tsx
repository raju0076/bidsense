"use client";

import { useState } from "react";

export default function VendorsList() {
  const [search, setSearch] = useState("");

  const vendors = [
    { id: 1, name: "ABC Supplies", email: "abc@gmail.com", category: "IT Hardware" },
    { id: 2, name: "TechNova Distributors", email: "contact@technova.com", category: "Electronics" },
    { id: 3, name: "OfficeGear Plus", email: "sales@officegear.com", category: "Office Furniture" },
  ];

  const filtered = vendors.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      
      <div className="flex justify-between items-center mt-8">
        <h1 className="text-3xl text-[#3c3c3c] font-semibold">Vendors</h1>

        <a
          href="/vendors/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
        >
          + Add Vendor
        </a>
      </div>

      <div className="mb-6">
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search vendors..."
          className="w-80 p-3 border rounded-lg bg-white text-black"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-600 text-white text-left">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Category</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((vendor) => (
              <tr
                key={vendor.id}
                className="border-b hover:bg-blue-50 transition"
              >
                <td className="p-4 text-black font-medium">{vendor.name}</td>
                <td className="p-4 text-black">{vendor.email}</td>
                <td className="p-4 text-black">{vendor.category}</td>
                <td className="p-4">
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-400">
                    View
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-6 text-black">
                  No vendors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
