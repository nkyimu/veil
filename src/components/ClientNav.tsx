"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export function ClientNav() {
  return (
    <div className="flex gap-6 items-center">
      <div className="flex gap-4 text-sm">
        <Link href="/" className="text-gray-400 hover:text-white">
          Credentials
        </Link>
        <Link href="/queries" className="text-gray-400 hover:text-white">
          Queries
        </Link>
        <Link href="/earnings" className="text-gray-400 hover:text-white">
          Earnings
        </Link>
      </div>
      <ConnectButton />
    </div>
  );
}
