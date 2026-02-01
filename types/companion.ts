export type CompanionType = "lamb" | "lion" | "donkey" | "horse";

export type CompanionTrait = "Gentle" | "Brave" | "Faithful" | "Courageous";

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
  donkey: {
    type: "donkey",
    trait: "Faithful",
    biblicalConnection:
      "Balaam's donkey, carried Mary to Bethlehem, Palm Sunday",
  },
  horse: {
    type: "horse",
    trait: "Courageous",
    biblicalConnection: "Chariots of fire, Revelation, journey stories",
  },
};
