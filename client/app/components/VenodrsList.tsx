"use client";

import { useEffect, useState } from "react";
import VendorCreateModal from "./VendorCreateModal";

type Vendor = {
  _id: string;
  name: string;
  email: string;
  category: string;
  phone?: string;
};

export default function VendorsList() {
  const [search, setSearch] = useState("");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [openModal, setOpenModal] = useState(false);

  const fetchVendors = async () => {
    const res = await fetch("http://localhost:3001/api/vendor/getAll-vendors");
    const data = await res.json();
    if (data.success) setVendors(data.vendors);
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const filtered = vendors.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full">
      {openModal && (
        <VendorCreateModal
          onClose={() => setOpenModal(false)}
          refresh={fetchVendors}
        />
      )}

      <div className="flex justify-between items-center mt-8">
        <h1 className="text-3xl text-[#3c3c3c] font-semibold">Vendors</h1>

        <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg"
        >
          + Add Vendor
        </button>
      </div>

      <div className="mb-6">
        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          placeholder="Search vendors..."
          className="w-80 p-3 border rounded-lg bg-white text-black"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-rose-600 text-white text-left">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Category</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((vendor) => (
              <tr key={vendor._id} className="border-b hover:bg-rose-50 transition">
                <td className="p-4 text-black font-medium">{vendor.name}</td>
                <td className="p-4 text-black">{vendor.email}</td>
                <td className="p-4 text-black">{vendor.category}</td>
                <td className="p-4 text-black">{vendor.phone || "—"}</td>
                <td className="p-4">
                  <button className="px-3 py-1 bg-rose-500 text-white rounded hover:bg-rose-400">
                    View
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-6 text-black">
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
