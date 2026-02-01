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
