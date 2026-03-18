"use client";

import { useState, useEffect } from "react";
import { Providers } from "./providers";
import { ClientNav } from "../components/ClientNav";

// Mount guard — RainbowKit calls localStorage.getItem during SSR which throws.
// Returning null during server render is safe: this is a client-side dApp,
// not an SEO surface. The shell appears after hydration on the client.
export function ClientShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Providers>
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🫥</span>
            <h1 className="text-xl font-bold text-veil-500">Veil</h1>
          </div>
          <ClientNav />
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
    </Providers>
  );
}
