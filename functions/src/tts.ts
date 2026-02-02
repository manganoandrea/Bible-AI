import { TextToSpeechClient } from "@google-cloud/text-to-speech";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

let client: TextToSpeechClient | null = null;

function getClient(): TextToSpeechClient {
  if (!client) {
    client = new TextToSpeechClient();
  }
  return client;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generates audio from text using Google Cloud Text-to-Speech.
 * Uses a warm, child-friendly female voice with slightly slower speech rate.
 *
 * @param text - The text to convert to speech
 * @returns Base64-encoded MP3 audio data
 */
export async function generateAudio(text: string): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`TTS generation attempt ${attempt}/${MAX_RETRIES}`);

      const [response] = await getClient().synthesizeSpeech({
        input: { text },
        voice: {
          languageCode: "en-US",
          name: "en-US-Studio-O", // Warm female narrator
        },
        audioConfig: {
          audioEncoding: "MP3",
          speakingRate: 0.9, // Slightly slower for children
          pitch: 0,
        },
      });

      if (!response.audioContent) {
        throw new Error("No audio content in TTS response");
      }

      console.log(`TTS generation succeeded on attempt ${attempt}`);
      return Buffer.from(response.audioContent as Uint8Array).toString("base64");
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.error(`TTS attempt ${attempt} failed:`, lastError.message);

      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * attempt;
        console.log(`Retrying TTS in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  throw new Error(
    `TTS generation failed after ${MAX_RETRIES} attempts: ${lastError?.message}`
  );
}
