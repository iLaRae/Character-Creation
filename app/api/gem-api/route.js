// app/api/gem-api/route.js
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not configured.' }, { status: 500 });
  }

  try {
    const { prompt, image, mimeType } = await req.json();
    if (!prompt || !image || !mimeType) {
      return NextResponse.json({ error: 'Prompt, image, and mimeType are required.' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const imagePart = { inlineData: { data: image, mimeType } };

    const result = await ai.models.generateContent({
      model: "gemini-3.1-flash-image", // Nano Banana 2 — use "gemini-2.5-flash-image" for original Nano Banana
      config: {
        responseModalities: ["TEXT", "IMAGE"], // required for image output
      },
      contents: [{ parts: [{ text: prompt }, imagePart] }],
    });

    const parts = result.candidates?.[0]?.content?.parts ?? [];

    // pull the generated image out of the response
    const imgPart = parts.find(p => p.inlineData);
    if (!imgPart) {
      // Include any text response in the error for easier debugging
      const textPart = parts.find(p => p.text)?.text ?? 'No image or text returned.';
      return NextResponse.json({ error: 'Model did not return an image.', detail: textPart }, { status: 502 });
    }

    return NextResponse.json({
      generatedImage: imgPart.inlineData.data,        // base64
      generatedMimeType: imgPart.inlineData.mimeType, // e.g. image/png
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    const message = error?.message ?? 'Failed to generate content from Gemini API.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}