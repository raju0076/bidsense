"use client";

import { useState } from "react";
import RfpModal from "./RfpModal";
import { toast } from "react-toastify";
import { BASE_URL } from "../apiEndpoints";

export default function HomePage() {
  const [input, setInput] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [rfpData, setRfpData] = useState(null);

const handleGenerate = async () => {
  if (!input.trim()) return;

  try {
    const res = await fetch(`${BASE_URL}api/create-rfp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: input }),
    });

    const data = await res.json();

    // ✅ IMPORTANT CHECK
    if (!res.ok) {
      throw new Error(data.error || "Failed to generate RFP");
    }

    // ✅ Success path only
    setRfpData(data.rfp);
    console.log("AI RFP:", data);
    toast.success("RFP created successfully!");
    setOpenModal(true);
    setInput("");

  } catch (err: unknown) {
  let message = "Something went wrong";

  if (err instanceof Error) {
    message = err.message;
  }

  console.error("Error generating RFP:", err);
  toast.error(message);
}

};


  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col">
      
      {openModal && <RfpModal rfp={rfpData} onClose={() => setOpenModal(false)} />}


      <div className="flex flex-col justify-center items-center flex-1 text-center px-6">
        
        <button className="px-4 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm mb-6">
          BidSense Beta
        </button>

        <h1 className="text-5xl font-extrabold mb-4">
          What will you <span className="text-blue-400">automate</span> today?
        </h1>

        <p className="text-lg text-gray-300 mb-12 max-w-2xl">
          Create, send, and compare RFPs instantly with AI.  
          Say goodbye to messy vendor emails and slow procurement workflows.
        </p>

        <div className="w-full max-w-2xl bg-gray-800 border border-gray-700 rounded-2xl p-6 shadow-lg">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Describe what you want to procure..."
            className="w-full bg-transparent outline-none text-lg"
          />

          <div className="flex justify-end mt-6">
            <button
              onClick={handleGenerate}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
            >
              Generate RFP →
            </button>
          </div>
        </div>

      </div>

      <footer className="text-center text-gray-500 py-4 text-sm">
        © {new Date().getFullYear()} BidSense.ai – AI-powered procurement
      </footer>
    </div>
  );
}
