import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button } from "@/components/ui";

type Plan = "monthly" | "annual";

export default function PaywallScreen() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<Plan>("annual");

  const handleSubscribe = () => {
    // TODO: RevenueCat purchase flow
    router.replace("/(onboarding)/generating");
  };

  const handleSkip = () => {
    router.replace("/(onboarding)/generating");
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <View className="flex-1 px-8 pt-8">
        <Text className="font-nunito-extrabold text-2xl text-charcoal">
          More stories. More values.{"\n"}More peace.
        </Text>

        <View className="mt-6 gap-3">
          <Text className="font-nunito text-base text-charcoal leading-6">
            ✦ Build habits through gentle choices
          </Text>
          <Text className="font-nunito text-base text-charcoal leading-6">
            ✦ Reinforce the values you pick
          </Text>
          <Text className="font-nunito text-base text-charcoal leading-6">
            ✦ Narrated stories for any moment
          </Text>
        </View>

        <View className="mt-6 gap-3">
          <Text className="font-nunito-semibold text-sm text-warm-gray">
            What you get:
          </Text>
          <Text className="font-nunito text-sm text-charcoal">
            • 4 personalized stories every month
          </Text>
          <Text className="font-nunito text-sm text-charcoal">
            • Full library of interactive stories
          </Text>
          <Text className="font-nunito text-sm text-charcoal">
            • New stories added regularly
          </Text>
        </View>

        {/* Plan selector */}
        <View className="mt-8 gap-3">
          <Pressable
            className={`flex-row items-center justify-between p-4 rounded-2xl border-2 ${
              selectedPlan === "annual"
                ? "bg-gold/10 border-gold"
                : "bg-white border-light-gray"
            }`}
            onPress={() => setSelectedPlan("annual")}
          >
            <View>
              <Text className="font-nunito-bold text-base text-charcoal">
                Annual
              </Text>
              <Text className="font-nunito text-sm text-warm-gray">
                $99.99/year ($8.33/mo)
              </Text>
            </View>
            <View className="bg-gold rounded-full px-3 py-1">
              <Text className="font-nunito-bold text-xs text-white">
                Best value
              </Text>
            </View>
          </Pressable>

          <Pressable
            className={`flex-row items-center justify-between p-4 rounded-2xl border-2 ${
              selectedPlan === "monthly"
                ? "bg-gold/10 border-gold"
                : "bg-white border-light-gray"
            }`}
            onPress={() => setSelectedPlan("monthly")}
          >
            <View>
              <Text className="font-nunito-bold text-base text-charcoal">
                Monthly
              </Text>
              <Text className="font-nunito text-sm text-warm-gray">
                $9.99/month
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View className="px-8 pb-8 gap-3">
        <Button title="Start plan" onPress={handleSubscribe} />
        <Button
          title="Restore purchases"
          variant="ghost"
          onPress={() => {
            // TODO: RevenueCat restore
          }}
        />
        <Button
          title="Start with your free story"
          variant="ghost"
          onPress={handleSkip}
        />
        <Text className="font-nunito text-xs text-warm-gray text-center">
          Cancel anytime in your App Store / Google Play settings.
        </Text>
      </View>
    </SafeAreaView>
  );
}
