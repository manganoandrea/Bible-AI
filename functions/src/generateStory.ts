import { GoogleGenerativeAI } from "@google/generative-ai";
import * as admin from "firebase-admin";
import { AgeBand, CompanionType, Value } from "./prompts/types";
import { buildStoryPrompt } from "./prompts/storyPrompt";
import { buildImagePrompt, buildCoverPrompt, COMPANION_DNA } from "./prompts/imagePrompt";
import { uploadImageToStorage } from "./storage";
import { generateImage } from "./imagen";

/**
 * Sanitizes user input to prevent prompt injection attacks.
 * Removes newlines, control characters, and special prompt injection patterns.
 */
function sanitizeUserInput(input: string | undefined, maxLength = 50): string {
  if (!input) return "";
  // Remove newlines, control characters, and special prompt injection patterns
  return input
    .replace(/[\n\r\t]/g, " ")
    .replace(/[#*`]/g, "")
    .slice(0, maxLength)
    .trim();
}

interface Slide {
  id: string;
  text: string;
  imageDescription: string;
  imagePrompt?: string;
  isChoicePoint?: boolean;
  choices?: {
    A: { label: string; description: string };
    B: { label: string; description: string };
  };
}

interface StoryChoice {
  label: string;
  description: string;
}

interface StoryGenerationResult {
  title: string;
  slides: Slide[];
  choicePointSlideId: string;
  choices: {
    A: StoryChoice;
    B: StoryChoice;
  };
  branchSlides: {
    A: Slide[];
    B: Slide[];
  };
  valuesReinforced?: Value[];
}

interface GenerateStoryParams {
  storyId: string;
  childName: string;
  ageBand: AgeBand;
  companionType: CompanionType;
  companionName: string;
  values: Value[];
}

/**
 * Extracts JSON from a string that may contain markdown code blocks or other text.
 */
function extractJson(text: string): string {
  // Try to find JSON in code blocks first
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  // Try to find raw JSON object
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return jsonMatch[0];
  }

  return text.trim();
}

/**
 * Validates the parsed story structure.
 */
function validateStoryStructure(data: unknown): data is StoryGenerationResult {
  if (!data || typeof data !== "object") return false;

  const story = data as Record<string, unknown>;

  if (typeof story.title !== "string") return false;
  if (!Array.isArray(story.slides)) return false;
  if (typeof story.choicePointSlideId !== "string") return false;
  if (!story.choices || typeof story.choices !== "object") return false;
  if (!story.branchSlides || typeof story.branchSlides !== "object") return false;

  // Validate slides have required fields
  for (const slide of story.slides) {
    if (!slide || typeof slide !== "object") return false;
    const s = slide as Record<string, unknown>;
    if (typeof s.id !== "string" || typeof s.text !== "string") return false;
  }

  // Validate branch slides
  const branches = story.branchSlides as Record<string, unknown>;
  if (!Array.isArray(branches.A) || !Array.isArray(branches.B)) return false;

  return true;
}

/**
 * Main story generation orchestrator.
 * Calls Gemini API to generate story structure, then processes and stores results.
 */
export async function generateStory(params: GenerateStoryParams): Promise<void> {
  const { storyId, ageBand, companionType, values } = params;
  // Sanitize user-provided strings to prevent prompt injection
  const childName = sanitizeUserInput(params.childName);
  const companionName = sanitizeUserInput(params.companionName);
  const db = admin.firestore();
  const storyRef = db.collection("stories").doc(storyId);

  try {
    // Initialize Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Build the story prompt
    const storyPrompt = buildStoryPrompt({
      ageBand,
      companionType,
      companionName,
      values,
      childName,
    });

    // Generate story with Gemini
    console.log(`Generating story for storyId: ${storyId}`);
    const result = await model.generateContent(storyPrompt);
    const response = result.response;
    const responseText = response.text();

    // Extract and parse JSON
    const jsonText = extractJson(responseText);
    let storyData: StoryGenerationResult;

    try {
      storyData = JSON.parse(jsonText) as StoryGenerationResult;
    } catch (parseError) {
      console.error("Failed to parse story JSON:", parseError);
      console.error("Raw response:", responseText);
      throw new Error("Failed to parse story structure from AI response");
    }

    // Validate story structure
    if (!validateStoryStructure(storyData)) {
      console.error("Invalid story structure:", storyData);
      throw new Error("Generated story has invalid structure");
    }

    // Update status to text_ready after successful text generation
    await storyRef.update({ status: "text_ready" });

    // Process slides - add image prompts
    const processedSlides: Slide[] = storyData.slides.map((slide) => {
      const isChoicePoint = slide.id === storyData.choicePointSlideId;

      const processedSlide: Slide = {
        ...slide,
        imagePrompt: buildImagePrompt({
          sceneDescription: slide.imageDescription,
          companionType,
          companionName,
          childName,
          isKeyFrame: isChoicePoint,
        }),
      };

      // Attach choices to the choice point slide
      if (isChoicePoint) {
        processedSlide.isChoicePoint = true;
        processedSlide.choices = storyData.choices;
      }

      return processedSlide;
    });

    // Process branch slides - add image prompts
    const processedBranchSlides = {
      A: storyData.branchSlides.A.map((slide, index, arr) => ({
        ...slide,
        imagePrompt: buildImagePrompt({
          sceneDescription: slide.imageDescription,
          companionType,
          companionName,
          childName,
          isKeyFrame: index === 0 || index === arr.length - 1,
        }),
      })),
      B: storyData.branchSlides.B.map((slide, index, arr) => ({
        ...slide,
        imagePrompt: buildImagePrompt({
          sceneDescription: slide.imageDescription,
          companionType,
          companionName,
          childName,
          isKeyFrame: index === 0 || index === arr.length - 1,
        }),
      })),
    };

    // Generate cover prompt and image
    const coverPrompt = buildCoverPrompt({
      title: storyData.title,
      companionType,
      companionName,
      childName: childName || "the child",
    });

    const coverImageBytes = await generateImage(coverPrompt);
    const coverImageUrl = await uploadImageToStorage(
      storyId,
      "cover.png",
      coverImageBytes
    );

    // Calculate total images needed for all slides
    const totalImages = processedSlides.length +
      (processedBranchSlides?.A?.length || 0) +
      (processedBranchSlides?.B?.length || 0);

    // Add imageStatus: "pending" to all slides
    const slidesWithStatus = processedSlides.map((s: any) => ({
      ...s,
      imageStatus: "pending",
    }));

    const branchSlidesWithStatus = {
      A: processedBranchSlides.A.map((s: any) => ({
        ...s,
        imageStatus: "pending",
      })),
      B: processedBranchSlides.B.map((s: any) => ({
        ...s,
        imageStatus: "pending",
      })),
    };

    // Update Firestore with generated story and cover_ready status
    await storyRef.update({
      title: storyData.title,
      coverImageUrl,
      slides: slidesWithStatus,
      branchSlides: branchSlidesWithStatus,
      choicePointSlideId: storyData.choicePointSlideId,
      coverPrompt,
      companionDna: COMPANION_DNA[companionType],
      valuesReinforced: storyData.valuesReinforced || values,
      status: "cover_ready",
      imagesGenerated: 0,
      totalImages,
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`Story generation complete for storyId: ${storyId}`);
  } catch (error) {
    console.error(`Story generation failed for storyId: ${storyId}`, error);

    // Update Firestore with failed status
    await storyRef.update({
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown error occurred",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    throw error;
  }
}
