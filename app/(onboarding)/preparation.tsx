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
