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
