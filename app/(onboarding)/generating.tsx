import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { PreparationStepper } from "@/components/onboarding/PreparationStepper";
import { useOnboardingStore, useAuthStore, useProfileStore, useStoryStore } from "@/stores";
import { createProfile } from "@/lib/firebaseProfile";
import { createStoryDoc, onStoryStatusChange, getStory } from "@/lib/firebaseStory";

export default function GeneratingScreen() {
  const router = useRouter();
  const { childName, ageBand, companionType, companionName, values } =
    useOnboardingStore();
  const user = useAuthStore((s) => s.user);
  const setProfile = useProfileStore((s) => s.setProfile);
  const setCurrentStory = useStoryStore((s) => s.setCurrentStory);
  const [storyId, setStoryId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function setup() {
      if (!user || !ageBand || !companionType) return;

      try {
        // Create profile
        const profile = await createProfile({
          userId: user.id,
          childName: childName || undefined,
          ageBand,
          companionType,
          companionName: companionName || undefined,
          values,
        });

        if (!isMounted) return;
        setProfile(profile);

        // Create story doc (triggers Cloud Function)
        const id = await createStoryDoc(profile.id, "personalized");
        if (!isMounted) return;
        setStoryId(id);
      } catch (err) {
        console.error("Failed to create profile or story:", err);
        if (isMounted) {
          setError("Something went wrong. Please try again.");
        }
      }
    }

    setup();

    return () => {
      isMounted = false;
    };
  }, [user, ageBand, companionType, childName, companionName, values, setProfile]);

  // Listen for story status changes
  useEffect(() => {
    if (!storyId) return;

    const unsubscribe = onStoryStatusChange(storyId, async (status) => {
      if (status === "cover_ready" || status === "ready") {
        // Fetch the story and set it in the store
        const story = await getStory(storyId);
        if (story) {
          setCurrentStory(story);
          setProgress(1);
        }
      } else if (status === "failed") {
        // TODO: Handle failure — show retry
        setProgress(0);
      }
    });

    return unsubscribe;
  }, [storyId, setCurrentStory]);

  const handleComplete = useCallback(() => {
    if (storyId) {
      // Navigate to cover reveal screen
      router.replace("/(onboarding)/cover-reveal");
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

        {error && (
          <Text className="font-nunito text-red-500 text-center mt-4">
            {error}
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
