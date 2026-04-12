import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    // Shielded Dynamic Import
    let OpenGradientSDK, LLMInferenceMode;
    try {
      const sdk = await import('opengradient-sdk-js');
      OpenGradientSDK = sdk.OpenGradientSDK;
      LLMInferenceMode = sdk.LLMInferenceMode;
    } catch (importError) {
      console.error("SDK Load Error:", importError);
      return NextResponse.json({ error: "SDK_NOT_INSTALLED", details: importError }, { status: 500 });
    }

    const ogClient = new OpenGradientSDK({
      privateKey: process.env.OPENGRADIENT_PRIVATE_KEY || "",
    });

    const [llmResponse] = await ogClient.llmCompletion(
      "bafybeiaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      LLMInferenceMode.TEE,
      `Evaluate: ${url}`
    );

    return NextResponse.json({ score: llmResponse.score });
  } catch (e) {
    return NextResponse.json({ error: "RUNTIME_ERROR" }, { status: 500 });
  }
}
