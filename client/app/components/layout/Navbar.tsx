"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-6 text-gray-300">
      <h1 className="text-2xl font-bold tracking-wide">
        <Link href="/">
          BidSense<span className="text-blue-400">.ai</span>
        </Link>
      </h1>

      <div className="flex gap-8 text-lg">
        <Link href="/rfp" className="hover:text-white">
          RFPs
        </Link>
        <Link href="/vendors" className="hover:text-white">
          Vendors
        </Link>
        <Link href="/proposals/inbox" className="hover:text-white">
          Proposals
        </Link>
        <Link href="/docs" className="hover:text-white">
          Docs
        </Link>
      </div>
    </nav>
  );
}
