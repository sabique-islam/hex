import type {
  PresentonGenerateRequest,
  PresentonGenerateResponse,
} from "./types";

type PresentonGenerateApiResponse = {
  presentation_id: string;
  path: string;
  edit_path?: string;
};

function presentonConfig() {
  const baseUrl = (process.env.PRESENTON_BASE_URL ?? "").replace(/\/$/, "");
  const apiKey = process.env.PRESENTON_API_KEY?.trim() || undefined;
  return { baseUrl, apiKey };
}

function authHeaders(apiKey?: string): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }
  return headers;
}

function fileNameFromPrompt(prompt: string): string {
  const slug = prompt
    .trim()
    .slice(0, 48)
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug || "Generated-presentation"}.pptx`;
}

export function isPresentonConfigured(): boolean {
  return Boolean(presentonConfig().baseUrl);
}

export async function generatePresentationPptx(
  input: PresentonGenerateRequest,
): Promise<PresentonGenerateResponse> {
  const { baseUrl, apiKey } = presentonConfig();
  if (!baseUrl) {
    throw new Error(
      "Presenton is not configured. Set PRESENTON_BASE_URL (e.g. http://localhost:5001).",
    );
  }

  const prompt = input.prompt.trim();
  if (!prompt) {
    throw new Error("Prompt is required");
  }

  const generateRes = await fetch(
    `${baseUrl}/api/v1/ppt/presentation/generate`,
    {
      method: "POST",
      headers: authHeaders(apiKey),
      body: JSON.stringify({
        content: prompt,
        template: input.template ?? "general",
        n_slides: input.nSlides,
        language: input.language,
        instructions: input.instructions,
        export_as: "pptx",
        include_title_slide: true,
      }),
      cache: "no-store",
    },
  );

  if (!generateRes.ok) {
    const detail = await generateRes.text();
    throw new Error(
      detail || `Presenton generation failed (${generateRes.status})`,
    );
  }

  const generated = (await generateRes.json()) as PresentonGenerateApiResponse;
  const exportPath = generated.path;
  if (!exportPath) {
    throw new Error("Presenton did not return an export path");
  }

  const exportUrl = exportPath.startsWith("http")
    ? exportPath
    : `${baseUrl}${exportPath.startsWith("/") ? exportPath : `/${exportPath}`}`;

  const fileRes = await fetch(exportUrl, {
    headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
    cache: "no-store",
  });

  if (!fileRes.ok) {
    throw new Error(`Could not download generated PPTX (${fileRes.status})`);
  }

  const bytes = Buffer.from(await fileRes.arrayBuffer());
  return {
    fileName: fileNameFromPrompt(prompt),
    bytesBase64: bytes.toString("base64"),
    presentationId: String(generated.presentation_id),
    editPath: generated.edit_path,
  };
}
