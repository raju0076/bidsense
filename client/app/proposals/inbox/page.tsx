"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BASE_URL } from "@/app/apiEndpoints";

export default function InboxPage() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInbox = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}api/email/rfp-email-logs`);

      if (!res.ok) {
        throw new Error("Failed to load inbox");
      }

      const json = await res.json();
      setEmails(json.data || []);
    } catch (err: any) {
      console.error("❌ loadInbox error:", err);
      setError(err.message || "Something went wrong");
      setEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const syncInbox = async () => {
    setSyncing(true);
    setError(null);

    try {
      const res = await fetch(
        `${BASE_URL}api/email/fetch-emails`,
        { method: "POST" }
      );

      if (!res.ok) {
        throw new Error("Email sync failed");
      }

      await loadInbox();
    } catch (err: any) {
      console.error(" syncInbox error:", err);
      setError(err.message || "Failed to sync emails");
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadInbox();
  }, []);

  return (
    <div className="relative p-10">

      {(loading || syncing) && <SpinnerOverlay text={syncing ? "Syncing inbox…" : "Loading inbox…"} />}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">
          RFP Inbox
        </h1>

        <button
          onClick={syncInbox}
          disabled={syncing}
          className={`px-4 py-2 rounded-md text-sm font-medium text-white transition
            ${syncing
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"}
          `}
        >
          {syncing ? "Syncing…" : "Sync Emails"}
        </button>
      </div>


      {error && (
        <div className="mb-4 rounded-md bg-red-900/30 text-red-400 px-4 py-3">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-800">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="bg-gray-900 text-gray-400">
            <tr>
              <th className="px-5 py-3">Received</th>
              <th className="px-5 py-3">Vendor</th>
              <th className="px-5 py-3">Subject</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800">
            {emails.map((mail) => (
              <tr key={mail._id} className="hover:bg-gray-900">
                <td className="px-5 py-4 text-gray-400">
                  {new Date(mail.receivedAt).toLocaleString()}
                </td>

                <td className="px-5 py-4">
                  {mail.fromEmail || "—"}
                </td>

                <td className="px-5 py-4">
  {mail.subject?.split("|")[1]?.trim() || mail.subject}
</td>


                <td className="px-5 py-4">
                  <StatusBadge status={mail.status} />
                </td>

                <td className="px-5 py-4 text-right">
                  {mail.proposalId ? (
                    <Link
                      href={`/proposals/${mail.proposalId}`}
                      className="text-blue-400 hover:underline"
                    >
                      View Proposal
                    </Link>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
              </tr>
            ))}

            {!emails.length && !loading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-gray-500"
                >
                  No RFP emails found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function SpinnerOverlay({ text }: { text: string }) {
  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        <span className="text-gray-300 text-sm">
          {text}
        </span>
      </div>
    </div>
  );
}


function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PROPOSAL_CREATED: "bg-green-600/20 text-green-400",
    INVALID_RFP: "bg-yellow-600/20 text-yellow-400",
    UNKNOWN_VENDOR: "bg-red-600/20 text-red-400",
    PARSE_ERROR: "bg-orange-600/20 text-orange-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        styles[status] || "bg-gray-700 text-gray-300"
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
