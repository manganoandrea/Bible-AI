export type CompanionType = "lamb" | "lion" | "cat" | "fox";

export type CompanionTrait = "Gentle" | "Brave" | "Wise" | "Adventurous";

export interface Companion {
  type: CompanionType;
  trait: CompanionTrait;
  name: string;
  biblicalConnection: string;
}

export const COMPANIONS: Record<CompanionType, Omit<Companion, "name">> = {
  lamb: {
    type: "lamb",
    trait: "Gentle",
    biblicalConnection: "Lamb of God, Good Shepherd, lost sheep parable",
  },
  lion: {
    type: "lion",
    trait: "Brave",
    biblicalConnection: "Lion of Judah, Daniel in the lion's den",
  },
  cat: {
    type: "cat",
    trait: "Wise",
    biblicalConnection: "Wisdom literature, patient observation, quiet faith",
  },
  fox: {
    type: "fox",
    trait: "Adventurous",
    biblicalConnection: "Clever navigator, journey companion, Song of Solomon",
  },
};
