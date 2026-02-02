import * as admin from "firebase-admin";

const storage = admin.storage();

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
  const bucket = storage.bucket();
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
