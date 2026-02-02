# Progressive Image Generation - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Gemini Imagen integration to generate story cover and slide illustrations progressively in Cloud Functions.

**Architecture:** Two-stage generation - cover image generated immediately after story text (user waits), then slide images generated in background batches while user can start reading.

**Tech Stack:** Firebase Cloud Functions, Gemini Imagen API (imagen-3.0-generate-002), Firebase Storage

---

## CRITICAL GUIDELINES

**Repository:** https://github.com/manganoandrea/Bible-AI.git
**Working Directory:** /Users/andreamangano/Bible-AI

Before ANY code changes:
1. Verify you're in `/Users/andreamangano/Bible-AI`
2. Verify `git remote -v` shows `manganoandrea/Bible-AI.git`
3. This is an **Expo React Native** app with **Firebase Cloud Functions**
4. Cloud Functions are in `/functions/src/`
5. App code is in `/app/`, `/components/`, `/lib/`, `/stores/`

**Companion Types:** lamb, lion, cat, fox (NOT donkey, horse)
**Color Palette:** cream, gold, charcoal, warm-gray, light-gray
**Style:** Soft watercolor children's book illustrations

---

## Phase 1: Update Types & Schema

### Task 1: Update Story Types

**Files:**
- Modify: `types/story.ts`

**Changes:**
Add new status values and image tracking fields:

```typescript
export type StoryStatus =
  | "generating"      // Text being generated
  | "text_ready"      // Text done, starting cover
  | "cover_ready"     // Cover done, user can see reveal
  | "ready"           // All images done
  | "failed";

export interface Slide {
  slideId: string;
  text: string;
  imageUrl: string;
  imageStatus: "pending" | "generating" | "ready" | "failed";
  audioUrl: string;
  isChoicePoint: boolean;
  choices: Choice[];
}

export interface Story {
  // ... existing fields
  status: StoryStatus;
  imagesGenerated: number;
  totalImages: number;
}
```

**Verify:** `npx tsc --noEmit`

**Commit:** `feat: update Story types for progressive image generation`

---

### Task 2: Update Cloud Function Types

**Files:**
- Modify: `functions/src/prompts/types.ts`

**Changes:**
Add StoryStatus type to match app types:

```typescript
export type StoryStatus =
  | "generating"
  | "text_ready"
  | "cover_ready"
  | "ready"
  | "failed";
```

**Verify:** `cd functions && npx tsc --noEmit`

**Commit:** `feat: add StoryStatus type to cloud functions`

---

## Phase 2: Image Generation Infrastructure

### Task 3: Create Storage Upload Helper

**Files:**
- Create: `functions/src/storage.ts`

**Implementation:**
```typescript
import * as admin from "firebase-admin";

const storage = admin.storage();

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
```

**Verify:** `cd functions && npx tsc --noEmit`

**Commit:** `feat: add Firebase Storage upload helper for images`

---

### Task 4: Create Gemini Imagen Helper

**Files:**
- Create: `functions/src/imagen.ts`

**Implementation:**
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateImage(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation"
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ["image", "text"],
    },
  });

  const response = result.response;
  const imagePart = response.candidates?.[0]?.content?.parts?.find(
    (part: any) => part.inlineData?.mimeType?.startsWith("image/")
  );

  if (!imagePart?.inlineData?.data) {
    throw new Error("No image generated");
  }

  return imagePart.inlineData.data; // base64
}
```

**Note:** Uses Gemini 2.0 Flash with image generation capability. Adjust model name if needed based on API availability.

**Verify:** `cd functions && npx tsc --noEmit`

**Commit:** `feat: add Gemini Imagen helper for image generation`

---

## Phase 3: Update Story Generation

### Task 5: Update generateStory for Cover Generation

**Files:**
- Modify: `functions/src/generateStory.ts`

**Changes:**
1. Import new helpers
2. After text generation, update status to "text_ready"
3. Generate cover image using buildCoverPrompt
4. Upload to Storage
5. Update coverImageUrl and status to "cover_ready"
6. Calculate totalImages count

**Key code additions:**
```typescript
import { uploadImageToStorage } from "./storage";
import { generateImage } from "./imagen";

// After parsing story JSON...
await storyRef.update({ status: "text_ready" });

// Generate cover
const coverPrompt = buildCoverPrompt({
  title: storyData.title,
  companionType: params.companionType,
  companionName: params.companionName,
  childName: params.childName || "the child",
});

const coverImageBytes = await generateImage(coverPrompt);
const coverImageUrl = await uploadImageToStorage(
  params.storyId,
  "cover.png",
  coverImageBytes
);

// Calculate total images
const totalImages = storyData.slides.length +
  (storyData.branchSlides?.A?.length || 0) +
  (storyData.branchSlides?.B?.length || 0);

await storyRef.update({
  coverImageUrl,
  status: "cover_ready",
  imagesGenerated: 0,
  totalImages,
});
```

**Verify:** `cd functions && npx tsc --noEmit`

**Commit:** `feat: add cover image generation to story creation`

---

### Task 6: Create Slide Image Generation Function

**Files:**
- Modify: `functions/src/index.ts`
- Create: `functions/src/generateSlideImages.ts`

**New function `generateSlideImages.ts`:**
```typescript
import * as admin from "firebase-admin";
import { generateImage } from "./imagen";
import { uploadImageToStorage } from "./storage";
import { buildImagePrompt, COMPANION_DNA } from "./prompts/imagePrompt";

const BATCH_SIZE = 3;

interface SlideImageParams {
  storyId: string;
  companionType: string;
  companionName: string;
  childName: string;
}

export async function generateSlideImages(params: SlideImageParams): Promise<void> {
  const db = admin.firestore();
  const storyRef = db.collection("stories").doc(params.storyId);
  const storySnap = await storyRef.get();

  if (!storySnap.exists) {
    throw new Error("Story not found");
  }

  const story = storySnap.data()!;
  const allSlides = [
    ...story.slides,
    ...(story.branchSlides?.A || []),
    ...(story.branchSlides?.B || []),
  ];

  let imagesGenerated = 0;

  // Process in batches
  for (let i = 0; i < allSlides.length; i += BATCH_SIZE) {
    const batch = allSlides.slice(i, i + BATCH_SIZE);

    await Promise.all(batch.map(async (slide: any, idx: number) => {
      const slideIndex = i + idx;
      const isKeyFrame = slideIndex === 0 ||
        slideIndex === allSlides.length - 1 ||
        slide.isChoicePoint;

      const prompt = buildImagePrompt({
        sceneDescription: slide.imageDescription || slide.text,
        companionType: params.companionType as any,
        companionName: params.companionName,
        childName: params.childName,
        isKeyFrame,
      });

      try {
        const imageBytes = await generateImage(prompt);
        const imageUrl = await uploadImageToStorage(
          params.storyId,
          `slides/${slide.id}.png`,
          imageBytes
        );

        // Update individual slide
        slide.imageUrl = imageUrl;
        slide.imageStatus = "ready";
      } catch (error) {
        console.error(`Failed to generate image for ${slide.id}:`, error);
        slide.imageStatus = "failed";
      }
    }));

    imagesGenerated += batch.length;

    // Update progress
    await storyRef.update({
      slides: story.slides,
      branchSlides: story.branchSlides,
      imagesGenerated,
    });
  }

  // Mark as fully ready
  await storyRef.update({ status: "ready" });
}
```

**Add trigger in `index.ts`:**
```typescript
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { generateSlideImages } from "./generateSlideImages";

export const onStoryCoverReady = onDocumentUpdated(
  { document: "stories/{storyId}", timeoutSeconds: 540, memory: "2GiB" },
  async (event) => {
    const before = event.data?.before.data();
    const after = event.data?.after.data();

    // Only trigger when status changes to cover_ready
    if (before?.status !== "cover_ready" && after?.status === "cover_ready") {
      const profileSnap = await admin
        .firestore()
        .collection("profiles")
        .doc(after.profileId)
        .get();

      if (!profileSnap.exists) return;
      const profile = profileSnap.data()!;

      await generateSlideImages({
        storyId: event.params.storyId,
        companionType: profile.companionType,
        companionName: profile.companionName || profile.companionType,
        childName: profile.childName || "the child",
      });
    }
  }
);
```

**Verify:** `cd functions && npx tsc --noEmit`

**Commit:** `feat: add progressive slide image generation function`

---

## Phase 4: Update Client App

### Task 7: Update Cover Reveal to Wait for cover_ready

**Files:**
- Modify: `app/(onboarding)/cover-reveal.tsx`

**Changes:**
- Listen for story status changes
- Show loading state until `status === "cover_ready"`
- Display actual coverImageUrl when ready

**Verify:** `npx tsc --noEmit`

**Commit:** `feat: update cover reveal to use real generated cover`

---

### Task 8: Update Story Player for Progressive Images

**Files:**
- Modify: `components/player/StorySlideView.tsx`

**Changes:**
- Check slide.imageStatus before displaying
- Show placeholder/loading while imageStatus is "pending" or "generating"
- Display image when imageStatus is "ready"
- Show error state if imageStatus is "failed"

**Verify:** `npx tsc --noEmit`

**Commit:** `feat: update story player to handle progressive image loading`

---

### Task 9: Update Generating Screen Progress

**Files:**
- Modify: `app/(onboarding)/generating.tsx`

**Changes:**
- Listen for status changes: generating → text_ready → cover_ready
- Update progress based on status transitions
- Navigate to cover-reveal when cover_ready

**Verify:** `npx tsc --noEmit`

**Commit:** `feat: update generating screen for multi-stage progress`

---

## Phase 5: Testing & Polish

### Task 10: Add Error Handling & Retry Logic

**Files:**
- Modify: `functions/src/generateStory.ts`
- Modify: `functions/src/generateSlideImages.ts`

**Changes:**
- Add retry logic for image generation (max 3 attempts)
- Handle rate limiting gracefully
- Log errors with context for debugging

**Verify:** `cd functions && npx tsc --noEmit`

**Commit:** `feat: add retry logic and error handling for image generation`

---

### Task 11: Deploy and Test

**Steps:**
1. Build functions: `cd functions && npm run build`
2. Deploy: `firebase deploy --only functions`
3. Test full flow: onboarding → generating → cover reveal → story player
4. Verify images appear progressively
5. Check Firebase Storage for uploaded images

**Commit:** `chore: prepare for deployment`

---

## Summary

**New Files:**
- `functions/src/storage.ts` - Firebase Storage upload helper
- `functions/src/imagen.ts` - Gemini Imagen API helper
- `functions/src/generateSlideImages.ts` - Background slide generation

**Modified Files:**
- `types/story.ts` - New status values, imageStatus field
- `functions/src/prompts/types.ts` - StoryStatus type
- `functions/src/generateStory.ts` - Cover generation
- `functions/src/index.ts` - New trigger for slide generation
- `app/(onboarding)/cover-reveal.tsx` - Real cover image
- `app/(onboarding)/generating.tsx` - Multi-stage progress
- `components/player/StorySlideView.tsx` - Progressive image loading

**Status Flow:**
```
generating → text_ready → cover_ready → ready
     ↓           ↓            ↓           ↓
  Gemini     Cover gen    Slides gen   Done!
  text API   (1 image)    (background)
```
