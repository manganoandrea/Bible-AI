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
