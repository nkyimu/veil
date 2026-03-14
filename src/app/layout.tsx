import type { Metadata } from "next";
import "./globals.css";

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
        <nav className="border-b border-gray-800 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🫥</span>
              <h1 className="text-xl font-bold text-veil-500">Veil</h1>
            </div>
            <div className="flex gap-4 text-sm">
              <a href="/" className="text-gray-400 hover:text-white">Credentials</a>
              <a href="/queries" className="text-gray-400 hover:text-white">Queries</a>
              <a href="/earnings" className="text-gray-400 hover:text-white">Earnings</a>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
