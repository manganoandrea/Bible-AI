import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  collection,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Profile, AgeBand, CompanionType, Value } from "@/types";

export async function createProfile(params: {
  userId: string;
  childName?: string;
  ageBand: AgeBand;
  companionType: CompanionType;
  companionName?: string;
  values: Value[];
}): Promise<Profile> {
  const profileRef = doc(collection(db, "profiles"));
  const profile: Omit<Profile, "id"> = {
    userId: params.userId,
    childName: params.childName,
    ageBand: params.ageBand,
    companionType: params.companionType,
    companionName: params.companionName,
    values: params.values,
    createdAt: new Date(),
  };

  await setDoc(profileRef, {
    ...profile,
    createdAt: serverTimestamp(),
  });

  return { id: profileRef.id, ...profile };
}

export async function getProfile(profileId: string): Promise<Profile | null> {
  const snap = await getDoc(doc(db, "profiles", profileId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Profile;
}
