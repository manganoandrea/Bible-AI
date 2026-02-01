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
