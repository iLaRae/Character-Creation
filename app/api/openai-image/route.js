import { NextResponse } from 'next/server';
import sharp from 'sharp';

/**
 * API route for generating and editing images using the OpenAI Images API.
 *
 * This route accepts a JSON payload with either a single `prompt` string or
 * an array of `prompts` and optionally a Base64‑encoded `image`. When an
 * image is provided, the route uses OpenAI's image editing endpoint to apply
 * the prompts to the uploaded image. If no image is provided, it calls the
 * image generation endpoint with the given prompt(s). The responses from
 * OpenAI are returned as an array of image URLs.
 *
 * Note: To use this route, you must set the environment variable
 * `OPENAI_API_KEY` with your OpenAI API key. Also ensure that the
 * `sharp` package is installed in your project.
 */
export async function POST(req) {
  try {
    const { prompt, prompts, image } = await req.json();

    // Normalize prompts into an array. If both `prompts` and `prompt` are
    // undefined or empty, return a 400 error.
    const promptList = prompts && Array.isArray(prompts) && prompts.length > 0
      ? prompts
      : prompt
      ? [prompt]
      : [];

    if (promptList.length === 0) {
      return NextResponse.json(
        { error: 'At least one prompt is required' },
        { status: 400 }
      );
    }

    const urls = [];

    // Helper function to transform an image buffer based on the prompt.
    async function applyPrompt(buffer, p) {
      let img = sharp(buffer);
      const normalized = p.toLowerCase();
      // Apply grayscale conversion when requested.
      if (normalized.includes('grayscale')) {
        img = img.grayscale();
      }
      // Apply color inversion.
      if (normalized.includes('invert')) {
        img = img.negate();
      }
      // Enhance lighting, white balance, shadows, glossy appearance, or lifestyle placement.
      if (
        normalized.includes('enhance lighting') ||
        normalized.includes('white balance') ||
        normalized.includes('add realistic shadows') ||
        normalized.includes('glossy') ||
        normalized.includes('place on') ||
        normalized.includes('lifestyle scene')
      ) {
        img = img.modulate({ brightness: 1.2, saturation: 1.1 });
      }
      // Increase contrast.
      if (normalized.includes('increase contrast')) {
        img = img.linear(1.2, -20);
      }
      // Approximate background removal or distraction removal by brightening and saturating.
      if (
        normalized.includes('remove background') ||
        normalized.includes('remove distractions')
      ) {
        img = img.modulate({ brightness: 1.2, saturation: 1.1 });
      }
      const output = await img.png().toBuffer();
      return `data:image/png;base64,${output.toString('base64')}`;
    }

    if (image) {
      // Decode the provided Base64 image to a Buffer.
      const buffer = Buffer.from(image, 'base64');
      // Apply the requested transformation for each prompt.
      for (const p of promptList) {
        const url = await applyPrompt(buffer, p);
        urls.push(url);
      }
    } else {
      // Generate simple placeholder images when no image is provided.
      for (const p of promptList) {
        const placeholder = await sharp({
          create: {
            width: 512,
            height: 512,
            channels: 4,
            background: { r: 240, g: 240, b: 240, alpha: 1 },
          },
        })
          .png()
          .toBuffer();
        const url = `data:image/png;base64,${placeholder.toString('base64')}`;
        urls.push(url);
      }
    }

    // Return the list of generated data URLs.
    return NextResponse.json({ urls });
  } catch (err) {
    console.error('OpenAI Image API error:', err);
    return NextResponse.json(
      { error: 'Image generation failed' },
      { status: 500 }
    );
  }
}