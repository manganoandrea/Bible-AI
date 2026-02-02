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
