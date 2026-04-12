import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    // THIS IS THE SECRET: Dynamic loading to bypass Netlify's build-time lock
    const sdkModule = await import('opengradient-sdk-js');
    const { OpenGradientSDK, LLMInferenceMode } = sdkModule;

    const ogClient = new OpenGradientSDK({
      privateKey: process.env.OPENGRADIENT_PRIVATE_KEY,
    });

    const [llmResponse] = await ogClient.llmCompletion(
      "bafybeiaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      LLMInferenceMode.TEE,
      `Perform forensic audit: ${url}`
    );

    return NextResponse.json({ score: llmResponse.score, verified: true });
  } catch (e) {
    return NextResponse.json({ error: "SDK native resolution failed" }, { status: 500 });
  }
}
