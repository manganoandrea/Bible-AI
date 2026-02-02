import { AgeBand, CompanionType, Value } from "./types";

interface StoryPromptParams {
  ageBand: AgeBand;
  companionType: CompanionType;
  companionName: string;
  values: Value[];
  childName: string;
}

const AGE_BAND_GUIDELINES: Record<AgeBand, string> = {
  "3-5": `
- Use very simple vocabulary (sight words, short sentences)
- Maximum 2-3 sentences per slide
- Focus on concrete, tangible concepts
- Emphasize repetition and rhythm
- Include gentle humor and playful elements
- Keep moral lessons implicit through actions
- Total story length: 8-10 slides`,
  "6-8": `
- Use grade-appropriate vocabulary with occasional new words
- 3-4 sentences per slide
- Can introduce abstract concepts with concrete examples
- Include mild conflict that resolves positively
- Characters can face simple moral dilemmas
- More complex narrative structure
- Total story length: 10-12 slides`,
  "9-11": `
- Rich vocabulary with context clues for new words
- 4-5 sentences per slide
- Can handle nuanced moral situations
- Characters experience growth and change
- Include thought-provoking questions
- Deeper exploration of Biblical themes
- Total story length: 12-14 slides`,
};

const COMPANION_PERSONALITIES: Record<CompanionType, string> = {
  lamb: "gentle, curious, sometimes timid but grows in confidence through friendship",
  lion: "brave, protective, learns that true strength comes from kindness",
  cat: "wise, patient, observant, loves learning and shares knowledge gently with quiet confidence",
  fox: "adventurous, clever, curious explorer who finds creative solutions and loves discovery",
};

export function buildStoryPrompt(params: StoryPromptParams): string {
  const { ageBand, companionType, companionName, values, childName } = params;
  const ageGuidelines = AGE_BAND_GUIDELINES[ageBand];
  const companionPersonality = COMPANION_PERSONALITIES[companionType];
  const valuesStr = values.join(", ");

  return `You are a master children's storyteller creating a personalized Bible-inspired storybook.

## STORY PARAMETERS
- Child's name: ${childName}
- Age group: ${ageBand} years old
- Companion animal: ${companionName} the ${companionType}
- Companion personality: ${companionPersonality}
- Core values to teach: ${valuesStr}

## AGE-APPROPRIATE GUIDELINES
${ageGuidelines}

## STORY STRUCTURE
Create an engaging, interactive story with ONE choice point that branches into two different paths.

The story should:
1. Begin with ${childName} meeting or being with ${companionName}
2. Introduce a gentle challenge or adventure inspired by Biblical themes
3. At approximately 40% through the story, present a meaningful CHOICE POINT
4. Each choice leads to a different but equally valuable lesson
5. Both branches should positively reinforce the selected values
6. End with a heartwarming conclusion that reinforces the friendship

## CHOICE POINT GUIDELINES
- The choice should be age-appropriate and meaningful
- Neither choice is "wrong" - both lead to positive outcomes
- Each branch teaches the values in slightly different ways
- Label choices clearly as "Choice A" and "Choice B"

## OUTPUT FORMAT
Return a valid JSON object with this exact structure:

{
  "title": "Story title here",
  "slides": [
    {
      "id": "slide-1",
      "text": "Story text for this slide",
      "imageDescription": "Detailed description of the illustration for this slide"
    }
  ],
  "choicePointSlideId": "slide-X",
  "choices": {
    "A": {
      "label": "Short label for choice A (max 4 words)",
      "description": "Brief description of what happens if child chooses this"
    },
    "B": {
      "label": "Short label for choice B (max 4 words)",
      "description": "Brief description of what happens if child chooses this"
    }
  },
  "branchSlides": {
    "A": [
      {
        "id": "branch-a-1",
        "text": "Story continuation for branch A",
        "imageDescription": "Detailed description of the illustration"
      }
    ],
    "B": [
      {
        "id": "branch-b-1",
        "text": "Story continuation for branch B",
        "imageDescription": "Detailed description of the illustration"
      }
    ]
  }
}

## IMAGE DESCRIPTION GUIDELINES
For each slide's imageDescription, provide:
- The scene setting (location, time of day, weather)
- Character positions and expressions
- Key objects or elements in the scene
- The emotional tone/mood
- Keep descriptions child-friendly and visually appealing

## IMPORTANT RULES
1. Output ONLY valid JSON - no markdown, no code blocks, no explanations
2. Ensure all slide IDs are unique
3. The choicePointSlideId must match an existing slide ID
4. Each branch should have 3-5 slides depending on age group
5. Keep ${companionName} present and active throughout the story
6. Reference the child by name (${childName}) naturally throughout
7. Make the story feel personal and magical

Generate the complete story now:`;
}
