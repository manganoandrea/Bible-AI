import type { AgeBand, Value } from "./story";
import type { CompanionType } from "./companion";

export * from "./companion";
export * from "./story";

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
