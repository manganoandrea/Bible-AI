import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui";
import { signInAnonymousUser, createOrGetUserDoc } from "@/lib/firebaseAuth";
import { useAuthStore } from "@/stores/authStore";

export default function AccountScreen() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const handleAuth = async (method: "apple" | "google" | "email" | "anonymous") => {
    try {
      if (method === "anonymous") {
        const firebaseUser = await signInAnonymousUser();
        const user = await createOrGetUserDoc(firebaseUser, "anonymous");
        setUser(user);
      }
      // TODO: Implement Apple, Google, Email auth
      router.push("/(onboarding)/paywall");
    } catch (error) {
      console.error("Auth error:", error);
    }
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
        <Button
          title="Continue as Guest"
          variant="ghost"
          onPress={() => handleAuth("anonymous")}
        />
        <Text className="font-nunito text-xs text-warm-gray text-center mt-1">
          You can create an account later.
        </Text>
      </View>
    </SafeAreaView>
  );
}
