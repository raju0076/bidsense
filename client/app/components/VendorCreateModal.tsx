"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { BASE_URL } from "../apiEndpoints";

interface VendorCreateModalProps {
  onClose: () => void;
  refresh: () => void;
}

export default function VendorCreateModal({ onClose, refresh }: VendorCreateModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}api/vendor/create-vendors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Vendor created successfully!");
        refresh();
        onClose();
      }
    } catch (error) {
      console.error("Vendor creation error:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="bg-white w-full max-w-md rounded-2xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-rose-600 text-xl font-bold hover:cursor-pointer"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-neutral-900">Add New Vendor</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border text-[#3c3c3c] p-3 rounded-lg"
            placeholder="Vendor Name"
          />

          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border text-[#3c3c3c] p-3 rounded-lg"
            placeholder="vendor@example.com"
          />

          <input
            required
            type="text"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border p-3 text-[#3c3c3c] rounded-lg"
            placeholder="Category"
          />

          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border p-3 text-[#3c3c3c] rounded-lg"
            placeholder="Phone (optional)"
          />

          <button
            type="submit"
            className="w-full bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-500"
          >
            Create Vendor
          </button>
        </form>
      </div>
    </div>
  );
}
