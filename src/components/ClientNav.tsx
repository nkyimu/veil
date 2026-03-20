"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "CREDENTIALS" },
  { href: "/queries", label: "QUERIES" },
  { href: "/earnings", label: "EARNINGS" },
];

export function ClientNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-4 items-center">
      <div className="flex gap-1 text-xs font-mono">
        {NAV_ITEMS.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={[
                "px-3 py-1.5 rounded-full tracking-widest transition-colors",
                isActive
                  ? "bg-veil-600/20 text-veil-400 border border-veil-600/40"
                  : "text-gray-500 hover:text-gray-300 border border-transparent hover:border-gray-700",
              ].join(" ")}
            >
              {label}
            </Link>
          );
        })}
      </div>
      <ConnectButton />
    </div>
  );
}
