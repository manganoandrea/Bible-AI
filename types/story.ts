export type AgeBand = "3-5" | "6-8" | "9-11";

export type Value =
  | "Kindness"
  | "Courage"
  | "Honesty"
  | "Patience"
  | "Gratitude"
  | "Forgiveness"
  | "Humility"
  | "Self-control";

export const ALL_VALUES: Value[] = [
  "Kindness",
  "Courage",
  "Honesty",
  "Patience",
  "Gratitude",
  "Forgiveness",
  "Humility",
  "Self-control",
];

export type StoryType = "premade" | "personalized";

export type StoryStatus =
  | "generating" // Text being generated
  | "text_ready" // Text done, starting cover
  | "cover_ready" // Cover done, user can see reveal
  | "ready" // All images done
  | "failed";

export interface StoryChoice {
  label: string;
  iconUrl: string;
  nextSlideId: string;
  valueTag: Value;
}

export interface StorySlide {
  slideId: string;
  text: string;
  imageUrl: string;
  imageStatus: "pending" | "generating" | "ready" | "failed";
  audioUrl: string;
  audioStatus: "pending" | "generating" | "ready" | "failed";
  isChoicePoint: boolean;
  choices?: StoryChoice[];
}

export interface Story {
  id: string;
  profileId: string | null;
  type: StoryType;
  title: string;
  coverImageUrl: string;
  slides: StorySlide[];
  branchSlides: StorySlide[];
  valuesReinforced: Value[];
  status: StoryStatus;
  imagesGenerated: number;
  totalImages: number;
  createdAt: Date;
}
