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
