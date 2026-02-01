export * from "./companion";
export * from "./story";

export type AgeBand = import("./story").AgeBand;
export type CompanionType = import("./companion").CompanionType;
export type Value = import("./story").Value;

export interface User {
  id: string;
  email: string;
  authProvider: "apple" | "google" | "email";
  subscriptionStatus: "free" | "active" | "expired";
  revenuecatId: string;
  createdAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  childName?: string;
  ageBand: AgeBand;
  companionType: CompanionType;
  companionName?: string;
  companionRefSheetUrl?: string;
  values: Value[];
  createdAt: Date;
}
