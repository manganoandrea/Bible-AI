import { CompanionType } from "./types";

/**
 * Visual DNA descriptions for each companion type.
 * These ensure consistent character rendering across all illustrations.
 */
export const COMPANION_DNA: Record<CompanionType, string> = {
  lamb: `A small, fluffy white lamb with soft woolly fur. Round gentle eyes with long eyelashes.
Small pink nose and tiny cloven hooves. Wears a blue bow ribbon around neck.
Expression is sweet and innocent. Semi-anthropomorphic, standing upright.
Friendly mascot style, soft watercolor aesthetic.`,

  lion: `A young, friendly lion cub with a small golden mane just starting to grow.
Warm amber eyes that sparkle with curiosity and kindness. Soft golden-tan fur.
Wears a cute blue vest with buttons. Paws are slightly oversized giving an endearing appearance.
Semi-anthropomorphic, standing upright. Gentle and approachable, never scary.`,

  cat: `An orange tabby cat with warm ginger fur and cream chest.
Large expressive eyes behind round scholarly glasses. Wears a cozy red scarf.
Holds a scroll or book, suggesting wisdom and learning.
Semi-anthropomorphic, standing upright. Patient and wise expression with quiet confidence.`,

  fox: `A friendly orange fox with bright russet fur and white chest and muzzle.
Warm brown eyes with a clever, friendly expression. Fluffy tail with white tip.
Wears a brown leather messenger satchel for adventures.
Semi-anthropomorphic, standing upright. Adventurous and curious, always ready to explore.`,
};

interface ImagePromptParams {
  sceneDescription: string;
  companionType: CompanionType;
  companionName: string;
  childName: string;
  isKeyFrame: boolean;
}

interface CoverPromptParams {
  title: string;
  companionType: CompanionType;
  companionName: string;
  childName: string;
}

/**
 * Builds a detailed image prompt for story slide illustrations.
 */
export function buildImagePrompt(params: ImagePromptParams): string {
  const { sceneDescription, companionType, companionName, childName, isKeyFrame } = params;
  const companionDna = COMPANION_DNA[companionType];

  return `Create a warm, inviting children's book illustration in a soft watercolor style.

## SCENE
${sceneDescription}

## CHARACTER: ${companionName} (the ${companionType})
${companionDna}

## CHILD CHARACTER: ${childName}
A friendly, diverse-representation child (leave ethnicity ambiguous to allow reader projection).
Wearing comfortable, timeless clothing in warm earth tones.
Expressions should be clear and relatable.
Approximately 6-8 years old in appearance.

## ART STYLE REQUIREMENTS
- ${isKeyFrame ? "Detailed, fully rendered scene" : "Softer, more atmospheric rendering"}
- Soft, dreamy watercolor aesthetic with gentle color palette
- Warm, golden lighting suggesting hope and comfort
- Biblical-era inspired backgrounds when appropriate (simple villages, fields, nature)
- No modern technology or contemporary elements
- Whimsical but not overly cartoonish
- Child-safe imagery - nothing scary or intense
- Emotionally expressive characters
- Rich textures and gentle gradients
- Suitable for a premium children's storybook

## COMPOSITION
- Characters should be prominently featured
- Clear focal point
- Balanced composition suitable for book format
- Leave some space for text overlay if needed

## IMPORTANT
- Maintain consistent character design for ${companionName}
- Keep the mood uplifting and child-appropriate
- Capture the emotional essence of the scene
- No text or words in the image`;
}

/**
 * Builds a detailed prompt for the book cover illustration.
 */
export function buildCoverPrompt(params: CoverPromptParams): string {
  const { title, companionType, companionName, childName } = params;
  const companionDna = COMPANION_DNA[companionType];

  return `Create a stunning children's book cover illustration in a premium watercolor style.

## BOOK TITLE
"${title}"

## MAIN CHARACTERS
${companionName} (the ${companionType}):
${companionDna}

${childName} (the child protagonist):
A friendly, diverse-representation child (leave ethnicity ambiguous to allow reader projection).
Wearing comfortable, timeless clothing in warm earth tones.
Joyful, welcoming expression inviting the reader into the story.

## COVER COMPOSITION
- ${childName} and ${companionName} together as the central focus
- Warm, inviting scene suggesting adventure and friendship
- Biblical-era inspired setting (rolling hills, olive trees, soft sky)
- Golden hour lighting with soft, warm tones
- Sense of wonder and magic
- Premium, high-quality children's book aesthetic

## ART STYLE
- Rich, luminous watercolor technique
- Dreamy, ethereal quality
- Soft color palette with warm accents
- Professional children's book illustration quality
- Emotionally engaging and inviting
- Would look beautiful as a keepsake book

## REQUIREMENTS
- Portrait orientation suitable for book cover
- Leave appropriate space at top for title text
- Leave appropriate space at bottom for author/personalization
- Characters should connect emotionally with viewer
- Capture the special bond between child and companion
- No text or words in the image itself

## MOOD
Magical, heartwarming, adventurous yet safe, filled with hope and wonder.`;
}
