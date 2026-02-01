# Bible-AI MVP Design Document

**Date:** 2026-02-01
**Status:** Approved
**Version:** 1.0

---

## 1. Product Overview

Bible-AI is a mobile app that generates personalized, illustrated, interactive Bible-inspired storybooks for children ages 3-11. Parents set up a child profile with an age band, choose a semi-anthropomorphic animal companion, and select up to 3 values to practice. The AI generates a 15-slide watercolor-style storybook with narration where the child makes 2-3 choices that shape the narrative and gently reinforce the selected values.

### Core Differentiators

- **Bible-focused** — No competitor specializes in faith-based AI storybooks.
- **Interactive branching** — Kids make choices that change the story. No competitor offers this.
- **Values reinforcement** — Choices are tied to values like kindness, courage, honesty. The companion gently reacts to value-aligned decisions.
- **Personalized** — The child's companion, name, and values are woven into every AI-generated story.

### Competitive Landscape

| Competitor | Price | AI Images | Branching | Faith-Based |
|------------|-------|-----------|-----------|-------------|
| Google Gemini Storybook | Free | Yes (Nano Banana) | No | No |
| StorySpark.AI | ~$32/mo | Yes (imperfect consistency) | No | No |
| StoryBee | $5/mo | Limited | No | No |
| **Bible-AI** | **$9.99/mo** | **Yes (Nano Banana)** | **Yes** | **Yes** |

---

## 2. Target Audience

- **Primary user:** Parents of children ages 3-11 who want faith-based content.
- **End user:** Children ages 3-11 who read/listen to stories.
- **Age bands:** 3-5 / 6-8 / 9-11 (affects vocabulary, story length, and choice complexity).

---

## 3. Onboarding Flow

10 screens, portrait orientation, bottom-aligned CTAs, 48dp+ tap targets throughout.

### S0 — Welcome

- Full-screen soft watercolor background (warm cream/golden tones).
- **Headline:** "Bible-inspired interactive stories for kids"
- **Subhead:** "Pick a Companion. Choose values. Your child makes choices that shape the story."
- **Primary CTA:** "Get started"
- **Secondary:** "How it works" opens a 3-card explainer (Create, Read, Learn).

### S1 — Parent Confirmation

- Calm, trust-building screen.
- **Title:** "For parents"
- **Body bullets:**
  - "Parents create stories. Kids read and play."
  - "Stories are gentle and Bible-inspired."
- **Primary CTA:** "I'm a parent / guardian"
- **Footer:** Privacy and Terms links.

### S2 — Child Profile

- **Title:** "Who are we reading for?"
- **Fields:**
  - Child nickname (optional): placeholder "e.g., Mia"
  - Age band (required): 3-5 / 6-8 / 9-11
- **Helper text:** "Age sets vocabulary, length, and choices."
- **Primary CTA:** "Continue"

### S3 — Choose Companion

- Grid of 4 semi-anthropomorphic biblical animals.
- Each card shows the animal in watercolor style with name and trait tag.
- **Companions:**

| Animal | Trait | Biblical Connection |
|--------|-------|---------------------|
| Lamb | Gentle | Lamb of God, Good Shepherd, lost sheep parable |
| Lion | Brave | Lion of Judah, Daniel in the lion's den |
| Donkey | Faithful | Balaam's donkey, carried Mary to Bethlehem, Palm Sunday |
| Horse | Courageous | Chariots of fire, Revelation, journey stories |

- Semi-anthropomorphic style: clearly animals, but can stand upright and use expressions/gestures when the story requires it. Think Bluey energy.
- **Optional:** Bottom sheet to name the companion (placeholder: "e.g., Sunny").
- **Primary CTA:** "Choose this Companion"

### S4 — Pick Values

- **Title:** "What values do you want to practice?"
- **Chip selector (max 3):** Kindness, Courage, Honesty, Patience, Gratitude, Forgiveness, Humility, Self-control.
- **Helper text:** "Your child's choices will reinforce these values."
- **Primary CTA:** "Continue"

### S5 — Preparation (Cover Generation)

- **Title:** "Preparing your story..."
- **Stepper (always show, 4 stages):**
  1. "Setting your Companion"
  2. "Loading illustrations"
  3. "Getting the narrator ready"
  4. "Building your story paths"
- Minimum display time ~2 seconds to feel intentional (even though only cover is generated here).
- **Rotating delight lines:**
  - "Your Companion is packing their satchel..."
  - "Choosing a cozy sky..."
  - "Finding the kindest path..."
- Soft watercolor background with gentle animation.

### S6 — Cover Reveal

- Full-screen watercolor cover illustration featuring the child's chosen companion in a biblical scene.
- Story title displayed prominently.
- **Subtitle:** "15 pages - choices shape the story"
- **Primary CTA:** "Start reading" (advances to account creation, not the player).
- The cover is the emotional hook that drives sign-up.

### S7 — Account

- **Title:** "Save your stories & rewards"
- **Bullets:**
  - "Access your library on all devices"
  - "Keep your Companion"
  - "Manage your plan"
- **CTAs (stacked):**
  - "Continue with Apple"
  - "Continue with Google"
  - "Continue with Email"
- Email path: "We'll send a sign-in link."
- Firebase Auth handles all three methods.

### S8 — Paywall (Soft)

- **Header:** "More stories. More values. More peace."
- **Value-led bullets:**
  - "Build habits through gentle choices"
  - "Reinforce the values you pick (kindness, courage, honesty...)"
  - "Narrated stories for any moment"
- **Feature bullets:**
  - "4 personalized stories every month"
  - "Full library of interactive stories"
  - "New stories added regularly"
- **Plan selector:** Monthly ($9.99) / Annual ($99.99 — highlighted).
- **Primary CTA:** "Start plan"
- **Secondary:** "Restore purchases"
- **Escape hatch (always visible):** "Start with your free story"
- Payment via RevenueCat — IAP + Web Purchase Button (A/B tested).
- **Footer:** "Cancel anytime in your App Store / Google Play settings."

### S9 — Preparation Continues

- Same stepper UI as S5.
- Now generating the remaining ~17 slides (text + illustrations + audio).
- Real progress with actual generation status.
- **Failure states:** "Retry" or "Try a different story."
- On completion: book opening animation triggers — card flips open, screen rotates to landscape, story begins.

---

## 4. Story Player

### Orientation

Landscape. The rest of the app is portrait. When the book opening animation triggers, the app rotates into landscape. When the story closes, it rotates back to portrait. This creates a clear mental boundary: "We're entering story time."

### Entry Animation

Book opening animation: the cover card flips open like a physical book cover, revealing the first slide. The cover becomes the left page, the first slide appears on the right, then expands to full screen in landscape.

### Layout

- Watercolor illustration fills 100% of the screen.
- No visible chrome by default.
- Story text appears as a soft floating bubble at the bottom — semi-transparent warm background, rounded corners, large readable type.
- Text fades in when narration begins, fades out a few seconds after narration ends, leaving the illustration fully visible.

### Narration

- Single warm AI voice (Google TTS).
- Text highlights word-by-word as it's read.
- Auto-advances to next slide when narration completes, with a ~2 second pause between slides.

### Navigation (Hybrid)

- **Auto-advance:** Slides progress automatically with narration.
- **Manual override:** Swipe left/right for page turns with subtle paper-turn animation and soft page-flip sound. Tap right edge to advance, left edge to go back.
- **Controls:** Small pause/play button and close (X) button in top corners — semi-transparent, fade out after 3 seconds of inactivity. Tap anywhere to reveal controls.

### Choice Points

- Narration pauses.
- Two soft rounded cards rise from the bottom with a gentle spring animation.
- Each card has a short text label (1-2 lines) and a small watercolor icon.
- Cards are 60dp+ height for small fingers.
- After the child taps a choice, the selected card glows softly, the other fades, and the story continues to the branch slide.
- Value-aligned choices: the companion in the illustration reacts with a subtle positive expression (smile, warm glow) in the next slide. Not punitive for the other choice — just gentle reinforcement.

### Story End

- Final slide shows a values summary: "You practiced: Kindness and Courage."
- Companion illustration smiling on a soft warm background.
- **Primary CTA:** "Good night" — closes the player, rotates back to portrait, returns to home.

---

## 5. Story Structure

### Dimensions

- **Total slides:** 15 (narrative) + 2-3 (branch variants) = ~17-18 total slides generated.
- **Choice points:** 2-3 per story, binary (A or B).
- **Branch depth:** 1 slide per branch before reconverging.

### Structure Template

```
Slides 1-5    (linear intro — setting, companion, conflict)
  -> Choice 1 (A/B) -> Slide 6a or 6b -> reconverge at Slide 7
Slides 7-11   (linear middle — journey, development)
  -> Choice 2 (A/B) -> Slide 12a or 12b -> reconverge at Slide 13
Slides 13-14  (linear build — climax)
  -> Choice 3 (A/B) -> Slide 15a or 15b -> reconverge at Slide 16
Slide 16      (resolution)
Slide 17      (values summary + ending)
```

### Content Guidelines

- Companion appears in every illustration and remains semi-anthropomorphic.
- Choices must change `nextSlideId` — branches reconverge after 1 slide to limit content explosion.
- Language: calm, gentle, no shame, no fear-driven imagery.
- Biblical themes: respectful and gentle; avoid graphic biblical events.
- Values woven into narrative — choices reflect the parent's selected values.
- Age band affects vocabulary, sentence complexity, and choice sophistication.

---

## 6. Home Screen

### Layout (Portrait)

- **Header:** Warm cream background. Child's companion as a small avatar in the top-left with their name ("Sunny the Lamb"). Time-of-day greeting: "Good evening, Mia" or "Ready for a story?"
- **Primary action:** Large card dominating the top half — "Create tonight's story." Watercolor background with companion in a new pose each time. One tap generates a new story using saved companion, values, and age band.
- **Past stories:** Horizontal scrollable row of miniature book covers. Each shows the watercolor cover illustration, story title, and a small badge of values practiced. Tapping reopens in the player (landscape, book opening animation) for re-reading. No re-generation.
- **Subscription status:** Subtle pill near the top. Free users: "1 free story" or "Subscribe for more." Subscribers: not shown.
- **Empty state:** After onboarding, past stories row replaced with: "Your first story is waiting" with cover thumbnail.
- **Settings:** Small gear icon in top-right opens a minimal sheet: account info, manage subscription, sign out.

### No tabs, no hamburger menu, no complex navigation for MVP.

---

## 7. Content Library

### Pre-Made Stories (5-8 at launch)

- Generated by the same AI pipeline, curated for quality, stored permanently.
- Feature generic biblical animal characters (not the child's personal companion).
- Have branching choices (2-3 per story), same interactive experience as AI-generated stories.
- Cover all 8 values across the library.
- Free for all users, cost $0 to serve.

### AI-Generated Personalized Stories (subscriber benefit)

- Generated on-demand per the child's profile.
- Feature the child's name, companion (by name), and selected values woven into narrative.
- 4 per month for subscribers.
- 1 free for all accounts (the onboarding story).

### Story Differentiation

| Aspect | Pre-Made | AI-Generated |
|--------|----------|--------------|
| Branching choices | Yes (2-3) | Yes (2-3) |
| Illustrations | Pre-generated watercolor | AI-generated per story |
| Companion | Generic animals | Child's personal companion by name |
| Values | Fixed theme per story | Tailored to child's 3 selected values |
| Narration | AI TTS | AI TTS |
| Child's name in story | No | Yes |
| Cost to serve | ~$0 | ~$1.25 |

---

## 8. Art Style & Character Consistency

### Visual Direction

Soft watercolor storybook. Gentle, dreamy, painterly. Warm tones (cream, gold, soft blue, sage green). Classic children's Bible illustration feel. Watercolor is forgiving of small AI variations — slight differences in brushstrokes feel natural rather than broken.

### Character Consistency Approach

1. **Companion reference sheet:** During onboarding, generate a reference sheet for the chosen companion (front, side, 3/4 view) using Nano Banana. Store in Firebase Storage.
2. **Character DNA prompt:** A fixed text description of the companion's appearance, propagated word-for-word across all slide image prompts. Includes: animal type, color palette, clothing/accessories, expression style, art medium.
3. **Anchor image system:** Every slide prompt includes the reference sheet image + the Character DNA text + the slide-specific scene description.
4. **Consistent style seed:** All prompts specify "soft watercolor storybook illustration" with the same style parameters.

### Image Generation

- **Key frames (6-8 per story):** Fully AI-generated unique illustrations for cover, scene changes, choice points, climax, ending.
- **Transition frames (7-9 per story):** Programmatic variations of the previous key frame — Ken Burns zoom/pan, color temperature shifts, text-only overlay on blurred version. No new image generation.
- **Resolution:** 1280x720 (landscape) or 1024x1024 for cover. Mobile resolution only — no 4K.
- **Tool:** Nano Banana (Gemini Image model) via Google AI Studio or Vertex AI.

---

## 9. Technical Architecture

### Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Expo (React Native) — new project, new repo |
| Routing | Expo Router (file-based) |
| Styling | NativeWind (Tailwind CSS for React Native) |
| State | Zustand |
| Auth | Firebase Auth (Apple, Google, Email link) |
| Database | Cloud Firestore |
| Storage | Firebase Cloud Storage |
| Story generation | Google Gemini API |
| Image generation | Nano Banana (Gemini Image) |
| Audio generation | Google TTS |
| Subscriptions | RevenueCat (IAP + Web Billing) |

### Firebase Data Model

```
users/{userId}
  - email: string
  - authProvider: string (apple/google/email)
  - subscriptionStatus: string (free/active/expired)
  - revenuecatId: string
  - createdAt: timestamp

profiles/{profileId}
  - userId: string (ref)
  - childName: string (optional)
  - ageBand: string (3-5 / 6-8 / 9-11)
  - companionType: string (lamb/lion/donkey/horse)
  - companionName: string (optional)
  - companionRefSheetUrl: string (Firebase Storage URL)
  - values: string[] (max 3)
  - createdAt: timestamp

stories/{storyId}
  - profileId: string (ref, null for pre-made)
  - type: string (premade/personalized)
  - title: string
  - coverImageUrl: string
  - slides: array
    - slideId: string
    - text: string
    - imageUrl: string
    - audioUrl: string
    - isChoicePoint: boolean
    - choices: array (if choice point)
      - label: string
      - iconUrl: string
      - nextSlideId: string
      - valueTag: string
  - branchSlides: array (variant slides from choices)
    - slideId: string
    - text: string
    - imageUrl: string
    - audioUrl: string
  - valuesReinforced: string[]
  - status: string (generating/ready/failed)
  - createdAt: timestamp
```

### Generation Pipeline

1. Parent taps "Create tonight's story" -> create `stories` doc with `status: generating`.
2. Cloud Function triggers Gemini API with prompt: age band, companion (type + name), selected values, story structure template (15 slides, 2-3 binary choice points, reconverge after 1 slide).
3. Gemini returns structured JSON: slide text, choice options, branch logic, image prompt per slide.
4. Identify key frames vs transition frames (6-8 key frames).
5. For each key frame: call Nano Banana with companion reference sheet + Character DNA prompt + slide scene description in watercolor style.
6. For each transition frame: programmatically create variation of nearest key frame.
7. For each slide: call Google TTS to generate narration audio.
8. Upload images + audio to Firebase Storage. Update story doc with URLs.
9. Set `status: ready` -> client receives update via Firestore real-time listener.

### Progressive Generation

Generate in chunks to reduce cost for incomplete reads:

- **Chunk 1 (pre-read):** Cover + slides 1-5.
- **Chunk 2 (during read of chunk 1):** Slides 6-10.
- **Chunk 3 (during read of chunk 2):** Slides 11-15 + branch slides.

If the child stops mid-story, ungenerated chunks are never created and never billed.

---

## 10. Business Model

### Pricing

| Tier | Price | AI Stories | Pre-Made Stories |
|------|-------|------------|-----------------|
| Free (no account) | $0 | 0 | 5-8 (full library) |
| Free (with account) | $0 | 1 (onboarding story) | 5-8 (full library) |
| Monthly subscriber | $9.99/mo | 4/month | All |
| Annual subscriber | $99.99/yr ($8.33/mo) | 4/month | All |

### Payment Processing

- **RevenueCat** manages all subscriptions.
- **In-App Purchase** (Apple IAP / Google Play Billing) as default payment method.
- **RevenueCat Web Purchase Button** (Stripe-powered) as alternative for US users — opens external browser, avoids app store fees.
- A/B test both flows using RevenueCat Experiments to optimize conversion vs margin.

### Fee Comparison

| Channel | Fee per $9.99 transaction | Net to developer |
|---------|--------------------------|-----------------|
| Apple IAP (15% small business) | $1.50 + $0.10 RC | $8.39 |
| Apple IAP (30% standard) | $3.00 + $0.10 RC | $6.89 |
| RevenueCat Web Billing | $0.59 Stripe + $0.10 RC | $9.30 |

### Unit Economics

| Metric | Value |
|--------|-------|
| AI images per story (key frames) | 6-8 |
| Cost per image (Nano Banana, mobile res) | ~$0.13 |
| Image cost per story | ~$0.78-1.04 |
| Text generation (Gemini) | ~$0.01-0.03 |
| Audio generation (TTS) | ~$0.18 |
| **Total cost per AI story** | **~$1.00-1.25** |
| Cost per subscriber per month (4 stories) | ~$4.00-5.00 |
| Revenue per subscriber (monthly plan) | $9.99 |
| Revenue per subscriber (annual plan) | $8.33/mo |
| **Margin per subscriber (monthly, web billing)** | **~$4.30-5.30** |
| **Margin per subscriber (annual, web billing)** | **~$2.75-3.75** |

---

## 11. Analytics Events

| Event | Properties |
|-------|-----------|
| `onboarding_start` | — |
| `onboarding_complete` | — |
| `companion_selected` | companionType, companionName |
| `values_selected` | values[] |
| `signup_started` | method (apple/google/email) |
| `signup_completed` | method |
| `paywall_viewed` | trigger (onboarding/second_story) |
| `purchase_started` | plan (monthly/annual), channel (iap/web) |
| `purchase_completed` | plan, channel, price |
| `restore_completed` | — |
| `story_create_requested` | type (premade/personalized) |
| `preparation_shown` | duration_ms |
| `story_ready` | storyId, slideCount |
| `story_started` | storyId, type |
| `choice_selected` | storyId, slideId, optionId, valueTag |
| `story_completed` | storyId, valuesReinforced[] |

---

## 12. MVP Scope — What's Out

The following features from the original UX spec are explicitly deferred to post-MVP:

| Feature | Reason for deferral |
|---------|-------------------|
| Credit system / multiple story tiers | Simplified to subscription + fixed 4 stories/month |
| Kid Mode with PIN | Single-mode app for MVP |
| Companion rewards / accessories / gamification | Post-story experience kept minimal |
| Interactive companion in story player | Complex animation + logic, not core to proving the idea |
| Parent dashboard / analytics | Not needed to validate core product |
| Multi-language support | English-only for MVP |
| Offline downloads | Requires significant caching infrastructure |
| Print-on-demand | Physical product integration deferred |
| Voice cloning | Premium feature for later |
| Companion hub | Depends on reward system |
| Multiple story tiers (Instant/Personalized/Custom) | One type only for MVP |
| Bedtime calm mode | Post-MVP settings |
| Top-up credit packs | No credit system in MVP |

---

## 13. Success Criteria

The MVP is successful if:

1. **Generation quality:** AI-generated stories are coherent, age-appropriate, and illustrations maintain acceptable character consistency across slides.
2. **Onboarding completion:** >60% of users who start onboarding complete it through to the first story.
3. **First story engagement:** >70% of users who start their first story finish it.
4. **Conversion:** >5% of free users convert to a paid subscription.
5. **Retention:** >30% of subscribers generate at least 2 stories in their first month.

---

## 14. Open Questions for Implementation

1. **Gemini prompt engineering:** Exact prompt templates for story structure, slide text, and image generation need to be developed and tested.
2. **Character DNA formula:** The specific reference sheet format and Character DNA text template for Nano Banana needs iteration.
3. **TTS voice selection:** Which Google TTS voice best fits the warm narrator tone.
4. **Cloud Function architecture:** Whether to use a single orchestrator function or chain multiple functions for the generation pipeline.
5. **Progressive generation timing:** Optimal chunk sizes and pre-fetch timing to balance cost savings with seamless reading experience.
6. **App name:** "Bible-AI" is the working title. Final consumer-facing name TBD.
