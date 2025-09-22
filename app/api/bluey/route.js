// app/api/bluey/route.js
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const form = await req.formData();
    const prompt = String(form.get("prompt") || "");
    const op = String(form.get("operation") || "bluey_style");
    const file = form.get("image");

    if (!prompt && !file) {
      return NextResponse.json({ error: "Provide a prompt and/or an image." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server is missing GEMINI_API_KEY." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const instructions = [];

    /* ---------- BLUEY-INSPIRED STYLES ---------- */
    switch (op) {
      case "bluey_style":
        instructions.push(
          "Transform into a Bluey-inspired cartoon look: clean thick outlines, soft round shapes, flat shading, friendly sky-blue palette, gentle gradients."
        );
        break;
      case "bluey_bluey":
        instructions.push(
          "Bluey-inspired vibe: playful expressions, sky/dark blue tones, rounded muzzle, simple paws; flat colors and soft shadows."
        );
        break;
      case "bluey_bingo":
        instructions.push(
          "Bingo-inspired vibe: warm orange/peach tones with cream accents, big curious eyes, rounded shapes, flat shading."
        );
        break;

      /* ---------- BLUEY-INSPIRED ENVIRONMENTS ---------- */
      case "bluey_lounge":
        instructions.push(
          "Bluey-inspired Heeler lounge: pastel walls, timber floorboards, simple couch, houseplants; soft flat colors."
        );
        break;
      case "bluey_playroom":
        instructions.push(
          "Bluey-inspired playroom: toy baskets, colorful rugs, simple bookshelf, paper crafts; gentle flat shading."
        );
        break;
      case "bluey_backyard":
        instructions.push(
          "Bluey-inspired backyard: soft green lawn, fig-tree vibe, timber fence, blue sky; cheerful flat palette."
        );
        break;
      case "bluey_veranda":
        instructions.push(
          "Bluey-inspired front veranda: timber posts, potted plants, steps; warm afternoon light, flat shading."
        );
        break;
      case "bluey_park":
        instructions.push(
          "Bluey-inspired park: play equipment, soft hills, scattered trees, bright sky; minimal detail, flat colors."
        );
        break;
      case "bluey_beach":
        instructions.push(
          "Bluey-inspired beach: pale sand, turquoise water, gentle foam, simple clouds; clean outlines, soft gradients."
        );
        break;
      case "bluey_school":
        instructions.push(
          "Bluey-inspired schoolyard: low fence, play area, colorful flags or bunting; flat cheerful palette."
        );
        break;
      case "bluey_markets":
        instructions.push(
          "Bluey-inspired weekend markets: simple stalls, bunting, produce crates; bright friendly colors, flat shading."
        );
        break;

      /* ---------- E-COMMERCE UTILITIES (optional) ---------- */
      case "edit_white_bg":
        instructions.push("Pure #FFFFFF background; soft natural shadow; centered; export square PNG.");
        break;
      case "remove_bg":
        instructions.push("Remove background cleanly; preserve edges/fur detail; output PNG with alpha transparency.");
        break;
      case "photo_studio":
        instructions.push("E-commerce studio polish: soft three-point lighting, minimal noise, subtle ground shadow.");
        break;
      case "square_1080":
        instructions.push("Square 1080x1080 composition; centered subject; safe margins; crisp finish.");
        break;

      default:
        break;
    }

    // User text last so it can override specifics
    instructions.push(prompt || "");

    const contents = [{ text: instructions.filter(Boolean).join(" ") }];

    if (file) {
      const buf = Buffer.from(await file.arrayBuffer());
      contents.push({
        inlineData: {
          mimeType: file.type || "image/png",
          data: buf.toString("base64"),
        },
      });
    }

    const resp = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents,
    });

    const cand = resp.candidates?.[0];
    const imgPart = cand?.content?.parts?.find((p) => p.inlineData);
    const b64 = imgPart?.inlineData?.data;

    if (!b64) {
      const text = cand?.content?.parts?.map((p) => p.text).filter(Boolean).join("\n");
      return NextResponse.json({ error: "No image returned.", modelText: text ?? "" }, { status: 502 });
    }

    return NextResponse.json({ imageBase64: b64, mimeType: "image/png" });
  } catch (err) {
    return NextResponse.json({ error: err?.message ?? "Unexpected error" }, { status: 500 });
  }
}
