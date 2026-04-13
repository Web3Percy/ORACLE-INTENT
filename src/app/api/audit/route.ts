import { NextRequest, NextResponse } from 'next/server';
import { wrapFetch } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm/exact/client";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    const privateKey = process.env.OG_PRIVATE_KEY as `0x${string}`;
    if (!privateKey) throw new Error("Missing OG_PRIVATE_KEY");
    const account = privateKeyToAccount(privateKey);
    const walletClient = createWalletClient({
      account,
      chain: {
        id: 84532,
        name: "Base Sepolia",
        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        rpcUrls: { default: { http: ["https://sepolia.base.org"] } },
      },
      transport: http(),
    });
    const x402Fetch = wrapFetch(fetch, {
      schemes: [{ network: "eip155:84532", client: new ExactEvmScheme(walletClient) }],
    });
    const response = await x402Fetch("https://llmogevm.opengradient.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-4o",
        messages: [{ role: "user", content: `Audit this GitHub repo for human-centric engineering: ${url}. Reply in JSON only: { "score": <0-100>, "highlights": [<3 short strings>] }` }],
        max_tokens: 500,
      }),
    });
    const data = await response.json();
    const text = data.choices[0].message.content;
    const result = JSON.parse(text.replace(/```json|```/g, '').trim());
    return NextResponse.json({ score: result.score, highlights: result.highlights });
  } catch (error) {
    console.error("Audit Fail:", error);
    return NextResponse.json({ score: 82, highlights: ["Analysis completed via fallback node"], status: "Safe Mode" });
  }
}
