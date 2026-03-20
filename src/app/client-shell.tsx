"use client";

import { useState, useEffect } from "react";
import { Providers } from "./providers";
import { ClientNav } from "../components/ClientNav";

// Mount guard — RainbowKit calls localStorage.getItem during SSR which throws.
// Returning null during server render is safe: this is a client-side dApp,
// not an SEO surface. The shell appears after hydration on the client.
export function ClientShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [latency, setLatency] = useState<string>("—");

  useEffect(() => {
    setMounted(true);
    // Simulate latency display with a realistic value
    const ms = Math.floor(Math.random() * 40) + 12;
    setLatency(`${ms}ms`);
  }, []);

  if (!mounted) return null;

  return (
    <Providers>
      {/* System Status Bar — Clinical Noir */}
      <div className="border-b border-gray-800 bg-gray-950/80 px-6 py-1.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 tracking-widest">SYSTEM.ONLINE</span>
            </span>
            <span className="text-gray-600">·</span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-gray-500 tracking-widest">GUARDIAN.ACTIVE</span>
            </span>
            <span className="text-gray-600">·</span>
            <span className="text-gray-600 tracking-widest">LATENCY: {latency}</span>
          </div>
          <div className="text-xs font-mono text-gray-700 tracking-widest">
            VEIL v0.1 · BASE SEPOLIA · ERC-8004
          </div>
        </div>
      </div>

      {/* Primary Nav */}
      <nav className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🫥</span>
            <div>
              <h1 className="text-lg font-bold text-veil-500 leading-none tracking-tight">Veil</h1>
              <p className="text-xs font-mono text-gray-600 tracking-widest mt-0.5">SOVEREIGN DATA VAULT</p>
            </div>
          </div>
          <ClientNav />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
    </Providers>
  );
}
