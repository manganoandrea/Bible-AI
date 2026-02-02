import { View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useOnboardingStore, useStoryStore } from "@/stores";
import { Button } from "@/components/ui";

export default function CoverRevealScreen() {
  const router = useRouter();
  const { companionType, companionName } = useOnboardingStore();
  const { currentStory } = useStoryStore();

  const displayName =
    companionName || companionType?.charAt(0).toUpperCase() + (companionType?.slice(1) || "");

  const title = currentStory?.title || `${displayName}'s Adventure`;
  const coverImageUrl = currentStory?.coverImageUrl;

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 items-center justify-center px-8">
        <Animated.View
          entering={FadeInUp.duration(800).springify()}
          className="w-full aspect-[3/4] bg-white rounded-3xl shadow-lg overflow-hidden"
        >
          {coverImageUrl ? (
            <Image
              source={{ uri: coverImageUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 w-full bg-gold/10 items-center justify-center">
              <Text className="text-8xl">📖</Text>
              <Text className="font-nunito-bold text-xl text-charcoal mt-4">
                {title}
              </Text>
            </View>
          )}
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.duration(600).delay(400)}
          className="font-nunito-extrabold text-xl text-charcoal mt-6 text-center"
        >
          {title}
        </Animated.Text>

        <Animated.Text
          entering={FadeInDown.duration(600).delay(600)}
          className="font-nunito text-sm text-warm-gray mt-2"
        >
          {currentStory?.totalImages || 15} pages · choices shape the story
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
