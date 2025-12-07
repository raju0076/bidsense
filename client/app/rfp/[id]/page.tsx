"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Vendor = {
  _id: string;
  name: string;
  email: string;
};

type Proposal = {
  vendorName: string;
  totalPrice: number;
  deliveryDays: number;
  warranty: string;
  notes: string;
};

type RfpItem = {
  _id?: string;
  name: string;
  quantity: number;
  specs: any;
};

type Rfp = {
  _id: string;
  title: string;
  description: string;
  status: string;
  assignedVendors: {
    _id: string;
    name: string;
    email: string;
    category?: string;
  }[];
  structured: {
    items: RfpItem[];
    budget?: number;
    delivery?: any;
    payment_terms?: string;
    warranty?: string;
  };
};


function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mb-10 rounded-2xl bg-white/70 backdrop-blur border border-white/40  p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-indigo-700">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  badge,
}: {
  label: string;
  value: any;
  badge?: boolean;
}) {
  return (
    <div
      className={`p-5 rounded-xl text-[black] bg-amber-100  `}
    >
      <p className="text-sm opacity-80">{label}</p>
      {badge ? (
        <span className="inline-block mt-2 bg-white/20 px-4 py-1 rounded-full text-sm capitalize">
          {value}
        </span>
      ) : (
        <p className="text-2xl font-bold mt-1">{value ?? "—"}</p>
      )}
    </div>
  );
}


export default function RfpDetailPage() {
  const [rfp, setRfp] = useState<Rfp | null>(null);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedVendorIds, setSelectedVendorIds] = useState<string[]>([]);
  const [showAllVendors, setShowAllVendors] = useState(false);

  const params = useParams();
  const id = params?.id as string | undefined;
console.log(vendors,"vendors")

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3001/api/rfp/${id}`)
      .then((r) => r.json())
      .then((d) => setRfp(d.data))
      .catch(console.error);
  }, [id]);

   const fetchVendors = async () => {
    const res = await fetch("http://localhost:3001/api/vendor/getAll-vendors");
    const data = await res.json();
    if (data.success) setVendors(data.vendors);
  };


  useEffect(() => {
     fetchVendors()
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3001/api/proposals/${id}`)
      .then((r) => r.json())
      .then((d) => setProposals(d.data || []))
      .catch(console.error);
  }, [id]);

  /* ---------- Selection Logic ---------- */

  const toggleVendor = (vendorId: string) => {
    setSelectedVendorIds((prev) =>
      prev.includes(vendorId)
        ? prev.filter((x) => x !== vendorId)
        : [...prev, vendorId]
    );
  };

  const allSelected =
    vendors.length > 0 && selectedVendorIds.length === vendors.length;

  const toggleAll = () => {
    setSelectedVendorIds(allSelected ? [] : vendors.map((v) => v._id));
  };

  if (!id) return <p className="p-10">Invalid RFP URL</p>;
  if (!rfp) return <p className="p-10">Loading RFP details...</p>;

  const sendRfpToVendors = async () => {
  if (!id) return;

  if (selectedVendorIds.length === 0) {
    toast.error("Select at least one vendor");
    return;
  }

  try {
    // 1️⃣ Assign vendors
    const assignRes = await fetch(
      `http://localhost:3001/api/select-vendors/${id}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorIds: selectedVendorIds }),
      }
    );

    const assignData = await assignRes.json();
    if (!assignData.success) {
      toast.error("Vendor assignment failed");
      return;
    }

    // 2️⃣ Send emails
    const sendRes = await fetch(
      `http://localhost:3001/api/email/send-mail/${id}`,
      { method: "POST" }
    );

    const sendData = await sendRes.json();
    if (sendData.success) {
      toast.success("RFP sent successfully to selected vendors");
    } else {
      toast.error("Failed to send RFP email");
    }
  } catch (error) {
    toast.error("Something went wrong");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-10 py-10 text-gray-900">
      <ToastContainer position="top-right" />

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {rfp.title}
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          RFP ID:
          <span className="ml-2 font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            {id}
          </span>
        </p>
      </div>

      {/* Summary */} 
<div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-12">
  <SummaryCard
    label="Budget"
  
    value={
      rfp.structured?.budget
        ? `$${rfp.structured.budget.toLocaleString()}`
        : "—"
    }
  />

  <SummaryCard
    label="Warranty"
    value={rfp.structured?.warranty || "—"}
  />

  <SummaryCard
    label="Line Items"
    value={rfp.structured.items.length}
  />

  <SummaryCard
    label="Status"
    value={rfp.status}
    badge
  />
</div>

      {/* Description */}
      <Section title="RFP Description">
        <p className="text-gray-700 leading-relaxed">{rfp.description}</p>
      </Section>

      {/* Line Items */}
      <Section title="Line Items">
        <div className="grid md:grid-cols-2 gap-5">
          {rfp.structured.items.map((item) => (
            <div
              key={item._id ?? item.name}
              className="rounded-xl p-5 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200  transition"
            >
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <div className="flex gap-3 mt-3 text-sm">
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                  Qty {item.quantity}
                </span>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                  {item.specs}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Assigned Vendors */}
      <Section title="Assigned Vendors">
        {rfp.assignedVendors.length === 0 ? (
          <p className="text-gray-500">No vendors assigned</p>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-5">
              {(showAllVendors
                ? rfp.assignedVendors
                : rfp.assignedVendors.slice(0, 6)
              ).map((v) => (
                <div
                  key={v._id}
                  className="p-5 rounded-xl bg-white  border transition"
                >
                  <p className="font-semibold text-indigo-700">{v.name}</p>
                  <p className="text-sm text-gray-500 truncate">{v.email}</p>
                  {v.category && (
                    <span className="inline-block mt-3 text-xs bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full">
                      {v.category}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {rfp.assignedVendors.length > 6 && (
              <div className="mt-5 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Showing {showAllVendors ? rfp.assignedVendors.length : 6} of{" "}
                  {rfp.assignedVendors.length}
                </p>
                <button
                  onClick={() => setShowAllVendors((p) => !p)}
                  className="text-indigo-600 text-sm font-medium hover:underline"
                >
                  {showAllVendors ? "Show less" : "View all"}
                </button>
              </div>
            )}
          </>
        )}
      </Section>
<Section
  title="Send RFP to Vendors"
  action={
    <button
      onClick={toggleAll}
      className="px-4 py-2 border border-indigo-600 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-50 transition"
    >
      {allSelected ? "Clear All" : "Select All"}
    </button>
  }
>
  <div className="overflow-x-auto">
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="bg-indigo-600 text-white">
          <th className="p-3 text-center">Select</th>
          <th className="p-3 text-left">Vendor</th>
          <th className="p-3 text-left">Email</th>
        </tr>
      </thead>

      <tbody>
        {vendors.map((v) => (
          <tr
            key={v._id}
            onClick={() => toggleVendor(v._id)}
            className={`border-b cursor-pointer transition ${
              selectedVendorIds.includes(v._id)
                ? "bg-indigo-50"
                : "hover:bg-gray-50"
            }`}
          >
            <td
              className="p-3 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={selectedVendorIds.includes(v._id)}
                onChange={() => toggleVendor(v._id)}
                className="w-5 h-5 cursor-pointer"
              />
            </td>

            <td className="p-3 font-medium">{v.name}</td>
            <td className="p-3 text-gray-600">{v.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <button
    onClick={sendRfpToVendors}
    className="mt-8 w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-semibold transition"
  >
    Send RFP to Selected Vendors
  </button>
</Section>


      <Section title="Vendor Proposals">
        {proposals.length === 0 ? (
          <p className="text-gray-500 text-center py-10">
            No proposals received yet
          </p>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
            {proposals.map((p, i) => (
              <div
                key={i}
                className="rounded-xl p-6 bg-white border   transition"
              >
                <h3 className="font-semibold text-lg text-indigo-700 mb-3">
                  {p.vendorName}
                </h3>
                <p><strong>${p.totalPrice.toLocaleString()}</strong></p>
                <p> {p.deliveryDays} days</p>
                <p>{p.warranty}</p>
                <p className="text-gray-600 mt-4">{p.notes}</p>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}
