# Audio/TTS Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Google Cloud Text-to-Speech narration to story slides, generated progressively alongside images.

**Architecture:** Extend existing slide generation to include audio. Each slide gets image + audio generated together.

**Tech Stack:** Google Cloud Text-to-Speech, Firebase Storage, expo-av for playback

---

## CRITICAL GUIDELINES

**Repository:** https://github.com/manganoandrea/Bible-AI.git
**Working Directory:** /Users/andreamangano/Bible-AI

Before ANY code changes:
1. Verify you're in `/Users/andreamangano/Bible-AI`
2. Verify `git remote -v` shows `manganoandrea/Bible-AI.git`
3. Cloud Functions are in `/functions/src/`
4. App code is in `/app/`, `/components/`, `/lib/`, `/stores/`

**Voice Configuration:**
- Voice: `en-US-Studio-O` (warm female narrator)
- Speaking rate: 0.9 (slightly slower for children)
- Format: MP3

---

## Phase 1: Update Types

### Task 1: Add audioStatus to Story Types

**Files:**
- Modify: `types/story.ts`

**Changes:**
Add `audioStatus` field to StorySlide interface:

```typescript
export interface StorySlide {
  slideId: string;
  text: string;
  imageUrl: string;
  imageStatus: "pending" | "generating" | "ready" | "failed";
  audioUrl: string;
  audioStatus: "pending" | "generating" | "ready" | "failed";  // NEW
  isChoicePoint: boolean;
  choices: StoryChoice[];
}
```

**Verify:** `npx tsc --noEmit`

**Commit:** `feat: add audioStatus field to StorySlide type`

---

## Phase 2: TTS Infrastructure

### Task 2: Install Google Cloud TTS Package

**Commands:**
```bash
cd functions
npm install @google-cloud/text-to-speech
npm install --save-dev @types/google-cloud__text-to-speech
cd ..
```

**Commit:** `chore: add Google Cloud TTS dependency`

---

### Task 3: Create TTS Helper Function

**Files:**
- Create: `functions/src/tts.ts`

**Implementation:**
```typescript
import { TextToSpeechClient } from "@google-cloud/text-to-speech";

const client = new TextToSpeechClient();

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateAudio(text: string): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`TTS generation attempt ${attempt}/${MAX_RETRIES}`);

      const [response] = await client.synthesizeSpeech({
        input: { text },
        voice: {
          languageCode: "en-US",
          name: "en-US-Studio-O",
        },
        audioConfig: {
          audioEncoding: "MP3",
          speakingRate: 0.9,
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
        await sleep(RETRY_DELAY_MS * attempt);
      }
    }
  }

  throw new Error(`TTS generation failed after ${MAX_RETRIES} attempts: ${lastError?.message}`);
}
```

**Verify:** `cd functions && npx tsc --noEmit`

**Commit:** `feat: add Google Cloud TTS helper with retry logic`

---

### Task 4: Update Storage Helper for Audio

**Files:**
- Modify: `functions/src/storage.ts`

**Changes:**
Add a function for uploading audio files:

```typescript
export async function uploadAudioToStorage(
  storyId: string,
  audioName: string,
  audioBytes: string // base64
): Promise<string> {
  const bucket = storage.bucket();
  const filePath = `stories/${storyId}/audio/${audioName}`;
  const file = bucket.file(filePath);

  const buffer = Buffer.from(audioBytes, "base64");

  await file.save(buffer, {
    metadata: {
      contentType: "audio/mpeg",
    },
  });

  await file.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
}
```

**Verify:** `cd functions && npx tsc --noEmit`

**Commit:** `feat: add audio upload helper to storage`

---

## Phase 3: Integrate Audio Generation

### Task 5: Update generateStory for Audio Status

**Files:**
- Modify: `functions/src/generateStory.ts`

**Changes:**
When creating slides with `imageStatus: "pending"`, also add `audioStatus: "pending"`:

```typescript
const slidesWithStatus = processedSlides.map((s: any) => ({
  ...s,
  imageStatus: "pending",
  audioStatus: "pending",  // ADD THIS
}));
```

Apply same change to branch slides.

**Verify:** `cd functions && npx tsc --noEmit`

**Commit:** `feat: initialize audioStatus for slides in story generation`

---

### Task 6: Update generateSlideImages to Include Audio

**Files:**
- Modify: `functions/src/generateSlideImages.ts`

**Changes:**

1. Import TTS and audio upload:
```typescript
import { generateAudio } from "./tts";
import { uploadImageToStorage, uploadAudioToStorage } from "./storage";
```

2. After generating image for each slide, also generate audio:
```typescript
// After image generation succeeds...
try {
  const audioBytes = await generateAudio(slide.text);
  const audioUrl = await uploadAudioToStorage(
    storyId,
    `${slide.id}.mp3`,
    audioBytes
  );
  mainSlides[slideIndex].audioUrl = audioUrl;
  mainSlides[slideIndex].audioStatus = "ready";
} catch (audioError) {
  console.error(`Failed to generate audio for slide ${slide.id}:`, audioError);
  mainSlides[slideIndex].audioStatus = "failed";
}
```

3. Apply same pattern to branch A and branch B slides.

**Verify:** `cd functions && npx tsc --noEmit`

**Commit:** `feat: add audio generation to slide processing`

---

## Phase 4: Client-Side Audio Playback

### Task 7: Install expo-av

**Commands:**
```bash
npx expo install expo-av
```

**Commit:** `chore: add expo-av for audio playback`

---

### Task 8: Create Audio Player Hook

**Files:**
- Create: `hooks/useStoryAudio.ts`

**Implementation:**
```typescript
import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";

interface UseStoryAudioProps {
  audioUrl: string | undefined;
  audioStatus: string | undefined;
  autoPlay?: boolean;
}

export function useStoryAudio({ audioUrl, audioStatus, autoPlay = true }: UseStoryAudioProps) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadAudio() {
      if (!audioUrl || audioStatus !== "ready") return;

      try {
        // Unload previous sound
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
        }

        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: autoPlay }
        );

        if (!isMounted) {
          await sound.unloadAsync();
          return;
        }

        soundRef.current = sound;
        setIsLoaded(true);
        setIsPlaying(autoPlay);

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded) {
            setIsPlaying(status.isPlaying);
            if (status.didJustFinish) {
              setIsPlaying(false);
            }
          }
        });
      } catch (error) {
        console.error("Failed to load audio:", error);
      }
    }

    loadAudio();

    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, [audioUrl, audioStatus, autoPlay]);

  const play = async () => {
    if (soundRef.current) {
      await soundRef.current.playAsync();
    }
  };

  const pause = async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
    }
  };

  const replay = async () => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(0);
      await soundRef.current.playAsync();
    }
  };

  return { isPlaying, isLoaded, play, pause, replay };
}
```

**Verify:** `npx tsc --noEmit`

**Commit:** `feat: add useStoryAudio hook for audio playback`

---

### Task 9: Update StorySlideView for Audio

**Files:**
- Modify: `components/player/StorySlideView.tsx`

**Changes:**
Add audioUrl and audioStatus props, integrate useStoryAudio:

```typescript
import { View, Image, ActivityIndicator, Text, Pressable } from "react-native";
import { TextBubble } from "./TextBubble";
import { useStoryAudio } from "@/hooks/useStoryAudio";

type ImageStatus = "pending" | "generating" | "ready" | "failed";
type AudioStatus = "pending" | "generating" | "ready" | "failed";

interface StorySlideViewProps {
  imageUrl: string;
  imageStatus: ImageStatus;
  audioUrl: string;
  audioStatus: AudioStatus;
  text: string;
  showText: boolean;
}

export function StorySlideView({
  imageUrl,
  imageStatus,
  audioUrl,
  audioStatus,
  text,
  showText,
}: StorySlideViewProps) {
  const { isPlaying, isLoaded, play, pause, replay } = useStoryAudio({
    audioUrl,
    audioStatus,
    autoPlay: true,
  });

  // ... existing renderImage code ...

  return (
    <View className="flex-1">
      <View className="flex-1 bg-charcoal items-center justify-center">
        {renderImage()}
      </View>

      {/* Audio controls */}
      {audioStatus === "ready" && isLoaded && (
        <View className="absolute top-4 right-4 flex-row gap-2">
          <Pressable
            onPress={isPlaying ? pause : play}
            className="bg-white/80 rounded-full w-10 h-10 items-center justify-center"
          >
            <Text className="text-lg">{isPlaying ? "⏸" : "▶️"}</Text>
          </Pressable>
          <Pressable
            onPress={replay}
            className="bg-white/80 rounded-full w-10 h-10 items-center justify-center"
          >
            <Text className="text-lg">🔄</Text>
          </Pressable>
        </View>
      )}

      <TextBubble text={text} visible={showText} />
    </View>
  );
}
```

**Verify:** `npx tsc --noEmit`

**Commit:** `feat: add audio playback controls to story player`

---

### Task 10: Update Story Player to Pass Audio Props

**Files:**
- Modify: `app/story/[id].tsx`

**Changes:**
Pass audioUrl and audioStatus to StorySlideView:

```typescript
<StorySlideView
  imageUrl={currentSlide.imageUrl}
  imageStatus={currentSlide.imageStatus}
  audioUrl={currentSlide.audioUrl}
  audioStatus={currentSlide.audioStatus}
  text={currentSlide.text}
  showText={showText}
/>
```

Also update mock data to include audioStatus: "ready" for testing.

**Verify:** `npx tsc --noEmit`

**Commit:** `feat: wire audio props through story player`

---

## Phase 5: Final Verification

### Task 11: Build and Test

**Steps:**
1. Build functions: `cd functions && npm run build`
2. Verify app: `npx tsc --noEmit`
3. Push to GitHub: `git push origin main`

**Commit:** `chore: prepare audio TTS for deployment`

---

## Summary

**New Files:**
- `functions/src/tts.ts` - Google Cloud TTS helper
- `hooks/useStoryAudio.ts` - Audio playback hook

**Modified Files:**
- `types/story.ts` - Add audioStatus field
- `functions/src/storage.ts` - Add audio upload function
- `functions/src/generateStory.ts` - Initialize audioStatus
- `functions/src/generateSlideImages.ts` - Generate audio with images
- `components/player/StorySlideView.tsx` - Audio controls
- `app/story/[id].tsx` - Pass audio props

**Audio Flow:**
```
Slide generation starts
       ↓
Generate image → upload → update imageUrl/imageStatus
       ↓
Generate audio → upload → update audioUrl/audioStatus
       ↓
Update Firestore with both
       ↓
Client loads slide → auto-plays audio
```

**Google Cloud Setup Required:**
1. Enable Cloud Text-to-Speech API in Google Cloud Console
2. Ensure Firebase service account has TTS permissions
3. Or set GOOGLE_APPLICATION_CREDENTIALS for local development
