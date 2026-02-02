import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { PreparationStepper } from "@/components/onboarding/PreparationStepper";
import { useProfileStore, useStoryStore } from "@/stores";
import { createStoryDoc, onStoryStatusChange, getStory } from "@/lib/firebaseStory";

export default function GeneratingScreen() {
  const router = useRouter();
  const profile = useProfileStore((s) => s.profile);
  const setCurrentStory = useStoryStore((s) => s.setCurrentStory);
  const addStory = useStoryStore((s) => s.addStory);
  const [storyId, setStoryId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function createNewStory() {
      if (!profile?.id) {
        setError("Profile not found. Please restart the app.");
        return;
      }

      try {
        // Create story doc (triggers Cloud Function)
        const id = await createStoryDoc(profile.id, "personalized");
        if (!isMounted) return;
        setStoryId(id);
      } catch (err) {
        console.error("Failed to create story:", err);
        if (isMounted) {
          setError("Something went wrong. Please try again.");
        }
      }
    }

    createNewStory();

    return () => {
      isMounted = false;
    };
  }, [profile?.id]);

  // Listen for story status changes
  useEffect(() => {
    if (!storyId) return;

    const unsubscribe = onStoryStatusChange(storyId, async (status) => {
      // Update progress based on status
      if (status === "generating") {
        setProgress(0.25);
      } else if (status === "text_ready") {
        setProgress(0.5);
      } else if (status === "cover_ready") {
        setProgress(0.75);
      } else if (status === "ready") {
        // Fetch the story and add it to the store
        const story = await getStory(storyId);
        if (story) {
          setCurrentStory(story);
          addStory(story);
          setProgress(1);
        }
      } else if (status === "failed") {
        setError("Story generation failed. Please try again.");
        setProgress(0);
      }
    });

    return unsubscribe;
  }, [storyId, setCurrentStory, addStory]);

  const handleComplete = useCallback(() => {
    if (storyId) {
      // Navigate directly to the story player
      router.replace(`/story/${storyId}`);
    }
  }, [router, storyId]);

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 justify-center px-8">
        <Text className="font-nunito-extrabold text-2xl text-charcoal text-center mb-12">
          Creating your story...
        </Text>

        <PreparationStepper
          onComplete={handleComplete}
          isRealProgress={!!storyId}
          progress={progress}
        />

        {error && (
          <View className="mt-6 items-center">
            <Text className="font-nunito text-red-500 text-center mb-4">
              {error}
            </Text>
            <Pressable
              className="bg-gold px-6 py-3 rounded-full"
              onPress={handleCancel}
            >
              <Text className="font-nunito-bold text-white">Go Back</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
