// app/api/gem-api/route.js
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    // 🚨 FIX: Change the model name here
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" }); 

    const imagePart = {
      inlineData: {
        data: image,
        mimeType: mimeType, 
      }
    };

    // The rest of the code is correct
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ generatedText: text });

  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json({ error: 'Failed to generate content from Gemini API.' }, { status: 500 });
  }
}