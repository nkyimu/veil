import { NextRequest, NextResponse } from "next/server";
import type { CreateCheckoutSessionRequest, CreateCheckoutSessionResponse } from "@withlocus/checkout-react";

/**
 * POST /api/locus/checkout
 *
 * Server-side proxy that creates a Locus checkout session.
 * Keeps LOCUS_API_KEY off the client.
 *
 * Body: { amount: string, description?: string }
 * Response: { sessionId: string, checkoutUrl: string }
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.LOCUS_API_KEY;
  const apiBase = process.env.LOCUS_API_URL ?? "https://beta-api.paywithlocus.com/api";

  if (!apiKey) {
    return NextResponse.json(
      { error: "LOCUS_API_KEY not configured" },
      { status: 503 }
    );
  }

  let body: { amount?: string; description?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const amount = body.amount ?? "5.00";
  const description = body.description ?? "Fund VeilVault query wallet";

  const sessionReq: CreateCheckoutSessionRequest = {
    amount,
    description,
    expiresInMinutes: 30,
    metadata: { source: "veil-checkout-sdk", version: "1.0" },
  };

  const upstream = await fetch(`${apiBase}/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sessionReq),
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    console.error("[locus/checkout] upstream error:", upstream.status, text);
    return NextResponse.json(
      { error: "Locus session creation failed", detail: text },
      { status: upstream.status }
    );
  }

  const data = (await upstream.json()) as CreateCheckoutSessionResponse;
  return NextResponse.json({
    sessionId: data.data.id,
    checkoutUrl: data.data.checkoutUrl,
    amount: data.data.amount,
    expiresAt: data.data.expiresAt,
  });
}
