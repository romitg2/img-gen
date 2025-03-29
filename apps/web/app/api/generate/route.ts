import { fal } from "@fal-ai/client";
import { NextRequest, NextResponse } from "next/server";

type RequestData = {
  lora?: string;
  prompt: string;
};

export async function POST(request: NextRequest) {
    console.log("endpoint hitted");
  try {
    const body = (await request.json()) as RequestData;
    const { prompt, lora } = body;
    console.log(prompt, lora);

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }
    const result = await fal.subscribe("fal-ai/flux-lora", {
      input: {
        prompt,
        loras: [
          {
            path: lora ?? "",
          },
        ],
      },
      logs: true,

      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
        console.log("--------IN_PROGRESS-----------");
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    console.log(result.data);
    console.log(result.requestId);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
