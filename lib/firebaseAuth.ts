import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  onAuthStateChanged,
  OAuthProvider,
  signInWithCredential,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { User } from "@/types";

const actionCodeSettings = {
  url: "https://bible-ai.app/auth/callback",
  handleCodeInApp: true,
};

export async function sendEmailLink(email: string): Promise<void> {
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
}

export async function signInWithEmail(
  email: string,
  link: string
): Promise<void> {
  if (isSignInWithEmailLink(auth, link)) {
    await signInWithEmailLink(auth, email, link);
  }
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export async function createOrGetUserDoc(
  firebaseUser: FirebaseUser,
  provider: User["authProvider"]
): Promise<User> {
  const userRef = doc(db, "users", firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() } as User;
  }

  const newUser: Omit<User, "id"> = {
    email: firebaseUser.email || "",
    authProvider: provider,
    subscriptionStatus: "free",
    revenuecatId: "",
    createdAt: new Date(),
  };

  await setDoc(userRef, {
    ...newUser,
    createdAt: serverTimestamp(),
  });

  return { id: firebaseUser.uid, ...newUser };
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
