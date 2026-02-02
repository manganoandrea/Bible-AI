import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Story, StoryStatus } from "@/types";

export async function createStoryDoc(
  profileId: string | null,
  type: Story["type"]
): Promise<string> {
  const storyRef = doc(collection(db, "stories"));
  await setDoc(storyRef, {
    profileId,
    type,
    title: "",
    coverImageUrl: "",
    slides: [],
    branchSlides: [],
    valuesReinforced: [],
    status: "generating",
    createdAt: serverTimestamp(),
  });
  return storyRef.id;
}

export async function getStory(storyId: string): Promise<Story | null> {
  const snap = await getDoc(doc(db, "stories", storyId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Story;
}

export async function getStoriesForProfile(
  profileId: string
): Promise<Story[]> {
  const q = query(
    collection(db, "stories"),
    where("profileId", "==", profileId),
    where("status", "==", "ready"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Story);
}

export function onStoryStatusChange(
  storyId: string,
  callback: (status: StoryStatus) => void
): Unsubscribe {
  return onSnapshot(doc(db, "stories", storyId), (snap) => {
    if (snap.exists()) {
      callback(snap.data().status as StoryStatus);
    }
  });
}

export async function getPremadeStories(): Promise<Story[]> {
  const q = query(
    collection(db, "stories"),
    where("type", "==", "premade"),
    where("status", "==", "ready"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Story);
}
