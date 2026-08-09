import { NextResponse } from "next/server";

import {
  generatePresentationPptx,
  isPresentonConfigured,
} from "@/lib/presenton/server";
import type { PresentonGenerateRequest } from "@/lib/presenton/types";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  if (!isPresentonConfigured()) {
    return NextResponse.json(
      {
        error:
          "Presenton is not configured. Set PRESENTON_BASE_URL and start the Presenton service.",
      },
      { status: 503 },
    );
  }

  let body: PresentonGenerateRequest;
  try {
    body = (await request.json()) as PresentonGenerateRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const result = await generatePresentationPptx(body);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Presentation generation failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
