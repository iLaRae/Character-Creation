// app/api/sketch/route.js
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

/**
 * IMPORTANT:
 * - This route matches the UI: NO animation.
 * - It accepts:
 *    - image (required)
 *    - palette (optional)
 *    - style (string)
 *    - prompt (string)
 *    - color_accents (string CSV)
 *    - animate ("false") + frames ("1") (accepted, ignored)
 */

const STYLE_INSTRUCTIONS = {
  // core requested
  ink_cleanup:
    "Clean and enhance pencil/ink line art: boost contrast, remove paper grime, keep natural hand-drawn feel. Preserve original stroke character.",
  colored_pencil:
    "Colored pencil rendering: visible pencil grain and paper tooth, layered cross-hatching, soft burnishing in highlights, rich but natural colors.",

  // Posca styles
  posca:
    "POSCA paint marker style: bold opaque fills, smooth matte coverage, slightly rounded edges, bright saturated colors, subtle marker overlap strokes (no streaky alcohol marker look).",
  posca_pens:
    "POSCA paint pens: ultra-opaque acrylic marker coverage, super clean edges, vibrant saturated blocks of color, minimal texture, subtle stroke overlap at boundaries, crisp highlights, and a playful, polished poster-like finish.",

  // watercolor / paint
  watercolor_soft:
    "Soft watercolor washes: light airy color, subtle paper texture, gentle bleed at edges, soft blooms, keep whites as highlights.",
  watercolor_vibrant:
    "Vibrant watercolor: more saturated washes, crisp edges in darks, soft blooms in lights, bright fully colored look while still watercolor-like.",
  gouache_dense:
    "Gouache style: opaque layered paint, matte finish, confident brush edges, clean shapes with slight brush texture; complete color coverage.",
  oil_pastel:
    "Oil pastel: creamy strokes, blended transitions, bold saturated hues, visible waxy texture and directional stroke marks; full-page color coverage.",
  marker_render:
    "Marker rendering: alcohol marker look with smooth gradients, slightly darker edges where strokes overlap, controlled streaking, clean fills (no watercolor bleed).",

  // comics / toon
  cel_shaded:
    "Cel-shaded toon style: flat base colors, one clear shadow shape and one simple highlight per region, crisp edges, clean presentation.",
  comic_halftone:
    "Retro comic print: halftone dots in shadows, bold flats, crisp black lines, slightly off-white paper; keep it print-like.",
  manga_tones:
    "Manga style: strong inks, screentone-like shading patterns, spot blacks, selective flat colors; keep linework dominant.",

  // classic / sketchy / fun
  crayon_childlike:
    "Crayon style: waxy strokes, visible texture, playful uneven coverage, childlike layering; warm paper feel.",
  gel_pen_neon:
    "Neon gel pen look: vivid neon accents, glossy ink highlights, bright pops over clean base colors; keep edges sharp.",
  sepia_wash:
    "Sepia wash: warm brown inks with layered tonal washes, vintage paper warmth, complete tonal coverage without looking muddy.",
  graphite_tint:
    "Graphite + tint: refined pencil shading, detailed value structure, subtle color tints in key areas; softly colored yet complete.",
};

const GLOBAL_GUARDRAILS = [
  "You are enhancing a sketchbook scan/photo into a polished, family-friendly storybook illustration.",
  "Preserve the original drawing structure and composition. Do not change the subject or add new characters.",
  "Do NOT warp faces, hands, or proportions. Keep pose and identity consistent.",
  "Keep the background clean and simple; remove smudges, stains, harsh shadows, and uneven paper tones.",
  "Keep line work readable. Do not paint over lines unless the style explicitly calls for softening them (watercolor).",
  "Avoid logos, text, watermarks, or signatures.",
  "Use gentle, appealing color harmony. Prefer a warm, inviting finish (storybook quality).",
];

function normStyle(style) {
  const s = String(style || "").trim();
  if (s && STYLE_INSTRUCTIONS[s]) return s;

  // aliases / legacy
  if (s === "marker_bold") return "marker_render";

  // label-ish inputs -> slug
  const slug = s.toLowerCase().replace(/\s+/g, "_");
  if (STYLE_INSTRUCTIONS[slug]) return slug;

  if (slug === "poscapens" || slug === "posca_pen") return "posca_pens";

  return "watercolor_soft";
}

function clampText(s, max = 700) {
  const t = String(s || "").trim();
  if (!t) return "";
  return t.length > max ? t.slice(0, max) : t;
}

function buildInstruction({ style, extraPrompt, colorAccents, hasPalette }) {
  const resolved = normStyle(style);
  const styleLine = STYLE_INSTRUCTIONS[resolved] || STYLE_INSTRUCTIONS.watercolor_soft;

  const accentsLine = colorAccents
    ? `Color accents/preferences (use if compatible): ${colorAccents}.`
    : "";

  const paletteLine = hasPalette
    ? "A second reference image may be provided: SAMPLE ONLY ITS COLORS to drive the palette. Do NOT copy shapes, layout, or subjects from it."
    : "";

  const promptLine = extraPrompt ? `Extra user request: ${extraPrompt}` : "";

  const base = [
    ...GLOBAL_GUARDRAILS,
    `Primary render style: ${styleLine}`,
    accentsLine,
    paletteLine,
    "Ensure the page looks fully colored in—avoid large uncolored areas unless intentionally left as highlights.",
    promptLine,
    "Output: return a single final colored image of the sketch (no collage, no multiple panels).",
  ];

  return base.filter(Boolean).join(" ");
}

function firstImagePartFromResponse(resp) {
  const cand = resp?.candidates?.[0];
  const parts = cand?.content?.parts || [];
  const inline = parts.find((p) => p?.inlineData?.data)?.inlineData?.data;
  const text = parts.map((p) => p?.text).filter(Boolean).join("\n");
  return { inline, text };
}

export async function POST(req) {
  try {
    const form = await req.formData();

    const file = form.get("image");
    const paletteFile = form.get("palette"); // optional

    const rawStyle = String(form.get("style") || "watercolor_soft");
    const prompt = clampText(form.get("prompt") || "");
    const colorAccents = clampText(form.get("color_accents") || "");

    // accepted but ignored (UI sends these)
    // const animate = String(form.get("animate") || "false") === "true";
    // const frames = parseInt(String(form.get("frames") || "1"), 10) || 1;

    if (!file || typeof file.arrayBuffer !== "function") {
      return NextResponse.json(
        { error: "Please attach a sketch image as 'image'." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server is missing GEMINI_API_KEY." },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // main image part
    const imgBuf = Buffer.from(await file.arrayBuffer());
    const mainPart = {
      inlineData: {
        mimeType: file.type || "image/png",
        data: imgBuf.toString("base64"),
      },
    };

    // optional palette part
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

    const instruction = buildInstruction({
      style: rawStyle,
      extraPrompt: prompt,
      colorAccents,
      hasPalette: !!palettePart,
    });

    const contents = [{ text: instruction }, mainPart];
    if (palettePart) contents.push(palettePart);

    const resp = await ai.models.generateContent({
      model: "gemini-2.5-flash-image", // ✅ Fixed: removed "-preview" suffix (model is now GA)
      contents,
    });

    const { inline, text } = firstImagePartFromResponse(resp);

    if (!inline) {
      return NextResponse.json(
        {
          error: "No image returned from model.",
          modelText: text || "",
          style: normStyle(rawStyle),
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      imageBase64: inline,
      mimeType: "image/png",
      style: normStyle(rawStyle),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}