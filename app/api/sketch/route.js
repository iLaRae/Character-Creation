// app/api/sketch/route.js
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

const STYLE_INSTRUCTIONS = {
  // Existing
  ink_cleanup:
    "Clean and enhance pencil/ink line art: boost contrast, remove paper texture, keep natural hand-drawn feel.",
  watercolor_soft:
    "Colorize with soft watercolor washes, paper texture preserved subtly, gentle bleed at edges, airy highlights.",
  marker_bold:
    "Colorize with alcohol marker look: flat fills, slightly darker edge feathering, subtle streaking, comic feel.",
  pastel_light:
    "Colorize with chalk pastel look: light, dusty texture, soft edges, warm paper tint, gentle gradients.",
  cel_shaded:
    "Colorize with cel-shaded toon style: flat base colors, one hard shadow and one light highlight per region.",
  comic_halftone:
    "Colorize with retro comic dots: halftone pattern in shadows, bold flats, crisp black lines, off-white paper.",
  bluey_soft:
    "Colorize in a friendly kids-cartoon vibe: round shapes, simple flat colors, soft shadows, cheerful palette.",

  // NEW “fully colored” looks
  watercolor_vibrant:
    "Vibrant watercolor: saturated washes, crisp edges in darks, soft blooms in lights; bright, fully colored look.",
  gouache_dense:
    "Gouache style: opaque layered paint, matte finish, confident brush edges; complete color coverage.",
  colored_pencil:
    "Colored pencil: visible pencil grain, layered cross-hatching, rich coverage with slight tooth paper texture.",
  oil_pastel:
    "Oil pastel: creamy strokes, blended transitions, bold saturated hues; full-page color coverage.",
  crayon_childlike:
    "Crayon style: waxy strokes, visible texture, playful color layering; childlike fully colored finish.",
  gel_pen_neon:
    "Neon gel pens: bright, high-contrast accents, clean lines, vivid highlights; fully colored with neon pops.",
  manga_tones:
    "Manga styling: strong inks plus screentone-like patterns and spot blacks; selective flat color panels.",
  sepia_wash:
    "Sepia wash: monochrome warm brown inks with layered tonal washes; vintage fully colored feel.",
  graphite_tint:
    "Graphite tint: refined pencil shading with subtle color tints in key areas; softly colored yet complete.",
};

function buildInstruction(style, extraPrompt, colorAccents, hasPalette, frameIdx, totalFrames, animateFlag) {
  const base = [
    "You are enhancing a sketchbook scan/photo.",
    "Preserve the original drawing and structure. Avoid warping faces or proportions.",
    "Keep background clean; remove smudges and uneven paper tones.",
    STYLE_INSTRUCTIONS[style] || "",
    colorAccents ? `Color accents/preferences: ${colorAccents}.` : "",
    hasPalette
      ? "A second reference image may be provided: SAMPLE ONLY ITS COLORS to drive the palette. Do NOT copy shapes or layout from it."
      : "",
    "Ensure the page looks fully colored in—avoid large uncolored areas unless intentionally left for highlights.",
    extraPrompt || "",
  ];
  return base.filter(Boolean).join(" ");
}

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("image");
    const paletteFile = form.get("palette"); // optional
    const style = String(form.get("style") || "watercolor_soft");
    const prompt = String(form.get("prompt") || "");
    const colorAccents = String(form.get("color_accents") || ""); // optional CSV
    const animate = String(form.get("animate") || "false") === "true";
    let frames = parseInt(String(form.get("frames") || "1"), 10);
    if (!Number.isFinite(frames) || frames < 1) frames = 1;
    if (frames > 12) frames = 12;

    if (!file) {
      return NextResponse.json({ error: "Please attach a sketch image." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server is missing GEMINI_API_KEY." }, { status: 500 });
    }
    const ai = new GoogleGenAI({ apiKey });

    const imgBuf = Buffer.from(await file.arrayBuffer());
    const mainPart = {
      inlineData: {
        mimeType: file.type || "image/png",
        data: imgBuf.toString("base64"),
      },
    };

    let palettePart = null;
    if (paletteFile && typeof paletteFile.arrayBuffer === "function") {
      const pbuf = Buffer.from(await paletteFile.arrayBuffer());
      palettePart = {
        inlineData: {
          mimeType: paletteFile.type || "image/png",
          data: pbuf.toString("base64"),
        },
      };
    }

    const hasPalette = !!palettePart;

    // Single image (colorize only)
    if (!animate || frames === 1) {
      const instruction = buildInstruction(
        style,
        prompt,
        colorAccents,
        hasPalette,
        0,
        1,
        false
      );
      const contents = [{ text: instruction }, mainPart];
      if (palettePart) contents.push(palettePart);

      const resp = await ai.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents,
      });

      const cand = resp.candidates?.[0];
      const out = cand?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;
      if (!out) {
        const text = cand?.content?.parts?.map((p) => p.text).filter(Boolean).join("\n");
        return NextResponse.json({ error: "No image returned.", modelText: text ?? "" }, { status: 502 });
      }
      return NextResponse.json({ imageBase64: out, mimeType: "image/png" });
    }

    // Multi-frame animation
    const framesBase64 = [];
    for (let i = 0; i < frames; i++) {
      const instruction = buildInstruction(
        style,
        prompt,
        colorAccents,
        hasPalette,
        i,
        frames,
        true
      );
      const contents = [{ text: instruction }, mainPart];
      if (palettePart) contents.push(palettePart);

      const resp = await ai.models.generateContent({
        model: "gemini-2.5-flash-image-preview",
        contents,
      });
      const cand = resp.candidates?.[0];
      const out = cand?.content?.parts?.find((p) => p.inlineData)?.inlineData?.data;
      if (!out) continue;
      framesBase64.push(out);
    }

    if (framesBase64.length === 0) {
      return NextResponse.json({ error: "No animation frames returned." }, { status: 502 });
    }
    return NextResponse.json({ framesBase64, mimeType: "image/png" });
  } catch (err) {
    return NextResponse.json({ error: err?.message ?? "Unexpected error" }, { status: 500 });
  }
}
