import { GoogleGenerativeAI } from "@google/generative-ai";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

let genAI: GoogleGenerativeAI | null = null;

function getGenAI(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateImage(prompt: string): Promise<string> {
  const model = getGenAI().getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation",
  });

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`Image generation attempt ${attempt}/${MAX_RETRIES}`);

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ["image", "text"],
        } as any,
      });

      const response = result.response;
      const imagePart = response.candidates?.[0]?.content?.parts?.find(
        (part: any) => part.inlineData?.mimeType?.startsWith("image/")
      );

      if (!imagePart?.inlineData?.data) {
        throw new Error("No image generated from Gemini");
      }

      console.log(`Image generation succeeded on attempt ${attempt}`);
      return imagePart.inlineData.data; // base64
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`Image generation attempt ${attempt} failed:`, lastError.message);

      // Check if it's a rate limit error
      const isRateLimit = lastError.message.toLowerCase().includes("rate") ||
        lastError.message.toLowerCase().includes("quota") ||
        lastError.message.includes("429");

      if (attempt < MAX_RETRIES) {
        const delay = isRateLimit ? RETRY_DELAY_MS * attempt : RETRY_DELAY_MS;
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  throw new Error(`Image generation failed after ${MAX_RETRIES} attempts: ${lastError?.message}`);
}
