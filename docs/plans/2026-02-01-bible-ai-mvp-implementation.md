# Bible-AI MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a complete MVP of Bible-AI — an Expo app where parents create personalized, illustrated, interactive Bible storybooks for children ages 3-11.

**Architecture:** Expo (React Native) with file-based routing, NativeWind for styling, Zustand for state, Firebase for auth/database/storage, Google Gemini for story text generation, Nano Banana (Gemini Image) for illustrations, Google TTS for narration, and RevenueCat for subscriptions.

**Tech Stack:** Expo 54+, Expo Router, React Native, NativeWind (Tailwind), Zustand, Firebase (Auth, Firestore, Storage), Google Gemini API, Google TTS, RevenueCat, TypeScript

**Design Document:** `docs/plans/2026-02-01-bible-ai-mvp-design.md`

---

## Phase 1: Project Foundation

### Task 1: Initialize Expo Project

**Files:**
- Create: `package.json` (via create-expo-app)
- Create: `app.json`
- Create: `tsconfig.json`
- Create: `babel.config.js`
- Create: `.gitignore`

**Step 1: Create Expo project**

```bash
npx create-expo-app@latest Bible-AI --template tabs
```

> Note: Run this from the PARENT directory of `/Users/andreamangano/Bible-AI`. The command will create the project inside the existing folder or you may need to create in a temp location and move files.
> Alternative: If the directory already exists, initialize inside it:

```bash
cd /Users/andreamangano/Bible-AI
npx create-expo-app@latest . --template blank-typescript
```

**Step 2: Verify project runs**

```bash
npx expo start
```

Expected: Metro bundler starts, QR code shown.

**Step 3: Commit**

```bash
git add -A
git commit -m "chore: initialize Expo project with TypeScript template"
```

---

### Task 2: Install Core Dependencies

**Files:**
- Modify: `package.json`
- Create: `tailwind.config.js`
- Modify: `babel.config.js`
- Create: `global.css`

**Step 1: Install Expo Router**

```bash
npx expo install expo-router expo-linking expo-constants expo-status-bar react-native-screens react-native-safe-area-context
```

**Step 2: Install NativeWind (Tailwind for RN)**

```bash
npx expo install nativewind tailwindcss react-native-reanimated
```

**Step 3: Install state management**

```bash
npm install zustand
```

**Step 4: Install animation and UI libraries**

```bash
npx expo install react-native-reanimated react-native-gesture-handler expo-linear-gradient expo-av expo-screen-orientation
```

**Step 5: Install fonts**

```bash
npx expo install @expo-google-fonts/nunito expo-font
```

**Step 6: Configure Tailwind**

Create `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cream: '#FDF8F0',
        ivory: '#FFFEF7',
        gold: '#FFB356',
        'sky-blue': '#1FA7E1',
        'sage-green': '#75D06A',
        'coral-rose': '#FF8B8B',
        charcoal: '#2D3436',
        'warm-gray': '#636E72',
        'light-gray': '#B2BEC3',
      },
      fontFamily: {
        'nunito': ['Nunito_400Regular'],
        'nunito-medium': ['Nunito_500Medium'],
        'nunito-semibold': ['Nunito_600SemiBold'],
        'nunito-bold': ['Nunito_700Bold'],
        'nunito-extrabold': ['Nunito_800ExtraBold'],
      },
    },
  },
  plugins: [],
};
```

**Step 7: Configure Babel for NativeWind**

Update `babel.config.js`:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      "react-native-reanimated/plugin",
    ],
  };
};
```

**Step 8: Create global.css**

Create `global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**Step 9: Verify build**

```bash
npx expo start --clear
```

Expected: No errors. Metro bundler starts cleanly.

**Step 10: Commit**

```bash
git add -A
git commit -m "chore: install core dependencies (router, nativewind, zustand, reanimated)"
```

---

### Task 3: Set Up File-Based Routing Structure

**Files:**
- Create: `app/_layout.tsx` (root layout)
- Create: `app/index.tsx` (entry — redirects to onboarding or home)
- Create: `app/(onboarding)/_layout.tsx`
- Create: `app/(onboarding)/welcome.tsx` (placeholder)
- Create: `app/(main)/_layout.tsx`
- Create: `app/(main)/home.tsx` (placeholder)
- Create: `app/story/[id].tsx` (placeholder)

**Step 1: Create root layout**

Create `app/_layout.tsx`:

```tsx
import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from "@expo-google-fonts/nunito";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(main)" />
        <Stack.Screen
          name="story/[id]"
          options={{
            animation: "none",
          }}
        />
      </Stack>
    </>
  );
}
```

**Step 2: Create entry point**

Create `app/index.tsx`:

```tsx
import { Redirect } from "expo-router";

export default function Index() {
  // TODO: Check auth state and redirect accordingly
  return <Redirect href="/(onboarding)/welcome" />;
}
```

**Step 3: Create onboarding layout**

Create `app/(onboarding)/_layout.tsx`:

```tsx
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    />
  );
}
```

**Step 4: Create placeholder screens**

Create `app/(onboarding)/welcome.tsx`:

```tsx
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream items-center justify-center">
      <Text className="font-nunito-bold text-2xl text-charcoal">
        Bible-AI
      </Text>
      <Text className="font-nunito text-warm-gray mt-2">
        Welcome screen placeholder
      </Text>
    </SafeAreaView>
  );
}
```

Create `app/(main)/_layout.tsx`:

```tsx
import { Stack } from "expo-router";

export default function MainLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
```

Create `app/(main)/home.tsx`:

```tsx
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-cream items-center justify-center">
      <Text className="font-nunito-bold text-2xl text-charcoal">Home</Text>
    </SafeAreaView>
  );
}
```

Create `app/story/[id].tsx`:

```tsx
import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function StoryPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View className="flex-1 bg-charcoal items-center justify-center">
      <Text className="font-nunito-bold text-2xl text-white">
        Story Player: {id}
      </Text>
    </View>
  );
}
```

**Step 5: Verify routing works**

```bash
npx expo start --clear
```

Expected: App opens on welcome screen placeholder. Navigation structure loads without errors.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: set up file-based routing structure with onboarding and main groups"
```

---

### Task 4: Set Up TypeScript Types

**Files:**
- Create: `types/index.ts`
- Create: `types/story.ts`
- Create: `types/companion.ts`

**Step 1: Create companion types**

Create `types/companion.ts`:

```ts
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
```

**Step 2: Create story types**

Create `types/story.ts`:

```ts
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

export type StoryStatus = "generating" | "ready" | "failed";

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
  audioUrl: string;
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
  createdAt: Date;
}
```

**Step 3: Create index barrel**

Create `types/index.ts`:

```ts
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
```

**Step 4: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No type errors.

**Step 5: Commit**

```bash
git add types/
git commit -m "feat: add TypeScript types for companions, stories, users, and profiles"
```

---

### Task 5: Set Up Zustand Stores

**Files:**
- Create: `stores/onboardingStore.ts`
- Create: `stores/authStore.ts`
- Create: `stores/profileStore.ts`
- Create: `stores/storyStore.ts`
- Create: `stores/index.ts`

**Step 1: Create onboarding store**

Create `stores/onboardingStore.ts`:

```ts
import { create } from "zustand";
import type { AgeBand, CompanionType, Value } from "@/types";

interface OnboardingState {
  childName: string;
  ageBand: AgeBand | null;
  companionType: CompanionType | null;
  companionName: string;
  values: Value[];
  currentStep: number;

  setChildName: (name: string) => void;
  setAgeBand: (band: AgeBand) => void;
  setCompanionType: (type: CompanionType) => void;
  setCompanionName: (name: string) => void;
  toggleValue: (value: Value) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
}

const initialState = {
  childName: "",
  ageBand: null as AgeBand | null,
  companionType: null as CompanionType | null,
  companionName: "",
  values: [] as Value[],
  currentStep: 0,
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,

  setChildName: (name) => set({ childName: name }),
  setAgeBand: (band) => set({ ageBand: band }),
  setCompanionType: (type) => set({ companionType: type }),
  setCompanionName: (name) => set({ companionName: name }),

  toggleValue: (value) => {
    const current = get().values;
    if (current.includes(value)) {
      set({ values: current.filter((v) => v !== value) });
    } else if (current.length < 3) {
      set({ values: [...current, value] });
    }
  },

  nextStep: () => set((s) => ({ currentStep: s.currentStep + 1 })),
  prevStep: () =>
    set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),
  reset: () => set(initialState),
}));
```

**Step 2: Create auth store**

Create `stores/authStore.ts`:

```ts
import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),
  setLoading: (isLoading) => set({ isLoading }),
}));
```

**Step 3: Create profile store**

Create `stores/profileStore.ts`:

```ts
import { create } from "zustand";
import type { Profile } from "@/types";

interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;

  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,

  setProfile: (profile) => set({ profile, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
}));
```

**Step 4: Create story store**

Create `stores/storyStore.ts`:

```ts
import { create } from "zustand";
import type { Story } from "@/types";

interface StoryState {
  stories: Story[];
  currentStory: Story | null;
  isGenerating: boolean;

  setStories: (stories: Story[]) => void;
  setCurrentStory: (story: Story | null) => void;
  setGenerating: (generating: boolean) => void;
  addStory: (story: Story) => void;
  updateStory: (id: string, updates: Partial<Story>) => void;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  stories: [],
  currentStory: null,
  isGenerating: false,

  setStories: (stories) => set({ stories }),
  setCurrentStory: (story) => set({ currentStory: story }),
  setGenerating: (isGenerating) => set({ isGenerating }),

  addStory: (story) =>
    set((s) => ({ stories: [story, ...s.stories] })),

  updateStory: (id, updates) =>
    set((s) => ({
      stories: s.stories.map((story) =>
        story.id === id ? { ...story, ...updates } : story
      ),
      currentStory:
        s.currentStory?.id === id
          ? { ...s.currentStory, ...updates }
          : s.currentStory,
    })),
}));
```

**Step 5: Create barrel export**

Create `stores/index.ts`:

```ts
export { useOnboardingStore } from "./onboardingStore";
export { useAuthStore } from "./authStore";
export { useProfileStore } from "./profileStore";
export { useStoryStore } from "./storyStore";
```

**Step 6: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No type errors.

**Step 7: Commit**

```bash
git add stores/ types/
git commit -m "feat: add Zustand stores for onboarding, auth, profile, and story state"
```

---

### Task 6: Set Up Firebase

**Files:**
- Create: `lib/firebase.ts`
- Modify: `package.json` (dependencies)
- Modify: `app/_layout.tsx` (provider)

**Step 1: Install Firebase**

```bash
npm install firebase
```

**Step 2: Create Firebase config**

Create `lib/firebase.ts`:

```ts
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
```

**Step 3: Install AsyncStorage**

```bash
npx expo install @react-native-async-storage/async-storage
```

**Step 4: Create .env.example (template — NOT real keys)**

Create `.env.example`:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

**Step 5: Add .env to .gitignore**

Append to `.gitignore`:

```
.env
.env.local
```

**Step 6: Verify build**

```bash
npx tsc --noEmit
```

Expected: No type errors (Firebase won't connect without real keys, but types should compile).

**Step 7: Commit**

```bash
git add lib/firebase.ts .env.example .gitignore package.json package-lock.json
git commit -m "feat: add Firebase configuration with auth, firestore, and storage"
```

---

### Task 7: Set Up Firebase Auth Library

**Files:**
- Create: `lib/firebaseAuth.ts`

**Step 1: Create auth helper**

Create `lib/firebaseAuth.ts`:

```ts
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
```

**Step 2: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No type errors.

**Step 3: Commit**

```bash
git add lib/firebaseAuth.ts
git commit -m "feat: add Firebase auth helpers for email link, sign out, and user doc creation"
```

---

## Phase 2: Onboarding Screens

### Task 8: Shared UI Components

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/ProgressDots.tsx`
- Create: `components/ui/index.ts`

**Step 1: Create Button component**

Create `components/ui/Button.tsx`:

```tsx
import { Pressable, Text, type PressableProps } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ButtonProps extends PressableProps {
  title: string;
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({
  title,
  variant = "primary",
  disabled,
  ...props
}: ButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const baseClasses = "w-full items-center justify-center rounded-2xl min-h-[52px] px-6";
  const variantClasses = {
    primary: "bg-gold",
    secondary: "bg-white border border-light-gray",
    ghost: "bg-transparent",
  };
  const textClasses = {
    primary: "text-white font-nunito-bold text-lg",
    secondary: "text-charcoal font-nunito-semibold text-lg",
    ghost: "text-warm-gray font-nunito-semibold text-base",
  };

  return (
    <AnimatedPressable
      style={animatedStyle}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? "opacity-50" : ""}`}
      onPressIn={() => {
        scale.value = withSpring(0.97);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      disabled={disabled}
      {...props}
    >
      <Text className={textClasses[variant]}>{title}</Text>
    </AnimatedPressable>
  );
}
```

**Step 2: Create ProgressDots component**

Create `components/ui/ProgressDots.tsx`:

```tsx
import { View } from "react-native";

interface ProgressDotsProps {
  total: number;
  current: number;
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <View className="flex-row items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={`h-2 rounded-full ${
            i === current ? "w-6 bg-gold" : "w-2 bg-light-gray"
          }`}
        />
      ))}
    </View>
  );
}
```

**Step 3: Create barrel export**

Create `components/ui/index.ts`:

```ts
export { Button } from "./Button";
export { ProgressDots } from "./ProgressDots";
```

**Step 4: Verify build**

```bash
npx tsc --noEmit
```

Expected: No type errors.

**Step 5: Commit**

```bash
git add components/
git commit -m "feat: add shared UI components (Button, ProgressDots)"
```

---

### Task 9: S0 — Welcome Screen

**Files:**
- Modify: `app/(onboarding)/welcome.tsx`

**Step 1: Implement Welcome screen**

Replace `app/(onboarding)/welcome.tsx`:

```tsx
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button } from "@/components/ui";

export default function WelcomeScreen() {
  const router = useRouter();
  const [showExplainer, setShowExplainer] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 items-center justify-center px-8">
        {/* TODO: Replace with watercolor background illustration */}
        <Text className="font-nunito-extrabold text-3xl text-charcoal text-center">
          Bible-inspired interactive stories for kids
        </Text>
        <Text className="font-nunito text-base text-warm-gray text-center mt-4 leading-6">
          Pick a Companion. Choose values. Your child makes choices that shape
          the story.
        </Text>
      </View>

      <View className="px-8 pb-8 gap-3">
        <Button
          title="Get started"
          onPress={() => router.push("/(onboarding)/parent")}
        />
        <Button
          title="How it works"
          variant="ghost"
          onPress={() => setShowExplainer(true)}
        />
      </View>

      {/* TODO: How it works modal (3-card explainer: Create, Read, Learn) */}
    </SafeAreaView>
  );
}
```

**Step 2: Verify screen renders**

```bash
npx expo start --clear
```

Expected: Welcome screen shows headline, subhead, and two buttons.

**Step 3: Commit**

```bash
git add app/(onboarding)/welcome.tsx
git commit -m "feat: implement S0 Welcome screen with copy and CTAs"
```

---

### Task 10: S1 — Parent Confirmation Screen

**Files:**
- Create: `app/(onboarding)/parent.tsx`

**Step 1: Implement Parent Confirmation screen**

Create `app/(onboarding)/parent.tsx`:

```tsx
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui";

export default function ParentScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 justify-center px-8">
        <Text className="font-nunito-extrabold text-2xl text-charcoal">
          For parents
        </Text>

        <View className="mt-6 gap-4">
          <View className="flex-row items-start gap-3">
            <Text className="text-gold text-xl">•</Text>
            <Text className="font-nunito text-base text-charcoal flex-1 leading-6">
              Parents create stories. Kids read and play.
            </Text>
          </View>
          <View className="flex-row items-start gap-3">
            <Text className="text-gold text-xl">•</Text>
            <Text className="font-nunito text-base text-charcoal flex-1 leading-6">
              Stories are gentle and Bible-inspired.
            </Text>
          </View>
        </View>
      </View>

      <View className="px-8 pb-8 gap-3">
        <Button
          title="I'm a parent / guardian"
          onPress={() => router.push("/(onboarding)/child-profile")}
        />
        <View className="flex-row justify-center gap-4">
          <Text className="font-nunito text-sm text-warm-gray underline">
            Privacy
          </Text>
          <Text className="font-nunito text-sm text-warm-gray underline">
            Terms
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
```

**Step 2: Verify navigation from Welcome → Parent**

```bash
npx expo start --clear
```

Expected: Tapping "Get started" navigates to parent confirmation screen.

**Step 3: Commit**

```bash
git add app/(onboarding)/parent.tsx
git commit -m "feat: implement S1 Parent Confirmation screen"
```

---

### Task 11: S2 — Child Profile Screen

**Files:**
- Create: `app/(onboarding)/child-profile.tsx`

**Step 1: Implement Child Profile screen**

Create `app/(onboarding)/child-profile.tsx`:

```tsx
import { View, Text, TextInput, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "@/stores";
import { Button } from "@/components/ui";
import type { AgeBand } from "@/types";

const AGE_BANDS: { label: string; value: AgeBand }[] = [
  { label: "3–5", value: "3-5" },
  { label: "6–8", value: "6-8" },
  { label: "9–11", value: "9-11" },
];

export default function ChildProfileScreen() {
  const router = useRouter();
  const { childName, ageBand, setChildName, setAgeBand } =
    useOnboardingStore();

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 justify-center px-8">
        <Text className="font-nunito-extrabold text-2xl text-charcoal">
          Who are we reading for?
        </Text>

        <View className="mt-8">
          <Text className="font-nunito-semibold text-sm text-warm-gray mb-2">
            Child's nickname (optional)
          </Text>
          <TextInput
            className="bg-white rounded-xl px-4 py-3 font-nunito text-base text-charcoal border border-light-gray"
            placeholder="e.g., Mia"
            placeholderTextColor="#B2BEC3"
            value={childName}
            onChangeText={setChildName}
          />
        </View>

        <View className="mt-6">
          <Text className="font-nunito-semibold text-sm text-warm-gray mb-2">
            Age band
          </Text>
          <View className="flex-row gap-3">
            {AGE_BANDS.map((band) => (
              <Pressable
                key={band.value}
                className={`flex-1 items-center py-3 rounded-xl border ${
                  ageBand === band.value
                    ? "bg-gold border-gold"
                    : "bg-white border-light-gray"
                }`}
                onPress={() => setAgeBand(band.value)}
              >
                <Text
                  className={`font-nunito-bold text-base ${
                    ageBand === band.value ? "text-white" : "text-charcoal"
                  }`}
                >
                  {band.label}
                </Text>
              </Pressable>
            ))}
          </View>
          <Text className="font-nunito text-xs text-warm-gray mt-2">
            Age sets vocabulary, length, and choices.
          </Text>
        </View>
      </View>

      <View className="px-8 pb-8">
        <Button
          title="Continue"
          disabled={!ageBand}
          onPress={() => router.push("/(onboarding)/companion")}
        />
      </View>
    </SafeAreaView>
  );
}
```

**Step 2: Verify screen and store binding**

```bash
npx expo start --clear
```

Expected: Screen shows name input and age band selector. Age band selection highlights. Continue disabled until age selected.

**Step 3: Commit**

```bash
git add app/(onboarding)/child-profile.tsx
git commit -m "feat: implement S2 Child Profile screen with age band selector"
```

---

### Task 12: S3 — Choose Companion Screen

**Files:**
- Create: `app/(onboarding)/companion.tsx`
- Create: `components/onboarding/CompanionCard.tsx`

**Step 1: Create CompanionCard component**

Create `components/onboarding/CompanionCard.tsx`:

```tsx
import { Pressable, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import type { CompanionType, CompanionTrait } from "@/types";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CompanionCardProps {
  type: CompanionType;
  trait: CompanionTrait;
  isSelected: boolean;
  onPress: () => void;
}

const COMPANION_EMOJI: Record<CompanionType, string> = {
  lamb: "🐑",
  lion: "🦁",
  donkey: "🫏",
  horse: "🐴",
};

export function CompanionCard({
  type,
  trait,
  isSelected,
  onPress,
}: CompanionCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={animatedStyle}
      className={`flex-1 items-center p-4 rounded-2xl border-2 ${
        isSelected ? "bg-gold/10 border-gold" : "bg-white border-light-gray"
      }`}
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
    >
      {/* TODO: Replace emoji with watercolor companion illustration */}
      <Text className="text-5xl mb-2">{COMPANION_EMOJI[type]}</Text>
      <Text className="font-nunito-bold text-base text-charcoal capitalize">
        {type}
      </Text>
      <View className="bg-gold/20 rounded-full px-3 py-1 mt-1">
        <Text className="font-nunito-semibold text-xs text-gold">
          {trait}
        </Text>
      </View>
    </AnimatedPressable>
  );
}
```

**Step 2: Implement Companion selection screen**

Create `app/(onboarding)/companion.tsx`:

```tsx
import { View, Text, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useOnboardingStore } from "@/stores";
import { Button } from "@/components/ui";
import { CompanionCard } from "@/components/onboarding/CompanionCard";
import { COMPANIONS, type CompanionType } from "@/types";

const companionEntries = Object.entries(COMPANIONS) as [
  CompanionType,
  (typeof COMPANIONS)[CompanionType],
][];

export default function CompanionScreen() {
  const router = useRouter();
  const { companionType, companionName, setCompanionType, setCompanionName } =
    useOnboardingStore();
  const [showNameInput, setShowNameInput] = useState(false);

  const handleSelect = (type: CompanionType) => {
    setCompanionType(type);
    setShowNameInput(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 justify-center px-8">
        <Text className="font-nunito-extrabold text-2xl text-charcoal">
          Choose a Companion
        </Text>

        <View className="flex-row flex-wrap gap-3 mt-8">
          {companionEntries.map(([type, data]) => (
            <View key={type} className="w-[48%]">
              <CompanionCard
                type={type}
                trait={data.trait}
                isSelected={companionType === type}
                onPress={() => handleSelect(type)}
              />
            </View>
          ))}
        </View>

        {showNameInput && (
          <View className="mt-6">
            <Text className="font-nunito-semibold text-sm text-warm-gray mb-2">
              Give your Companion a name (optional)
            </Text>
            <TextInput
              className="bg-white rounded-xl px-4 py-3 font-nunito text-base text-charcoal border border-light-gray"
              placeholder="e.g., Sunny"
              placeholderTextColor="#B2BEC3"
              value={companionName}
              onChangeText={setCompanionName}
            />
          </View>
        )}
      </View>

      <View className="px-8 pb-8">
        <Button
          title="Choose this Companion"
          disabled={!companionType}
          onPress={() => router.push("/(onboarding)/values")}
        />
      </View>
    </SafeAreaView>
  );
}
```

**Step 3: Verify screen**

```bash
npx expo start --clear
```

Expected: 2x2 grid of companions. Selecting one highlights it and shows name input. CTA enabled after selection.

**Step 4: Commit**

```bash
git add components/onboarding/ app/(onboarding)/companion.tsx
git commit -m "feat: implement S3 Choose Companion screen with 4 biblical animals"
```

---

### Task 13: S4 — Pick Values Screen

**Files:**
- Create: `app/(onboarding)/values.tsx`

**Step 1: Implement Values screen**

Create `app/(onboarding)/values.tsx`:

```tsx
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useOnboardingStore } from "@/stores";
import { Button } from "@/components/ui";
import { ALL_VALUES, type Value } from "@/types";

export default function ValuesScreen() {
  const router = useRouter();
  const { values, toggleValue } = useOnboardingStore();

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 justify-center px-8">
        <Text className="font-nunito-extrabold text-2xl text-charcoal">
          What values do you want to practice?
        </Text>
        <Text className="font-nunito text-sm text-warm-gray mt-2">
          Pick up to 3. Your child's choices will reinforce these values.
        </Text>

        <View className="flex-row flex-wrap gap-3 mt-8">
          {ALL_VALUES.map((value) => {
            const isSelected = values.includes(value);
            const isDisabled = !isSelected && values.length >= 3;

            return (
              <Pressable
                key={value}
                className={`px-5 py-3 rounded-full border ${
                  isSelected
                    ? "bg-gold border-gold"
                    : isDisabled
                      ? "bg-white border-light-gray opacity-40"
                      : "bg-white border-light-gray"
                }`}
                onPress={() => toggleValue(value)}
                disabled={isDisabled}
              >
                <Text
                  className={`font-nunito-semibold text-sm ${
                    isSelected ? "text-white" : "text-charcoal"
                  }`}
                >
                  {value}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {values.length > 0 && (
          <Text className="font-nunito text-xs text-warm-gray mt-4">
            Selected: {values.join(", ")} ({values.length}/3)
          </Text>
        )}
      </View>

      <View className="px-8 pb-8">
        <Button
          title="Continue"
          disabled={values.length === 0}
          onPress={() => router.push("/(onboarding)/preparation")}
        />
      </View>
    </SafeAreaView>
  );
}
```

**Step 2: Verify screen**

```bash
npx expo start --clear
```

Expected: 8 value chips displayed. Selecting toggles gold highlight. Max 3 selectable — others dim. Counter shows selection.

**Step 3: Commit**

```bash
git add app/(onboarding)/values.tsx
git commit -m "feat: implement S4 Pick Values screen with chip selector (max 3)"
```

---

### Task 14: S5 — Preparation Screen (Cover Generation)

**Files:**
- Create: `app/(onboarding)/preparation.tsx`
- Create: `components/onboarding/PreparationStepper.tsx`

**Step 1: Create PreparationStepper component**

Create `components/onboarding/PreparationStepper.tsx`:

```tsx
import { View, Text } from "react-native";
import { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const STEPS = [
  "Setting your Companion",
  "Loading illustrations",
  "Getting the narrator ready",
  "Building your story paths",
];

const DELIGHT_LINES = [
  "Your Companion is packing their satchel...",
  "Choosing a cozy sky...",
  "Finding the kindest path...",
  "Painting with watercolors...",
];

interface PreparationStepperProps {
  onComplete: () => void;
  isRealProgress?: boolean;
  progress?: number;
}

export function PreparationStepper({
  onComplete,
  isRealProgress = false,
  progress = 0,
}: PreparationStepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [delightIndex, setDelightIndex] = useState(0);

  useEffect(() => {
    if (isRealProgress) return;

    // Simulated progress for onboarding cover generation
    const stepDuration = 600;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(timer);
          setTimeout(onComplete, 400);
          return prev;
        }
        return prev + 1;
      });
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isRealProgress, onComplete]);

  useEffect(() => {
    if (isRealProgress) {
      const step = Math.min(
        Math.floor(progress * STEPS.length),
        STEPS.length - 1
      );
      setCurrentStep(step);
      if (progress >= 1) onComplete();
    }
  }, [isRealProgress, progress, onComplete]);

  useEffect(() => {
    const timer = setInterval(() => {
      setDelightIndex((prev) => (prev + 1) % DELIGHT_LINES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <View className="items-center">
      <View className="w-full gap-4">
        {STEPS.map((step, i) => (
          <View key={step} className="flex-row items-center gap-3">
            <View
              className={`w-6 h-6 rounded-full items-center justify-center ${
                i <= currentStep ? "bg-gold" : "bg-light-gray"
              }`}
            >
              {i < currentStep ? (
                <Text className="text-white text-xs font-nunito-bold">✓</Text>
              ) : (
                <Text className="text-white text-xs font-nunito-bold">
                  {i + 1}
                </Text>
              )}
            </View>
            <Text
              className={`font-nunito text-base ${
                i <= currentStep ? "text-charcoal" : "text-light-gray"
              }`}
            >
              {step}
            </Text>
          </View>
        ))}
      </View>

      <Text className="font-nunito text-sm text-warm-gray mt-8 italic text-center">
        {DELIGHT_LINES[delightIndex]}
      </Text>
    </View>
  );
}
```

**Step 2: Implement Preparation screen**

Create `app/(onboarding)/preparation.tsx`:

```tsx
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { PreparationStepper } from "@/components/onboarding/PreparationStepper";

export default function PreparationScreen() {
  const router = useRouter();

  const handleComplete = useCallback(() => {
    // TODO: Actual cover generation via Gemini + Nano Banana
    router.replace("/(onboarding)/cover-reveal");
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 justify-center px-8">
        <Text className="font-nunito-extrabold text-2xl text-charcoal text-center mb-12">
          Preparing your story...
        </Text>

        <PreparationStepper onComplete={handleComplete} />
      </View>
    </SafeAreaView>
  );
}
```

**Step 3: Verify screen**

```bash
npx expo start --clear
```

Expected: Stepper animates through 4 steps, delight lines rotate, auto-navigates to cover-reveal on completion.

**Step 4: Commit**

```bash
git add components/onboarding/PreparationStepper.tsx app/(onboarding)/preparation.tsx
git commit -m "feat: implement S5 Preparation screen with animated stepper"
```

---

### Task 15: S6 — Cover Reveal Screen

**Files:**
- Create: `app/(onboarding)/cover-reveal.tsx`

**Step 1: Implement Cover Reveal screen**

Create `app/(onboarding)/cover-reveal.tsx`:

```tsx
import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useOnboardingStore } from "@/stores";
import { Button } from "@/components/ui";

export default function CoverRevealScreen() {
  const router = useRouter();
  const { companionType, companionName } = useOnboardingStore();

  const displayName =
    companionName || companionType?.charAt(0).toUpperCase() + (companionType?.slice(1) || "");

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 items-center justify-center px-8">
        {/* TODO: Replace with actual AI-generated cover image */}
        <Animated.View
          entering={FadeInUp.duration(800).springify()}
          className="w-full aspect-[3/4] bg-white rounded-3xl shadow-lg items-center justify-center overflow-hidden"
        >
          <View className="flex-1 w-full bg-gold/10 items-center justify-center">
            <Text className="text-8xl">📖</Text>
            <Text className="font-nunito-bold text-xl text-charcoal mt-4">
              {displayName}'s Adventure
            </Text>
          </View>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.duration(600).delay(400)}
          className="font-nunito text-sm text-warm-gray mt-4"
        >
          15 pages · choices shape the story
        </Animated.Text>
      </View>

      <View className="px-8 pb-8">
        <Button
          title="Start reading"
          onPress={() => router.push("/(onboarding)/account")}
        />
      </View>
    </SafeAreaView>
  );
}
```

**Step 2: Verify screen**

```bash
npx expo start --clear
```

Expected: Placeholder cover animates in with spring effect. Subtitle fades in. CTA navigates to account screen.

**Step 3: Commit**

```bash
git add app/(onboarding)/cover-reveal.tsx
git commit -m "feat: implement S6 Cover Reveal screen with entrance animation"
```

---

### Task 16: S7 — Account Screen

**Files:**
- Create: `app/(onboarding)/account.tsx`

**Step 1: Implement Account screen**

Create `app/(onboarding)/account.tsx`:

```tsx
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui";

export default function AccountScreen() {
  const router = useRouter();

  const handleAuth = async (method: "apple" | "google" | "email") => {
    // TODO: Implement actual Firebase auth for each method
    // For now, navigate to paywall
    router.push("/(onboarding)/paywall");
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 justify-center px-8">
        <Text className="font-nunito-extrabold text-2xl text-charcoal">
          Save your stories & rewards
        </Text>

        <View className="mt-6 gap-3">
          <View className="flex-row items-start gap-3">
            <Text className="text-gold text-xl">•</Text>
            <Text className="font-nunito text-base text-charcoal flex-1 leading-6">
              Access your library on all devices
            </Text>
          </View>
          <View className="flex-row items-start gap-3">
            <Text className="text-gold text-xl">•</Text>
            <Text className="font-nunito text-base text-charcoal flex-1 leading-6">
              Keep your Companion
            </Text>
          </View>
          <View className="flex-row items-start gap-3">
            <Text className="text-gold text-xl">•</Text>
            <Text className="font-nunito text-base text-charcoal flex-1 leading-6">
              Manage your plan
            </Text>
          </View>
        </View>
      </View>

      <View className="px-8 pb-8 gap-3">
        <Button
          title="Continue with Apple"
          onPress={() => handleAuth("apple")}
        />
        <Button
          title="Continue with Google"
          variant="secondary"
          onPress={() => handleAuth("google")}
        />
        <Button
          title="Continue with Email"
          variant="secondary"
          onPress={() => handleAuth("email")}
        />
        <Text className="font-nunito text-xs text-warm-gray text-center mt-1">
          We'll send a sign-in link.
        </Text>
      </View>
    </SafeAreaView>
  );
}
```

**Step 2: Verify screen**

```bash
npx expo start --clear
```

Expected: Three auth buttons stacked, bullets above. Tapping any navigates to paywall (auth stubbed).

**Step 3: Commit**

```bash
git add app/(onboarding)/account.tsx
git commit -m "feat: implement S7 Account screen with auth method CTAs"
```

---

### Task 17: S8 — Paywall Screen (Soft)

**Files:**
- Create: `app/(onboarding)/paywall.tsx`

**Step 1: Implement Paywall screen**

Create `app/(onboarding)/paywall.tsx`:

```tsx
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button } from "@/components/ui";

type Plan = "monthly" | "annual";

export default function PaywallScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<Plan>("annual");

  const handleSubscribe = () => {
    // TODO: RevenueCat purchase flow
    router.replace("/(onboarding)/generating");
  };

  const handleSkip = () => {
    router.replace("/(onboarding)/generating");
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 px-8 pt-8">
        <Text className="font-nunito-extrabold text-2xl text-charcoal">
          More stories. More values.{"\n"}More peace.
        </Text>

        <View className="mt-6 gap-3">
          <Text className="font-nunito text-base text-charcoal leading-6">
            ✦ Build habits through gentle choices
          </Text>
          <Text className="font-nunito text-base text-charcoal leading-6">
            ✦ Reinforce the values you pick
          </Text>
          <Text className="font-nunito text-base text-charcoal leading-6">
            ✦ Narrated stories for any moment
          </Text>
        </View>

        <View className="mt-6 gap-3">
          <Text className="font-nunito-semibold text-sm text-warm-gray">
            What you get:
          </Text>
          <Text className="font-nunito text-sm text-charcoal">
            • 4 personalized stories every month
          </Text>
          <Text className="font-nunito text-sm text-charcoal">
            • Full library of interactive stories
          </Text>
          <Text className="font-nunito text-sm text-charcoal">
            • New stories added regularly
          </Text>
        </View>

        {/* Plan selector */}
        <View className="mt-8 gap-3">
          <Pressable
            className={`flex-row items-center justify-between p-4 rounded-2xl border-2 ${
              selectedPlan === "annual"
                ? "bg-gold/10 border-gold"
                : "bg-white border-light-gray"
            }`}
            onPress={() => setSelectedPlan("annual")}
          >
            <View>
              <Text className="font-nunito-bold text-base text-charcoal">
                Annual
              </Text>
              <Text className="font-nunito text-sm text-warm-gray">
                $99.99/year ($8.33/mo)
              </Text>
            </View>
            <View className="bg-gold rounded-full px-3 py-1">
              <Text className="font-nunito-bold text-xs text-white">
                Best value
              </Text>
            </View>
          </Pressable>

          <Pressable
            className={`flex-row items-center justify-between p-4 rounded-2xl border-2 ${
              selectedPlan === "monthly"
                ? "bg-gold/10 border-gold"
                : "bg-white border-light-gray"
            }`}
            onPress={() => setSelectedPlan("monthly")}
          >
            <View>
              <Text className="font-nunito-bold text-base text-charcoal">
                Monthly
              </Text>
              <Text className="font-nunito text-sm text-warm-gray">
                $9.99/month
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View className="px-8 pb-8 gap-3">
        <Button title="Start plan" onPress={handleSubscribe} />
        <Button
          title="Restore purchases"
          variant="ghost"
          onPress={() => {
            // TODO: RevenueCat restore
          }}
        />
        <Button
          title="Start with your free story"
          variant="ghost"
          onPress={handleSkip}
        />
        <Text className="font-nunito text-xs text-warm-gray text-center">
          Cancel anytime in your App Store / Google Play settings.
        </Text>
      </View>
    </SafeAreaView>
  );
}
```

**Step 2: Verify screen**

```bash
npx expo start --clear
```

Expected: Value bullets, feature list, plan selector (annual pre-selected with badge), three CTAs at bottom. Skip option always visible.

**Step 3: Commit**

```bash
git add app/(onboarding)/paywall.tsx
git commit -m "feat: implement S8 soft Paywall screen with plan selector and skip option"
```

---

### Task 18: S9 — Generation Screen (Story Slides)

**Files:**
- Create: `app/(onboarding)/generating.tsx`

**Step 1: Implement Generation screen**

Create `app/(onboarding)/generating.tsx`:

```tsx
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { PreparationStepper } from "@/components/onboarding/PreparationStepper";

export default function GeneratingScreen() {
  const router = useRouter();

  const handleComplete = useCallback(() => {
    // TODO: Navigate to story player with actual generated story ID
    // For now, use a placeholder ID
    router.replace("/story/onboarding-story");
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 justify-center px-8">
        <Text className="font-nunito-extrabold text-2xl text-charcoal text-center mb-12">
          Preparing your story...
        </Text>

        {/* TODO: Use real progress from Firestore listener */}
        <PreparationStepper onComplete={handleComplete} />
      </View>
    </SafeAreaView>
  );
}
```

**Step 2: Verify full onboarding flow**

```bash
npx expo start --clear
```

Expected: Complete flow from Welcome → Parent → Child Profile → Companion → Values → Preparation → Cover Reveal → Account → Paywall → Generating → Story Player placeholder.

**Step 3: Commit**

```bash
git add app/(onboarding)/generating.tsx
git commit -m "feat: implement S9 Generation screen — completes full onboarding flow"
```

---

## Phase 3: Story Player

### Task 19: Story Player — Basic Layout

**Files:**
- Modify: `app/story/[id].tsx`
- Create: `components/player/StorySlideView.tsx`
- Create: `components/player/TextBubble.tsx`

**Step 1: Create TextBubble component**

Create `components/player/TextBubble.tsx`:

```tsx
import { Text } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface TextBubbleProps {
  text: string;
  visible: boolean;
}

export function TextBubble({ text, visible }: TextBubbleProps) {
  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(300)}
      className="absolute bottom-12 left-6 right-6 bg-charcoal/60 rounded-2xl px-6 py-4"
    >
      <Text className="font-nunito-semibold text-lg text-white text-center leading-7">
        {text}
      </Text>
    </Animated.View>
  );
}
```

**Step 2: Create StorySlideView component**

Create `components/player/StorySlideView.tsx`:

```tsx
import { View, Image } from "react-native";
import { TextBubble } from "./TextBubble";

interface StorySlideViewProps {
  imageUrl: string;
  text: string;
  showText: boolean;
}

export function StorySlideView({
  imageUrl,
  text,
  showText,
}: StorySlideViewProps) {
  return (
    <View className="flex-1">
      {/* TODO: Replace placeholder with actual AI-generated illustration */}
      <View className="flex-1 bg-charcoal items-center justify-center">
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full bg-gold/20" />
        )}
      </View>

      <TextBubble text={text} visible={showText} />
    </View>
  );
}
```

**Step 3: Implement basic story player**

Replace `app/story/[id].tsx`:

```tsx
import { View, Pressable, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useCallback, useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { StorySlideView } from "@/components/player/StorySlideView";
import type { StorySlide } from "@/types";

// TODO: Replace with real story data from Firestore
const MOCK_SLIDES: StorySlide[] = [
  {
    slideId: "1",
    text: "Once upon a time, in a land of rolling green hills, a little lamb named Sunny set out on an adventure.",
    imageUrl: "",
    audioUrl: "",
    isChoicePoint: false,
  },
  {
    slideId: "2",
    text: "Sunny walked along a winding path, the warm sun painting golden light across the meadow.",
    imageUrl: "",
    audioUrl: "",
    isChoicePoint: false,
  },
  {
    slideId: "3",
    text: "At the crossroads, Sunny saw two paths. One led to a quiet village, the other into a mysterious forest.",
    imageUrl: "",
    audioUrl: "",
    isChoicePoint: true,
    choices: [
      {
        label: "Visit the village",
        iconUrl: "",
        nextSlideId: "4a",
        valueTag: "Kindness",
      },
      {
        label: "Explore the forest",
        iconUrl: "",
        nextSlideId: "4b",
        valueTag: "Courage",
      },
    ],
  },
  {
    slideId: "4a",
    text: "Sunny chose the village, where friendly faces welcomed them with warm smiles. Kindness filled the air.",
    imageUrl: "",
    audioUrl: "",
    isChoicePoint: false,
  },
  {
    slideId: "4b",
    text: "Sunny bravely stepped into the forest, where tall trees whispered ancient stories of courage.",
    imageUrl: "",
    audioUrl: "",
    isChoicePoint: false,
  },
  {
    slideId: "5",
    text: "And so Sunny learned that every choice leads to something wonderful. The end.",
    imageUrl: "",
    audioUrl: "",
    isChoicePoint: false,
  },
];

export default function StoryPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideHistory, setSlideHistory] = useState<string[]>(["1"]);
  const [showText, setShowText] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Lock to landscape on mount
  useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
    );
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    };
  }, []);

  // Auto-hide controls
  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [showControls]);

  const currentSlideId = slideHistory[currentSlideIndex];
  const currentSlide = MOCK_SLIDES.find((s) => s.slideId === currentSlideId);

  const handleNext = useCallback(() => {
    if (!currentSlide || currentSlide.isChoicePoint) return;

    const currentIdx = MOCK_SLIDES.findIndex(
      (s) => s.slideId === currentSlideId
    );
    const nextSlide = MOCK_SLIDES[currentIdx + 1];
    if (!nextSlide) return;

    const newHistory = [...slideHistory.slice(0, currentSlideIndex + 1), nextSlide.slideId];
    setSlideHistory(newHistory);
    setCurrentSlideIndex(newHistory.length - 1);
  }, [currentSlide, currentSlideId, currentSlideIndex, slideHistory]);

  const handlePrev = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  }, [currentSlideIndex]);

  const handleChoice = useCallback(
    (nextSlideId: string) => {
      const newHistory = [...slideHistory.slice(0, currentSlideIndex + 1), nextSlideId];
      setSlideHistory(newHistory);
      setCurrentSlideIndex(newHistory.length - 1);
    },
    [currentSlideIndex, slideHistory]
  );

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  if (!currentSlide) return null;

  return (
    <View className="flex-1 bg-charcoal">
      <StatusBar hidden />

      <StorySlideView
        imageUrl={currentSlide.imageUrl}
        text={currentSlide.text}
        showText={showText}
      />

      {/* Touch areas for navigation */}
      <View className="absolute inset-0 flex-row">
        {/* Left tap — go back */}
        <Pressable
          className="flex-1"
          onPress={() => {
            setShowControls(true);
            handlePrev();
          }}
        />
        {/* Center tap — toggle controls */}
        <Pressable
          className="flex-[2]"
          onPress={() => setShowControls(!showControls)}
        />
        {/* Right tap — go forward */}
        <Pressable
          className="flex-1"
          onPress={() => {
            setShowControls(true);
            if (!currentSlide.isChoicePoint) handleNext();
          }}
        />
      </View>

      {/* Choice cards */}
      {currentSlide.isChoicePoint && currentSlide.choices && (
        <View className="absolute bottom-8 left-6 right-6 flex-row gap-4">
          {currentSlide.choices.map((choice) => (
            <Pressable
              key={choice.nextSlideId}
              className="flex-1 bg-white/90 rounded-2xl p-4 items-center min-h-[60px] justify-center"
              onPress={() => handleChoice(choice.nextSlideId)}
            >
              <Text className="font-nunito-bold text-sm text-charcoal text-center">
                {choice.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Controls overlay */}
      {showControls && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          className="absolute top-4 right-4 flex-row gap-3"
        >
          <Pressable
            className="w-10 h-10 bg-charcoal/50 rounded-full items-center justify-center"
            onPress={() => setIsPaused(!isPaused)}
          >
            <Text className="text-white text-sm">
              {isPaused ? "▶" : "⏸"}
            </Text>
          </Pressable>
          <Pressable
            className="w-10 h-10 bg-charcoal/50 rounded-full items-center justify-center"
            onPress={handleClose}
          >
            <Text className="text-white text-sm">✕</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}
```

**Step 4: Verify player**

```bash
npx expo start --clear
```

Expected: Story player opens in landscape. Text bubble visible. Tap right to advance. Choice point shows two cards. Tapping a choice branches the story. Controls auto-hide after 3 seconds.

**Step 5: Commit**

```bash
git add app/story/ components/player/
git commit -m "feat: implement story player with landscape mode, text bubbles, and branching choices"
```

---

## Phase 4: Home Screen

### Task 20: Home Screen

**Files:**
- Modify: `app/(main)/home.tsx`
- Create: `components/home/StoryBookCard.tsx`
- Create: `components/home/CreateStoryCard.tsx`

**Step 1: Create StoryBookCard component**

Create `components/home/StoryBookCard.tsx`:

```tsx
import { Pressable, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface StoryBookCardProps {
  title: string;
  coverImageUrl: string;
  valuesReinforced: string[];
  onPress: () => void;
}

export function StoryBookCard({
  title,
  valuesReinforced,
  onPress,
}: StoryBookCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={animatedStyle}
      className="w-36 mr-4"
      onPressIn={() => {
        scale.value = withSpring(0.95);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
    >
      {/* TODO: Replace with actual cover image */}
      <View className="w-36 h-48 bg-white rounded-2xl shadow-sm items-center justify-center overflow-hidden">
        <View className="flex-1 w-full bg-gold/10 items-center justify-center">
          <Text className="text-4xl">📖</Text>
        </View>
      </View>
      <Text
        className="font-nunito-semibold text-sm text-charcoal mt-2"
        numberOfLines={1}
      >
        {title}
      </Text>
      {valuesReinforced.length > 0 && (
        <Text className="font-nunito text-xs text-warm-gray" numberOfLines={1}>
          {valuesReinforced.join(" · ")}
        </Text>
      )}
    </AnimatedPressable>
  );
}
```

**Step 2: Create CreateStoryCard component**

Create `components/home/CreateStoryCard.tsx`:

```tsx
import { Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Pressable } from "react-native";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CreateStoryCardProps {
  companionName: string;
  onPress: () => void;
}

export function CreateStoryCard({
  companionName,
  onPress,
}: CreateStoryCardProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={animatedStyle}
      className="w-full bg-white rounded-3xl shadow-sm overflow-hidden"
      onPressIn={() => {
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
    >
      {/* TODO: Replace with watercolor companion illustration */}
      <View className="w-full h-48 bg-gold/10 items-center justify-center">
        <Text className="text-6xl">✨</Text>
      </View>
      <View className="p-5">
        <Text className="font-nunito-bold text-xl text-charcoal">
          Create tonight's story
        </Text>
        <Text className="font-nunito text-sm text-warm-gray mt-1">
          A new adventure with {companionName}
        </Text>
      </View>
    </AnimatedPressable>
  );
}
```

**Step 3: Implement Home screen**

Replace `app/(main)/home.tsx`:

```tsx
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useProfileStore, useStoryStore } from "@/stores";
import { CreateStoryCard } from "@/components/home/CreateStoryCard";
import { StoryBookCard } from "@/components/home/StoryBookCard";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const stories = useStoryStore((s) => s.stories);

  const childName = profile?.childName || "friend";
  const companionName =
    profile?.companionName ||
    profile?.companionType?.charAt(0).toUpperCase() +
      (profile?.companionType?.slice(1) || "") ||
    "Companion";

  const handleCreateStory = () => {
    // TODO: Trigger generation pipeline, navigate to preparation screen
    router.push("/story/new-story");
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
          <View className="flex-row items-center gap-3">
            {/* TODO: Replace with companion avatar */}
            <View className="w-10 h-10 bg-gold/20 rounded-full items-center justify-center">
              <Text className="text-lg">🐑</Text>
            </View>
            <View>
              <Text className="font-nunito-bold text-lg text-charcoal">
                {getGreeting()}, {childName}
              </Text>
              <Text className="font-nunito text-sm text-warm-gray">
                Ready for a story?
              </Text>
            </View>
          </View>
          <Pressable
            className="w-10 h-10 items-center justify-center"
            onPress={() => {
              // TODO: Open settings sheet
            }}
          >
            <Text className="text-warm-gray text-xl">⚙</Text>
          </Pressable>
        </View>

        {/* Create Story Card */}
        <View className="px-6 mt-4">
          <CreateStoryCard
            companionName={companionName}
            onPress={handleCreateStory}
          />
        </View>

        {/* Past Stories */}
        {stories.length > 0 ? (
          <View className="mt-8">
            <Text className="font-nunito-bold text-lg text-charcoal px-6 mb-3">
              Your stories
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24 }}
            >
              {stories.map((story) => (
                <StoryBookCard
                  key={story.id}
                  title={story.title}
                  coverImageUrl={story.coverImageUrl}
                  valuesReinforced={story.valuesReinforced}
                  onPress={() => router.push(`/story/${story.id}`)}
                />
              ))}
            </ScrollView>
          </View>
        ) : (
          <View className="mt-8 px-6">
            <Text className="font-nunito-bold text-lg text-charcoal mb-3">
              Your stories
            </Text>
            <View className="bg-white rounded-2xl p-6 items-center">
              <Text className="text-4xl mb-3">📚</Text>
              <Text className="font-nunito-semibold text-base text-charcoal">
                Your first story is waiting
              </Text>
              <Text className="font-nunito text-sm text-warm-gray mt-1 text-center">
                Create a story above to start your library
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
```

**Step 4: Verify screen**

```bash
npx expo start --clear
```

Expected: Home screen with greeting, create card, and empty state for past stories.

**Step 5: Commit**

```bash
git add app/(main)/home.tsx components/home/
git commit -m "feat: implement Home screen with create story card and past stories library"
```

---

## Phase 5: Firebase Integration

### Task 21: Firestore Profile & Story Operations

**Files:**
- Create: `lib/firebaseProfile.ts`
- Create: `lib/firebaseStory.ts`

**Step 1: Create profile operations**

Create `lib/firebaseProfile.ts`:

```ts
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
```

**Step 2: Create story operations**

Create `lib/firebaseStory.ts`:

```ts
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
```

**Step 3: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No type errors.

**Step 4: Commit**

```bash
git add lib/firebaseProfile.ts lib/firebaseStory.ts
git commit -m "feat: add Firestore operations for profiles and stories"
```

---

## Phase 6: AI Generation Pipeline (Backend)

### Task 22: Cloud Function — Story Generation Orchestrator

> **Note:** This task creates Firebase Cloud Functions. You will need a Firebase project configured with the Blaze plan for Cloud Functions. The functions use Google Gemini API and require an API key.

**Files:**
- Create: `functions/package.json`
- Create: `functions/tsconfig.json`
- Create: `functions/src/index.ts`
- Create: `functions/src/generateStory.ts`
- Create: `functions/src/prompts/storyPrompt.ts`
- Create: `functions/src/prompts/imagePrompt.ts`

**Step 1: Initialize Cloud Functions directory**

```bash
mkdir -p functions/src/prompts
```

Create `functions/package.json`:

```json
{
  "name": "bible-ai-functions",
  "main": "lib/index.js",
  "scripts": {
    "build": "tsc",
    "serve": "npm run build && firebase emulators:start --only functions",
    "deploy": "firebase deploy --only functions"
  },
  "engines": {
    "node": "20"
  },
  "dependencies": {
    "firebase-admin": "^13.0.0",
    "firebase-functions": "^6.0.0",
    "@google/generative-ai": "^0.21.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0"
  }
}
```

Create `functions/tsconfig.json`:

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "outDir": "lib",
    "sourceMap": true,
    "strict": true,
    "target": "es2020",
    "esModuleInterop": true
  },
  "compileOnSave": true,
  "include": ["src"]
}
```

**Step 2: Create story generation prompt template**

Create `functions/src/prompts/storyPrompt.ts`:

```ts
import type { AgeBand, CompanionType, Value } from "./types";

export function buildStoryPrompt(params: {
  ageBand: AgeBand;
  companionType: CompanionType;
  companionName: string;
  values: Value[];
  childName?: string;
}): string {
  const { ageBand, companionType, companionName, values, childName } = params;

  const ageGuidance = {
    "3-5": "Use simple sentences (5-8 words). Vocabulary for preschoolers. Very gentle themes. 2 choice points.",
    "6-8": "Use moderate sentences (8-12 words). Age-appropriate vocabulary. Gentle adventure themes. 2-3 choice points.",
    "9-11": "Use richer sentences (10-15 words). More complex vocabulary. Deeper themes with nuance. 3 choice points.",
  };

  const childRef = childName ? childName : "the child";

  return `You are a children's Bible storybook author. Generate a personalized interactive story.

## Story Parameters
- Age band: ${ageBand}
- Companion: A semi-anthropomorphic ${companionType} named "${companionName}"
- Values to reinforce: ${values.join(", ")}
- Child's name: ${childRef}

## Writing Guidelines
- ${ageGuidance[ageBand]}
- Tone: calm, gentle, warm. No shame, no fear-driven imagery.
- Biblical themes: respectful and gentle. Avoid graphic events.
- The companion (${companionName}) appears in every scene as ${childRef}'s faithful partner.
- ${companionName} is semi-anthropomorphic: clearly a ${companionType}, but can stand upright, gesture, and express emotions.
- Weave the values (${values.join(", ")}) naturally into the narrative and choice points.

## Story Structure
Generate exactly this structure as JSON:
- 15 linear slides + branch variant slides
- Each choice point has 2 options (A and B)
- One option should gently align with one of the selected values
- Branches reconverge after exactly 1 slide

## Required JSON Schema
{
  "title": "string — story title",
  "slides": [
    {
      "slideId": "string — unique ID like 's1', 's2', etc.",
      "text": "string — narration text for this slide",
      "imagePrompt": "string — detailed scene description for illustration",
      "isChoicePoint": false
    }
  ],
  "branchSlides": [
    {
      "slideId": "string — like 's6a' or 's6b'",
      "text": "string",
      "imagePrompt": "string",
      "parentChoiceSlideId": "string — the slideId of the choice point",
      "reconvergeAtSlideId": "string — the slideId where branches merge"
    }
  ],
  "choices": [
    {
      "slideId": "string — the choice point slide ID",
      "options": [
        {
          "label": "string — short choice text (3-6 words)",
          "nextSlideId": "string — branch slide ID",
          "valueTag": "string — which value this aligns with (or 'neutral')"
        }
      ]
    }
  ],
  "valuesReinforced": ["string — values practiced in this story"]
}

Generate ONLY valid JSON. No markdown, no explanation.`;
}
```

**Step 3: Create image prompt template**

Create `functions/src/prompts/imagePrompt.ts`:

```ts
import type { CompanionType } from "./types";

const COMPANION_DNA: Record<CompanionType, string> = {
  lamb: "A small, fluffy white lamb with soft wool, round dark eyes, rosy cheeks, and a gentle smile. Wears a tiny sage-green satchel. Semi-anthropomorphic: can stand on hind legs and gesture with front hooves. Expressive face with warm, kind features.",
  lion: "A young golden lion cub with a small fluffy mane, bright amber eyes, and a brave confident expression. Wears a small crimson scarf. Semi-anthropomorphic: can stand upright and gesture with front paws. Strong but gentle build.",
  donkey: "A small grey donkey with long floppy ears, soft brown eyes, and a patient faithful expression. Wears a tiny woven blanket on its back. Semi-anthropomorphic: can stand on hind legs and use front hooves expressively. Humble and endearing features.",
  horse: "A young chestnut horse with a flowing dark mane, bright determined eyes, and a courageous stance. Wears a small blue riding sash. Semi-anthropomorphic: can stand upright and gesture nobly. Athletic but approachable build.",
};

export function buildImagePrompt(params: {
  companionType: CompanionType;
  companionName: string;
  sceneDescription: string;
  isKeyFrame: boolean;
}): string {
  const { companionType, companionName, sceneDescription, isKeyFrame } = params;

  return `Soft watercolor storybook illustration for a children's Bible-inspired story. Gentle, dreamy, painterly style with warm tones (cream, gold, soft blue, sage green). Hand-painted feel with visible brushstrokes.

Character: ${COMPANION_DNA[companionType]} The character's name is ${companionName}.

Scene: ${sceneDescription}

Style requirements:
- Soft watercolor medium on textured paper
- Warm, inviting color palette
- Gentle lighting, no harsh shadows
- Child-friendly, calming atmosphere
- 1280x720 landscape composition
- ${isKeyFrame ? "Detailed, fully rendered scene" : "Softer, more atmospheric rendering"}

IMPORTANT: Maintain exact character appearance as described above. The character must look identical across all illustrations.`;
}

export function buildCoverPrompt(params: {
  companionType: CompanionType;
  companionName: string;
  title: string;
}): string {
  const { companionType, companionName, title } = params;

  return `Soft watercolor storybook COVER illustration. Gentle, dreamy, painterly style.

Character: ${COMPANION_DNA[companionType]} The character's name is ${companionName}.

Scene: ${companionName} the ${companionType} standing in a beautiful biblical landscape, looking forward with warmth and anticipation. Golden hour lighting. Rolling hills, olive trees, or gentle desert scenery in the background. The scene evokes the beginning of an adventure.

This is a book cover — the character should be prominent and centered. Leave space at the top for the title "${title}".

Style: Soft watercolor on textured paper. Warm palette (cream, gold, soft blue, sage green). 1024x1024 square composition. Child-friendly, inviting.

IMPORTANT: Maintain exact character appearance as described above.`;
}

export { COMPANION_DNA };
```

**Step 4: Create shared types for functions**

Create `functions/src/prompts/types.ts`:

```ts
export type AgeBand = "3-5" | "6-8" | "9-11";
export type CompanionType = "lamb" | "lion" | "donkey" | "horse";
export type Value =
  | "Kindness"
  | "Courage"
  | "Honesty"
  | "Patience"
  | "Gratitude"
  | "Forgiveness"
  | "Humility"
  | "Self-control";
```

**Step 5: Create story generation function**

Create `functions/src/generateStory.ts`:

```ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as admin from "firebase-admin";
import { buildStoryPrompt } from "./prompts/storyPrompt";
import { buildImagePrompt, buildCoverPrompt } from "./prompts/imagePrompt";
import type { CompanionType, AgeBand, Value } from "./prompts/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface GenerateStoryParams {
  storyId: string;
  profileId: string;
  ageBand: AgeBand;
  companionType: CompanionType;
  companionName: string;
  values: Value[];
  childName?: string;
}

export async function generateStory(params: GenerateStoryParams): Promise<void> {
  const db = admin.firestore();
  const storyRef = db.collection("stories").doc(params.storyId);

  try {
    // Step 1: Generate story text + structure via Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = buildStoryPrompt(params);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Failed to parse story JSON from Gemini");
    const storyData = JSON.parse(jsonMatch[0]);

    // Step 2: Generate cover image
    // TODO: Call Nano Banana / Gemini Image API
    const coverPrompt = buildCoverPrompt({
      companionType: params.companionType,
      companionName: params.companionName,
      title: storyData.title,
    });
    // Placeholder — actual image generation to be implemented
    const coverImageUrl = "";

    // Step 3: Identify key frames (cover, choice points, scene changes, ending)
    const keyFrameIds = new Set<string>();
    keyFrameIds.add(storyData.slides[0]?.slideId);
    keyFrameIds.add(storyData.slides[storyData.slides.length - 1]?.slideId);
    for (const choice of storyData.choices || []) {
      keyFrameIds.add(choice.slideId);
    }
    for (const branch of storyData.branchSlides || []) {
      keyFrameIds.add(branch.slideId);
    }
    // Add a few more evenly spaced key frames
    const spacing = Math.floor(storyData.slides.length / 4);
    for (let i = spacing; i < storyData.slides.length; i += spacing) {
      keyFrameIds.add(storyData.slides[i]?.slideId);
    }

    // Step 4: Generate images for key frames
    // TODO: Batch Nano Banana calls for key frames
    const slides = storyData.slides.map((slide: any) => ({
      slideId: slide.slideId,
      text: slide.text,
      imageUrl: "", // TODO: Generated image URL
      audioUrl: "", // TODO: TTS audio URL
      isChoicePoint: slide.isChoicePoint || false,
      choices: [],
    }));

    // Attach choices to slides
    for (const choice of storyData.choices || []) {
      const slide = slides.find((s: any) => s.slideId === choice.slideId);
      if (slide) {
        slide.isChoicePoint = true;
        slide.choices = choice.options.map((opt: any) => ({
          label: opt.label,
          iconUrl: "",
          nextSlideId: opt.nextSlideId,
          valueTag: opt.valueTag,
        }));
      }
    }

    const branchSlides = (storyData.branchSlides || []).map((slide: any) => ({
      slideId: slide.slideId,
      text: slide.text,
      imageUrl: "", // TODO: Generated image URL
      audioUrl: "", // TODO: TTS audio URL
    }));

    // Step 5: Generate TTS audio for all slides
    // TODO: Google TTS API calls

    // Step 6: Update Firestore with completed story
    await storyRef.update({
      title: storyData.title,
      coverImageUrl,
      slides,
      branchSlides,
      valuesReinforced: storyData.valuesReinforced || params.values,
      status: "ready",
    });
  } catch (error) {
    console.error("Story generation failed:", error);
    await storyRef.update({ status: "failed" });
  }
}
```

**Step 6: Create Cloud Function entry point**

Create `functions/src/index.ts`:

```ts
import * as admin from "firebase-admin";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { generateStory } from "./generateStory";

admin.initializeApp();

export const onStoryCreated = onDocumentCreated(
  "stories/{storyId}",
  async (event) => {
    const data = event.data?.data();
    if (!data || data.type !== "personalized" || data.status !== "generating") {
      return;
    }

    const profileSnap = await admin
      .firestore()
      .collection("profiles")
      .doc(data.profileId)
      .get();

    if (!profileSnap.exists) {
      console.error("Profile not found:", data.profileId);
      return;
    }

    const profile = profileSnap.data()!;

    await generateStory({
      storyId: event.params.storyId,
      profileId: data.profileId,
      ageBand: profile.ageBand,
      companionType: profile.companionType,
      companionName: profile.companionName || profile.companionType,
      values: profile.values,
      childName: profile.childName,
    });
  }
);
```

**Step 7: Install function dependencies**

```bash
cd functions && npm install && cd ..
```

**Step 8: Verify functions build**

```bash
cd functions && npx tsc --noEmit && cd ..
```

Expected: No type errors.

**Step 9: Commit**

```bash
git add functions/
git commit -m "feat: add Cloud Functions for story generation with Gemini prompts"
```

---

## Phase 7: RevenueCat Integration

### Task 23: RevenueCat Setup

**Files:**
- Create: `lib/revenuecat.ts`
- Create: `stores/subscriptionStore.ts`
- Modify: `stores/index.ts`

**Step 1: Install RevenueCat**

```bash
npx expo install react-native-purchases react-native-purchases-ui
```

**Step 2: Create RevenueCat lib**

Create `lib/revenuecat.ts`:

```ts
import Purchases, {
  type CustomerInfo,
  type PurchasesOffering,
} from "react-native-purchases";
import { Platform } from "react-native";

const API_KEYS = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || "",
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || "",
};

export async function initRevenueCat(userId?: string): Promise<void> {
  const apiKey = Platform.OS === "ios" ? API_KEYS.ios : API_KEYS.android;

  await Purchases.configure({
    apiKey,
    appUserID: userId,
  });
}

export async function getOfferings(): Promise<PurchasesOffering | null> {
  const offerings = await Purchases.getOfferings();
  return offerings.current;
}

export async function getCustomerInfo(): Promise<CustomerInfo> {
  return Purchases.getCustomerInfo();
}

export async function restorePurchases(): Promise<CustomerInfo> {
  return Purchases.restorePurchases();
}

export function isPremium(customerInfo: CustomerInfo): boolean {
  return customerInfo.entitlements.active["premium"] !== undefined;
}

export async function identifyUser(userId: string): Promise<void> {
  await Purchases.logIn(userId);
}
```

**Step 3: Create subscription store**

Create `stores/subscriptionStore.ts`:

```ts
import { create } from "zustand";

interface SubscriptionState {
  isPremium: boolean;
  storiesRemainingThisMonth: number;
  isLoading: boolean;

  setPremium: (isPremium: boolean) => void;
  setStoriesRemaining: (count: number) => void;
  decrementStories: () => void;
  setLoading: (loading: boolean) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  isPremium: false,
  storiesRemainingThisMonth: 0,
  isLoading: true,

  setPremium: (isPremium) =>
    set({
      isPremium,
      storiesRemainingThisMonth: isPremium ? 4 : 0,
    }),
  setStoriesRemaining: (storiesRemainingThisMonth) =>
    set({ storiesRemainingThisMonth }),
  decrementStories: () =>
    set((s) => ({
      storiesRemainingThisMonth: Math.max(
        0,
        s.storiesRemainingThisMonth - 1
      ),
    })),
  setLoading: (isLoading) => set({ isLoading }),
}));
```

**Step 4: Update stores barrel**

Update `stores/index.ts`:

```ts
export { useOnboardingStore } from "./onboardingStore";
export { useAuthStore } from "./authStore";
export { useProfileStore } from "./profileStore";
export { useStoryStore } from "./storyStore";
export { useSubscriptionStore } from "./subscriptionStore";
```

**Step 5: Add RevenueCat keys to .env.example**

Append to `.env.example`:

```
EXPO_PUBLIC_REVENUECAT_IOS_KEY=your-ios-key
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=your-android-key
```

**Step 6: Verify build**

```bash
npx tsc --noEmit
```

Expected: No type errors.

**Step 7: Commit**

```bash
git add lib/revenuecat.ts stores/ .env.example
git commit -m "feat: add RevenueCat integration with subscription store"
```

---

## Phase 8: Connect the Dots

### Task 24: Wire Auth State to Root Layout

**Files:**
- Modify: `app/_layout.tsx`
- Modify: `app/index.tsx`

**Step 1: Update root layout with auth listener**

Update `app/_layout.tsx` to wrap with auth state initialization:

Add to the `RootLayout` component after font loading:

```tsx
import { useAuthStore } from "@/stores";
import { onAuthChange, createOrGetUserDoc } from "@/lib/firebaseAuth";

// Inside RootLayout, after fontsLoaded:
useEffect(() => {
  const unsubscribe = onAuthChange(async (firebaseUser) => {
    if (firebaseUser) {
      const user = await createOrGetUserDoc(firebaseUser, "email");
      useAuthStore.getState().setUser(user);
    } else {
      useAuthStore.getState().setUser(null);
    }
  });
  return unsubscribe;
}, []);
```

**Step 2: Update entry point with routing logic**

Update `app/index.tsx`:

```tsx
import { Redirect } from "expo-router";
import { useAuthStore, useProfileStore } from "@/stores";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { profile } = useProfileStore();

  if (authLoading) {
    return (
      <View className="flex-1 bg-cream items-center justify-center">
        <ActivityIndicator color="#FFB356" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  if (!profile) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  return <Redirect href="/(main)/home" />;
}
```

**Step 3: Verify routing logic**

```bash
npx expo start --clear
```

Expected: App redirects to onboarding welcome for unauthenticated users.

**Step 4: Commit**

```bash
git add app/_layout.tsx app/index.tsx
git commit -m "feat: wire auth state listener and conditional routing"
```

---

### Task 25: Wire Onboarding to Profile Creation

**Files:**
- Modify: `app/(onboarding)/generating.tsx`

**Step 1: Update generating screen to create profile + story doc**

Update `app/(onboarding)/generating.tsx` to create a Firestore profile and story document after onboarding:

```tsx
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { PreparationStepper } from "@/components/onboarding/PreparationStepper";
import { useOnboardingStore, useAuthStore, useProfileStore } from "@/stores";
import { createProfile } from "@/lib/firebaseProfile";
import { createStoryDoc, onStoryStatusChange } from "@/lib/firebaseStory";

export default function GeneratingScreen() {
  const router = useRouter();
  const { childName, ageBand, companionType, companionName, values } =
    useOnboardingStore();
  const user = useAuthStore((s) => s.user);
  const setProfile = useProfileStore((s) => s.setProfile);
  const [storyId, setStoryId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function setup() {
      if (!user || !ageBand || !companionType) return;

      // Create profile
      const profile = await createProfile({
        userId: user.id,
        childName: childName || undefined,
        ageBand,
        companionType,
        companionName: companionName || undefined,
        values,
      });
      setProfile(profile);

      // Create story doc (triggers Cloud Function)
      const id = await createStoryDoc(profile.id, "personalized");
      setStoryId(id);
    }

    setup();
  }, [user, ageBand, companionType]);

  // Listen for story status changes
  useEffect(() => {
    if (!storyId) return;

    const unsubscribe = onStoryStatusChange(storyId, (status) => {
      if (status === "ready") {
        setProgress(1);
      } else if (status === "failed") {
        // TODO: Handle failure — show retry
        setProgress(0);
      }
    });

    return unsubscribe;
  }, [storyId]);

  const handleComplete = useCallback(() => {
    if (storyId) {
      router.replace(`/story/${storyId}`);
    }
  }, [router, storyId]);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 justify-center px-8">
        <Text className="font-nunito-extrabold text-2xl text-charcoal text-center mb-12">
          Preparing your story...
        </Text>

        <PreparationStepper
          onComplete={handleComplete}
          isRealProgress={!!storyId}
          progress={progress}
        />
      </View>
    </SafeAreaView>
  );
}
```

**Step 2: Verify build**

```bash
npx tsc --noEmit
```

Expected: No type errors.

**Step 3: Commit**

```bash
git add app/(onboarding)/generating.tsx
git commit -m "feat: wire onboarding to Firestore profile + story creation"
```

---

## Implementation Notes

### What's Stubbed (TODO markers)

The following items are marked with TODO in the codebase and need to be completed during integration:

1. **Nano Banana image generation** — `functions/src/generateStory.ts` has placeholder for actual API calls
2. **Google TTS audio generation** — Same file, audio generation is stubbed
3. **Firebase Auth methods** — `app/(onboarding)/account.tsx` auth handlers are stubbed
4. **RevenueCat purchase flow** — `app/(onboarding)/paywall.tsx` purchase is stubbed
5. **Cover image in Cover Reveal** — `app/(onboarding)/cover-reveal.tsx` uses placeholder
6. **Companion illustrations** — All companion cards use emoji placeholders
7. **Story player images** — Mock slides have empty imageUrl
8. **Book opening animation** — Story entry uses default navigation instead of custom animation
9. **Page turn animation** — Story player uses tap navigation without page-turn effect
10. **Ken Burns transition frames** — Transition frame generation not yet implemented
11. **Settings sheet** — Home screen gear icon handler is empty
12. **Progressive generation** — Chunk-based generation not yet implemented

### Build & Test Commands

```bash
npx expo start --clear          # Start dev server
npx tsc --noEmit                # TypeScript check
npx expo start --ios            # iOS simulator
npx expo start --android        # Android emulator
cd functions && npx tsc         # Build Cloud Functions
```

### Firebase Setup Required

Before running with real Firebase:

1. Create a Firebase project
2. Enable Authentication (Apple, Google, Email Link)
3. Create Firestore database
4. Enable Cloud Storage
5. Deploy Cloud Functions
6. Set environment variables in `.env`
7. Add Gemini API key to Cloud Function environment

### RevenueCat Setup Required

1. Create RevenueCat project
2. Configure Apple/Google app store connections
3. Create products (monthly $9.99, annual $99.99)
4. Create "premium" entitlement
5. Set up Web Billing with Stripe (optional, for US users)
6. Add API keys to `.env`
