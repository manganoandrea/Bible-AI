import * as admin from "firebase-admin";

function getStorage() {
  return admin.storage();
}

/**
 * Uploads a base64-encoded image to Firebase Storage.
 *
 * @param storyId - The unique identifier for the story
 * @param imageName - The name of the image file (e.g., "page1.png")
 * @param imageBytes - The base64-encoded image data
 * @returns The public URL of the uploaded image
 */
export async function uploadImageToStorage(
  storyId: string,
  imageName: string,
  imageBytes: string // base64
): Promise<string> {
  const bucket = getStorage().bucket();
  const filePath = `stories/${storyId}/${imageName}`;
  const file = bucket.file(filePath);

  const buffer = Buffer.from(imageBytes, "base64");

  await file.save(buffer, {
    metadata: {
      contentType: "image/png",
    },
  });

  // Make publicly accessible
  await file.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
}

/**
 * Uploads base64-encoded audio to Firebase Storage.
 *
 * @param storyId - The unique identifier for the story
 * @param audioName - The name of the audio file (e.g., "slide-1.mp3")
 * @param audioBytes - The base64-encoded audio data
 * @returns The public URL of the uploaded audio
 */
export async function uploadAudioToStorage(
  storyId: string,
  audioName: string,
  audioBytes: string // base64
): Promise<string> {
  const bucket = getStorage().bucket();
  const filePath = `stories/${storyId}/audio/${audioName}`;
  const file = bucket.file(filePath);

  const buffer = Buffer.from(audioBytes, "base64");

  await file.save(buffer, {
    metadata: {
      contentType: "audio/mpeg",
    },
  });

  // Make publicly accessible
  await file.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
}
