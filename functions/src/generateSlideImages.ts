import * as admin from "firebase-admin";
import { generateImage } from "./imagen";
import { uploadImageToStorage } from "./storage";
import { buildImagePrompt } from "./prompts/imagePrompt";
import type { CompanionType } from "./prompts/types";

const BATCH_SIZE = 3;

interface SlideImageParams {
  storyId: string;
  companionType: CompanionType;
  companionName: string;
  childName: string;
}

export async function generateSlideImages(params: SlideImageParams): Promise<void> {
  const { storyId, companionType, companionName, childName } = params;
  const db = admin.firestore();
  const storyRef = db.collection("stories").doc(storyId);

  const storySnap = await storyRef.get();
  if (!storySnap.exists) {
    throw new Error("Story not found");
  }

  const story = storySnap.data()!;

  // Collect all slides that need images
  const mainSlides = story.slides || [];
  const branchASlides = story.branchSlides?.A || [];
  const branchBSlides = story.branchSlides?.B || [];

  let imagesGenerated = 0;

  // Process main slides
  for (let i = 0; i < mainSlides.length; i += BATCH_SIZE) {
    const batch = mainSlides.slice(i, Math.min(i + BATCH_SIZE, mainSlides.length));

    await Promise.all(batch.map(async (slide: any, batchIdx: number) => {
      const slideIndex = i + batchIdx;
      const isKeyFrame = slideIndex === 0 ||
        slideIndex === mainSlides.length - 1 ||
        slide.isChoicePoint;

      try {
        const prompt = buildImagePrompt({
          sceneDescription: slide.imageDescription || slide.text,
          companionType,
          companionName,
          childName,
          isKeyFrame,
        });

        const imageBytes = await generateImage(prompt);
        const imageUrl = await uploadImageToStorage(
          storyId,
          `slides/${slide.id}.png`,
          imageBytes
        );

        mainSlides[slideIndex].imageUrl = imageUrl;
        mainSlides[slideIndex].imageStatus = "ready";
      } catch (error) {
        console.error(`Failed to generate image for slide ${slide.id}:`, error);
        mainSlides[slideIndex].imageStatus = "failed";
      }
    }));

    imagesGenerated += batch.length;
    await storyRef.update({ slides: mainSlides, imagesGenerated });
  }

  // Process branch A slides
  for (let i = 0; i < branchASlides.length; i += BATCH_SIZE) {
    const batch = branchASlides.slice(i, Math.min(i + BATCH_SIZE, branchASlides.length));

    await Promise.all(batch.map(async (slide: any, batchIdx: number) => {
      const slideIndex = i + batchIdx;
      const isKeyFrame = slideIndex === 0 || slideIndex === branchASlides.length - 1;

      try {
        const prompt = buildImagePrompt({
          sceneDescription: slide.imageDescription || slide.text,
          companionType,
          companionName,
          childName,
          isKeyFrame,
        });

        const imageBytes = await generateImage(prompt);
        const imageUrl = await uploadImageToStorage(
          storyId,
          `slides/branch-a-${slide.id}.png`,
          imageBytes
        );

        branchASlides[slideIndex].imageUrl = imageUrl;
        branchASlides[slideIndex].imageStatus = "ready";
      } catch (error) {
        console.error(`Failed to generate image for branch A slide ${slide.id}:`, error);
        branchASlides[slideIndex].imageStatus = "failed";
      }
    }));

    imagesGenerated += batch.length;
    await storyRef.update({
      "branchSlides.A": branchASlides,
      imagesGenerated
    });
  }

  // Process branch B slides (same pattern)
  for (let i = 0; i < branchBSlides.length; i += BATCH_SIZE) {
    const batch = branchBSlides.slice(i, Math.min(i + BATCH_SIZE, branchBSlides.length));

    await Promise.all(batch.map(async (slide: any, batchIdx: number) => {
      const slideIndex = i + batchIdx;
      const isKeyFrame = slideIndex === 0 || slideIndex === branchBSlides.length - 1;

      try {
        const prompt = buildImagePrompt({
          sceneDescription: slide.imageDescription || slide.text,
          companionType,
          companionName,
          childName,
          isKeyFrame,
        });

        const imageBytes = await generateImage(prompt);
        const imageUrl = await uploadImageToStorage(
          storyId,
          `slides/branch-b-${slide.id}.png`,
          imageBytes
        );

        branchBSlides[slideIndex].imageUrl = imageUrl;
        branchBSlides[slideIndex].imageStatus = "ready";
      } catch (error) {
        console.error(`Failed to generate image for branch B slide ${slide.id}:`, error);
        branchBSlides[slideIndex].imageStatus = "failed";
      }
    }));

    imagesGenerated += batch.length;
    await storyRef.update({
      "branchSlides.B": branchBSlides,
      imagesGenerated
    });
  }

  // Mark story as fully ready
  await storyRef.update({ status: "ready" });
}
