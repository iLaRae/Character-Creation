// app/api/nano/route.js
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const form = await req.formData();
    const prompt = String(form.get("prompt") || "");
    const op = String(form.get("operation") || "edit_white_bg");
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

    /* ── ECOMMERCE ─────────────────────────────────────────── */
    switch (op) {
      case "edit_white_bg":
        instructions.push("Place the subject on pure #FFFFFF background; soft natural shadow; centered; export square PNG.");
        break;
      case "remove_bg":
        instructions.push("Remove background cleanly; preserve edges and hair detail; output PNG with alpha transparency.");
        break;
      case "photo_studio":
        instructions.push("High-end e-commerce studio polish: soft three-point lighting, minimal noise, subtle ground shadow.");
        break;
      case "square_1080":
        instructions.push("Compose as square 1080x1080; centered subject; safe margins; crisp retail finish.");
        break;
      case "reflection_floor":
        instructions.push("Add glossy white reflection floor with soft falloff; pristine studio feel.");
        break;
      case "ghost_mannequin":
        instructions.push("Ghost mannequin effect: remove mannequin/stand; realistic inner-neck shading for apparel.");
        break;
      case "ecom_amazon":
        instructions.push("Amazon main image compliance: pure white (#FFFFFF) background, product fills 85%+ of frame, no text/props.");
        break;
      case "ecom_ebay":
        instructions.push("eBay main image: clean white or very light gray background, natural shadow, accurate color.");
        break;
      case "ecom_color_bg":
        instructions.push("Set a soft pastel backdrop (mint/teal/pink) with gentle gradient; retail lifestyle vibe.");
        break;
      case "ecom_lifestyle":
        instructions.push("Place product on a simple lifestyle set: clean wood table, soft daylight window, realistic shadows.");
        break;
      case "ecom_topdown":
        instructions.push("Top-down flat-lay composition: neatly arranged accessories; even lighting; soft shadows.");
        break;
      case "ecom_packshot":
        instructions.push("Classic packshot: straight-on, centered, label readable, subtle shadow; catalog-ready.");
        break;

      /* ── BOB'S BURGERS — CHARACTER VIBES ───────────────────── */
      case "bobs_burgers_style":
        instructions.push("Transform into a Bob’s Burgers–inspired cartoon: bold outlines, flat colors, simple shading, off-white backdrop.");
        break;
      case "bobs_portrait":
        instructions.push("Bob’s Burgers–inspired portrait: waist-up, thick linework, limited palette, off-white background.");
        break;
      case "bobs_tina":
        instructions.push("Bob’s Burgers–inspired Tina vibe: teal tones, large round glasses silhouette, straight hair; flat shading.");
        break;
      case "bobs_gene":
        instructions.push("Bob’s Burgers–inspired Gene vibe: playful expression, blue/yellow tones, simple shading.");
        break;
      case "bobs_louise":
        instructions.push("Bob’s Burgers–inspired Louise vibe: bold outline, pink/green accent (bunny-ears hat motif), cheeky grin.");
        break;
      case "bobs_linda":
        instructions.push("Bob’s Burgers–inspired Linda vibe: red top tones, cat-eye glasses silhouette, cheerful expression, flat colors.");
        break;
      case "bobs_teddy":
        instructions.push("Bob’s Burgers–inspired Teddy vibe: cap/hat silhouette, friendly handyman energy, warm neutral palette.");
        break;

      /* ── BOB'S BURGERS — ENVIRONMENTS ──────────────────────── */
      case "bobs_restaurant_scene":
        instructions.push("Bob’s Burgers–inspired diner: checker floor, ketchup & mustard bottles, menu board, flat colors, simple shadows.");
        break;
      case "bobs_counter":
        instructions.push("Bob’s Burgers–inspired counter scene: laminate counter, swivel stools, griddle in background, condiment caddies.");
        break;
      case "bobs_grill_line":
        instructions.push("Bob’s Burgers–inspired grill line: flat-top grill, spatulas, order tickets on a string, warm kitchen hues.");
        break;
      case "bobs_alley":
        instructions.push("Bob’s Burgers–inspired back alley: brick walls, dumpsters, back door, posters; flat cartoon colors.");
        break;
      case "bobs_ocean_pier":
        instructions.push("Bob’s Burgers–inspired boardwalk/pier: ocean backdrop, carnival lights, simple booths, flat shading.");
        break;
      case "bobs_arcade":
        instructions.push("Bob’s Burgers–inspired arcade: bright cabinets, simple neon shapes, checker patterns; playful vibe.");
        break;
      case "bobs_school_hall":
        instructions.push("Bob’s Burgers–inspired school hallway: lockers, bulletin board, flat colors, minimal shadows.");
        break;
      case "bobs_apartment":
        instructions.push("Bob’s Burgers–inspired Belcher apartment: cozy living room, simple furniture, warm flat palettes.");
        break;
      case "bobs_night_diner":
        instructions.push("Bob’s Burgers–inspired diner at night: cool exterior lighting, warm interior glow, reflections on windows.");
        break;
      case "bobs_holiday_lights":
        instructions.push("Bob’s Burgers–inspired main street with holiday string lights, shop windows, festive flat colors.");
        break;

      default:
        break;
    }

    // User prompt appended last so it can override
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
