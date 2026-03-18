import type { Metadata } from "next";
import "./globals.css";
import { ClientShell } from "./client-shell";

// Force dynamic rendering — wagmi/rainbowkit need localStorage
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Veil — Sovereign Data Vault",
  description:
    "Your AI agent guards your data and charges others to query it. Synthesis Hackathon 2026.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-white">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
